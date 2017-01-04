## Modules

<dl>
<dt><a href="#module_connection-grid-core">connection-grid-core</a> ⇐ <code>{@link</code></dt>
<dd><p>Connection Grid Core</p>
</dd>
<dt><a href="#module_connection-grid-core-factory">connection-grid-core-factory</a></dt>
<dd><p>A module for generating square mazes</p>
</dd>
</dl>

<a name="module_connection-grid-core"></a>

## connection-grid-core ⇐ <code>{@link</code>
Connection Grid Core

**Extends:** <code>{@link</code>  

* [connection-grid-core](#module_connection-grid-core) ⇐ <code>{@link</code>
    * [.isDir(dir)](#module_connection-grid-core+isDir) ⇒ <code>boolean</code>
    * [.getOppositeDir(dir)](#module_connection-grid-core+getOppositeDir) ⇒ <code>string</code>
    * [.getNeighbor(x, y, dir)](#module_connection-grid-core+getNeighbor) ⇒ <code>string</code>
    * [.getNeighborDirs(x, y)](#module_connection-grid-core+getNeighborDirs)
    * [.getShuffledNeighborDirs(x, y)](#module_connection-grid-core+getShuffledNeighborDirs)
    * [.markVisited(x, y)](#module_connection-grid-core+markVisited) ⇒ <code>boolean</code>
    * [.visited(x, y)](#module_connection-grid-core+visited) ⇒ <code>boolean</code>
    * [.mask(x, y)](#module_connection-grid-core+mask) ⇒ <code>boolean</code>
    * [.isMasked(x, y)](#module_connection-grid-core+isMasked) ⇒ <code>boolean</code>
    * [.hasConnections(x, y)](#module_connection-grid-core+hasConnections) ⇒ <code>boolean</code>
    * [.open(x, y, dir)](#module_connection-grid-core+open)
    * [.connect(x, y, dir)](#module_connection-grid-core+connect) ⇒ <code>boolean</code>
    * [.connectUndirected(x, y, dir)](#module_connection-grid-core+connectUndirected) ⇒ <code>boolean</code>
    * [.connects(x, y, dir)](#module_connection-grid-core+connects) ⇒ <code>boolean</code>
    * [.connectsAny(x, y, list)](#module_connection-grid-core+connectsAny) ⇒ <code>boolean</code>

<a name="module_connection-grid-core+isDir"></a>

### connection-grid-core.isDir(dir) ⇒ <code>boolean</code>
Returns true if string is found in _DIR_MAP array.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
if(core.isDir("N")) ...
```
<a name="module_connection-grid-core+getOppositeDir"></a>

### connection-grid-core.getOppositeDir(dir) ⇒ <code>string</code>
Returns opposite direction based on _OPPOSITE array.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
core.getOppositeDir("N").should.eql("S");
```
<a name="module_connection-grid-core+getNeighbor"></a>

### connection-grid-core.getNeighbor(x, y, dir) ⇒ <code>string</code>
Returns the neighbor in a particular direction for a cell at x,y.
<b><This should be overriden by base class/b>

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
var neighbor = core.getNeighbor(1,2,"N");
```
<a name="module_connection-grid-core+getNeighborDirs"></a>

### connection-grid-core.getNeighborDirs(x, y)
Returns the neighbor directions for a cell at x,y.
<b><This should be overriden by base class/b>.
Classic square grids ignore x and y, but other derived classes, like hexagon, may not.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
var neighbors = core.getNeighborDirs(1,2);
```
<a name="module_connection-grid-core+getShuffledNeighborDirs"></a>

### connection-grid-core.getShuffledNeighborDirs(x, y)
Returns a shuffled list of neighbors for a cell at x,y.
Useful for generating random mazes.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
var neighbors = core.getShuffledNeighborDirs(1,2);
```
<a name="module_connection-grid-core+markVisited"></a>

### connection-grid-core.markVisited(x, y) ⇒ <code>boolean</code>
Marks a cell at x,y as visited.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
core.markVisited(1,2);
```
<a name="module_connection-grid-core+visited"></a>

### connection-grid-core.visited(x, y) ⇒ <code>boolean</code>
Returns true if a cell at x,y exists and it has been marked as visited.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
if(core.visited(x)) ...
```
<a name="module_connection-grid-core+mask"></a>

### connection-grid-core.mask(x, y) ⇒ <code>boolean</code>
Marks a cell at x,y as masked.
Useful for maze generators to mark cells to skip

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
core.mask(1,2)
```
<a name="module_connection-grid-core+isMasked"></a>

### connection-grid-core.isMasked(x, y) ⇒ <code>boolean</code>
Returns true if a cell at x,y has been marked using [mask](#module_connection-grid-core+mask).

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
if(core.isMasked(1,2)) ...
```
<a name="module_connection-grid-core+hasConnections"></a>

### connection-grid-core.hasConnections(x, y) ⇒ <code>boolean</code>
Returns true if a cell at x,y has connections.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |

**Example** *(console output)*  
```js
if(core.hasConnections(1,2)) ...
```
<a name="module_connection-grid-core+open"></a>

### connection-grid-core.open(x, y, dir)
Maps a connection for a cell at x,y in a particular direction.
Unlike [connect](#module_connection-grid-core+connect) a cell in the direction does not have to exist.
Useful for mazes that need to open up border walls.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
core.open(0,0,"N");
```
<a name="module_connection-grid-core+connect"></a>

### connection-grid-core.connect(x, y, dir) ⇒ <code>boolean</code>
Maps a connection for a cell at x,y in a particular direction.
Returns false if the cell in the target direction does not exist.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
if(core.connect(1,2,"N")) ...
```
<a name="module_connection-grid-core+connectUndirected"></a>

### connection-grid-core.connectUndirected(x, y, dir) ⇒ <code>boolean</code>
Maps a connection for a cell at x,y in a particular direction.
Also maps a connection from the target cell back to the source cell.
Returns false if the cell in the target direction does not exist.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
if(core.connectUndirected(1,2,"N")) ...
```
<a name="module_connection-grid-core+connects"></a>

### connection-grid-core.connects(x, y, dir) ⇒ <code>boolean</code>
Returns true if a cell connects to a neighbor cell in a particular direction.
It does not matter if a the target cell exists such as when [open](#module_connection-grid-core+open) maps a connection to a non-existant cell.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| dir | <code>string</code> | A string representing a direction |

**Example** *(console output)*  
```js
if(core.connects(1,2,"N")) ...
```
<a name="module_connection-grid-core+connectsAny"></a>

### connection-grid-core.connectsAny(x, y, list) ⇒ <code>boolean</code>
Returns true if a cell connects to a neighbor cell in any direction in the list.

**Kind**: instance method of <code>[connection-grid-core](#module_connection-grid-core)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate |
| y | <code>number</code> | The y coordinate |
| list | <code>array</code> | An array of strings that each represent a direction |

**Example** *(console output)*  
```js
if(core.connectsAny(1,2,["N","W"]) ...
```
<a name="module_connection-grid-core-factory"></a>

## connection-grid-core-factory
A module for generating square mazes

<a name="module_connection-grid-core-factory.create"></a>

### connection-grid-core-factory.create(options) ⇒ <code>[connection-grid-core](#module_connection-grid-core)</code>
Factory method that returns a connection grid core object.
It takes one spec parameter that must be an object with named parameters.

**Kind**: static method of <code>[connection-grid-core-factory](#module_connection-grid-core-factory)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Named parameters for generating a connection grid core |
| options.grid | <code>grid</code> | Grid based on @mitchallen/grid-core |
| options.dirMap | <code>dirMap</code> | Direction map containing bit map flags for directions |
| options.oppositeMap | <code>oppositeMap</code> | Opposite direction map |

**Example** *(Creating a connection-grid-core)*  
```js
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
});
```