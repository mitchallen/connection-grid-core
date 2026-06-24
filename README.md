
@mitchallen/connection-grid-core
==
Connection grid core
--

<p align="left">

  <a href="https://github.com/mitchallen/connection-grid-core/actions/workflows/ci.yml">
    <img src="https://github.com/mitchallen/connection-grid-core/actions/workflows/ci.yml/badge.svg" alt="Build Status">
  </a>
  
  <a href="https://codecov.io/gh/mitchallen/connection-grid-core">
    <img src="https://codecov.io/gh/mitchallen/connection-grid-core/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
  
  <a href="https://github.com/mitchallen/connection-grid-core/pkgs/npm/connection-grid-core">
    <img src="https://img.shields.io/github/v/tag/mitchallen/connection-grid-core.svg?label=version" alt="Version">
  </a>
  
  <a href="https://github.com/mitchallen/connection-grid-core/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mitchallen/connection-grid-core.svg">
  </a>
  
</p>

* * *
## Installation

This package — and its `@mitchallen` dependencies — is published to the
**GitHub Packages** registry, not npmjs. GitHub Packages requires
authentication for every install, even though the packages are public, so you
need a GitHub personal access token with the `read:packages` scope.

1. Export your token:

       export NODE_AUTH_TOKEN=ghp_your_token_here

2. Add an `.npmrc` to your project so the `@mitchallen` scope resolves from
   GitHub Packages:

       @mitchallen:registry=https://npm.pkg.github.com
       //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

3. Install:

       $ npm install @mitchallen/connection-grid-core --save

> Tip: with the GitHub CLI, `export NODE_AUTH_TOKEN="$(gh auth token)"`
> (after `gh auth refresh --scopes read:packages`).
  
* * *

## Usage

```js
"use strict";
    
let gridFactory = require("@mitchallen/connection-grid-core"),
    gridSquare = require('@mitchallen/grid-square')
    
let sourceGrid = gridSquare.create({ x: 5, y: 6 });
	
let _dirMap = { 
        "N": 0x010, 
        "S": 0x020, 
        "E": 0x040, 
        "W": 0x080 };

let _oppositeMap = { "E": "W", "W": "E", "N": "S", "S": "N" };

let cg = gridFactory.create({  
        grid: sourceGrid,     
        dirMap: _dirMap,
        oppositeMap: _oppositeMap 
      });
```

## Browser Usage:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Connection-Grid-Core Example</title>
    <meta name="description" content="Connection Grid Core Example">
    <script src="https://cdn.jsdelivr.net/gh/mitchallen/connection-grid-core@v0.1.22/dist/connection-grid-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/mitchallen/grid-square@v0.1.8/dist/grid-square.min.js"></script>
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
```
    
* * *

## Documentation

* [DOC-API.md](./DOC-API.md)

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

#### Version 0.1.12

* Added isDeadEnd method
* Added connectionCount method
* hasConnections accounts for VISITED flag

#### Version 0.1.11

* added experimental getMaxDistance and supporting functions

#### Version 0.1.10

* updated .npmignore

#### Version 0.1.9

* integrated travis-ci and codecov.io
* uses latest version of @mitchallen/shuffle
* updated license to MIT
* refactored test cases to bring code coverage to 100%

#### Version 0.1.8

* corrected reference to derived class in documentation

#### Version 0.1.7

* refactored documentation

#### Version 0.1.6

* fixed issue with documentation

#### Version 0.1.5

* fixed issue with documentation

#### Version 0.1.4

* added web-server to npm scripts
* added message in client example HTML to check JavaScript console

#### Version 0.1.3

* fixed issue with documentation tag

#### Version 0.1.2 

* added __open__ method
* integrated jsdoc
* updated documentation

#### Version 0.1.1 

* added browser example

#### Version 0.1.0 

* initial release

* * *
