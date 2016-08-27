var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var concat = require("gulp-concat");
var del = require("del");
var filelog = require("gulp-filelog");
var frep = require("gulp-frep");
var gulp = require("gulp");
var cleancss = require("gulp-clean-css");
var pkg = require("./package.json");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
// var uglify = require("gulp-uglify-harmony"); // FIXME: Removed until gulp-uglifyjs supports harmony
var vinylPaths = require("vinyl-paths");


var proxy = "http://localhost:8000";
var srcRoot = "file:///Users/Vancura/Desktop/webvr-bootstrap-typescript/src/ts/"; // TODO: Set to your local path to get sourcemaps

var paths = {
    src: "src",
    srcTS: "src/ts/**/*.ts",
    srcSCSS: "src/scss/**/*.scss",

    dist: "dist",
    distCSS: "dist/css",
    distImages: "dist/images",
    distJS: "dist/js",
    distJSList: [
        "dist/js/main.js"
    ]
};

var tsProject = ts.createProject("tsconfig.json", {typescript: require("typescript")});


gulp.task("styles", function() {
    "use strict";

    // Compile SCSS.
    return gulp.src(paths.srcSCSS)
               .pipe(sass({
                   errLogToConsole: false,
                   outputStyle: "expanded"
               }).on("error", sass.logError))
               .pipe(autoprefixer("last 2 versions", "safari 6", "ie 10", "opera 12.1", "ios 6", "android 4", "blackberry 10"))
               .pipe(rename({
                   suffix: ".min"
               }))
               .pipe(cleancss())
               .pipe(gulp.dest(paths.distCSS))
               .pipe(browserSync.reload({
                   stream: true
               }));
});


gulp.task("tslint", function() {
    "use strict";

    return gulp.src(paths.srcTS)
               .pipe(tslint({
                   formatter: "verbose"
               }))
               .pipe(tslint.report());
});


gulp.task("scripts-debug", function() {
    "use strict";

    var patterns = [{
        pattern: /%VERSION%/g,
        replacement: pkg.version + " (" + new Date().toGMTString() + ")"
    }];

    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(ts(tsProject));

    return tsResult.js
                   .pipe(sourcemaps.write(".", {
                       sourceRoot: srcRoot,
                       includeContent: false
                   }))
                   .pipe(frep(patterns))
                   .pipe(gulp.dest("."))
                   .pipe(browserSync.reload({
                       stream: true
                   }));
});


gulp.task("scripts-dist", ["scripts-debug"], function() {
    "use strict";

    return gulp.src(paths.distJSList)
               .pipe(filelog("concat-dist"))
               .pipe(concat("main.js"))
               // FIXME: Removed until gulp-uglifyjs supports harmony
               // .pipe(rename({
               //     suffix: ".min"
               // }))
               // .pipe(uglify())
               .pipe(gulp.dest(paths.distJS));
});


gulp.task("browser-sync", function() {
    "use strict";

    browserSync({
        proxy: proxy,
        logConnections: true,
        open: false
    });
});


gulp.task("watch", function() {
    "use strict";

    runSequence("clean", ["styles", "scripts-debug"], "browser-sync");

    gulp.watch(paths.srcSCSS, ["styles"]);
    gulp.watch(paths.srcTS, ["scripts-debug"]);
});


gulp.task("clean", function() {
    "use strict";

    return gulp.src(paths.dist)
               .pipe(vinylPaths(del));
});


gulp.task("default", function(callback) {
    "use strict";

    runSequence("clean", "tslint", ["styles", "scripts-dist"], callback);
});
