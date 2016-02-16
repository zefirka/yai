'use strict';

const fs = require('fs');
const join = require('path').join;
const mkdirp = require('mkdirp');

/**
 * remove:: String -> String -> String -> String -> Undefined
 */
function remove(addres, lang, keyset, key) {
    let addr = join(addres, keyset);
    let file = lang.toLowerCase() + '.json';

    fs.readFile(join(addr, file), 'utf-8', (err, data) => {
        let o = {};

        if (!err) {
            o = JSON.parse(data);
            o[key] = null;
            delete o[key];
        }
        write(addr, file, o);
    });
}

/**
 * write:: String -> String -> Object -> Undefined
 */
function write(addr, file, o) {
    mkdirp(addr, err => {
        if (err) {
            throw new Error(err);
        }

        fs.writeFile(join(addr, file), JSON.stringify(o), err => {
            if (err) {
                throw new Error(err);
            }
        });
    });
}

module.exports = remove;
