/// <reference path="./plugin.d.ts" />

/**
 * TypeScript Fixture
 */

function alpha( content : string ) {
    content += "alpha";
}

const t = __PLUGIN__;

if ( t ) {
    alpha("foo");    
}