'use strict';

const fs = require('fs');
const join = require('path').join;
const mkdirp = require('mkdirp');

/**
 * add:: String -> String -> String -> String -> String -> Undefined
 */
function add(addres, lang, keyset, key, value) {
    let addr = join(addres, keyset);
    let file = lang.toLowerCase() + '.json';

    fs.readFile(join(addr, file), 'utf-8', (err, data) => {
        let o = {
            [key]: value
        };
        if (!err) {
            o = Object.assign(JSON.parse(data), o);
        }
        write(addr, file, o);
    });
}

/**
 * write:: String -> String -> Object -> Undefined
 */
function write(addr, file, o) {
    return mkdirp(addr, err => {
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

module.exports = add;
