/**
    Module: @mitchallen/connection-grid-core
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

var parentFactory = require("@mitchallen/factory-base");

module.exports.create = function (spec) {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/connection-grid-core";
    var _parent = parentFactory.create(spec);
    if(!_parent) {
        return null;
    }
    return Object.assign( _parent, {
        // public 
        package: function() {
            return _package;
        },
        health: function() {
            return "OK";
        }
    });
};
