# YAI 
#### Yet another I18N

Yai is a simple i18n module for any environment.

## Usage

Yai allow to you create your own method to read and write keys for localization. Therefore, if you don't want to write your own accessors you can use ready accessors for JSON storage.

## Preparation

At first, you need accessor which can read from your storages required files. It can be JSON or connection to database (if you need server side localization). Anyway, rules are simple:

```js
var i18n = require('yai');

module.exports = i18n([translator function], [language switcher function]);
```

where

```js
function translator(lang, keyset, key) {
    // your magic here
	return valueByKey;
}

function langSwitcher(newLang){
	// just switches language
}
```

`translator` function just acept language code, keyset name, key and returns value of key in given keyset of language. And `languageSwitcher` just changes some value of language code which used in translator. Pretty simple, don't it?


## JSON

By default there are JSON i18n-storage in the Yai package.

### In node:
```js
const i18n = require('./node/lang')(addressOfStorage).i18n;

i18n('keyset', 'key');
// -> Key from addressOfStorage/keyset/en.json

i18n.lang('ru');
// Switch language

i18n('keyset', 'key');
// -> Key from addressOfStorage/keyset/ru.json
```

## YAI ToolKit

Yai toolkit provide simple API to maintain i18n storages via command line.

### Usage

```
Usage: yai [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -l, --lang [lang]            Choose language
    -k, --keyset [set]           Choose keyset
    -a, --add <key> <value>      Add key to keyset
    -r, --remove [key]           Remove key from
    -s, --setup [address]        Setup address for keysets
    -A, --use-adder [adder]      Use custom adder function
    -R, --use-remover [remover]  Use custom remover function
    -i, --info                   Show info
    -e, --storage-type           Storage type
    -c, --compile                Build i18n bundle
    --setup-adder [adder]        Setup adder
    --setup-remover [remover]    Setup remover

    config                       Shows configuration file
```