/**
    Module: @mitchallen/connection-grid-core/modules/index.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var shuffleFactory = require("@mitchallen/shuffle");

/**
 * Connection Grid Core
 * @module connection-grid-core
 * @augments {@link https://www.npmjs.com/package/@mitchallen/grid-core @mitchallen/grid-core}
 */

/**
 * 
 * A module for generating grid cores
 * @module connection-grid-core-factory
 */

 /** 
 * Factory method that returns a connection grid core object.
 * It takes one spec parameter that must be an object with named parameters.
 * @param {Object} options Named parameters for generating a connection grid core
 * @param {grid} options.grid Grid based on @mitchallen/grid-core
 * @param {dirMap} options.dirMap Direction map containing bit map flags for directions
 * @param {oppositeMap} options.oppositeMap Opposite direction map
 * @returns {module:connection-grid-core}
 * @example <caption>Creating a connection-grid-core</caption>
 * "use strict";
 * var gridFactory = require("@mitchallen/connection-grid-core"),
 *     gridSquare = require('@mitchallen/grid-square')
 * var sourceGrid = gridSquare.create({ x: 5, y: 6 });
 * var _dirMap = { 
 *     "N": 0x010, 
 *     "S": 0x020, 
 *     "E": 0x040, 
 *     "W": 0x080 };
 * let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };
 * var cg = gridFactory.create({  
 *     grid: sourceGrid,     
 *     dirMap: _dirMap,
 *     oppositeMap: _oppositeMap 
 * });
 */
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

        /** Returns true if string is found in _DIR_MAP array.
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @returns {boolean}
          * @example <caption>usage</caption>
          * if(core.isDir("N")) ...
         */
        isDir: function(dir) {
            if(typeof dir === 'string') {
                return(_DIR_MAP[dir]!==undefined);
            }
            return false;
        },
        /** Returns opposite direction based on _OPPOSITE array.
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @returns {string}
          * @example <caption>usage</caption>
          * core.getOppositeDir("N").should.eql("S");
         */
        getOppositeDir: function(dir) {
            if(!this.isDir(dir)) { return null; }
            return _OPPOSITE[dir];
        },
        /** Returns the neighbor in a particular direction for a cell at x,y.
          * <b>This should be overriden by base class</b>
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @returns {string}
          * @example <caption>usage</caption>
          * var neighbor = core.getNeighbor(1,2,"N");
         */
        getNeighbor: function(x, y, dir) {
            // derived should override
            console.log("getNeighbor should be overriden by derived class");
            return null;
        },
        /** Returns the neighbor directions for a cell at x,y.
          * <b>This should be overriden by base class</b>.
          * Classic square grids ignore x and y, but other derived classes, like hexagon, may not.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * var neighbors = core.getNeighborDirs(1,2);
         */
        getNeighborDirs: function(x, y) {
            // derived should override
            // Classic ignores x and y, but other derived classes may not
            console.log("getNeighborDirs should be overriden by derived class");
            return [];
        },
        /** Returns a shuffled list of neighbors for a cell at x,y.
          * Useful for generating random mazes.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * var neighbors = core.getShuffledNeighborDirs(1,2);
         */
        getShuffledNeighborDirs: function( x, y ) {
            var shuffler = shuffleFactory.create( { array: this.getNeighborDirs(x,y) } );
            return shuffler.shuffle();
        },
        /** Marks a cell at x,y as visited.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * core.markVisited(1,2);
         */
        markVisited: function( x, y )  {
            return this.set( x,y, this.get(x,y) | VISITED );
        },
        /** Returns true if a cell at x,y exists and it has been marked as visited.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.visited(x)) ...
         */
        visited: function(x, y) {
            if(!this.isCell(x, y)) { return false; }
            return ( ( this.get(x,y) & VISITED ) !== 0 );
        },
        /** Marks a cell at x,y as masked.
          * Useful for maze generators to mark cells to skip
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * core.mask(1,2)
         */
        mask: function( x, y )  {
            return this.set( x,y, this.get(x,y) | MASKED );
        },
        /** Returns true if a cell at x,y has been marked using [mask]{@link module:connection-grid-core#mask}.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.isMasked(1,2)) ...
         */
        isMasked: function( x, y )  {
            if(!this.isCell(x, y)) { return false; }
            return ( ( this.get(x,y) & MASKED ) !== 0 );
        },
        /** Returns true if a cell at x,y has connections.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.hasConnections(1,2)) ...
         */
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
        /** Maps a connection for a cell at x,y in a particular direction.
          * Unlike [connect]{@link module:connection-grid-core#connect} a cell in the direction does not have to exist.
          * Useful for mazes that need to open up border walls.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * core.open(0,0,"N");
         */
        open: function( x, y, dir ) {
            // dir must be string
            if(!this.isDir(dir)) {
                return false;
            }
            return this.set(x, y, this.get(x,y) | _DIR_MAP[dir]);
        },
        /** Maps a connection for a cell at x,y in a particular direction.
          * Returns false if the cell in the target direction does not exist.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.connect(1,2,"N")) ...
         */
        connect: function( x, y, dir ) {
            // dir must be string
            // Connect cell to neighbor (one way)}
            if(!this.getNeighbor(x,y,dir)) return false;
            return this.open(x,y,dir);
        },
        /** Maps a connection for a cell at x,y in a particular direction.
          * Also maps a connection from the target cell back to the source cell.
          * Returns false if the cell in the target direction does not exist.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {string} dir A string representing a direction
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.connectUndirected(1,2,"N")) ...
         */
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
        /** Returns true if a cell connects to a neighbor cell in a particular direction.
          * It does not matter if a the target cell exists such as when [open]{@link module:connection-grid-core#open} maps a connection to a non-existant cell.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {string} dir A string representing a direction
          * @returns {boolean}
          * @function
          * @instance
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.connects(1,2,"N")) ...
         */
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
        /** Returns true if a cell connects to a neighbor cell in any direction in the list.
          * @param {number} x The x coordinate
          * @param {number} y The y coordinate
          * @param {array} list An array of strings that each represent a direction
          * @function
          * @instance
          * @returns {boolean}
          * @memberof module:connection-grid-core
          * @example <caption>usage</caption>
          * if(core.connectsAny(1,2,["N","W"]) ...
         */
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