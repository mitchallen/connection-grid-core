
@mitchallen/connection-grid-core
==
Connection grid core
--
* * *
## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/connection-grid-core --save
  
* * *

## Usage


    "use strict";
    
    var gridFactory = require("@mitchallen/connection-grid-core"),
    				  gridSquare = require('@mitchallen/grid-square')
    
	var sourceGrid = gridSquare.create({ x: 5, y: 6 });
	
    var _dirMap = { 
        "N": 0x010, 
        "S": 0x020, 
        "E": 0x040, 
        "W": 0x080 };

    let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };

    var cg = gridFactory.create({  
        grid: sourceGrid,     
        dirMap: _dirMap,
        oppositeMap: _oppositeMap 
    })


## Browser Usage:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Connection-Grid-Core Example</title>
        <meta name="description" content="Connection Grid Core Example">
        <!-- either cdn should work -->
        <!--
        <script src="https://cdn.rawgit.com/mitchallen/connection-grid-core/v0.1.0/dist/connection-grid-core.min.js"></script>
        -->
        <script src="https://unpkg.com/@mitchallen/connection-grid-core@0.1.0/dist/connection-grid-core.min.js"></script>
        <script src="https://unpkg.com/@mitchallen/grid-square@0.1.4/dist/grid-square.min.js"></script>
        <script>
          var factory = window.MitchAllen.ConnectionGridCore;
          var squareFactory = window.MitchAllen.GridSquare;
          console.log(factory);
          var xSize = 10, ySize = 5;
          var sourceGrid = squareFactory.create({ x: xSize, y: ySize });
          var _dirMap = { 
            "N": 0x010, 
            "S": 0x020, 
            "E": 0x040, 
            "W": 0x080 };
        let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };
        var cg = factory.create({ 
            grid: sourceGrid, 
            dirMap: _dirMap,
            oppositeMap: _oppositeMap 
          });
          console.log(cg); 
        </script>
      </head>
      <body>
        <h1>Connection Grid Core Example</h1>
      </body>
    </html>

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/connection-grid-core.git](https://bitbucket.org/mitchallen/connection-grid-core.git)
* [github.com/mitchallen/connection-grid-core.git](https://github.com/mitchallen/connection-grid-core.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.1 

* added browser example

#### Version 0.1.0 

* initial release

* * *
