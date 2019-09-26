var path = require('path')
var fs = require('fs')

var concat = require('concat')
var replace = require('replace')
var UglifyJS = require('uglify-js')

function copyFile(src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

var DIST = 'jquery.sparkline.js'
var DIST_MINIFIED = 'jquery.sparkline.min.js'
var SOURCE_DIR = "src"
var SOURCE_FILES = [
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
  return path.join(SOURCE_DIR, fileName)
})

var banner = fs.readFileSync('minheader.txt').toString()

concat(SOURCE_FILES, DIST, function (err) {
  if (err) {
    console.log(err)
  } else {
    var result = UglifyJS.minify(DIST, {
      wrap: false
    });
    fs.writeFileSync(DIST_MINIFIED, banner + result.code)

    replace({
      regex: '@VERSION@',
      replacement: process.env.npm_package_version,
      paths: [DIST, DIST_MINIFIED]
    })

    console.log('Done')
  }
})