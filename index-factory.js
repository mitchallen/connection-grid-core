/**
    Module: @mitchallen/connection-grid-core
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports.create = (spec) => {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/connection-grid-core";
    return {
        // public 
        package: () => _package,
        health: () => "OK"
    };
};
