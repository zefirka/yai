#!/usr/bin/env node

'use strict';

var bundler = require('../client/bundler');
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

function lastOf(v) {
    return Array.isArray(v) ? v.pop() : v;
}

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
    .option('-c, --compile', 'Build i18n bundle')
    .option('--setup-adder [adder]', 'Setup adder')
    .option('--setup-remover [remover]', 'Setup remover\n')
    .option('config', 'Shows configuration file')
    .parse(process.argv);

var remover = require(program.useRemover);
var adder = require(program.useAdder);
var address = program.setup;
var lang = program.lang;
var keyset = program.keyset;

run(program);

function run(program) {
    if (!validate(program)) {
        return;
    }

    if (program.config) {
        var last = program.rawArgs.slice().pop();
        if (last === 'default') {
            setConfigDefault();
        } else {
            console.log(CONFIG);
        }
        return;
    }

    if (program.info) {
        return info();
    }

    if (program.compile) {
        return build(program.rawArgs.slice());
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
        save('address', lastOf(address));
    }

    if (program.keyset !== DEFAULT_KEYSET) {
        save('keyset', lastOf(keyset));
    }

    if (program.lang !== DEFAULT_LANG) {
        save('lang', lastOf(lang));
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

}

function save(prop, value) {
    if (value) {
        CONFIG[prop] = value;
    } else {
        delete CONFIG[prop];
    }

    var json = beautify(JSON.stringify(CONFIG), {
        indent_size: 4
    });

    fs.writeFileSync('./config.json', json, 'utf-8');

    if (value) {
        console.log(`Property: ${prop} successfuly saved as: ${value}`);
    } else {
        console.log(`Property: ${prop} was deleted`);
    }
}

function info() {
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

function build(args) {
    var name = '__yai__';

    if (args.length === 6) {
        name = args.pop();
    }

    if (args.length < 4) {
        throw 'Specify bundle for reading';
    }

    var dist = args.length === 5 ? args.pop() : undefined;
    var from = args.pop();

    dist = dist ? dist + '.' + lang + '.js' : undefined;
    bundler.create(address, [lang], name, from, dist);
    return;
}

function setConfigDefault() {
    save('address');
    save('keyset');
    save('lang');
    save('type');
    save('adder');
    save('remover');
}

function validate() {
    return true;
}

