import {join} from 'path';
import * as fs from 'fs';
import * as uglify from 'uglify-js';

(function (){
  const DIST = 'jquery.sparkline.js';
  const DIST_MINIFIED = 'jquery.sparkline.min.js';
  const DIST_CJS = 'jquery.sparkline.cjs';
  const DIST_MJS = 'jquery.sparkline.mjs';

  const outputFiles = [DIST, DIST_CJS, DIST_MJS];
  const SOURCE_DIR = "src";

  let SOURCE_FILES = [
    'header.js',
    'defaults.js',
    'utils.js',
    'simpledraw.js',
    'rangemap.js',
    'interact.js',
    'base.js',
    'chart-line.js',
    'chart-bar.js',
    'chart-tristate.js',
    'chart-discrete.js',
    'chart-bullet.js',
    'chart-pie.js',
    'chart-box.js',
    'vcanvas-base.js',
    'vcanvas-canvas.js',
    'vcanvas-vml.js',
    'footer.js'
  ];
  let banner = fs.readFileSync('minheader.txt', {encoding: 'utf-8'});
  let mergeFileOutput = '';

  SOURCE_FILES = SOURCE_FILES.map(function(fileName) {
    return join(SOURCE_DIR, fileName);
  });

  SOURCE_FILES.forEach(srcFile => mergeFileOutput += fs.readFileSync(srcFile));

  const updateVersion = (file) => file.replace('@VERSION@', process.env.npm_package_version);

  banner = updateVersion(banner);
  mergeFileOutput = updateVersion(mergeFileOutput);

  fs.writeFileSync(DIST, mergeFileOutput);
  console.log('building', DIST, '...');

  outputFiles.forEach(outputFile => {

    try {
      if (outputFile === DIST_MJS) {
        // Convert to esm
        // Would be better to use /(const|let|var)\s\w+\s=\s(require\(['|"])\w+-?\w+?(['|"]\);)/g to get all instances
        // However, more time would be needed to implement. This is all we need for now.
        mergeFileOutput = mergeFileOutput.replace(/const\sjQuery\s=\srequire\('jquery'\);/g, 'import jQuery from \'jquery\';');
      }

      if (outputFile === DIST) {
        const minResult = uglify.minify(mergeFileOutput, {
          wrap: false
        });

        fs.writeFileSync(DIST_MINIFIED, banner + minResult.code)
        console.log('building', DIST_MINIFIED, '...');
      } else {
        fs.writeFileSync(outputFile, mergeFileOutput);
        console.log('building', outputFile, '...');
      }
    } catch (err) {
      console.error(`Could not complete build for ${outputFile}: ${err}`);
    }
  });

  console.log('\nDone');
})();