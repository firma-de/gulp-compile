"use strict";

var gulp    = require( "gulp" ),
    should  = require( "should" ),
    through = require( "through2" ),
    gutil   = require( "gulp-util" ),
    webpack = require( "webpack" ),
    compile = require( "./index.js" ),
    fs      = require( "fs" );

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

    it( "should export webpack too", function() {
        compile.webpack.should.eql(webpack);
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

    it( "should be able to add additional plugins", function( done ) {
        this.slow( 5000 );
        this.timeout( 5000 );
        gulp
            .src( "./fixtures/plugin.ts" )
            .pipe( compile( {
                target : "node",
                plugins: [
                    new compile.webpack
                        .DefinePlugin({ '__PLUGIN__' : JSON.stringify("yes") } )
                ],
                silent : true
            } ).on( "error", ( error ) => console.log( error ) ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "plugin.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-plugin.js", "utf-8"
                        )
                    );
                callback( null, file );
            }, () => done() ) );

    } );

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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-typescript.js", "utf-8"
                        )
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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-json.js", "utf-8"
                        )
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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-typescript-not-minified.js",
                            "utf-8"
                        )
                    );
                callback( null, file );
            }, () => done() ) );
    } );

    it( "should compile properly included css", function( done ) {
        this.timeout( 10000 );
        this.slow( 10000 );
        gulp
            .src( "./fixtures/css.ts" )
            .pipe( compile( { target : "node", silent: true } ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "css.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-css.js",
                            "utf-8"
                        )
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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-tsx.js", "utf-8"
                        )
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
                                fs.readFileSync(
                                    "./fixtures/compiled/node-proper-source-map.js",
                                    "utf-8"
                                )
                            );
                    }

                    if ( file.relative === "index.js.map" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .replace(/bootstrap\s[a-z0-9]+/, "")
                            .should
                            .equal(
                                fs.readFileSync(
                                    "./fixtures/compiled/node-proper-source-map.js.map",
                                    "utf-8"
                                )
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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-external-modules.js", "utf-8"
                        )
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
                        fs.readFileSync(
                            "./fixtures/compiled/node-proper-library.js", "utf-8"
                        )
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

    it( "should be able to add additional plugins", function( done ) {
        this.slow( 5000 );
        this.timeout( 5000 );
        gulp
            .src( "./fixtures/plugin.ts" )
            .pipe( compile( {
                target : "web",
                plugins: [
                    new compile.webpack
                        .DefinePlugin({ '__PLUGIN__' : JSON.stringify("yes") } )
                ],
                silent : true
            } ).on( "error", ( error ) => console.log( error ) ) )
            .pipe( through.obj( function( file, enc, callback ) {
                file.relative.should.equal( "plugin.js" );
                file.contents.toString( "utf8" )
                    .should
                    .equal(
                        fs.readFileSync(
                            "./fixtures/compiled/web-proper-plugin.js", "utf-8"
                        )
                    );
                callback( null, file );
            }, () => done() ) );

    } );

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
                        fs.readFileSync(
                            "./fixtures/compiled/web-proper-typescript.js", "utf-8"
                        )
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
                        fs.readFileSync(
                            "./fixtures/compiled/web-proper-typescript-not-minified.js",
                            "utf-8"
                        )
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
                                    fs.readFileSync(
                                        "./fixtures/compiled/web-proper-css.js", "utf-8"
                                    )
                                );
                        }

                        if ( file.relative === "styles.css" ) {
                            count--;
                            file.contents.toString( "utf8" )
                                .should
                                .equal( "._1ctjD{color:red}" );
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
                        fs.readFileSync(
                            "./fixtures/compiled/web-proper-tsx.js", "utf-8"
                        )
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
                                fs.readFileSync(
                                    "./fixtures/compiled/web-proper-source-map.js",
                                    "utf-8"
                                )
                            );
                    }

                    if ( file.relative === "index.js.map" ) {
                        count--;
                        file.contents.toString( "utf8" )
                            .replace(/bootstrap\s[a-z0-9]+/, "")
                            .should
                            .equal(
                                fs.readFileSync(
                                    "./fixtures/compiled/web-proper-source-map.js.map",
                                    "utf-8"
                                )
                            );
                    }

                } );

                count.should.equal( 0 );

                done();

            } ) );
    } );

} );