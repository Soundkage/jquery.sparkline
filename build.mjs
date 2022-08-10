import {join} from 'path'
import * as fs from 'fs'
import replace from 'replace'
import * as uglify from 'uglify-js'

function copyFile(src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

(function (){

const DIST = 'jquery.sparkline.js'
const DIST_MINIFIED = 'jquery.sparkline.min.js'
const SOURCE_DIR = "src"
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
]

SOURCE_FILES = SOURCE_FILES.map(function(fileName) {
  return join(SOURCE_DIR, fileName)
})

const banner = fs.readFileSync('minheader.txt', {encoding: 'utf-8'})

try {
  const result = uglify.default.minify(DIST, {
    wrap: false,
    module: true,
    parse: { module: true }
  });
  fs.writeFileSync(DIST_MINIFIED, banner + result.code)

  replace({
    regex: '@VERSION@',
    replacement: process.env.npm_package_version,
    paths: [DIST, DIST_MINIFIED]
  })

  console.log('Done')

} catch (err) {
  console.log(err)
  process.exit(1);
}
})()