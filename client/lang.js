'use strict';

var i18n = require('yai');
var cache = {};
var lang = 'en';

/**
 * @private
 * @param {string} lang
 * @param {string} keyset
 * @param {string} key
 * @return string
 */
function _translator(lang, keyset, key) {
    cache[keyset] = cache[keyset] || require('./lang/' + keyset + '/' + lang + '.js');
    keyset = cache[keyset];

    return keyset[key];
}

/**
 *
 * @param {string} newLang - новый язык
 * @return string
 */
function _lang(newLang) {
    return newLang ?
      lang = newLang :
      lang;
}

/**
 * @public
 * @return {object}
 */
function keysets() {
    return cache;
}

module.exports = {
    i18n: i18n(_translator, _lang),
    keysets: keysets
};

// console.log(module.exports.i18n('common', 'test'));
