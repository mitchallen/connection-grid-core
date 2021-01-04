/**
    Module: @mitchallen/connection-grid-core/src/index.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var shuffleFactory = require("@mitchallen/shuffle");

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
module.exports.create = (spec) => {

  spec = spec || {};
  var _grid = spec.grid;
  var _DIR_MAP = spec.dirMap || {};
  var _OPPOSITE = spec.oppositeMap || {};

  if (!_grid) {
    return null;
  }

  // bit masks
  let VISITED = 0x01;
  let MASKED = 0x02;

  Object.defineProperties(_grid, {
    "dirMap": {
      writeable: false,
      value: _DIR_MAP,
      enumerable: true,
      configurable: true
    },
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
    isDir: function (dir) {
      if (typeof dir === 'string') {
        return (_DIR_MAP[dir] !== undefined);
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
    getOppositeDir: function (dir) {
      if (!this.isDir(dir)) { return null; }
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
    getNeighbor: function (x, y, dir) {
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
    getNeighborDirs: function (x, y) {
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
    getShuffledNeighborDirs: function (x, y) {
      var shuffler = shuffleFactory.create({ array: this.getNeighborDirs(x, y) });
      return shuffler.shuffle();
    },

    /** Sets a flag in a cell at x,y
        * @param {number} x The x coordinate
        * @param {number} y The y coordinate
        * @function
        * @instance
        * @returns {boolean}
        * @memberof module:connection-grid-core
        * @example <caption>usage</caption>
        * core.setFlag(1,2,VISITED);
       */
    setFlag: function (x, y, flag) {
      if (!this.isCell(x, y)) { return false; }
      return this.set(x, y, this.get(x, y) | flag);
    },

   /** Clears a flag from cell
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.clearFlag(1,2,flag);
     */
    clearFlag: function (x, y, flag) {
      if (!this.isCell(x, y)) { return false; }
      return this.set(x, y, this.get(x, y) & ~flag);
    },

      /** Returns true if a cell at x,y exists and flag has been set.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * if(core.isFlagSet(x,y,VISITED)) ...
     */
    isFlagSet: function (x, y, flag) {
      if (!this.isCell(x, y)) { return false; }
      return ((this.get(x, y) & flag) !== 0);
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
    markVisited: function (x, y) {
      // return this.set(x, y, this.get(x, y) | VISITED);
      return this.setFlag(x,y,VISITED);
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
    clearVisited: function (x, y) {
      // return this.set(x, y, this.get(x, y) & ~VISITED);
      return this.clearFlag(x,y,VISITED);
    },
    /** Clear all visited flag from grid
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.clearAllVisited();
     */
    clearAllVisited: function () {
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
    visited: function (x, y) {
      if (!this.isCell(x, y)) { return false; }
      // return ((this.get(x, y) & VISITED) !== 0);
      return this.isFlagSet(x,y,VISITED);
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
    mask: function (x, y) {
      // return this.set(x, y, this.get(x, y) | MASKED);
      return this.setFlag(x,y,MASKED);
    },
    /** Clear the mask flag from cell at x,y.
      * Useful for maze generators to mark and clear cells to skip
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.clearMask(1,2)
     */
    clearMask: function (x, y) {
      // return this.set(x, y, this.get(x, y) & ~MASKED);
      return this.clearFlag(x,y,MASKED);
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
    isMasked: function (x, y) {
      if (!this.isCell(x, y)) { return false; }
      // return ((this.get(x, y) & MASKED) !== 0);
      return this.isFlagSet(x,y,MASKED);
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
    hasConnections: function (x, y) {
      let cell = this.get(x, y);
      if (cell === null) { return false; }
      // TODO - also discount MASKED and any other flags
      cell = cell & ~VISITED; // discount visited flag
      if (cell === 0) { return false; }
      let list = this.getNeighborDirs(x, y);
      for (var key in list) {
        let sDir = list[key];
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
    open: function (x, y, dir) {
      // dir must be string
      if (!this.isDir(dir)) {
        return false;
      }
      // return this.set(x, y, this.get(x, y) | _DIR_MAP[dir]);
      return this.setFlag(x,y, _DIR_MAP[dir]);
    },

    /** Removes a connection for a cell at x,y in a particular direction.
      * Unlike [connect]{@link module:connection-grid-core#connect} a cell in the direction does not have to exist.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @param {string} dir A string representing a direction
      * @function
      * @instance
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * core.close(0,0,"N");
     */
    close: function (x, y, dir) {
      // dir must be string
      if (!this.isDir(dir)) {
        return false;
      }
      // return this.set(x, y, this.get(x, y) & ~_DIR_MAP[dir]);
      return this.clearFlag(x,y,_DIR_MAP[dir]);
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
    connect: function (x, y, dir) {
      // dir must be string
      // Connect cell to neighbor (one way)}
      if (!this.getNeighbor(x, y, dir)) return false;
      return this.open(x, y, dir);
    },
    /** Removes connection for a cell at x,y in a particular direction.
      * Returns false if the cell in the target direction does not exist.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @param {string} dir A string representing a direction
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * if(core.disconnect(1,2,"N")) ...
     */
    disconnect: function (x, y, dir) {
      // dir must be string
      // Disconnect cell from neighbor (one way)}
      if (!this.getNeighbor(x, y, dir)) return false;
      return this.close(x, y, dir);
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
    connectUndirected: function (x, y, sDir) {
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

    /** Removes a connection for a cell at x,y in a particular direction.
      * Also removes a connection from the target cell back from the source cell.
      * Returns false if the cell in the target direction does not exist.
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @param {string} dir A string representing a direction
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * if(core.disconnectUndirected(1,2,"N")) ...
     */
    disconnectUndirected: function (x, y, sDir) {
      // dir must be a string
      if (!this.disconnect(x, y, sDir)) {
        return false;
      }
      var n = this.getNeighbor(x, y, sDir);
      if (!this.disconnect(n.x, n.y, _OPPOSITE[sDir])) {
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
    connects: function (x, y, sDir) {
      if (!this.isDir(sDir)) {
        console.error("connects unknown direction: ", sDir);
        return false;
      }
      let cell = this.get(x, y);
      if (cell === null) { return false; }
      var iDir = _DIR_MAP[sDir];
      return ((cell & iDir) !== 0);
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
    connectsAny: function (x, y, list) {
      var connects = false;
      list.forEach(el => {
        if (this.connects(x, y, el)) {
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
    getMaxDistance(x, y) {
      this.clearAllVisited();
      // create new internal distance trackker
      this.maxDistance = {
        x: 0,
        y: 0,
        distance: 0,
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
    getDistance(x, y, distance) {
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
      let cell = this.get(x, y);
      let list = this.getNeighborDirs(x, y);
      for (let sDir of list) {
        // console.log(`SCANNING: ${sDir}`);
        if (!this.isDir(sDir)) {
          console.error("getDistance unknown direction: ", sDir);
          return;
        }
        let iDir = _DIR_MAP[sDir];
        if ((cell & iDir) != 0) {
          // console.log(`# CONNECTS NEIGHBOR: ${sDir} `);
          let neighbor = this.getNeighbor(x, y, sDir);
          if (neighbor.x == -1) return;
          this.getDistance(neighbor.x, neighbor.y, /* ++distance */ distance + 1);
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
    connectionCount(x, y) {
      if (!this.hasConnections(x, y)) return;
      let cell = this.get(x, y);
      let list = this.getNeighborDirs(x, y);
      let connections = 0;
      for (let sDir of list) {
        // console.log(`DEBUG: connectionCount - scanning: ${sDir}`)
        if (!this.isDir(sDir)) {
          console.error("connectionCount unknown direction: ", sDir);
          return 0;
        }
        let iDir = _DIR_MAP[sDir];
        if ((cell & iDir) != 0) {
          connections++;
        }
      }
      return connections;
    },
    /** Returns true or false if cell is a dead end / leaf node (only one connection)
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * let flag = core.isLeaf(1,2);
      */
    isLeaf(x, y) {
      return this.connectionCount(x, y) == 1;
    },
    /** Clears all connections and flags from cell 
      * @param {number} x The x coordinate
      * @param {number} y The y coordinate
      * @function
      * @instance
      * @returns {boolean}
      * @memberof module:connection-grid-core
      * @example <caption>usage</caption>
      * let isCell = core.reset(1,2);
      */
    reset(x, y) {
      if (!this.isCell(x, y)) { return false; }
      let list = this.getNeighborDirs(x, y);
      for (let sDir of list) {
        if (!this.isDir(sDir)) {
          console.error(".reset unknown direction: ", sDir);
          return false;
        }
        this.disconnectUndirected(x, y, sDir)
      }
      this.clearMask(x, y);
      this.clearVisited(x, y);
      return true;
    },

  });
};