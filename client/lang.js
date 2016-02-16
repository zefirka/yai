'use strict';

(function () {
    var i18n = require('yai');

    var keysets = this.__yai.getKeysets();
    var lang = this.__yai__defaultLang;

    /**
     * @private
     * @param {string} lang
     * @param {string} keyset
     * @param {string} key
     * @return string
     */
    function _translator(lang, keyset, key) {
        return keysets[keysets][lang][key];
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

    module.exports = {
        i18n: i18n(_translator, _lang),
        keysets: keysets
    };

})();
// console.log(module.exports.i18n('common', 'test'));
