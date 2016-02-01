#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg     = require('../package');
var join    = require('path').join;

const DEFAULT_LANG = 'en';
const DEFAULT_KEYSET = 'common';
const DEFAULT_TYPE = 'JSON';
const DEFAULT_ADDRESS = './etc/lang';
const DEFAULT_ADDER = './tools/jsonAdder.js';
const DEFAULT_REMOVER = './tools/jsonRemover.js';

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
  .parse(process.argv);

if (program.info) {
    console.log('Yai');
    console.log('--------------------------');
    console.log('Storage address: ' + join(__dirname, program.setup));
    console.log('Storage type: ' + (program.storageType || DEFAULT_TYPE));
    console.log('Adder address: ' + join(__dirname, program.useAdder));
    console.log('Remover address: ' + join(__dirname, program.useRemover));
    console.log('\n--------------------------');
    console.log('Lang: ' + (program.lang || DEFAULT_LANG));
    console.log('Keyset: ' + (program.keyset || DEFAULT_KEYSET));
}

let remover = require(program.useRemover);
let adder = require(program.useAdder);
let address = program.setup;
let lang = program.lang;
let keyset = program.keyset;

if (program.add && typeof program.add === 'string') {
    let key = program.add;
    let value = program.args.pop();

    adder(address, lang, keyset, key, value);
}

if (program.remove && typeof program.remove === 'string') {
    let key = program.remove;

    remover(address, lang, keyset, key);
}
