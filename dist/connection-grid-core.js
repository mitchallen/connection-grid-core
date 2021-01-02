(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.MitchAllen || (g.MitchAllen = {})).ConnectionGridCore = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
(function (global){(function (){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.MitchAllen || (g.MitchAllen = {})).Shuffle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
    Module: @mitchallen/shuffle
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

module.exports.create = function (spec) {
    if (!spec) {
        return null;
    }
    if (!spec.array) {
        return null;
    }
    var _array = spec.array.slice(0);
    return {
        shuffle: function shuffle() {
            var i = 0,
                j = 0,
                temp = null;
            for (i = _array.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1));
                temp = _array[i];
                _array[i] = _array[j];
                _array[j] = temp;
            }
            return _array;
        }
    };
};

},{}]},{},[1])(1)
});
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
/**
    Module: @mitchallen/connection-grid-core/src/index.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var shuffleFactory = _dereq_("@mitchallen/shuffle");

/**
 * Grid Core
 * @external @mitchallen/grid-core
 * @see {@link https://www.npmjs.com/package/@mitchallen/grid-core|@mitchallen/grid-core}
 */

/**
 * Connection Grid Core generated by {@link module:connection-grid-core-factory|create}
 * @module connection-grid-core
 * @extends external:@mitchallen/grid-core
 */

/**
 * 
 * A factory for generating connection grid core objects
 * @module connection-grid-core-factory
 */

/** 
* Factory method that returns a connection grid core object.
* It takes one spec parameter that must be an object with named parameters.
* @param {Object} options Named parameters for generating a connection grid core
* @param {grid} options.grid Grid based on {@link external:@mitchallen/grid-core|@mitchallen/grid-core}
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
module.exports.create = function (spec) {

  spec = spec || {};
  var _grid = spec.grid;
  var _DIR_MAP = spec.dirMap || {};
  var _OPPOSITE = spec.oppositeMap || {};

  if (!_grid) {
    return null;
  }

  // bit masks
  var VISITED = 0x01;
  var MASKED = 0x02;

  Object.defineProperties(_grid, {
    "dirMap": {
      writeable: false,
      value: _DIR_MAP,
      enumerable: true,
      configurable: true
    }
  });

  return Object.assign(_grid, {

    /** Returns true if string is found in DIR_MAP array.
      * @param {string} dir A string representing a direction
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @returns {boolean}
      * @example <caption>usage</caption>
      * if(core.isDir("N")) ...
     */
    isDir: function isDir(dir) {
      if (typeof dir === 'string') {
        return _DIR_MAP[dir] !== undefined;
      }
      return false;
    },
    /** Returns opposite direction based on OPPOSITE array.
      * @param {string} dir A string representing a direction
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @returns {string}
      * @example <caption>usage</caption>
      * core.getOppositeDir("N").should.eql("S");
     */
    getOppositeDir: function getOppositeDir(dir) {
      if (!this.isDir(dir)) {
        return null;
      }
      return _OPPOSITE[dir];
    },
    /** Returns the neighbor in a particular direction for a cell at x,y.
      * <b>This should be overriden by derived class</b>
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
    getNeighbor: function getNeighbor(x, y, dir) {
      // derived should override
      console.log("getNeighbor should be overriden by derived class");
      return null;
    },
    /** Returns the neighbor directions for a cell at x,y.
      * <b>This should be overriden by derived class</b>.
      * Classic square grids ignore x and y, but other derived classes, like hexagon, may not.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * var neighbors = core.getNeighborDirs(1,2);
     */
    getNeighborDirs: function getNeighborDirs(x, y) {
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
    getShuffledNeighborDirs: function getShuffledNeighborDirs(x, y) {
      var shuffler = shuffleFactory.create({ array: this.getNeighborDirs(x, y) });
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
    markVisited: function markVisited(x, y) {
      return this.set(x, y, this.get(x, y) | VISITED);
    },
    /** Clears visit flag from cell
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.clearVisited(1,2);
     */
    clearVisited: function clearVisited(x, y) {
      return this.set(x, y, this.get(x, y) & ~VISITED);
    },
    /** Clear all visited flag from grid
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.clearAllVisited();
     */
    clearAllVisited: function clearAllVisited() {
      // return this.set(x, y, this.get(x, y) & ~VISITED);
      for (var row = 0; row < this.rows; row++) {
        var rs = this.rowSize(row);
        for (var pos = 0; pos < rs; pos++) {
          this.clearVisited(row, pos);
        }
      }
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
    visited: function visited(x, y) {
      if (!this.isCell(x, y)) {
        return false;
      }
      return (this.get(x, y) & VISITED) !== 0;
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
    mask: function mask(x, y) {
      return this.set(x, y, this.get(x, y) | MASKED);
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
    isMasked: function isMasked(x, y) {
      if (!this.isCell(x, y)) {
        return false;
      }
      return (this.get(x, y) & MASKED) !== 0;
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
    hasConnections: function hasConnections(x, y) {
      var cell = this.get(x, y);
      if (cell === null) {
        return false;
      }
      cell = cell & ~VISITED; // discount visited flag
      if (cell === 0) {
        return false;
      }
      var list = this.getNeighborDirs(x, y);
      for (var key in list) {
        var sDir = list[key];
        if (!this.isDir(sDir)) {
          console.error("hasConnections unknown direction: ", sDir);
          return false;
        }
        var iDir = _DIR_MAP[sDir];
        if ((cell & iDir) !== 0) {
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
    open: function open(x, y, dir) {
      // dir must be string
      if (!this.isDir(dir)) {
        return false;
      }
      return this.set(x, y, this.get(x, y) | _DIR_MAP[dir]);
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
    connect: function connect(x, y, dir) {
      // dir must be string
      // Connect cell to neighbor (one way)}
      if (!this.getNeighbor(x, y, dir)) return false;
      return this.open(x, y, dir);
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
    connectUndirected: function connectUndirected(x, y, sDir) {
      // dir must be a string
      if (!this.connect(x, y, sDir)) {
        return false;
      }
      var n = this.getNeighbor(x, y, sDir);
      if (!this.connect(n.x, n.y, _OPPOSITE[sDir])) {
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
    connects: function connects(x, y, sDir) {
      if (!this.isDir(sDir)) {
        console.error("connects unknown direction: ", sDir);
        return false;
      }
      var cell = this.get(x, y);
      if (cell === null) {
        return false;
      }
      var iDir = _DIR_MAP[sDir];
      return (cell & iDir) !== 0;
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
    connectsAny: function connectsAny(x, y, list) {
      var _this = this;

      var connects = false;
      list.forEach(function (el) {
        if (_this.connects(x, y, el)) {
          connects = true;
        }
      });
      return connects;
    },
    /** Returns cell that is max distance from x,y.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {MaxDistance}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * let d = core.getMaxDistance(1,2)
      * console.log( "DISTANCE: " + d.x + ", " + d.y + " = " + d.distance );
     */
    getMaxDistance: function getMaxDistance(x, y) {
      this.clearAllVisited();
      // create new internal distance trackker
      this.maxDistance = {
        x: 0,
        y: 0,
        distance: 0
      };
      this.getDistance(x, y, 0);
      this.clearAllVisited(); // Reset for next routine to use
      // maxDistance.PrintMaxDistance();
      return this.maxDistance;
    },

    /** Internal recursive function that update internal maxDistance 
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {MaxDistance}
      * @memberof module:connection-grid-core
     */
    getDistance: function getDistance(x, y, distance) {
      // console.log( `DISTANCE:  ${x}, ${y} = ${distance}`);
      if (this.visited(x, y)) {
        // console.log(`RETURN - VISITED: ${x}, ${y}`);
        return;
      }
      // console.log(`markVisited: ${x},${y}`);
      this.markVisited(x, y);
      if (this.maxDistance.distance < distance) {
        this.maxDistance.x = x;
        this.maxDistance.y = y;
        this.maxDistance.distance = distance;
        // console.log(`UPDATING MAX DISTANCE: ${this.maxDistance.distance}`)
      }
      // console.log(this.maxDistance);
      if (!this.hasConnections(x, y)) return;
      var cell = this.get(x, y);
      var list = this.getNeighborDirs(x, y);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sDir = _step.value;

          // console.log(`SCANNING: ${sDir}`);
          if (!this.isDir(sDir)) {
            console.error("getDistance unknown direction: ", sDir);
            return;
          }
          var iDir = _DIR_MAP[sDir];
          if ((cell & iDir) != 0) {
            // console.log(`# CONNECTS NEIGHBOR: ${sDir} `);
            var neighbor = this.getNeighbor(x, y, sDir);
            if (neighbor.x == -1) return;
            this.getDistance(neighbor.x, neighbor.y, /* ++distance */distance + 1);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },

    /** Returns number of connections for cell
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {number}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * let count = core.connectionCount(1,2)
      */
    connectionCount: function connectionCount(x, y) {
      if (!this.hasConnections(x, y)) return;
      var cell = this.get(x, y);
      var list = this.getNeighborDirs(x, y);
      var connections = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var sDir = _step2.value;

          // console.log(`DEBUG: connectionCount - scanning: ${sDir}`)
          if (!this.isDir(sDir)) {
            console.error("connectionCount unknown direction: ", sDir);
            return 0;
          }
          var iDir = _DIR_MAP[sDir];
          if ((cell & iDir) != 0) {
            connections++;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return connections;
    },

    /** Returns true or false if cell is a dead end (only one connection)
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * let flag = core.isDeadEnd(1,2)
      */
    isDeadEnd: function isDeadEnd(x, y) {
      return this.connectionCount(x, y) == 1;
    }
  });
};

},{"@mitchallen/shuffle":1}]},{},[2])(2)
});
