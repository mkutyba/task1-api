var shell = require('shelljs');

shell.cp('-R', 'src/public', 'dist');
shell.cp('-R', 'src/config', 'dist');
