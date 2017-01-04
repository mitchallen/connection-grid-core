/**
    Module: @mitchallen/connection-grid-core
      Test: smoke-test
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
    should = require('should'),
    gridCore = require('@mitchallen/grid-core'),
    gridSquare = require('@mitchallen/grid-square'),
    modulePath = "../dist/connection-grid-core";

describe('module smoke test', function() {

    var _module = null;

    var _dirMap = { 
        "N": 0x010, 
        "S": 0x020, 
        "E": 0x040, 
        "W": 0x080 };

    let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };

    before(function(done) {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _module = require(modulePath);
        done();
    });

    after(function(done) {
        // Call after all tests
        done();
    });

    beforeEach(function(done) {
        // Call before each test
        done();
    });

    afterEach(function(done) {
        // Call after eeach test
        done();
    });

    it('module should exist', function(done) {
        should.exist(_module);
        done();
    });

    it('create method with no spec should return null', function(done) {
        var cg = _module.create();
        should.not.exist(cg);
        done();
    });

    it('create method with valid parameters should return object', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        should.exist(cg);
        done();
    });

    it('getNeighborDirs should return empty list', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
            // sourceGrid.fill(0)
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.getNeighborDirs(1,1).should.eql([]);
        done();
    });

    it('getShuffledNeighborDirs should return empty list', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 1;
        let tY = 2;
        var shuffled = cg.getShuffledNeighborDirs(tX,tY);
        shuffled.length.should.eql(0);
        done();
    });

    it('markVisited should return true for valid cell', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 0;
        let tY = 0;
        let VISITED = 0x01;
        var result = cg.markVisited(tX,tY);
        result.should.eql(true);
        cg.get(tX,tY).should.eql(VISITED);
        done();
    });

    it('visited should return true for a visited cell', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 0;
        let tY = 0;
        cg.markVisited(tX,tY).should.eql(true);
        cg.visited(tX,tY).should.eql(true);
        done();
    });

    it('hasConnections should return false when nothing connected', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        let tX = 0;
        let tY = 0;
        cg.hasConnections(tX,tY).should.eql(false);
        done();
    });

    it('getNeighbor should return null', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 2;
        let tY = 3;
        // derived class needs to override
        var result = cg.getNeighbor(tX,tY,"S");
        should.not.exist(result);
        done();
    });

    it('connect should return false for base class', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 0;
        let tY = 0;
        // because base class doesn't handle neighbors
        cg.connect(tX,tY,"S").should.eql(false);
        done();
    });

    it('connectUndirected should return false for base class', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        let tX = 0;
        let tY = 0;
        // base class doesn't define neighbors
        let status = cg.connectUndirected(tX,tY,"S").should.eql(false);
        done();
    });

    it('connects should return false for base class', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        let tX = 0;
        let tY = 0;
        // base class doesn't know about neighbors
        cg.connect(tX,tY,"S").should.eql(false);
        done();
    });

    it('isMasked should return true for a masked cell', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        let tX = 0;
        let tY = 0;
        cg.mask(tX,tY).should.eql(true);
        cg.isMasked(tX,tY).should.eql(true);
        done();
    });

    it('getOppositeDir should return opposite neighbor', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.getOppositeDir("N").should.eql("S");
        done();
    });

    it('open should connect a cell in the designated direction', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        let tX = 0;
        let tY = 0;
        cg.connects(tX,tY,"N").should.eql(false);
        cg.open(tX,tY,"N").should.eql(true);
        cg.connects(tX,tY,"N").should.eql(true);
        done();
    });
});