'use strict';

const fs = require('fs');
const join = require('path').join;
const mkdirp = require('mkdirp');

function add(addres, lang, keyset, key, value) {
    let addr = join(addres, keyset);
    let file = lang.toLowerCase() + '.json';

    fs.readFile(join(addr, file), {
        encoding: 'utf-8'
    }, function (err, data) {
        let o = {
            [key]: value
        };
        if (!err) {
            o = Object.assign(JSON.parse(data), o);
        }
        write(addr, file, o);
    });
}

function write(addr, file, o) {
    mkdirp(addr, function (err) {
        if (err) {
            throw new Error(err);
        }

        fs.writeFile(join(addr, file), JSON.stringify(o), function (err) {
            if (err) {
                throw new Error(err);
            }
        });
    });
}

module.exports = add;
