const { fork } = require('child_process');
const { join } = require('path');
const { libraryList } = require('./setting');
const { getClassesMapping, readDir, chunk } = require('./src/utils');

const cpus = require('os').cpus().length;

const arg = process.argv.slice(2)[0];
const mode = arg && ((arg === 'reverse') || (arg === '-r')) ? 'reverse' : 'forward';
const classesMapping = getClassesMapping();
console.log(libraryList)
for (let index in libraryList) {
  let SEARCH_DIR = 'node_modules';
  SEARCH_DIR = SEARCH_DIR + '/' + libraryList[index];
  const files = readDir(SEARCH_DIR);
  console.log(`Jetifier found ${files.length} file(s) to ${mode}-jetify. Using ${cpus} workers...`);

  for (const filesChunk of chunk(files, cpus)) {
    const worker = fork(join(__dirname, 'src', 'worker.js'));
    worker.send({ filesChunk, classesMapping, mode });
  }

}