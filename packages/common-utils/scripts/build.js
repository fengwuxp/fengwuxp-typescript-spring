const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;


execSync(`rm -rf ${path.resolve(__dirname, `../lib`)}`);

console.log("移除文件成功");

console.log("开始编译\r\n");
execSync("tsc");
console.log("编译完成\r\n");

