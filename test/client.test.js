'use strict';

const i18n = require('../client/lang')(__dirname + '/lang').i18n

describe('on client with json', () => {
    
    it('with english and no keyset', function () {
         i18n('test').must.to.be('Test');
    });

    it('with english and with keyset', function () {
        i18n('common', 'test').must.to.be('Test');
        i18n('test', 'new').must.to.be('New');
    });

    it('with russian and without keyset', function () {
        i18n.lang('ru');
        i18n('test').must.to.be('Тест');
    });

    it('with russian and wit keyset', function () {
        i18n('test', 'new').must.to.be('Новый');
    });

});