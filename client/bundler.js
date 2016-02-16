'use strict';

const fs = require('fs');
const join = require('path').join;
const beautify = require('js-beautify').js_beautify;

var regex = /i18n\s?\(\s?['"](.+)['"]\s?,\s?['"](.+)['"]\s?.*\)/gm;
var defaultDir = __dirname;

var opts = {
    regex: regex
};

function getKeysets(code) {
    var matches = code.match(regex);

    var keysets = matches.map(function (include) {
            return include.match(/'([\w\s\d]+)'/g).map(function (spec) {
                return spec.slice(1, -1);
            });
        })
        .map(function (includes) {
            return includes.slice(0, 1).pop();
        })
        .reduce(unique, []);

    return keysets;
}

function unique(sum, cur) {
    if (sum.indexOf(cur) === -1) {
        sum.push(cur);
    }

    return sum;
}

function promisify(dir, lang, keyset) {
    return new Promise(function (resolve) {
        var fname = `${join(__dirname, dir, keyset, lang)}.json`;
        fs.readFile(fname, 'utf-8', function (err, data) {
            if (err) {
                resolve({
                    type: 'error',
                    code: err.code,
                    keyset: keyset,
                    err: err
                });
            }

            resolve({
                type: 'success',
                keyset: keyset,
                data: data //JSON.parse(data)
            });
        });
    });
}

function interpolate(globalEnvName, keysets, errorMessages) {
    return `(function (global){
    global.${    globalEnvName} = function () {
      return keysets;
    }

    var keysets = {};
    var errors = {};

    var yai = {
      keyset: function (name, value) {
        keysets[name] = value;
      },
      error: function (name, error) {
        errors[name] = error;
      }
    };

    ${keysets}

    ${errorMessages}
  })(this);`;
}

function makeBundle(code, langs, dir, globalEnvName) {
    var keysets = getKeysets(code);

    return Promise.all(keysets.map(function (keyset) {
        return langs.map(function (lang) {
            return promisify(dir, lang, keyset);
        });
    }).reduce(function (sum, cur) {
        return sum.concat(cur);
    }, [])).then(function (result) {
        var data = result.filter(function (response) {
            return response.type === 'success';
        });

        var errors = result.filter(function (response) {
            return response.type === 'error';
        });

        var keysets = data.map(function (item) {
            return `yai.keyset('${item.keyset}', ${item.data});`;
        }).join('\n');

        var errorMessages = errors.map(function (error) {
            return `yai.error('${error.keyset}', '${error.code}');`;
        }).join('\n');

        return interpolate(globalEnvName, keysets, errorMessages);
    }).then(function (bundle) {
        return beautify(bundle, {
            indent_size: 4
        });
    });
}

function create(dir, langs, globalEnvName, bundleFrom, bundleDist) {
    fs.readFile(bundleFrom, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }

        makeBundle(data, langs, dir, globalEnvName)
            .then(function (bundle) {
                fs.writeFile(bundleDist, 'utf-8', bundle);
            });

    });
}

function setup(ops) {
    regex = ops.regex ?
        new RegExp(opts.regex + '\\s?\\(\\s?[\'"](.+)[\'"]\\s?,\\s?[\'"](.+)[\'"]\\s?.*\\)', 'gm')
        : regex;

    defaultDir = opts.defaultDir || defaultDir;
}

module.exports = {
    create: create,
    setup: setup
};
