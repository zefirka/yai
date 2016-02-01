'use strict';

const fs = require('fs');
const join = require('path').join;
const i18n = require('../index');

let cache = {};
let currentLang = 'en';

/**
 * @private
 * @param {string} newLang - new language
 * @return string - current language
 */
function langSwitcher(newLang) {
    if (newLang) {
        cache = {};
        currentLang = newLang;
    }

    return currentLang;
}

/**
 * @public
 * @return {object}
 */
function keysets() {
    return cache;
}

/**
 * Creates a API for YAI
 *
 * @public
 * @param {string} addr - address for storage
 * @return {object} API
 */
module.exports = function (addr) {
    addr = addr || join(__dirname, 'lang');

    /**
    * @private
    * @param {string} lang
    * @param {string} keyset
    * @param {string} key
    * @return string
    */
    function translator(lang, keyset, key) {
        cache[keyset] = cache[keyset] || JSON.parse(fs.readFileSync(join(addr, keyset, `${lang.toLowerCase()}.json`)));
        keyset = cache[keyset];

        return keyset[key];
    }

    return {
        i18n: i18n(translator, langSwitcher),
        keysets: keysets
    };
};
