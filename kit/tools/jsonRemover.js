'use strict';

const fs = require('fs');
const join = require('path').join;
const mkdirp = require('mkdirp');

function remove(addres, lang, keyset, key) {
    let addr = join(addres, keyset);
    let file = lang.toLowerCase() + '.json';

    fs.readFile(join(addr, file), {
        encoding: 'utf-8'
    }, function (err, data) {
        let o = {};

        if (!err) {
            o = JSON.parse(data);
            o[key] = null;
            delete o[key];
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

module.exports = remove;
