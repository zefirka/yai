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


## YAI ToolKit

Yai toolkit provide simple API to maintain i18n storages via command line.