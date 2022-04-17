const {
  src,
  dest,
  watch,
  parallel,
  series
} = require("gulp");
const gulpautoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const scss = require("gulp-sass")(require("sass"));
const ttf2Towoff2 = require("gulp-ttf2woff2");
const cssClean = require("gulp-clean-css");
const fonter = require("gulp-fonter");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const webp = require("gulp-webp");
const csso = require("gulp-csso");
const del = require("del");
const fs = require("fs");

//---------------------------------------------------------------------

function syncBrowser() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

//---------------------------------------------------------------------

function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({
      outputStyle: "compressed"
    }).on("error", scss.logError))
    .pipe(concat("style.min.css"))
    .pipe(
      gulpautoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(csso())
    .pipe(cssClean())
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

//---------------------------------------------------------------------

function scripts() {
  return src([
      "node_modules/jquery/dist/jquery.js",
      "node_modules/slick-carousel/slick/slick.js",
      "app/js/main.js",
    ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

//---------------------------------------------------------------------

function images() {
  return src("app/images/**/*.*")
    .pipe(
      webp({
        quality: 80,
        method: 1,
      })
    )
    .pipe(dest("app/images/"));
}

//---------------------------------------------------------------------

function fonts() {
  return src("app/fonts/**/*.*")
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest("app/fonts"))
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
    .pipe(dest("app/fonts"));
}

function fonts2() {
  return src("app/fonts/**/*.*").pipe(ttf2Towoff2()).pipe(dest("app/fonts"));
}

async function fontsStyle() {
  let fontsFile = "app/scss/fonts.scss";
  fs.readdir("app/fonts/", function (err, fontsFiles) {
    if (!fs.existsSync(fontsFile)) {
      fs.writeFile(fontsFile, "", cb);
      let newFileOnly;
      for (var i = 0; i < fontsFiles.length; i++) {
        let fontFileName = fontsFiles[i].split(".")[0];
        if (newFileOnly !== fontFileName) {
          let fontName = fontFileName.split("-")[0] ?
            fontFileName.split("-")[0] :
            fontFileName;
          let fontWeight = fontFileName.split("-")[1] ?
            fontFileName.split("-")[1] :
            fontFileName;
          if (fontWeight.toLowerCase() === "thin") {
            fontWeight = 100;
          } else if (
            fontWeight.toLowerCase() === "extralight" ||
            fontWeight.toLowerCase() === "extralightitalic"
          ) {
            fontWeight = 200;
          } else if (
            fontWeight.toLowerCase() === "light" ||
            fontWeight.toLowerCase() === "lightitalic"
          ) {
            fontWeight = 300;
          } else if (
            fontWeight.toLowerCase() === "medium" ||
            fontWeight.toLowerCase() === "mediumitalic"
          ) {
            fontWeight = 500;
          } else if (
            fontWeight.toLowerCase() === "semibold" ||
            fontWeight.toLowerCase() === "semibolditalic"
          ) {
            fontWeight = 600;
          } else if (
            fontWeight.toLowerCase() === "bold" ||
            fontWeight.toLowerCase() === "bolditalic"
          ) {
            fontWeight = 700;
          } else if (
            fontWeight.toLowerCase() === "extrabold" ||
            fontWeight.toLowerCase() === "extrabolditalic"
          ) {
            fontWeight = 800;
          } else if (
            fontWeight.toLowerCase() === "black" ||
            fontWeight.toLowerCase() === "blackitalic"
          ) {
            fontWeight = 900;
          } else {
            fontWeight = 400;
          }
          fs.appendFile(
            fontsFile,
            `@font-face {
                         font-family: ${fontName};
                         font-display: swap;
                         src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
                         font-weight: ${fontWeight};
                         font-style: normal;
                          }\r\n`,
            cb
          );
          newFileOnly = fontFileName;
        }
      }
    } else {
      console.log(
        "Файл scss/fonts.scss уже существует. для обновления его надо удалить"
      );
    }
  });

  return "app/";

  function cb() {}
}

//---------------------------------------------------------------------

function watching() {
  watch(["app/scss/*.scss"], styles);
  // watch(["app/images/**/*.{png,jpeg,webp,gif,svg}"], images);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/**/*.html"]).on("change", browserSync.reload);
}

//---------------------------------------------------------------------

function build() {
  return src(
    [
      "app/**/*.html",
      "app/images/**/*.{webp,svg,gif}",
      "app/css/style.min.css",
      "app/js/main.min.js",
      "app/fonts/**/*.woff",
      "app/fonts/**/*.woff2",
    ], {
      base: "app",
    }
  ).pipe(dest("dist"));
}

function cleanDist() {
  return del("dist");
}

//---------------------------------------------------------------------

exports.syncBrowser = syncBrowser;
exports.cleanDist = cleanDist;
exports.watching = watching;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

exports.default = parallel(images, styles, scripts, syncBrowser, watching);
exports.fonts = series(fonts, fonts2, fontsStyle);
exports.build = series(cleanDist, images, build);