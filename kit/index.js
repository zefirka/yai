#!/usr/bin/env node

'use strict';

var program = require('commander');
var fs = require('fs');
var pkg = require('../package');
var join = require('path').join;
var beautify = require('js-beautify').js_beautify;

var CONFIG = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
var DEFAULT_ADDRESS = CONFIG.address || CONFIG.defaultAddress;
var DEFAULT_KEYSET = CONFIG.keyset || CONFIG.defaultKeyset;
var DEFAULT_LANG = CONFIG.lang || CONFIG.defaultLang;
var DEFAULT_TYPE = CONFIG.type || CONFIG.defaultType;
var DEFAULT_ADDER = CONFIG.adder || CONFIG.defaultAdder;
var DEFAULT_REMOVER = CONFIG.remover || CONFIG.defaultRemover;

program
    .version(pkg.version)
    .option('-l, --lang [lang]', 'Choose language', DEFAULT_LANG)
    .option('-k, --keyset [set]', 'Choose keyset', DEFAULT_KEYSET)
    .option('-a, --add <key> <value>', 'Add key to keyset')
    .option('-r, --remove [key]', 'Remove key from')
    .option('-s, --setup [address]', 'Setup address for keysets', DEFAULT_ADDRESS)
    .option('-A, --use-adder [adder]', 'Use custom adder function', DEFAULT_ADDER)
    .option('-R, --use-remover [remover]', 'Use custom remover function', DEFAULT_REMOVER)
    .option('-i, --info', 'Show info')
    .option('-e, --storage-type', 'Storage type')
    .option('--setup-adder [adder]', 'Setup adder')
    .option('--setup-remover [remover]', 'Setup remover\n')
    .option('config', 'Shows configuration file')
    .option('compile <bundle>', 'Compiles i18n bundle')
    .parse(process.argv);

if (program.info) {
    console.log('Yai info\n');
    console.log('------------------------------------------------------------------------------');
    console.log('Storage address:          ' + join(__dirname, program.setup));
    console.log('Storage type:             ' + (program.storageType || DEFAULT_TYPE));
    console.log('Adder address:            ' + join(__dirname, program.useAdder));
    console.log('Remover address:          ' + join(__dirname, program.useRemover));
    console.log('\n----------------------------------------------------------------------------');
    console.log('Lang:                     ' + (program.lang || DEFAULT_LANG));
    console.log('Keyset:                   ' + (program.keyset || DEFAULT_KEYSET));
}

var remover = require(program.useRemover);
var adder = require(program.useAdder);
var address = program.setup;
var lang = program.lang;
var keyset = program.keyset;

if (program.config) {
    console.log(CONFIG);
}

if (program.setupAdder) {
    save('adder', program.setupAdder);
    adder = program.setupAdder;
}

if (program.setupRemover) {
    save('remover', program.setupRemover);
    remover = program.setupRemover;
}

if (program.setup !== DEFAULT_ADDRESS) {
    save('address', address);
}

if (program.keyset !== DEFAULT_KEYSET) {
    save('keyset', keyset);
}

if (program.lang !== DEFAULT_LANG) {
    save('lang', lang);
}

if (program.add && typeof program.add === 'string') {
    let key = program.add;
    let value = program.args.pop();

    adder(address, lang, keyset, key, value);
}

if (program.remove && typeof program.remove === 'string') {
    let key = program.remove;

    remover(address, lang, keyset, key);
}

function save(prop, value) {
    var newJson = Object.assign({}, CONFIG, {[prop]: value});
    var json = beautify(JSON.stringify(newJson), {
        indent_size: 4
    });
    fs.writeFileSync('./config.json', json, 'utf-8');
}
