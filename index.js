"use strict";

var path          = require( "path" ),
    fs            = require( "fs" ),
    gutil         = require( "gulp-util" ),
    named         = require( "vinyl-named" ),
    webpackStream = require( "webpack-stream" ),
    webpack       = require( "webpack" ),
    _             = require( "lodash" ),
    ExtractText   = require( "extract-text-webpack-plugin" ),
    combine       = require( "stream-combiner" );

module.exports = function( options ) {

    /** Creates a Plugin Error */
    function pluginError( message ) {
        return new gutil.PluginError( "@firma-de/gulp-compile", message )
    }

    /** Options sanity check */
    if ( !options ) { throw pluginError( "`target` is required options" ); }

    ["target"]
        .filter( option => !options[option] )
        .forEach( option => { throw pluginError( "`" + option + "` is missing" ) } );

    /** We need the following options provided */
    const target       = options["target"],
          filename     = options["filename"],
          extensions   = options["extensions"] || [],
          watch        = options["watch"],
          externals    = options["externals"] || [],
          excludeStats = options["excludeStats"] || [],
          sourcemaps   = options["sourcemaps"],
          minify       = options["minify"],
          silent       = options["silent"],
          library      = options["library"],
          plugins      = options["plugins"] || [],
          outputStyles = options["outputStyles"] || "styles.css",
          loaders      = options["loaders"] || [];

    /** Webpack configuration */
    const configuration = {
        target : target,
        output : { filename : filename },
        resolve : {
            extensions : [
                "", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"
            ].concat( extensions )
        },
        module : {
            loaders : [
                { test : /\.tsx?$/, loader : "ts" },
                { test : /\.json$/, loader : "json" }
            ].concat( loaders )
        },
        ts : {
            silent : silent === undefined ? true : silent,
            compilerOptions : { jsx : "react" }
        },
        watch : watch,
        plugins : plugins
    };

    /** Default configuration for printing */
    const statsConfiguration = {};

    /** CSS Options for css loader */
    const cssLoaderOptions =
              "sourceMap&modules&localIdentName=[hash:base64:5]&importLoaders=1!postcss-loader";

    /** Prepare Node Target */
    if ( target === "node" ) {

        configuration.module.loaders.push( {
            test : /\.s?css$/,
            loader : "css-loader/locals?" + cssLoaderOptions
        } );

        configuration.externals = _( externals )
                                      .map( module => [module, "commonjs " + module] )
                                      .fromPairs()
                                      .value() || {};

        configuration.postcss = [require( "precss" )];

        _.assign(
            configuration.externals,
            {},
            _( fs.readdirSync( "node_modules" ) )
                .filter( module => [".bin"].indexOf( module ) === -1 )
                .map( module => [module, "commonjs " + module] )
                .fromPairs()
                .value()
        );

    }

    /** Prepare Web Target */
    if ( target === "web" ) {

        configuration.module.loaders.push( {
            test : /\.s?css$/,
            loader : ExtractText.extract(
                "style-loader", "css-loader?" + cssLoaderOptions
            )
        } );

        configuration.postcss = [
            require( "autoprefixer" ),
            require( "precss" )
        ];

        configuration.plugins = [
            new webpack.PrefetchPlugin( "react" ),
            new ExtractText( outputStyles, { allChunks : true } )
        ];

        statsConfiguration.exclude = excludeStats;

    }

    /** Sets output if we want a library */
    if ( library !== undefined ) {
        configuration.output.library       = library;
        configuration.output.libraryTarget = 'umd';
    }

    if ( ( sourcemaps === undefined ? watch : sourcemaps ) ) {
        configuration.devtool                              = 'source-map';
        configuration.ts.compilerOptions.sourceMap         = true;
        configuration.output.devtoolModuleFilenameTemplate = "../[resource-path]";
    }

    if ( ( minify == undefined ? !watch : minify ) ) {
        configuration.plugins.push( new webpack.optimize.UglifyJsPlugin() );
    }

    /** WebPack compiler */
    function compile() {

        /** The actual stream */
        return webpackStream( configuration, webpack, function( err, stats ) {
            if ( err ) {
                throw pluginError( err.message || "Webpack error" );
            }
            if ( silent !== true ) {
                gutil.log(
                    "[@firma-de/gulp-compile]",
                    stats.toString( statsConfiguration )
                )
            }
        } )

    }

    /** Return a stream */
    return combine(
        named(),
        compile()
    );

};