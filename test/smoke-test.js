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
    // modulePath = "../dist/connection-grid-core";
    modulePath = "../modules/index";

describe('module smoke test', function() {

    var _module = null;

    var _dirMap = { 
        "N": 0x010, 
        "S": 0x020, 
        "E": 0x040, 
        "W": 0x080 };

    let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };

    // override getNeighbor for test.
    var mockGetNeighbor = function(x, y, dir) {
            if(!this.isCell(x, y)) { return null; }
            // dir must be string and in dirmap
            if(!this.isDir(dir)) { return null; }
            let _DX = { "E": 1, "W": -1, "N": 0, "S": 0 };
            let _DY = { "E": 0, "W": 0, "N": -1, "S": 1 };
            var nx = x + _DX[dir];
            var ny = y + _DY[dir];
            if(!this.isCell(nx, ny)) { 
                return null; 
            }
            return { x: nx, y: ny };
        };

    // override getNeighborDirs for test.
    var mockGetNeighborDirs = function(x, y) {
            // Classic ignores x and y, but other derived classes may not
            return [ "N", "S", "E", "W" ];
        }

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
        cg.connectUndirected(tX,tY,"S").should.eql(false);
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
        cg.connects(tX,tY,"S").should.eql(false);
        done();
    });

    it('connects should return false for non-string direction', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        
        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;
        cg.connects(1,0,1).should.eql(false);
        done();
    });

    it('connects should return false for non-existant cell', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        })
        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;
        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;
        cg.connects(-1,0,"N").should.eql(false);
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

    it('isDir for non-string should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.isDir(1).should.eql(false);
        done();
    });

    it('getOppositeDir for non-string should return null', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        var result = cg.getOppositeDir(1);
        should.not.exist(result);
        done();
    });

    it('visited for a cell that was not visited should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.visited(0,0).should.eql(false);
        done();
    });

    it('isMasked for a cell that was not masked should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.isMasked(0,0).should.eql(false);
        done();
    });

    it('hasConnections for a non-existant cell should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.hasConnections(-1,0).should.eql(false);
        done();
    });

    it('hasConnections for a cell that has no connections should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.hasConnections(x,y).should.eql(false);
        done();
    });

    it('hasConnections for a cell that has connections should return true', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.hasConnections(x,y).should.eql(true);
        done();
    });

    it('hasConnections for a cell that has an invalid direction should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = function(x, y) {
            // Classic ignores x and y, but other derived classes may not
            return [ "X", "Y", "Z" ];
        }

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.hasConnections(x,y).should.eql(false);
        done();
    });

    it('hasConnections for a cell that has no directions should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = function(x, y) {
            // Classic ignores x and y, but other derived classes may not
            return [];
        }

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.hasConnections(x,y).should.eql(false);
        done();
    });

    it('connectUndirected should return false if no opposite directions', function(done) {
        var xSize = 5,
            ySize = 6;
        var sourceGrid = gridSquare.create({ x: xSize, y: ySize });
        var cg = _module.create({  
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
        cg.connectUndirected(tX,tY,"S").should.eql(false);
        done();
    });

    it('open for a non-string direction should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.set(0,0,0);
        cg.open(0,0,1).should.eql(false);
        done();
    });

    it('connect for a non-string direction should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });
        cg.set(0,0,0);
        cg.connect(0,0,1).should.eql(false);
        done();
    });

    it('connect for a valid cell and direction should return true', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.connect(x,y,"N").should.eql(true);
        done();
    });

    it('connectsAny for a cell that has connections should return true', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.connectsAny(x,y,["N","E","W","S"]).should.eql(true);
        done();
    });

    it('connectsAny for a list of non-sensical directions should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.connectsAny(x,y,["X","Y","Z"]).should.eql(false);
        done();
    });

        it('connectsAny for an empty list should return false', function(done) {
        var sourceGrid = gridCore.create({rows: 5});
        var cg = _module.create({  
            grid: sourceGrid,     
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
        });

        cg.set(1,0,0);
        cg.set(1,1,0);

        // override getNeighbor for test.
        cg.getNeighbor = mockGetNeighbor;

        // override getNeighborDirs for test.
        cg.getNeighborDirs = mockGetNeighborDirs;

        var x = 1, y = 1;
        cg.connectUndirected(x,y,"N");
        cg.connectsAny(x,y,[]).should.eql(false);
        done();
    });
});