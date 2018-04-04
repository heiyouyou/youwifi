var gulp = require("gulp");
var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var babelify = require("babelify");
var minifycss = require('gulp-minify-css');
// var jshint = require('gulp-jshint');

// 压缩图片插件
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// 批量browserify的插件
var glob = require("glob");
var es = require("event-stream");
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

// 静态资源版本号添加的相关插件,防浏览器缓存
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");


// 各种资源存放路径
var srcObj = {
    cssSrc:'./css/src/*.css',
    cssDist:'./css/dist/',
    jsSrc:'./js/src/*.js',
    jsDist:'./js/dist/',
    jspSrc:'../templates/src/**/*.html',
    jspDist:'../templates/',
}

// 处理样式文件
gulp.task("styles",function(){
    return gulp.src(srcObj.cssSrc)
    .pipe(minifycss())//压缩
    .pipe(gulp.dest(srcObj.cssDist))//生成文件存放目录
    .pipe(rev())//生成md5后缀查询参数的文件名
    .pipe(rev.manifest())//生成rev-manifest.json文件
    .pipe(gulp.dest('./rev'))//rev-manifest.json文件存放目录
});

// 处理ES6代码
// gulp.task("es6_to_es5", function () {
//     return gulp.src([srcObj.jsSrc])
//         // .pipe(jshint.reporter('default')) // js代码检查
//         .pipe(babel())
//         // .pipe(babel({
//         //     presets: ['es2015'] //不能少装npm install babel-preset-es2015 --save-dev ,如果已经有.babelrc文件配置了，就不需要在这里配置presets选项
//         // }))
//         .pipe(uglify()) //压缩
//         .pipe(gulp.dest(srcObj.jsDist))
//         .pipe(rev())
//         .pipe(rev.manifest('../rev/rev-manifest.json',{
//             'base':'../rev',
// 			'merge':true//当前输出目录下如果已经存在rev-manifest.json文件进行合并
//         }))
//         .pipe(gulp.dest("../rev"));
// });

// 清理冗余的静态资源文件
// gulp.task('clean',function(){
// 	return gulp.src([
// 		'../css/dist/*.css',//删除的文件路径
// 		'./dist/*.js',
// 	],{read: false})
// 	.pipe(clean({force:true}))
// });

// 处理图片文件
// gulp.task("images",function(){
//     return gulp.src(['../images/*.{jpg,jpeg}'])
//     .pipe(cache(imagemin({
//         optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//         progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//         interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//         multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
//     })))//压缩图片
//     .pipe(gulp.dest('../images/dist/'))
// });

// 处理require导入模块的文件，该文件中的变量和方法将私有化，不能被共享
gulp.task("browserify", function (done) {
    // 多个入口文件匹配编译输出成合并文件，支持正则匹配
    glob(srcObj.jsSrc, function (err, files) {
        if (err) done(err);
        var tasks = files.map(function (entry) {
            // 获取每个文件名
            var bundle = entry.substring(entry.lastIndexOf('/')+1)
            console.log(bundle)
            return browserify({
                "entries":[entry],
                "debug":true
            })
            .transform(babelify, {//调用babel插件进行编译es6
                "presets": [
                    "es2015"
                ]
            })
            .bundle()//转换成流
            .on('error', function (err) { console.error(err); })//监听错误
            .pipe(source(bundle))//输出文件，如果指定一个文件名，则会合并在一个文件中输出
            .pipe(buffer())//转换成buffer流
            // .pipe(sourcemaps.init({//日志调试
            //     loadMaps:true
            // }))
            // .pipe(sourcemaps.write("./"))
            .pipe(uglify())
            .pipe(gulp.dest(srcObj.jsDist))//最终输出，但是版本号文件只能输出最后一个文件的版本号
            .pipe(rev())
            .pipe(rev.manifest('./rev/rev-manifest.json',{
                'base':'./rev',
                'merge':true//当前输出目录下如果已经存在rev-manifest.json文件进行合并
            }))
            .pipe(gulp.dest("./rev"));
        });
        // 监听多个任务流结束
        es.merge(tasks).on("end", done);
    });
});

// jsp文件替换css、js文件版本
gulp.task("revJsp",function(){
    // gulp.src()中的第一个文件路径一定要写rev-manifest.json的路径，否则会无法进行替换
    return gulp.src(['./rev/rev-manifest.json',srcObj.jspSrc])
        .pipe(revCollector({
			replaceReved: true
		}))
        .pipe(gulp.dest(srcObj.jspDist));

});

// 同步执行任务，先css、再js执行、后jsp同步执行，否则无法进行静态资源版本替换
gulp.task('dev',function(done){
	runSequence('styles','browserify','revJsp',done);
});

// 监听多个任务下的文件改动
gulp.task("listen", function () {
    // gulp.watch(srcObj.cssSrc, ["styles"]);
    // gulp.watch(srcObj.jsSrc, ["es6_to_es5"]);
    gulp.watch([srcObj.cssSrc,srcObj.jsSrc,srcObj.jspSrc], ["dev"]);
});

gulp.task("default", ["dev","listen"]);
