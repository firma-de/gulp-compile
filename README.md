# Gulp Compile

[![npm version](https://img.shields.io/npm/v/@firma-de/gulp-compile.svg)](https://www.npmjs.com/package/@firma-de/gulp-compile)
[![build status](https://img.shields.io/circleci/project/firma-de/gulp-compile/master.svg)](https://circleci.com/gh/firma-de/gulp-compile)
[![dependencies](https://img.shields.io/david/firma-de/gulp-compile.svg)](https://david-dm.org/firma-de/gulp-compile)

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

## License

MIT