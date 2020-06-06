const fs = require('browserfs/dist/shims/fs.js');
fs.mkdtemp = () => {};
module.exports = fs;