const copyDir = require('copy-template-dir');
 
module.exports = function (inDir, outDir, vars) {
  copyDir(inDir, outDir, vars, (err, createdFiles) => {
    if (err) throw err;
  
    createdFiles.forEach(filePath => console.log(`Created ${filePath}`));
  
    console.log('done!')
  });
}