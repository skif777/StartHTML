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
    plumber             = require('gulp-plumber'); // Перехват ошибок


// Компиляция из sass в css
gulp.task('sass' , function () {
    return gulp.src('app/sass/style.sass')
    .pipe(sass({outputStyle: 'expanded'}).on('error' , sass.logError)) // Компиляция в css
    .pipe(autoprefixer({ // автопрефиксер 
            browsers: ['last 15 versions', 'ie >= 9', 'and_chr >= 2.3'],
            cascade: true
        }))
 // .pipe(browserSync.reload({stream: true})) // livereload pipe
    .pipe(gulp.dest('app/css'))
});

// Jade - Компиляция в HTML
gulp.task('jade', function(){
  gulp.src([
    'app/blocks/page-contents/index/index.jade',
    '!app/blocks/page-contents/contact/contact.jade',
    '!app/blocks/page-contents/price/price.jade',
    '!app/blocks/page-contents/services/services.jade',
    '!app/blocks/page-contents/portfolio/portfolio.jade',
    '!app/blocks/page-contents/catalog/catalog.jade',
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
    '!app/libs/Google-maps-api/google-maps-api.js',
    '!app/libs/Maplace/maplace.min.js',
    '!app/libs/jquery-ui-1.12.1.custom',
    '!app/libs/jquery-countTo-master/jquery.countTo.js'
    ])
    .pipe(concat('scripts.js')) // Название файла в который идет конкатинация
  //.pipe(uglify()) // Сжатие js
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest('app/js'));
});  

// Оптимизация и минификая css
gulp.task('css', function() {
    return gulp.src('app/css/style.css')
    .pipe(stripCssComments({ // Удаление комментариев
        preserve: false
    }))
    .pipe(uncss({ // Удаление лишних классов
        html: ['app/*.html', 'http://cm96985.tmweb.ru/'] // Файлы в которых проверяются CSS классы на использование
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
    .pipe(rename({  // Переименование файла
            suffix: ".min",
         }))
    .pipe(gulp.dest('dist'));
});

// Переименование
/*gulp.task('rename' ,['sass'], function() {
    gulp.src("app/css/main.css")
    .pipe(rename("style.css"))
    .pipe(gulp.dest("app/css")); 
});*/

// Сжатие изображений
gulp.task('compress', function() {
    gulp.src([
        'app/img/*.jpg',
        'app/libs/Sprites/*.png'
    ])
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [imageminPngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

// Ультра-сжатие изображений
gulp.task('tinypng', function(cb) {
    gulp.src([
        'app/img/*.jpg',
        'app/img/*.png',
        'app/libs/Sprites/*.jpg',
        'app/libs/Sprites/*.png'
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
    'app/img/Sprites/*.jpg',
    'app/img/Sprites/*.png'
  ]).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.sass',
    imgPath: '../img/sprite.png',
    algorithm: 'left-right'
  }));
  return spriteData.pipe(gulp.dest('app/libs/Sprites/css'));
});

// SVG Sprite
gulp.task('svg', function () {
    return gulp.src('app/img/SVG/*.svg')
        .pipe(svgmin()) // Минификация SVG
    /*  .pipe(cheerio(function ($) {
            $('svg').attr('style',  'display:none');
        })) */
        .pipe(rename({
            basename: "svg-sprite"
        }))
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/libs/Sprites/SVG"));
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
gulp.task('clean', function() {
    return del.sync('dist');
});

// Наблюдение
gulp.task('watch' , ['jade', 'sass', 'scripts', 'browser-sync'], function() {
    gulp.watch('app/sass/**/*.sass' , ['sass']); // Наблюдение за SASS в папке sass
    gulp.watch('app/blocks/**/*.sass' , ['sass']); // Наблюдение за SASS в папке blocks
    gulp.watch('app/blocks/**/*.jade' , ['jade']); // Наблюдение за Jade в папке blocks
    gulp.watch('app/css/style.css',  browserSync.reload); // reload css
    gulp.watch('app/*.html' , browserSync.reload); // reload html
    gulp.watch('app/**/*.js' , ['scripts'], browserSync.reload); // reload js
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

// Сборка
gulp.task('build', ['clean', 'sass', 'css', 'scripts', 'jade'], function() {

    var destToCss = gulp.src([
        'app/css/**',
        ])
        .pipe(gulp.dest('dist/css'));

    var destToFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var destToJsMin = gulp.src('app/js/scripts.js')
        .pipe(strip()) // Удаление комментариев
        .pipe(uglify()) // Сжатие js
        .pipe(rename({ // Переименование файла
            suffix: ".min",
         }))
        .pipe(gulp.dest('dist/js'));

    var destToJs = gulp.src('app/js/webfont-loaded.js')
        .pipe(strip()) // Удаление комментариев
        .pipe(uglify()) // Сжатие js
        .pipe(gulp.dest('dist/js'));

    var destTo = gulp.src([
        'app/*.html',
        'app/settings/**',
        'app/settings/.gitattributes',
        'app/settings/.gitignore',
        'app/settings/.editorconfig',
        ])
        .pipe(gulp.dest('dist'));

    var destToPhpRename = gulp.src([
        'app/php/send(phpmailer-6).php'
        ])
        .pipe(rename({
            basename: "send",
         }))
        .pipe(gulp.dest('dist/php'));

    var destToPhpLibs = gulp.src([
        'app/php/**',
        '!app/blocks/_includes/form/_php/*.php',
        '!app/blocks/_includes/form/_php/*.txt',
        ])
        .pipe(gulp.dest('dist/php/'));

    var destHtaccessRename = gulp.src('app/ht.access')
        .pipe(rename({
            basename: ".",
            extname: "htaccess"
         }))
        .pipe(gulp.dest('dist'));

   var destToImg =  gulp.src([
        'app/img/*.jpg',
        'app/img/*.png',
        'app/img/*.gif',
        'app/libs/Sprites/css/sprite.png',
        ])
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img'));

    var destToSvg =  gulp.src('app/libs/Sprites/SVG/svg/svg-sprite.svg')
        .pipe(gulp.dest('dist/img/SVG'));

    var destToFavicon =  gulp.src('app/img/Favicon/**')
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/Favicon'));

    var destToIcons =  gulp.src('app/img/Icons/**')
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/Icons')); 

    var destToOpenGraph =  gulp.src('app/img/OpenGraph/**')
        .pipe(tiny()) // Ультра-сжатие изображение
        .pipe(gulp.dest('dist/img/OpenGraph')); 
});
 
// Команды по умолчанию
gulp.task('default', ['watch']); 