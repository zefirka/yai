'use strict';

Function.prototype.doc = function (val) {
    if (val) {
        Object.defineProperty(this, '__doc__', {
            value: val,
            enumarble: false,
        });
    } else {
        return this.__doc__;
    }
}

const fs = require('fs');
const join = require('path').join;
const beautify = require('js-beautify').js_beautify;

var regex = /i18n\s?\(\s?['"](.+)['"]\s?,\s?['"](.+)['"]\s?.*\)/gm;
var defaultDir = __dirname;

const GLOBAL_ENV_NAME = '__yai';

var opts = {
    regex: regex,
    globalEnvName: GLOBAL_ENV_NAME
};

/**
 * @param {string} code
 * @return {array} keysets
 */
function getKeysets(code) {
    const matches = code.match(regex);
    const keysets = matches.map(include => include.match(/'([\w\s\d]+)'/g).map(spec => spec.slice(1, -1)))
        .map(includes => includes.slice(0, 1).pop())
        .reduce(unique, []);

    return keysets;
}


/**
 * @param {Array} sum
 * @param {*} cur
 * @return {Array}
 */
function unique(sum, cur) {
    if (sum.indexOf(cur) === -1) {
        sum.push(cur);
    }

    return sum;
}

/**
 * @param {string} dir
 * @param {string} lang
 * @param {string} keyset
 * @return {Promise}
 */
function promisify(dir, lang, keyset) {
    return new Promise(resolve => {
        const fname = `${join(__dirname, dir, keyset, lang)}.json`;

        fs.readFile(fname, 'utf-8', (err, data) => {
            const type = err ? 'err' : 'data';
            const value = err ? err : data;

            resolve({
                type: err ? 'error' : 'success',
                code: value.code,
                [type] : value,
                keyset,
                lang
            });
        });
    });
}

/**
 * @param {string} globalEnvName
 * @param {string} keysets
 * @param {string} errorMessages
 * @return {string}
 */
function interpolate(globalEnvName, keysets, errorMessages) {
    return `(function (global){
    global['${globalEnvName || '__yai'}'] = function (lang) {
        if (Object.keys(langs[lang].errors).length) {
            console.warn('There are some keys that was not found in i18n bundle');
        }

        return langs[lang].keysets;
    }

    /* Languages */
    var langs = {};

    var yai = {
      keyset: function (lang, name, value) {
        langs[lang] = langs[lang] || {keysets: {}, errors: {}};
        langs[lang].keysets[name] = value;
      },
      error: function (lang, name, error) {
        langs[lang] = langs[lang] || {keysets: {}, errors: {}};
        langs[lang].errors[name] = error;
      }
    };

    ${String(keysets)}

    ${String(errorMessages)}
  })(this);`;
}

/**
 * @param {string} code
 * @param {array} alngs
 * @param {string} dir
 * @param {stirng} globalEnvName
 * @return {Promise}
 */
function makeBundle(code, langs, dir, globalEnvName) {
    const allKeysets = getKeysets(code);

    return Promise
        .all(allKeysets
            .map(keyset => langs.map(lang => promisify(dir, lang, keyset)))
            .reduce((sum, cur) => sum.concat(cur), []))
        .then(result => {
            const data = result.filter(response => response.type === 'success');
            const errors = result.filter(response => response.type === 'error');

            const keysets = data
                .map(i => `yai.keyset('${i.lang}', '${i.keyset}', ${i.data});`)
                .join('\n');

            const errorMessages = errors
                .map(e => `yai.error('${e.lang}', '${e.keyset}', '${e.code}');`)
                .join('\n');

            return interpolate(globalEnvName, keysets, errorMessages);
        }).then(bundle => beautify(bundle, {
            indent_size: 4
        }));
}

/**
 * @param {string} dir
 * @param {Array} langs
 * @param {string} globalEnvName
 * @param {string} bundleFrom
 * @param {string} bundleDist
 */
function create(dir, langs, globalEnvName, bundleFrom, bundleDist) {
    fs.readFile(bundleFrom, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        return makeBundle(data, langs, dir, globalEnvName)
            .then(bundle => {
                if (!bundleDist) {
                    console.log('bundle', bundle);
                } else {
                    fs.writeFileSync(bundleDist, bundle, 'utf-8');
                }
            });

    });
}

/**
 * @signature
 */
create.doc(`
  create:: (dir, langs, globalEnvName, bundleFrom, bundleDist)
  String: dir -> 
  Array: langs -> 
  String: globalEnvName -> 
  String: bundleFrom -> 
  String: bundleDist -> Promise'`)

function setup(ops) {
    regex = ops.regex ?
        new RegExp(opts.regex + '\\s?\\(\\s?[\'"](.+)[\'"]\\s?,\\s?[\'"](.+)[\'"]\\s?.*\\)', 'gm') : regex;

    defaultDir = opts.defaultDir || defaultDir;
}

module.exports = {
    create: create,
    setup: setup
};
