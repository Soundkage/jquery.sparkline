import {join} from 'path';
import * as fs from 'fs';
import * as uglify from 'uglify-js';

(function (){
  const DIST_MJS = 'jquery.sparkline.mjs';
  const DIST_CJS = 'jquery.sparkline.cjs';
  const DIST_MJS_MINIFIED = 'jquery.sparkline.min.mjs';
  const DIST_CJS_MINIFIED = 'jquery.sparkline.min.cjs';

  const outputFiles = [DIST_CJS, DIST_MJS];
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

  const minifyCode = (outfile, code) => {
    const minResult = uglify.minify(code, {
      wrap: false
    });

    fs.writeFileSync(outfile, banner + minResult.code)
    console.log('building', outfile, '...');
  }

  banner = updateVersion(banner);
  mergeFileOutput = updateVersion(mergeFileOutput);

  outputFiles.forEach(outputFile => {

    try {
      if (outputFile === DIST_MJS) {
        // TODO: For brevity use /(const|let|var)\s\w+\s=\s(require\(['|"])\w+-?\w+?(['|"]\);)/g to get all instances
        mergeFileOutput = mergeFileOutput.replace(/const\sjQuery\s=\srequire\('jquery'\);/g, 'import jQuery from \'jquery\';');
        minifyCode(DIST_MJS_MINIFIED, mergeFileOutput);
      }

      if (outputFile === DIST_CJS) {
        minifyCode(DIST_CJS_MINIFIED, mergeFileOutput);
      }

    } catch (err) {
      console.error(`Could not complete build for ${outputFile}: ${err}`);
    }
  });

  console.log('\nDone');
})();