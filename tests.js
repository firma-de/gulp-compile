"use strict";

var gulp    = require( "gulp" ),
    should  = require( "should" ),
    through = require( "through2" ),
    gutil   = require( "gulp-util" ),
    compile = require( "./index.js" );

describe( "module requirements", function() {

    it( "should export a function", () => {
        compile.should.be.Function();
    } );

    it( "should throw if no options are provided", () => {
        should.throws( function() { compile(); } );
    } );

    it( "should throw if we provide empty object", function() {
        this.slow( 1000 );
        should.throws( function() { compile( {} ); } );
    } );

    it( "should not throw if required options are provided", function() {
        this.slow( 1000 );
        should.doesNotThrow( function() { compile( { target : "node" } ); } );
    } );

} );

describe( "general options", function() {

    it( "should print if silent option is off", function( done ) {

        this.slow( 4000 );
        this.timeout( 5000 );

        var originalLog = gutil.log,
            logLines    = 0;

        gutil.log = () => logLines++;

        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "node" } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                callback( null, file );
            }, () => {
                setTimeout( function() {
                    gutil.log = originalLog;
                    logLines.should.equal( 1 );
                    done();
                }, 200 );
            } ) );
    } );

    it( "should print nothing silent option is on", function( done ) {

        this.slow( 4000 );
        this.timeout( 5000 );

        var originalLog = gutil.log,
            logLines    = 0;

        gutil.log = () => logLines++;

        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                callback( null, file );
            }, () => {
                setTimeout( function() {
                    gutil.log = originalLog;
                    logLines.should.equal( 0 );
                    done();
                }, 200 );
            } ) );
    } );

} );

describe( "target node", function() {

    it( "should compile properly typescript", function( done ) {
        this.slow( 4000 );
        this.timeout( 5000 );
        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "index.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(o){function t(r){if(n[r])return n[r].exports;var e=n' +
                        '[r]={exports:{},id:r,loaded:!1};return o[r].call(e.exports,e,e' +
                        '.exports,t),e.loaded=!0,e.exports}var n={};return t.m=o,t.c=n,' +
                        't.oe=function(o){throw o},t.p="",t(t.s=1)}([function(o,t){func' +
                        'tion n(o){o+="alpha"}n("foo")},function(o,t,n){o.exports=n(0)}' +
                        ']);'
                    );
                callback( null, file );
            }, () => done() ) );

    } );

    it( "should properly include json by default", function( done ) {
        this.slow( 4000 );
        gulp
            .src( "./fixtures/test-json.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "test-json.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(o){function n(t){if(r[t])return r[t].exports;var e=r' +
                        '[t]={exports:{},id:t,loaded:!1};return o[t].call(e.exports,e,e' +
                        '.exports,n),e.loaded=!0,e.exports}var r={};return n.m=o,n.c=r,' +
                        'n.oe=function(o){throw o},n.p="",n(n.s=2)}([function(o,n,r){va' +
                        'r t=r(1);console.log(t)},function(o,n){o.exports={name:"alpha"' +
                        '}},function(o,n,r){o.exports=r(0)}]);'
                    );
                callback( null, file );
            }, () => done() ) );

    } );

    it( "should compile properly typescript not minified", function( done ) {
        this.slow( 4000 );
        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "node", silent : true, minify : false } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "index.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '/******/ (function(modules) { // webpackBootstrap\n/******/ \t' +
                        '// The module cache\n/******/ \tvar installedModules = {};\n\n' +
                        '/******/ \t// The require function\n/******/ \tfunction __webp' +
                        'ack_require__(moduleId) {\n\n/******/ \t\t// Check if module i' +
                        's in cache\n/******/ \t\tif(installedModules[moduleId])\n/****' +
                        '**/ \t\t\treturn installedModules[moduleId].exports;\n\n/*****' +
                        '*/ \t\t// Create a new module (and put it into the cache)\n/**' +
                        '****/ \t\tvar module = installedModules[moduleId] = {\n/******' +
                        '/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ ' +
                        '\t\t\tloaded: false\n/******/ \t\t};\n\n/******/ \t\t// Execut' +
                        'e the module function\n/******/ \t\tmodules[moduleId].call(mod' +
                        'ule.exports, module, module.exports, __webpack_require__);\n\n' +
                        '/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule' +
                        '.loaded = true;\n\n/******/ \t\t// Return the exports of the m' +
                        'odule\n/******/ \t\treturn module.exports;\n/******/ \t}\n\n\n' +
                        '/******/ \t// expose the modules object (__webpack_modules__)' +
                        '\n/******/ \t__webpack_require__.m = modules;\n\n/******/ \t//' +
                        ' expose the module cache\n/******/ \t__webpack_require__.c = i' +
                        'nstalledModules;\n\n/******/ \t// on error function for async ' +
                        'loading\n/******/ \t__webpack_require__.oe = function(err) { t' +
                        'hrow err; };\n\n/******/ \t// __webpack_public_path__\n/******' +
                        '/ \t__webpack_require__.p = "";\n/******/ \t// Load entry modu' +
                        'le and return exports\n/******/ \treturn __webpack_require__(_' +
                        '_webpack_require__.s = 1);\n/******/ })\n/********************' +
                        '****************************************************/\n/******' +
                        '/ ([\n/* 0 */\n/***/ function(module, exports) {\n\n\t/**\n\t ' +
                        '* TypeScript Fixture\n\t */\n\tfunction alpha(content) {\n\t  ' +
                        '  content += "alpha";\n\t}\n\talpha("foo");\n\n\n/***/ },\n/* ' +
                        '1 */\n/***/ function(module, exports, __webpack_require__) {\n' +
                        '\n\tmodule.exports = __webpack_require__(0);\n\n\n/***/ }\n/**' +
                        '****/ ]);'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should compile properly included css", function( done ) {
        this.timeout( 5000 );
        this.slow( 4000 );
        gulp
            .src( "./fixtures/css.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "css.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(o){function t(n){if(r[n])return r[n].exports;var e=r' +
                        '[n]={exports:{},id:n,loaded:!1};return o[n].call(e.exports,e,e' +
                        '.exports,t),e.loaded=!0,e.exports}var r={};return t.m=o,t.c=r,' +
                        't.oe=function(o){throw o},t.p="",t(t.s=2)}([function(o,t,r){fu' +
                        'nction n(o){o+="1"}var e=r(1);n(e.root)},function(o,t){o.expor' +
                        'ts={root:"_1ctjD"}},function(o,t,r){o.exports=r(0)}]);'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should compile properly tsx files", function( done ) {
        this.timeout( 5000 );
        this.slow( 4000 );
        gulp
            .src( "./fixtures/tsx.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "tsx.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(t){function r(n){if(e[n])return e[n].exports;var o=e' +
                        '[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o' +
                        '.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,' +
                        'r.oe=function(t){throw t},r.p="",r(r.s=2)}([function(t,r,e){fu' +
                        'nction n(t){return t}var o=e(1);n(o.markup)},function(t,r){r.m' +
                        'arkup=React.createElement("div",{className:"test"})},function(' +
                        't,r,e){t.exports=e(0)}]);'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should create sourcemaps", function( done ) {
        this.timeout( 5000 );
        this.slow( 4000 );

        const files = [];

        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( {
                target : "node",
                silent : true,
                minify : false,
                sourcemaps : true
            } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                files.push( file );
                callback( null, file );
            }, () => {

                var count = files.length;

                files.should.have.length( 2 );
                files.forEach( file => {

                    if ( file.relative === "index.js" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .should
                            .equal(
                                '/******/ (function(modules) { // webpackBootstrap\n/**' +
                                '****/ \t// The module cache\n/******/ \tvar installedM' +
                                'odules = {};\n/******/\n/******/ \t// The require func' +
                                'tion\n/******/ \tfunction __webpack_require__(moduleId' +
                                ') {\n/******/\n/******/ \t\t// Check if module is in c' +
                                'ache\n/******/ \t\tif(installedModules[moduleId])\n/**' +
                                '****/ \t\t\treturn installedModules[moduleId].exports;' +
                                '\n/******/\n/******/ \t\t// Create a new module (and p' +
                                'ut it into the cache)\n/******/ \t\tvar module = insta' +
                                'lledModules[moduleId] = {\n/******/ \t\t\texports: {},' +
                                '\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded:' +
                                ' false\n/******/ \t\t};\n/******/\n/******/ \t\t// Exe' +
                                'cute the module function\n/******/ \t\tmodules[moduleI' +
                                'd].call(module.exports, module, module.exports, __webp' +
                                'ack_require__);\n/******/\n/******/ \t\t// Flag the mo' +
                                'dule as loaded\n/******/ \t\tmodule.loaded = true;\n/*' +
                                '*****/\n/******/ \t\t// Return the exports of the modu' +
                                'le\n/******/ \t\treturn module.exports;\n/******/ \t}' +
                                '\n/******/\n/******/\n/******/ \t// expose the modules' +
                                ' object (__webpack_modules__)\n/******/ \t__webpack_re' +
                                'quire__.m = modules;\n/******/\n/******/ \t// expose t' +
                                'he module cache\n/******/ \t__webpack_require__.c = in' +
                                'stalledModules;\n/******/\n/******/ \t// on error func' +
                                'tion for async loading\n/******/ \t__webpack_require__' +
                                '.oe = function(err) { throw err; };\n/******/\n/******' +
                                '/ \t// __webpack_public_path__\n/******/ \t__webpack_r' +
                                'equire__.p = "";\n/******/ \t// Load entry module and ' +
                                'return exports\n/******/ \treturn __webpack_require__(' +
                                '__webpack_require__.s = 1);\n/******/ })\n/***********' +
                                '******************************************************' +
                                '*******/\n/******/ ([\n/* 0 */\n/***/ function(module,' +
                                ' exports) {\n\n\t/**\n\t * TypeScript Fixture\n\t */\n' +
                                '\tfunction alpha(content) {\n\t    content += "alpha";' +
                                '\n\t}\n\talpha("foo");\n\n\n/***/ },\n/* 1 */\n/***/ f' +
                                'unction(module, exports, __webpack_require__) {\n\n\tm' +
                                'odule.exports = __webpack_require__(0);\n\n\n/***/ }\n' +
                                '/******/ ]);\n//# sourceMappingURL=index.js.map'
                            );
                    }

                    if ( file.relative === "index.js.map" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .should
                            .equal(
                                '{"version":3,"sources":["../webpack/bootstrap ddae8dd3' +
                                'c3d5272ba650",".././fixtures/index.ts"],"names":["alph' +
                                'a"],"mappings":";AAAA;AACA;;AAEA;AACA;;AAEA;AACA;AACA;' +
                                ';AAEA;AACA;AACA,uBAAe;AACf;AACA;AACA;;AAEA;AACA;;AAEA;' +
                                'AACA;;AAEA;AACA;AACA;;;AAGA;AACA;;AAEA;AACA;;AAEA;AACA' +
                                ',kDAA0C,WAAW;;AAErD;AACA;AACA;AACA;;;;;;;ACxCA;;IAEG;A' +
                                'AEH,gBAAgB,OAAgB;KAC5BA,OAAOA,IAAIA,OAAOA,CAACA;AACvBA' +
                                ',EAACA;AAED,MAAK,CAAC,KAAK,CAAC,CAAC","file":"index.js' +
                                '","sourcesContent":[" \\t// The module cache\\n \\tvar' +
                                ' installedModules = {};\\n\\n \\t// The require functi' +
                                'on\\n \\tfunction __webpack_require__(moduleId) {\\n\\' +
                                'n \\t\\t// Check if module is in cache\\n \\t\\tif(ins' +
                                'talledModules[moduleId])\\n \\t\\t\\treturn installedM' +
                                'odules[moduleId].exports;\\n\\n \\t\\t// Create a new ' +
                                'module (and put it into the cache)\\n \\t\\tvar module' +
                                ' = installedModules[moduleId] = {\\n \\t\\t\\texports:' +
                                ' {},\\n \\t\\t\\tid: moduleId,\\n \\t\\t\\tloaded: fal' +
                                'se\\n \\t\\t};\\n\\n \\t\\t// Execute the module funct' +
                                'ion\\n \\t\\tmodules[moduleId].call(module.exports, mo' +
                                'dule, module.exports, __webpack_require__);\\n\\n \\t' +
                                '\\t// Flag the module as loaded\\n \\t\\tmodule.loaded' +
                                ' = true;\\n\\n \\t\\t// Return the exports of the modu' +
                                'le\\n \\t\\treturn module.exports;\\n \\t}\\n\\n\\n \\' +
                                't// expose the modules object (__webpack_modules__)\\n' +
                                ' \\t__webpack_require__.m = modules;\\n\\n \\t// expos' +
                                'e the module cache\\n \\t__webpack_require__.c = insta' +
                                'lledModules;\\n\\n \\t// on error function for async l' +
                                'oading\\n \\t__webpack_require__.oe = function(err) { ' +
                                'throw err; };\\n\\n \\t// __webpack_public_path__\\n ' +
                                '\\t__webpack_require__.p = \\"\\";\\n \\t// Load entr' +
                                'y module and return exports\\n \\treturn __webpack_re' +
                                'quire__(__webpack_require__.s = 1);\\n\\n\\n\\n/** WE' +
                                'BPACK FOOTER **\\n ** webpack/bootstrap ddae8dd3c3d52' +
                                '72ba650\\n **/","/**\\n * TypeScript Fixture\\n */\\n' +
                                '\\nfunction alpha( content : string ) {\\n    content ' +
                                '+= \\"alpha\\";\\n}\\n\\nalpha(\\"foo\\");\\n\\n\\n/**' +
                                ' WEBPACK FOOTER **\\n ** ./fixtures/index.ts\\n **/"],' +
                                '"sourceRoot":""}'
                            );
                    }

                } );

                count.should.equal( 0 );

                done();

            } ) );
    } );

    it( "should compile properly external modules", function( done ) {
        this.slow( 4000 );
        this.timeout( 5000 );
        gulp
            .src( "./fixtures/externals.ts" )
            .pipe( compile( { target : "node", silent : true, externals : ["alpha"] } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "externals.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(r){function o(n){if(t[n])return t[n].exports;var e=t' +
                        '[n]={exports:{},id:n,loaded:!1};return r[n].call(e.exports,e,e' +
                        '.exports,o),e.loaded=!0,e.exports}var t={};return o.m=r,o.c=t,' +
                        'o.oe=function(r){throw r},o.p="",o(o.s=2)}([function(r,o,t){fu' +
                        'nction n(r){r+="b"}var e=t(1);n(e)},function(r,o){r.exports=re' +
                        'quire("alpha")},function(r,o,t){r.exports=t(0)}]);'
                    );
                callback( null, file );
            }, () => done() ) );

    } );

    it( "should be able to compile library", function( done ) {
        this.slow( 4000 );
        gulp
            .src( "./fixtures/library.ts" )
            .pipe(
                compile( { target : "node", silent : true, library : "testLibrary" } )
            )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "library.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(t,e){"object"==typeof exports&&"object"==typeof modu' +
                        'le?module.exports=e():"function"==typeof define&&define.amd?de' +
                        'fine([],e):"object"==typeof exports?exports.testLibrary=e():t.' +
                        'testLibrary=e()}(this,function(){return function(t){function e' +
                        '(r){if(o[r])return o[r].exports;var n=o[r]={exports:{},id:r,lo' +
                        'aded:!1};return t[r].call(n.exports,n,n.exports,e),n.loaded=!0' +
                        ',n.exports}var o={};return e.m=t,e.c=o,e.oe=function(t){throw ' +
                        't},e.p="",e(e.s=1)}([function(t,e){t.exports=function(){return' +
                        '!0}},function(t,e,o){t.exports=o(0)}])});'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should emit error if TypeScript didn't compile", function( done ) {
        this.slow( 4000 );
        gulp
            .src( "./fixtures/errorful.ts" )
            .pipe( compile( { target : "node", silent : true } ) )
            .on( "error", err => done() );
    } );

} );

describe( "target web", function() {

    it( "should compile properly typescript", function( done ) {
        this.slow( 5000 );
        this.timeout( 4000 );
        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "web", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "index.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(o){function t(r){if(n[r])return n[r].exports;var e=n' +
                        '[r]={exports:{},id:r,loaded:!1};return o[r].call(e.exports,e,e' +
                        '.exports,t),e.loaded=!0,e.exports}var n={};return t.m=o,t.c=n,' +
                        't.oe=function(o){throw o},t.p="",t(t.s=1)}([function(o,t){func' +
                        'tion n(o){o+="alpha"}n("foo")},function(o,t,n){o.exports=n(0)}' +
                        ']);'
                    );
                callback( null, file );
            }, () => done() ) );

    } );

    it( "should compile properly typescript not minified", function( done ) {
        this.slow( 5000 );
        this.timeout( 6000 );
        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( { target : "web", silent : true, minify : false } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "index.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '/******/ (function(modules) { // webpackBootstrap\n/******/ \t' +
                        '// The module cache\n/******/ \tvar installedModules = {};\n\n' +
                        '/******/ \t// The require function\n/******/ \tfunction __webp' +
                        'ack_require__(moduleId) {\n\n/******/ \t\t// Check if module i' +
                        's in cache\n/******/ \t\tif(installedModules[moduleId])\n/****' +
                        '**/ \t\t\treturn installedModules[moduleId].exports;\n\n/*****' +
                        '*/ \t\t// Create a new module (and put it into the cache)\n/**' +
                        '****/ \t\tvar module = installedModules[moduleId] = {\n/******' +
                        '/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ ' +
                        '\t\t\tloaded: false\n/******/ \t\t};\n\n/******/ \t\t// Execut' +
                        'e the module function\n/******/ \t\tmodules[moduleId].call(mod' +
                        'ule.exports, module, module.exports, __webpack_require__);\n\n' +
                        '/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule' +
                        '.loaded = true;\n\n/******/ \t\t// Return the exports of the m' +
                        'odule\n/******/ \t\treturn module.exports;\n/******/ \t}\n\n\n' +
                        '/******/ \t// expose the modules object (__webpack_modules__)' +
                        '\n/******/ \t__webpack_require__.m = modules;\n\n/******/ \t//' +
                        ' expose the module cache\n/******/ \t__webpack_require__.c = i' +
                        'nstalledModules;\n\n/******/ \t// on error function for async ' +
                        'loading\n/******/ \t__webpack_require__.oe = function(err) { t' +
                        'hrow err; };\n\n/******/ \t// __webpack_public_path__\n/******' +
                        '/ \t__webpack_require__.p = "";\n/******/ \t// Load entry modu' +
                        'le and return exports\n/******/ \treturn __webpack_require__(_' +
                        '_webpack_require__.s = 1);\n/******/ })\n/********************' +
                        '****************************************************/\n/******' +
                        '/ ([\n/* 0 */\n/***/ function(module, exports) {\n\n\t/**\n\t ' +
                        '* TypeScript Fixture\n\t */\n\tfunction alpha(content) {\n\t  ' +
                        '  content += "alpha";\n\t}\n\talpha("foo");\n\n\n/***/ },\n/* ' +
                        '1 */\n/***/ function(module, exports, __webpack_require__) {\n' +
                        '\n\tmodule.exports = __webpack_require__(0);\n\n\n/***/ }\n/**' +
                        '****/ ]);'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should compile properly included css", function( done ) {
        this.timeout( 6000 );
        this.slow( 4000 );

        const files = [];

        gulp
            .src( "./fixtures/css.ts" )
            .pipe( compile( { target : "web", silent : true } ) )
            .on( "error", err => console.log( err ) )
            .pipe( through.obj( function( file, enc, callback ) {
                    files.push( file );
                    callback( null, file );
                },
                function() {

                    var count = files.length;
                    files.should.have.length( 2 );

                    files.forEach( file => {

                        if ( file.relative === "css.js" ) {
                            count--;
                            file.contents.toString( "utf8" )
                                .should
                                .equal(
                                    '!function(o){function t(n){if(r[n])return r[n].exp' +
                                    'orts;var e=r[n]={exports:{},id:n,loaded:!1};return' +
                                    ' o[n].call(e.exports,e,e.exports,t),e.loaded=!0,e.' +
                                    'exports}var r={};return t.m=o,t.c=r,t.oe=function(' +
                                    'o){throw o},t.p="",t(t.s=2)}([function(o,t,r){func' +
                                    'tion n(o){o+="1"}var e=r(1);n(e.root)},function(o,' +
                                    't){o.exports={root:"_1ctjD"}},function(o,t,r){o.ex' +
                                    'ports=r(0)}]);'
                                );
                        }

                        if ( file.relative === "styles.css" ) {
                            count--;
                            file.contents.toString( "utf8" )
                                .should
                                .equal( "._1ctjD { color: red; }" );
                        }

                    } );

                    count.should.equal( 0 );

                    done();

                } )
            )
            .on( "error", err => console.log( err ) )
    } );

    it( "should compile properly tsx files", function( done ) {
        this.timeout( 5000 );
        this.slow( 4000 );
        gulp
            .src( "./fixtures/tsx.ts" )
            .pipe( compile( { target : "web", silent : true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "tsx.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        '!function(t){function r(n){if(e[n])return e[n].exports;var o=e' +
                        '[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o' +
                        '.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,' +
                        'r.oe=function(t){throw t},r.p="",r(r.s=2)}([function(t,r,e){fu' +
                        'nction n(t){return t}var o=e(1);n(o.markup)},function(t,r){r.m' +
                        'arkup=React.createElement("div",{className:"test"})},function(' +
                        't,r,e){t.exports=e(0)}]);'
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should create sourcemaps", function( done ) {
        this.timeout( 5000 );
        this.slow( 4000 );

        const files = [];

        gulp
            .src( "./fixtures/index.ts" )
            .pipe( compile( {
                target : "web",
                silent : true,
                minify : false,
                sourcemaps : true
            } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                files.push( file );
                callback( null, file );
            }, () => {

                var count = files.length;

                files.should.have.length( 2 );
                files.forEach( file => {

                    if ( file.relative === "index.js" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .should
                            .equal(
                                '/******/ (function(modules) { // webpackBootstrap\n/**' +
                                '****/ \t// The module cache\n/******/ \tvar installedM' +
                                'odules = {};\n/******/\n/******/ \t// The require func' +
                                'tion\n/******/ \tfunction __webpack_require__(moduleId' +
                                ') {\n/******/\n/******/ \t\t// Check if module is in c' +
                                'ache\n/******/ \t\tif(installedModules[moduleId])\n/**' +
                                '****/ \t\t\treturn installedModules[moduleId].exports;' +
                                '\n/******/\n/******/ \t\t// Create a new module (and p' +
                                'ut it into the cache)\n/******/ \t\tvar module = insta' +
                                'lledModules[moduleId] = {\n/******/ \t\t\texports: {},' +
                                '\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded:' +
                                ' false\n/******/ \t\t};\n/******/\n/******/ \t\t// Exe' +
                                'cute the module function\n/******/ \t\tmodules[moduleI' +
                                'd].call(module.exports, module, module.exports, __webp' +
                                'ack_require__);\n/******/\n/******/ \t\t// Flag the mo' +
                                'dule as loaded\n/******/ \t\tmodule.loaded = true;\n/*' +
                                '*****/\n/******/ \t\t// Return the exports of the modu' +
                                'le\n/******/ \t\treturn module.exports;\n/******/ \t}' +
                                '\n/******/\n/******/\n/******/ \t// expose the modules' +
                                ' object (__webpack_modules__)\n/******/ \t__webpack_re' +
                                'quire__.m = modules;\n/******/\n/******/ \t// expose t' +
                                'he module cache\n/******/ \t__webpack_require__.c = in' +
                                'stalledModules;\n/******/\n/******/ \t// on error func' +
                                'tion for async loading\n/******/ \t__webpack_require__' +
                                '.oe = function(err) { throw err; };\n/******/\n/******' +
                                '/ \t// __webpack_public_path__\n/******/ \t__webpack_r' +
                                'equire__.p = "";\n/******/ \t// Load entry module and ' +
                                'return exports\n/******/ \treturn __webpack_require__(' +
                                '__webpack_require__.s = 1);\n/******/ })\n/***********' +
                                '******************************************************' +
                                '*******/\n/******/ ([\n/* 0 */\n/***/ function(module,' +
                                ' exports) {\n\n\t/**\n\t * TypeScript Fixture\n\t */\n' +
                                '\tfunction alpha(content) {\n\t    content += "alpha";' +
                                '\n\t}\n\talpha("foo");\n\n\n/***/ },\n/* 1 */\n/***/ f' +
                                'unction(module, exports, __webpack_require__) {\n\n\tm' +
                                'odule.exports = __webpack_require__(0);\n\n\n/***/ }\n' +
                                '/******/ ]);\n//# sourceMappingURL=index.js.map'
                            );
                    }

                    if ( file.relative === "index.js.map" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .should
                            .equal(
                                '{"version":3,"sources":["../webpack/bootstrap bee422bb' +
                                'b05eb7b2567a",".././fixtures/index.ts"],"names":["alph' +
                                'a"],"mappings":";AAAA;AACA;;AAEA;AACA;;AAEA;AACA;AACA;' +
                                ';AAEA;AACA;AACA,uBAAe;AACf;AACA;AACA;;AAEA;AACA;;AAEA;' +
                                'AACA;;AAEA;AACA;AACA;;;AAGA;AACA;;AAEA;AACA;;AAEA;AACA' +
                                ',kDAA0C,WAAW;;AAErD;AACA;AACA;AACA;;;;;;;ACxCA;;IAEG;A' +
                                'AEH,gBAAgB,OAAgB;KAC5BA,OAAOA,IAAIA,OAAOA,CAACA;AACvBA' +
                                ',EAACA;AAED,MAAK,CAAC,KAAK,CAAC,CAAC","file":"index.js' +
                                '","sourcesContent":[" \\t// The module cache\\n \\tvar' +
                                ' installedModules = {};\\n\\n \\t// The require functi' +
                                'on\\n \\tfunction __webpack_require__(moduleId) {\\n\\' +
                                'n \\t\\t// Check if module is in cache\\n \\t\\tif(ins' +
                                'talledModules[moduleId])\\n \\t\\t\\treturn installedM' +
                                'odules[moduleId].exports;\\n\\n \\t\\t// Create a new ' +
                                'module (and put it into the cache)\\n \\t\\tvar module' +
                                ' = installedModules[moduleId] = {\\n \\t\\t\\texports:' +
                                ' {},\\n \\t\\t\\tid: moduleId,\\n \\t\\t\\tloaded: fal' +
                                'se\\n \\t\\t};\\n\\n \\t\\t// Execute the module funct' +
                                'ion\\n \\t\\tmodules[moduleId].call(module.exports, mo' +
                                'dule, module.exports, __webpack_require__);\\n\\n \\t' +
                                '\\t// Flag the module as loaded\\n \\t\\tmodule.loaded' +
                                ' = true;\\n\\n \\t\\t// Return the exports of the modu' +
                                'le\\n \\t\\treturn module.exports;\\n \\t}\\n\\n\\n \\' +
                                't// expose the modules object (__webpack_modules__)\\n' +
                                ' \\t__webpack_require__.m = modules;\\n\\n \\t// expos' +
                                'e the module cache\\n \\t__webpack_require__.c = insta' +
                                'lledModules;\\n\\n \\t// on error function for async l' +
                                'oading\\n \\t__webpack_require__.oe = function(err) { ' +
                                'throw err; };\\n\\n \\t// __webpack_public_path__\\n ' +
                                '\\t__webpack_require__.p = \\"\\";\\n \\t// Load entry' +
                                ' module and return exports\\n \\treturn __webpack_requ' +
                                'ire__(__webpack_require__.s = 1);\\n\\n\\n\\n/** WEBPA' +
                                'CK FOOTER **\\n ** webpack/bootstrap bee422bbb05eb7b25' +
                                '67a\\n **/","/**\\n * TypeScript Fixture\\n */\\n\\nfu' +
                                'nction alpha( content : string ) {\\n    content += \\' +
                                '"alpha\\";\\n}\\n\\nalpha(\\"foo\\");\\n\\n\\n/** WEBP' +
                                'ACK FOOTER **\\n ** ./fixtures/index.ts\\n **/"],"sour' +
                                'ceRoot":""}'
                            );
                    }

                } );

                count.should.equal( 0 );

                done();

            } ) );
    } );

} );