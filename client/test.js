var i18n = require('./lang.js');

i18n('common', 'Test')
i18n('specific', 'Another');

// ====== b.js

var i18n = require('../lang.js');

i18n('specific', 'One more');

YAI.requre('common', 'specific')


// ====== entry.js

var a = require('./a.js');
var b = require('./b.js');
var i18n = require('./lang/lang.js');

i18n('third', 'Allo');
i18n('simple');
i18n('jojo', '12d allai', {bubo: 'fofudia'});
