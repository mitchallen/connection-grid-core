/**
    Module: @mitchallen/connection-grid-core/modules/index.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var shuffleFactory = require("@mitchallen/shuffle");

module.exports.create = (spec) => {

    spec = spec || {};
    var _grid = spec.grid;
    var _DIR_MAP = spec.dirMap || {};
    var _OPPOSITE = spec.oppositeMap || {};

    if(!_grid) {
        return null;
    }

    // bit masks
    let VISITED = 0x01;
    let MASKED  = 0x02;

    Object.defineProperties( _grid, {
        "dirMap": {
            writeable: false,
            value: _DIR_MAP,
            enumerable: true,
            configurable: true
        },
    });

    return Object.assign( _grid, {

        isDir: function(dir) {
            if(typeof dir === 'string') {
                return(_DIR_MAP[dir]!==undefined);
            }
            return false;
        },
        getOppositeDir: function(dir) {
            if(!this.isDir(dir)) { return null; }
            return _OPPOSITE[dir];
        },
        getNeighbor: function(x, y, dir) {
            // derived should override
            console.log("getNeighbor should be overriden by derived class");
            return null;
        },
        getNeighborDirs: function(x, y) {
            // derived should override
            // Classic ignores x and y, but other derived classes may not
            console.log("getNeighborDirs should be overriden by derived class");
            return [];
        },
        getShuffledNeighborDirs: function( x, y ) {
            var shuffler = shuffleFactory.create( { array: this.getNeighborDirs(x,y) } );
            return shuffler.shuffle();
        },
        markVisited: function( x, y )  {
            return this.set( x,y, this.get(x,y) | VISITED );
        },
        visited: function(x, y) {
            if(!this.isCell(x, y)) { return false; }
            return ( ( this.get(x,y) & VISITED ) !== 0 );
        },
        mask: function( x, y )  {
            return this.set( x,y, this.get(x,y) | MASKED );
        },
        isMasked: function( x, y )  {
            if(!this.isCell(x, y)) { return false; }
            return ( ( this.get(x,y) & MASKED ) !== 0 );
        },
        hasConnections: function(x, y) {
            // Need to discount visited flag, etc
            let cell = this.get(x,y);
            if(cell===null) { return false; }
            if(cell===0) { return false;}
            let list = this.getNeighborDirs(x, y);
            for(var key in list) {
                let sDir = list[key];
                if(!this.isDir(sDir)) {
                    console.error("hasConnections unknown direction: ", sDir);
                    return false;
                }
                var iDir = _DIR_MAP[sDir];
                if((cell & iDir) !== 0) {
                    return true;
                }
            }
            return false;
        },
        connect: function( x, y, dir ) {
            // dir must be string
            // Connect cell to neighbor (one way)}
            if(!this.getNeighbor(x,y,dir)) return false;
            return this.set(x, y, this.get(x,y) | _DIR_MAP[dir]);
        },
        connectUndirected: function(x, y, sDir) {
            // dir must be a string
            if(!this.connect(x, y, sDir)) { 
                return false; 
            }
            var n = this.getNeighbor(x, y, sDir);
            if(!this.connect( n.x, n.y, _OPPOSITE[sDir])) {
                return false;
            }
            return true;
        },
        connects: function(x,y,sDir) {
            if(!this.isDir(sDir)) {
                console.error("connects unknown direction: ", sDir);
                return false;
            }
            let cell = this.get(x,y);
            if(cell===null) { return false; }
            var iDir = _DIR_MAP[sDir];
            return((cell & iDir) !== 0);
        },
        connectsAny: function(x,y,list) {
            var connects = false;
            list.forEach( el => {
                if(this.connects( x, y, el )) {
                    connects = true;
                }
            });
            return connects;
        },
    });
};