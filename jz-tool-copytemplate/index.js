const copy = require('copy-template-dir');
const joinPath = require('path.join');
 
const vars = { foo: 'bar' };

const inDir = joinPath(process.cwd(), 'src');
const outDir = joinPath(process.cwd(), 'dist');
 
copy(inDir, outDir, vars, (err, createdFiles) => {
  if (err) throw err;

  createdFiles.forEach(filePath => console.log(`Created ${filePath}`));

  console.log('done!')
});