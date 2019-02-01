var gulp                = require('gulp'), // GULP
    sass                = require('gulp-sass'), // Компиляция из SASS в CSS
    autoprefixer        = require('gulp-autoprefixer'), // Добавление вендорных прификсов
    concat              = require('gulp-concat'), // Конкатинация(объединение)
    browserSync         = require('browser-sync'), // liveReload - обновление страницы при сохранении
    uglify              = require('gulp-uglifyjs'), // Сжатие js
    cssnano             = require('gulp-cssnano'), // Минификация css
    uncss               = require('gulp-uncss'), // Удаление не используемых классов в CSS
    rename              = require('gulp-rename'), // Переименование
    imagemin            = require('gulp-imagemin'), // Сжатие img
    imageminPngquant    = require('imagemin-pngquant'), // Сжатие png
    cache               = require('gulp-cache'), // Очистка кеша
    del                 = require('del'), // Удаление
    spritesmith         = require('gulp.spritesmith'), // CSS Sprite
    tiny                = require('gulp-tinypng-nokey'), // Ультра-сжатие изображений
    zip                 = require('gulp-zip'), // Архивирование в ZIP
    gutil               = require('gulp-util'), // Подсвечивание ошибок
    ftp                 = require('gulp-ftp'), // Выгрузка на хостинг
    htmlmin             = require('gulp-htmlmin'), // Минификая html
    csso                = require('gulp-csso'), // Оптимизация css
    stripCssComments    = require('gulp-strip-css-comments'), // Удаление комментариев из CSS
    strip               = require('gulp-strip-comments'), // Удаление комментриев из HTML и JS
    svgSprite           = require('gulp-svg-sprites'), // Создание SVG sprite
    cheerio             = require('gulp-cheerio'), // Изменение HTML и XML-файлов
    replace             = require('gulp-replace'), // Удаление атрибутов
    svgmin              = require('gulp-svgmin'), // Минификая SVG
    critical            = require('critical'), // Критический CSS
    jade                = require('gulp-jade'), // Компиляция в HTML
    plumber             = require('gulp-plumber'), // Перехват ошибок
    webp                = require('gulp-webp'), // Конвертация в Webp
    imageminMozjpeg     = require('imagemin-mozjpeg'), // Сжатие jpeg
    responsive          = require('gulp-responsive'), // Изменение изображений
    merge               = require('gulp-merge'); // Объедините несколько потоков в один поток по порядку


// Компиляция из sass в css
gulp.task('sass', function () {
    return gulp.src([
        'app/sass/style.sass',
        //'app/blocks/page-contents/index/index.sass',
        ])
    .pipe(sass({outputStyle: 'expanded'}).on('error' , sass.logError)) // Компиляция в css
    .pipe(autoprefixer({ // автопрефиксер 
            browsers: ['last 15 versions', 'ie >= 9', 'and_chr >= 2.3'],
            cascade: true
        }))
 // .pipe(browserSync.reload({stream: true})) // livereload pipe
    .pipe(gulp.dest('app/css'))
});

// Jade - Компиляция в HTML
gulp.task('jade', function() {
    return gulp.src([
        'app/blocks/page-contents/index/index.jade',
        'app/blocks/page-contents/404/404.jade'
    ])
    .pipe(plumber()) // Перехват ошибок
    .pipe(jade({
        pretty: true
        }))
    .pipe(gulp.dest('app/'))
});

// livereload task
gulp.task('browser-sync' , function() { 
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

//Сжатие js
gulp.task('uglify', function () {
    gulp.src('app/js/scripts.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

 // Конкатинация JS файлов
gulp.task('scripts', function() {
    return gulp.src([
    'app/libs/jquery3/jquery-3.2.1.min.js',
    'app/js/settings/settings.js'
    ])
    .pipe(concat('scripts.js')) // Название файла в который идет конкатинация
    .pipe(gulp.dest('app/js'));
});

 // Конкатинация JS-min файлов
gulp.task('scripts-min', function() {
    return gulp.src([
    'app/scripts.js',
    ])
    .pipe(strip()) // Удаление комментариев
    .pipe(uglify()) // Сжатие js
    .pipe(rename({ // Переименование файла
            suffix: ".min",
        }))
    .pipe(gulp.dest('app/js'));
}); 

// Оптимизация и минификая css
gulp.task('css-min', function() {
    return gulp.src('app/css/style.css')
    .pipe(stripCssComments({ // Удаление комментариев
        preserve: false
    }))
    .pipe(uncss({ // Удаление лишних классов
        html: [ // Файлы в которых проверяются CSS классы на использование
        'app/*.html',
        'http://cv56344.tmweb.ru/',
        ],
        ignore: [
        /\.webfont-loaded/, 
        /\.js-menu-open/, 
        /\.is-active/,
       ]
    }))
    .pipe(csso({ // Оптимизация css
        restructure: false,
        sourceMap: true,
        debug: true
    }))
    .pipe(cssnano()) // Минификая css
    .pipe(rename({  // Переименование файла
      suffix: ".min",
    }))
    .pipe(gulp.dest('dist/css'));
}); 

// Критический CSS
gulp.task('critical', function (cb) {
    critical.generate({
        inline: false,
        base: 'app/',
       // html: 'index.html',
        src: 'index.html',
        css: ['app/css/style.css'],
        dest: 'css/critical-style.css',
        minify: true,
        width: 1920,
        height: 480
    });
});

// Минификация html
gulp.task('htmlmin', function() {
  return gulp.src([
    'app/*.html',
    '!app/404.html'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(strip()) // Удаление комментариев
    // .pipe(rename({  // Переименование файла
    //         suffix: ".min",
    //      }))
    .pipe(gulp.dest('dist'));
});

// Изменение изображений
gulp.task('resp', function () {
  return gulp.src('app/img/Sprite/png/sprite.png')
     .pipe(responsive({
    
     '6.png': [{
        // image-small.jpg is 200 pixels wide
        width: 200,
        rename: {
          suffix: '-mobile',
          extname: '.jpg',
        },
      }, {
        // image-small@2x.jpg is 400 pixels wide
        width: 200 * 2,
        rename: {
          suffix: '-@2x',
          extname: '.jpg',
        },
      }],

      '7.png': [{
        width: 200,
        rename: { suffix: '-200px'}
      }],

      'bg-color3.png': [{
        width: 200,
        rename: { suffix: '-200px'}
      }],

      '*.png': [{
        width: 7896 * 2,
        rename: { suffix: '-200px'}
      }],

    }))

    .pipe(gulp.dest('app/img/Resp'));
});


// Конвертация в Webp
gulp.task('webp', () =>
    gulp.src([
        'app/img/*.jpg',
        'app/img/*.png'
        ])
        .pipe(webp({
            // quality: 80,
            // preset: 'photo',
            // method: 6,
            lossless: true // Сжатие без потерь
        }))
        .pipe(gulp.dest('dist/img'))
);

// Минификация SVG
gulp.task('build-svg', () =>
    gulp.src([
        'app/img/SVG/*.svg',
        ])
        .pipe(svgmin())
        .pipe(gulp.dest('dist/img/SVG'))
);

// Сжатие изображений
gulp.task('compress', function() {
    gulp.src([
        'app/img/*.png',
        'app/img/*.jpg',
        'app/img/*.jpg',
        'app/img/*.gif',
        'app/libs/Sprites/css/sprite.png'
    ])
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [imageminPngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

// Сжатие jpeg
gulp.task('jpg', () =>
    gulp.src('app/img/*.jpg')
    .pipe(imagemin([imageminMozjpeg({
        quality: 85
    })]))
    .pipe(gulp.dest('dist/img'))
);

// Ультра-сжатие изображений
gulp.task('tinypng', function(cb) {
    gulp.src([
        'app/img/*.png',
        'app/img/*.jpg',
        'app/img/*.jpg',
        'app/img/*.gif',
        'app/libs/Sprites/css/sprite.png'
        ])
        .pipe(tiny())
        .pipe(gulp.dest('dist/img'));
});

// Архивирование в zip
gulp.task('zip', () =>
    gulp.src('dist/**')
        .pipe(zip('ready.zip'))
        .pipe(gulp.dest(''))
);

// CSS Sprite
gulp.task('sprite', function () {
  var spriteData = gulp.src([
    'app/img/Icons/*.jpg',
    'app/img/Icons/*.png'
  ]).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.sass',
    imgPath: '../img/Sprite/png/sprite.png',
    algorithm: 'left-right'
  }));
  return spriteData.pipe(gulp.dest('app/img/Sprite/png'));
});

// SVG Sprite
gulp.task('svg', function () {
    return gulp.src('app/img/SVG/*.svg')
        .pipe(svgmin()) // Минификация SVG
    /*  .pipe(cheerio(function ($) {
            $('svg').attr('style',  'display:none');
        })) */
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/img/Sprite"));
});

// Gulp update
gulp.task('up', function () {
  var update = require('gulp-update')();
 
  gulp.watch('./package.json').on('change', function (file) {
    update.write(file);
  });
 
});

// Очистка кэша
gulp.task('cache', function() {
    return cache.clearAll();
});

// Удаление
gulp.task("clean", clean);
function clean() {
    return del(["./dist"]);
}

// Наблюдение
gulp.task('watch', function() {
    // Наблюдение
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass')); 
    gulp.watch('app/blocks/**/*.sass', gulp.parallel('sass')); 
    gulp.watch('app/blocks/**/*.jade', gulp.parallel('jade')); 
    gulp.watch('app/js/settings/settings.js', gulp.parallel('scripts'));
    // Обновление страницы
    gulp.watch('app/css/style.css').on('change', browserSync.reload); // reload css
    gulp.watch('app/*.html').on('change', browserSync.reload); // reload html
    gulp.watch('app/js/settings/settings.js').on('change', browserSync.reload); // reload js
});

// Выгрузка на хостинг
gulp.task('deploy', function () {
    return gulp.src('dist/**')
        .pipe(ftp({
            host: 'cm96985.tmweb.ru',
            user: 'cm96985',
            pass: '******',
            remotePath: 'public_html'
        }))
        .pipe(gutil.noop());
});


// Выгрузка в папку dist/css
gulp.task('build-css', function() {

    // Файлы из папки css
    var destToCss = gulp.src([
        'app/css/**',
        ])
    // Выгрузка в папку dist/css
    return merge(destToCss)
        .pipe(gulp.dest('dist/css'));

});

// Выгрузка в папку dist/fonts
gulp.task('build-fonts', function() {

    // Файлы из папки fonts
    var destToFonts = gulp.src('app/fonts/**/*')
    // Выгрузка в папку dist/fonts
    return merge(destToFonts)
        .pipe(gulp.dest('dist/fonts'));

});

// Выгрузка в папку dist/js
gulp.task('build-webfont-loaded', function() {

    // Файлы из папки webfont-loaded
    var destToWebfontLoaded = gulp.src('app/js/webfont-loaded.js')
    // Выгрузка в папку dist/js
    return merge(destToWebfontLoaded)
        .pipe(uglify()) // Сжатие js
        .pipe(gulp.dest('dist/js'));

});

// Выгрузка в папку dist/js
gulp.task('build-js', function() {

    // Файлы из папки js
    var destToJs = gulp.src([
        'app/js/*.js',
        ])
    // Выгрузка в папку dist/js
    return merge(destToJs)
        .pipe(gulp.dest('dist/js'));

});

// Выгрузка в папку dist
gulp.task('build-settings', function() {

    // Файлы из папки settings
    var destToDist = gulp.src([
        'app/*.html',
        '!app/settings/ht.access',
        'app/settings/**',
        ])
    // Выгрузка в папку dist
    return merge(destToDist)
        .pipe(gulp.dest('dist'));

});

// Выгрузка в папку dist
gulp.task('build-php', function() {

    // Файлы из папки settings
    var destToPhpLibs = gulp.src([
        'app/php/**',
        '!app/blocks/_includes/form/_php/*.php',
        '!app/blocks/_includes/form/_php/*.txt',
        ])
    // Выгрузка в папку dist
    return merge(destToPhpLibs)
        .pipe(gulp.dest('dist/php'));

});

// Выгрузка в папку dist
gulp.task('build-htaccess', function() {

    // Файлы из папки settings/ht.access
    var destHtaccessRename = gulp.src('app/settings/ht.access')
        
    // Выгрузка в папку dist
    return merge(destHtaccessRename)
        .pipe(rename({
            basename: ".",
            extname: "htaccess"
        }))
        .pipe(gulp.dest('dist'));

});

// Выгрузка в папку dist/images/favicon
gulp.task('build-favicon', function() {

    // Файлы из папки images
    var destToFavicon =  gulp.src('app/img/Favicon/**')
    // Выгрузка в папку dist/images/favicon
    return merge(destToFavicon)
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/Favicon'));

});

// Выгрузка в папку dist/images/icons
gulp.task('build-icons', function() {

    // Файлы из папки images
    var destToIcons =  gulp.src('app/img/Icons/**')
    // Выгрузка в папку dist/images/icons
    return merge(destToIcons)
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/Icons')); 

});

// Выгрузка в папку dist/images/OpenGraph
gulp.task('build-og', function() {

    // Файлы из папки images
    var destToOpenGraph =  gulp.src('app/img/OpenGraph/**')
    // Выгрузка в папку dist/images/OpenGraph
    return merge(destToOpenGraph)
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/OpenGraph')); 

});

// Выгрузка в папку dist/images/img
gulp.task('build-img', function() {

    // Файлы из папки images
    var destToImg =  gulp.src([
        'app/img/*.png',
        'app/img/*.jpg',
        'app/img/*.jpeg',
        'app/img/*.gif',
        ])
    // Выгрузка в папку dist/images/img
    return merge(destToImg)
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img')); 

});

// Выгрузка в папку dist/img/Sprite/png
gulp.task('build-sprite', function() {

    // Файлы из папки images
    var destToImgSprite =  gulp.src('app/img/Sprite/png/*.png')
    // Выгрузка в папку dist/img/Sprite/png
    return merge(destToImgSprite)
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/Sprite/png')); 

});

// Выгрузка в папку dist/img/Sprite/svg
gulp.task('build-sprite-svg', function() {

    // Файлы из папки images
    var destToImgSprite =  gulp.src('app/img/Sprite/svg/*.svg')
    // Выгрузка в папку dist/img/Sprite/svg
    return merge(destToImgSprite)
        .pipe(gulp.dest('dist/img/Sprite/svg')); 

});

// Выгрузка в папку dist/img/JPEG 2000
gulp.task('build-jpeg2', function() {

    // Файлы из папки images
    var destToImgJpeg2 =  gulp.src('app/img/JPEG 2000/**')
    // Выгрузка в папку dist/img/JPEG 2000
    return merge(destToImgJpeg2)
        .pipe(gulp.dest('dist/img/JPEG 2000')); 

});

// Выгрузка в папку dist/img/JPEG XR
gulp.task('build-jpegxr', function() {

    // Файлы из папки images
    var destToImgJpegxr =  gulp.src('app/img/JPEG XR/**')
    // Выгрузка в папку dist/img/JPEG XR
    return merge(destToImgJpegxr)
        .pipe(gulp.dest('dist/img/JPEG XR')); 

});

// Выгрузка в папку dist/img/WebP
gulp.task('build-webp-webp', function() {

    // Файлы из папки images
    var destToImgWebP =  gulp.src('app/img/WebP/**')
    // Выгрузка в папку dist/img/WebP
    return merge(destToImgWebP)
        .pipe(gulp.dest('dist/img/WebP')); 

});

// Выгрузка в папку dist/images/WebP
gulp.task('build-webp', () =>
    gulp.src([
        'app/img/*.jpg',
        'app/img/*.png'
        ])
        .pipe(webp({
            // quality: 80,
            // preset: 'photo',
            // method: 6,
            lossless: true // Сжатие без потерь
        }))
        .pipe(gulp.dest('dist/img'))
);

// Сборка
gulp.task('build', gulp.series(
    'clean',
    'jade', 
    'sass', 
    'scripts',
    'build-css',
    'build-fonts',
    'build-webfont-loaded',
    'build-js',
    'build-settings',
    'build-php',
    'build-htaccess',
    'build-favicon',
    'build-icons',
    'build-svg',
    'build-og',
    'build-img',
    'build-sprite',
    'build-jpeg2',
    'build-jpegxr',
    'build-webp-webp',
    'build-sprite-svg',
    'build-webp',
    ))
 
// Команды по умолчанию
gulp.task('default', gulp.parallel('watch', 'jade', 'sass', 'scripts', 'browser-sync')); 