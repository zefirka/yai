'use strict';

(function () {
    var i18n = require('../index');
    var lang;
    var keysets;
    var yai;

    function init(settings) {
        yai = settings.global[settings.nameSpace];
        lang = yai.getDefaultLang();
        keysets = yai(lang);

        return {
            i18n: i18n(_translator, _lang),
            keysets: keysets
        };
    }

    /**
     * @private
     * @param {string} lang
     * @param {string} keyset
     * @param {string} key
     * @return string
     */
    function _translator(lang, keyset, key) {
        return keysets[keyset][key];
    }

    /**
     *
     * @param {string} newLang - новый язык
     * @return string
     */
    function _lang(newLang) {
        if (newLang) {
            keysets = yai(newLang);
            lang = newLang;
        }
        return lang;
    }

    module.exports = init;

})();

// console.log(module.exports.i18n('common', 'test'));
