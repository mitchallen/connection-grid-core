/**
    Module: @mitchallen/connection-grid-core
      Test: smoke-test
    Author: Mitch Allen
*/

"use strict";

const { describe, it, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const gridCore = require('@mitchallen/grid-core');
const gridSquare = require('@mitchallen/grid-square');
const modulePath = "../src/index";

describe('module smoke test', function () {

  let _module = null;

  let _dirMap = {
    "N": 0x010,
    "S": 0x020,
    "E": 0x040,
    "W": 0x080
  };

  let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };

  // override getNeighbor for test.
  let mockGetNeighbor = function (x, y, dir) {
    if (!this.isCell(x, y)) { return null; }
    // dir must be string and in dirmap
    if (!this.isDir(dir)) { return null; }
    let _DX = { "E": 1, "W": -1, "N": 0, "S": 0 };
    let _DY = { "E": 0, "W": 0, "N": -1, "S": 1 };
    var nx = x + _DX[dir];
    var ny = y + _DY[dir];
    if (!this.isCell(nx, ny)) {
      return null;
    }
    return { x: nx, y: ny };
  };

  // override getNeighborDirs for test.
  let mockGetNeighborDirs = function (x, y) {
    // Classic ignores x and y, but other derived classes may not
    return ["N", "S", "E", "W"];
  }

  before(function() {
    // Call before all tests
    delete require.cache[require.resolve(modulePath)];
    _module = require(modulePath);
  });

  after(function() {
    // Call after all tests
  });

  beforeEach(function() {
    // Call before each test
  });

  afterEach(function() {
    // Call after eeach test
  });

  it('module should exist', function() {
    assert.ok(_module != null);
  });

  it('create method with no spec should return null', function() {
    let cg = _module.create();
    assert.ok(cg == null);
  });

  it('create method with valid parameters should return object', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.ok(cg != null);
  });

  it('getNeighborDirs should return empty list', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    // sourceGrid.fill(0)
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.getNeighborDirs(1, 1), []);
  });

  it('getShuffledNeighborDirs should return empty list', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 1;
    let tY = 2;
    let shuffled = cg.getShuffledNeighborDirs(tX, tY);
    assert.deepStrictEqual(shuffled.length, 0);
  });

  it('markVisited should return true for valid cell', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let VISITED = 0x01;
    let result = cg.markVisited(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.get(tX, tY), VISITED);
  });

  it('clearVisited should return true for cleared cell', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let VISITED = 0x01;
    let result = cg.markVisited(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.get(tX, tY), VISITED);
    cg.clearVisited(tX, tY);
    assert.notDeepStrictEqual(cg.get(tX, tY), VISITED);
  });

  it('visited should return true for a visited cell', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.markVisited(tX, tY), true);
    assert.deepStrictEqual(cg.visited(tX, tY), true);
  });

  it('hasConnections should return false when nothing connected', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.hasConnections(tX, tY), false);
  });

  it('getNeighbor should return null', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 2;
    let tY = 3;
    // derived class needs to override
    let result = cg.getNeighbor(tX, tY, "S");
    assert.ok(result == null);
  });

  it('connect should return false for base class', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    // because base class doesn't handle neighbors
    assert.deepStrictEqual(cg.connect(tX, tY, "S"), false);
  });

  it('connectUndirected should return false for base class', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    let tX = 0;
    let tY = 0;
    // base class doesn't define neighbors
    assert.deepStrictEqual(cg.connectUndirected(tX, tY, "S"), false);
  });

  it('connects should return false for base class', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    let tX = 0;
    let tY = 0;
    // base class doesn't know about neighbors
    assert.deepStrictEqual(cg.connects(tX, tY, "S"), false);
  });

  it('connects should return false for non-string direction', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;
    assert.deepStrictEqual(cg.connects(1, 0, 1), false);
  });

  it('connects should return false for non-existant cell', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;
    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;
    assert.deepStrictEqual(cg.connects(-1, 0, "N"), false);
  });

  it('isMasked should return true for a masked cell', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.mask(tX, tY), true);
    assert.deepStrictEqual(cg.isMasked(tX, tY), true);
  });

  it('isMasked should return false for a masked cell that was cleared', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    })
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.mask(tX, tY), true);
    assert.deepStrictEqual(cg.isMasked(tX, tY), true);
    cg.clearMask(tX, tY);
    assert.deepStrictEqual(cg.isMasked(tX, tY), false);
  });

  it('getOppositeDir should return opposite neighbor', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.getOppositeDir("N"), "S");
  });

  it('open should connect a cell in the designated direction', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.connects(tX, tY, "N"), false);
    assert.deepStrictEqual(cg.open(tX, tY, "N"), true);
    assert.deepStrictEqual(cg.connects(tX, tY, "N"), true);
  });

  it('close should disconnect a cell in the designated direction', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    assert.deepStrictEqual(cg.connects(tX, tY, "N"), false);
    assert.deepStrictEqual(cg.open(tX, tY, "N"), true);
    assert.deepStrictEqual(cg.connects(tX, tY, "N"), true);
    assert.deepStrictEqual(cg.close(tX, tY, "N"), true);
    assert.deepStrictEqual(cg.connects(tX, tY, "N"), false);
  });

  it('isDir for non-string should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.isDir(1), false);
  });

  it('getOppositeDir for non-string should return null', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let result = cg.getOppositeDir(1);
    assert.ok(result == null);
  });

  it('visited for a cell that was not visited should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.visited(0, 0), false);
  });

  it('isMasked for a cell that was not masked should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.isMasked(0, 0), false);
  });

  it('hasConnections for a non-existant cell should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    assert.deepStrictEqual(cg.hasConnections(-1, 0), false);
  });

  it('hasConnections for a cell that has no connections should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
  });

  it('hasConnections for a cell that has connections should return true', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), true);
  });

  it('hasConnections for a cell that has an invalid direction should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = function (x, y) {
      // Classic ignores x and y, but other derived classes may not
      return ["X", "Y", "Z"];
    }

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
  });

  it('hasConnections for a cell that has no directions should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = function (x, y) {
      // Classic ignores x and y, but other derived classes may not
      return [];
    }

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
  });

  it('connectUndirected should return false if no opposite directions', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      // oppositeMap: _oppositeMap 
    })

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let tX = 0;
    let tY = 0;
    // base class doesn't define neighbors
    assert.deepStrictEqual(cg.connectUndirected(tX, tY, "S"), false);
  });

  it('open for a non-string direction should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    cg.set(0, 0, 0);
    assert.deepStrictEqual(cg.open(0, 0, 1), false);
  });

  it('connect for a non-string direction should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    cg.set(0, 0, 0);
    assert.deepStrictEqual(cg.connect(0, 0, 1), false);
  });

  it('connect for a valid cell and direction should return true', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    assert.deepStrictEqual(cg.connect(x, y, "N"), true);
  });

  it('connectsAny for a cell that has connections should return true', function() {
    let sourceGrid = gridCore.create({ rows: 5 });

    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    for( let i = 0; i < 3; i++ ) {
      for( let j = 0; j < 3; j++ ) {
        cg.set(i,j,0);
      }
    }

    // cg.set(1, 0, 0);
    // cg.set(1, 1, 0);
    // cg.set(1, 2, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "E");
    assert.deepStrictEqual(cg.connectsAny(x, y, ["N", "E", "W", "S"]), true);
    assert.deepStrictEqual(cg.connectsAny(x, y, ["E", "W"]), true);
    assert.deepStrictEqual(cg.connectsAny(x, y, ["E"]), true);
    assert.notDeepStrictEqual(cg.connectsAny(x, y, ["N", "W", "S"]), true);
  });

  it('connectsAny for a list of non-sensical directions should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.connectsAny(x, y, ["X", "Y", "Z"]), false);
  });

  it('connectsAny for an empty list should return false', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.connectsAny(x, y, []), false);
  });

  it('getMaxDistance should return max distance', function() {

    let sourceGrid = gridCore.create({ rows: 5 });

    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    for( let i = 0; i < 5; i++ ) {
      for( let j = 0; j < 5; j++ ) {
        cg.set(i,j,0);
      }
    }

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let startX = 2, startY = 2;
    console.log( "*", { x: startX, y: startY })
    cg.connectUndirected(startX, startY, "N");
    let n1 = cg.getNeighbor(startX, startY, "N");
    console.log("N", n1);
    cg.connectUndirected( n1.x, n1.y, "E");
    let n2 = cg.getNeighbor(n1.x, n1.y, "E");
    console.log("E", n2);
    cg.connectUndirected( n2.x, n2.y, "S");
    let n3 = cg.getNeighbor(n2.x, n2.y, "S");
    console.log("S", n3);
    let d = cg.getMaxDistance(startX,startY);
    console.log(d);
    assert.deepStrictEqual(d.x, 3);
    assert.deepStrictEqual(d.y, 2);
    assert.deepStrictEqual(d.distance, 3);
  });

  it('isLeaf should return true or false for deadend', function() {

    let sourceGrid = gridCore.create({ rows: 5 });

    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    for( let i = 0; i < 5; i++ ) {
      for( let j = 0; j < 5; j++ ) {
        cg.set(i,j,0);
      }
    }

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let startX = 2, startY = 2;
    console.log( "*", { x: startX, y: startY })
    cg.connectUndirected(startX, startY, "N");
    let n1 = cg.getNeighbor(startX, startY, "N");
    console.log("N", n1);
    cg.connectUndirected( n1.x, n1.y, "E");
    let n2 = cg.getNeighbor(n1.x, n1.y, "E");
    console.log("E", n2);
    cg.connectUndirected( n2.x, n2.y, "S");
    let n3 = cg.getNeighbor(n2.x, n2.y, "S");
    console.log("S", n3);
    assert.deepStrictEqual(cg.isLeaf(startX, startY), true);
    assert.deepStrictEqual(cg.isLeaf(n1.x, n1.y), false);
    assert.deepStrictEqual(cg.isLeaf(n2.x, n2.y), false);
    assert.deepStrictEqual(cg.isLeaf(n3.x, n3.y), true);
  });

  it('connectionCount should return number of connections', function() {

    let sourceGrid = gridCore.create({ rows: 5 });

    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    for( let i = 0; i < 5; i++ ) {
      for( let j = 0; j < 5; j++ ) {
        cg.set(i,j,0);
      }
    }

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let startX = 2, startY = 2;
    console.log( "*", { x: startX, y: startY })
    cg.connectUndirected(startX, startY, "N");
    cg.connectUndirected(startX, startY, "S");
    let n1n = cg.getNeighbor(startX, startY, "N");
    let n1s = cg.getNeighbor(startX, startY, "S");
    console.log("N", n1n);
    console.log("S", n1s);
    cg.connectUndirected( n1n.x, n1n.y, "E");
    let n2 = cg.getNeighbor(n1n.x, n1n.y, "E");
    console.log("E", n2);
    cg.connectUndirected( n2.x, n2.y, "S");
    let n3 = cg.getNeighbor(n2.x, n2.y, "S");
    console.log("S", n3);
    assert.deepStrictEqual(cg.connectionCount(startX, startY), 2);
    assert.deepStrictEqual(cg.connectionCount(n1n.x, n1n.y), 2);
    assert.deepStrictEqual(cg.connectionCount(n1s.x, n1s.y), 1);
    assert.deepStrictEqual(cg.connectionCount(n2.x, n2.y), 2);
    assert.deepStrictEqual(cg.connectionCount(n3.x, n3.y), 1);
  });

  it('disconnect should remove the connection for a cell (one way)', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connect(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), true);
    cg.disconnect(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
  });

  it('disconnectUndirected should remove connection from both cells', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), true);
    assert.deepStrictEqual(cg.hasConnections(x, y - 1), true);
    cg.disconnectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
    assert.deepStrictEqual(cg.hasConnections(x, y - 1), false);
  });

  it('reset should remove all connection from both cells and flags from target', function() {
    let sourceGrid = gridCore.create({ rows: 5 });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });

    cg.set(1, 0, 0);
    cg.set(1, 1, 0);

    // override getNeighbor for test.
    cg.getNeighbor = mockGetNeighbor;

    // override getNeighborDirs for test.
    cg.getNeighborDirs = mockGetNeighborDirs;

    let x = 1, y = 1;
    cg.connectUndirected(x, y, "N");
    assert.deepStrictEqual(cg.hasConnections(x, y), true);
    assert.deepStrictEqual(cg.hasConnections(x, y - 1), true);
    cg.mask(x, y);
    cg.markVisited(x, y);
    cg.markRed(x, y);
    cg.markGreen(x, y);
    assert.deepStrictEqual(cg.isMasked(x,y), true);
    assert.deepStrictEqual(cg.visited(x,y), true);
    assert.deepStrictEqual(cg.isRed(x,y), true);
    assert.deepStrictEqual(cg.isGreen(x,y), true);
    // Reset
    cg.reset(x, y);
    assert.deepStrictEqual(cg.hasConnections(x, y), false);
    assert.deepStrictEqual(cg.hasConnections(x, y - 1), false);
    assert.deepStrictEqual(cg.isMasked(x,y), false);
    assert.deepStrictEqual(cg.visited(x,y), false);
    assert.deepStrictEqual(cg.isRed(x,y), false);
    assert.deepStrictEqual(cg.isGreen(x,y), false);
  });

  it('clearAllVisited should clear all visited cells', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let VISITED = 0x01;
    let result = cg.markVisited(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.visited(tX, tY), true);
    assert.deepStrictEqual(cg.get(tX, tY), VISITED);
    cg.clearAllVisited(tX, tY);
    assert.deepStrictEqual(cg.visited(tX, tY), false);
    assert.notDeepStrictEqual(cg.get(tX, tY), VISITED);
  });

  it('clearAllMasks should clear all mask cells', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let MASKED = 0x02;
    let result = cg.mask(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.isMasked(tX, tY), true);
    assert.deepStrictEqual(cg.get(tX, tY), MASKED);
    cg.clearAllMasks(tX, tY);
    assert.deepStrictEqual(cg.isMasked(tX, tY), false);
    assert.notDeepStrictEqual(cg.get(tX, tY), MASKED);
  });

  it('clearAllRed should clear all red cells', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let RED = 0x04;
    let result = cg.markRed(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.isRed(tX, tY), true);
    assert.deepStrictEqual(cg.get(tX, tY), RED);
    cg.clearAllRed(tX, tY);
    assert.deepStrictEqual(cg.isRed(tX, tY), false);
    assert.notDeepStrictEqual(cg.get(tX, tY), RED);
  });

  it('clearAllGreen should clear all green cells', function() {
    let xSize = 5,
      ySize = 6;
    let sourceGrid = gridSquare.create({ x: xSize, y: ySize });
    let cg = _module.create({
      grid: sourceGrid,
      dirMap: _dirMap,
      oppositeMap: _oppositeMap
    });
    let tX = 0;
    let tY = 0;
    let GREEN = 0x08;
    let result = cg.markGreen(tX, tY);
    assert.deepStrictEqual(result, true);
    assert.deepStrictEqual(cg.isGreen(tX, tY), true);
    assert.deepStrictEqual(cg.get(tX, tY), GREEN);
    cg.clearAllGreen(tX, tY);
    assert.deepStrictEqual(cg.isGreen(tX, tY), false);
    assert.notDeepStrictEqual(cg.get(tX, tY), GREEN);
  });

});