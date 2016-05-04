# Gulp Compile

[![npm version](https://img.shields.io/npm/v/@firma-de/gulp-compile.svg)](https://www.npmjs.com/package/@firma-de/gulp-compile)
[![build status](https://img.shields.io/circleci/project/firma-de/gulp-compile/master.svg)](https://circleci.com/gh/firma-de/gulp-compile)
[![dependencies](https://img.shields.io/david/firma-de/gulp-compile.svg)](https://david-dm.org/firma-de/gulp-compile)
[![coverage](https://img.shields.io/coveralls/firma-de/gulp-compile/master.svg)](https://coveralls.io/github/firma-de/gulp-compile)

Compiles TypeScript to JavaScript with no fatigue

## Description

Opinionated webpack + TypeScript + ReactJS configuration that we reuse
across our projects.

## Installation

```
$ npm install @firma-de/gulp-compile
```

## Usage

Basic usage of compiling your entry TypeScript file to a combined JS
bundle.

```
const compile = require("@firma-de/gulp-compile");

gulp.task("build", () => {
    gulp.src("./server.ts")
        .pipe( compile( { target : "node" } ) )
        .pipe( gulp.dest("./.build") );
});
```

In all configuration options `@firma-de/gulp-compile` will produce a 
single bundle JS files. Based on the configuration it will also produce
CSS bundle and a source map files.

It has pre-configured :

 - Loader for `.json` files ( json-loader )
 - Loader for `.tsx`, `.ts` files ( ts-loader )
 - Loader for `.scss`, `.css` files ( postcss )

## Options

### `target` - required

Target options specifies the Webpack's target.

Values :

 - `"node"` - compiles code for the server-side
 - `"web"` - compiles code for the client-side
 
### `filename`
 
Webpack's `{ output: { filename: ... } }` option. It is used to specify
the JS bundle's filename

Value : `String`

### `extensions`

By default this configuration will have Webpack's extensions option set 
like :

```
[ "", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json" ]
```

If you specify `extensions` option it will add it to the list above
 
Value : `[String]` 

### `watch`

Will trigger Webpack's `watch` option. Default is `false`

Value : `Boolean`

### `externals` ( for target `node` )

`@firma-de/gulp-compile` will add all modules from `node_modules/` 
directory to the list of the files that will not be added to the bundle.
If you want to add more files to that list, add them as an Array to 
this configuration option

Value : `[String]`

Example : `{ target: "node", externals : [ "react/dom" ] }`
 
### `excludeStats`
 
Alias for Webpack's stats options `{ excludeStats: ... }`

It will exclude from the stats the strings that are matched in this 
array.
 
Value : `[String]` 

### `sourcemaps`

Will trigger Webpack's `{ devtool : "source-map" }` plus sourcemaps for
CSS and TypeScript loaders.

Value : `Boolean`

### `minify`

Will minify the output bundles ( adds `Uglify`'s Webpack plugin ).

Value : `Boolean`

### `silent`

Will suppress all output of Webpack ( useful for the tests ).

Value : `Boolean`
 
### `library`
 
Will compile the code to an UMD library with a module name, the specified
value of this option.

This internally adds the following to the webpack's configuration :

```
{ 
  output : {
    library : ...
    libraryTarget : 'umd'
  }
}
```

Value : `String`

### `plugins`

Will load the plugins in the Webpack's configuration.

`@firma-de/gulp-compile` has these plugins activated for `web` mode :

```
new webpack.PrefetchPlugin( "react" ),
new ExtractText( outputStyles, { allChunks : true } )
```

And optionally adds `Uglify` when `minify` option is set to `true`
 
Value : `[WebpackPlugins]`
 
### `outputStyles` ( for target `web` )
 
Will change the name of the final CSS bundle. By default this value is
set to `styles.css`
 
Value : `String`

### `loaders`

Will attach additional loaders to Webpack.

By default `@firma-de/gulp-compile` has the following loaders configured :

```
[
  { test : /\.tsx?$/, loader : "ts" },
  { test : /\.json$/, loader : "json" }
]  
```

For target `node` it appends one more :

```
[
  { test : /\.s?css$/, loader : "css-loader/locals?..." }  
]
```

and respectively for target `web` the same `css-loader`, but with 
different settings :

```
[
  { 
    test : /\.s?css$/, 
    loader : ExtractText.extract( "style-loader", "css-loader?..." )  
  }
]
```                

## Access raw webpack

You can access the raw webpack from the exports of this module. It is handy if you want to
add additional plugins

```
const compile = require("@firma-de/gulp-compile");

gulp.task("build", () => {
    gulp.src("./server.ts")
        .pipe( compile( {
             target : "node",
             plugins: [ new compile.webpack.DefinePlugin({ '__DEV__' : true } ) ],
        } ) )
        .pipe( gulp.dest("./.build") );
});
```

## Changelog

- 0.0.3 - Fixed a bug for web and additional plugins & exposing webpack from compile
- 0.0.2 - Added support for TypeScript 1.8
- 0.0.1 - Initial release

## License

MIT