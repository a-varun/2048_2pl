var bpo = 0;
var flag = false;
function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  bpo = 0;
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};


GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;
  if(bpo % 2 == 1 && !flag) return;
  bpo = bpo + 1; 
  varitup+=1;
  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
  else{
    bpo--;
  }

  function dofunc(){
    return 1;
  }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

this.getarr =function(){
    var arr = [];
    for (var i = 0 ; i <4 ; i++) {
      var row = [];
      for (var j = 0; j < 4; j++) {
        tile = self.grid.cellContent({x:j, y:i});
        if(tile == null)
          row.push(0);
        else 
          row.push(tile["value"]);
      };
      arr.push(row);
    };

    return arr;
  }

this.copyarr = function(arr){
  var b=[];
  for(var i=0;i<4;i++){
    var c=[];
    for(var j=0;j<4;j++)
      c.push(arr[i][j]);
    b.push(c);
  }
  return b;
}

this.moveitout = function(arit, mv){
  var arr = self.copyarr(arit);
  var tilex,tiley, rox,roy,colx,coly,startx,starty;
  if(mv == 0 ){
    //up
    rox = 0; roy = 1;
    colx = 1; coly = 0;
    starty = 0;startx = 0;
    tilex = -1; tiley = 0;
    //alert('up');
  }
  else if(mv==1){
    //right
    //alert('right');
    rox = 1; roy = 0;
    starty = 3;startx = 0;
    colx = 0; coly = -1;
    tilex = 0; tiley = 1;
  }
  else if(mv==(3-1)){
    //down
    //alert('down');
    rox = 0; roy = -1;
    starty = 3;startx = 3;
    colx = -1; coly = 0;
    tilex = 1; tiley = 0;
  }
  else{
    //left
    //alert('left');
    rox = -1; roy = 0;
    starty = 0;startx = 3;
    colx = 0; coly = 1;
    tilex = 0; tiley = -1;
  }
  
  var visited=[];
  for(var i=0;i<4;i++){
    var k=[];
    for(var j=0;j<4;j++){
      k.push(0);
    }
    visited.push(k);
  }
  console.log('Before');
  self.printarray(arr);
    startx  = startx - colx;
    starty  = starty - coly;

  for(var i=0;i<4;i++){
    startx  = startx + colx;
    starty  = starty + coly;
    var ttmpx = startx, ttmpy = starty;
    ttmpx  = ttmpx -rox; ttmpy  = ttmpy - roy;
    for(var j=0;j<4;j++){
      ttmpy  = ttmpy + roy; ttmpx  = ttmpx + rox;
      var tmpx = ttmpx,tmpy = ttmpy;
      while(tmpx>=0 && tmpy >=0 && tmpx< 4 && tmpy < 4){
        
        if(arr[tmpx+tilex]!=undefined && arr[tmpx+tilex][tmpy+tiley]!= undefined && arr[tmpx+tilex][tmpy+tiley] ==0){
          arr[tmpx+tilex][tmpy+tiley] = arr[tmpx][tmpy];
          arr[tmpx][tmpy] = 0;

          tmpx = tmpx + tilex;
          tmpy = tmpy + tiley;
          continue;
        }
        else if(arr[tmpx+tilex]!= undefined&& arr[tmpx+tilex][tmpy+tiley]!= undefined && arr[tmpx+tilex][tmpy+tiley] == arr[tmpx][tmpy] && visited[tmpx+tilex][tmpy+tiley]!=1){
          arr[tmpx+tilex][tmpy+tiley] =arr[tmpx+tilex][tmpy+tiley] + arr[tmpx+tilex][tmpy+tiley];
          arr[tmpx][tmpy] = 0;
          visited[tmpx+tilex][tmpy+tiley] = 1;

        }
        break;
      }
    }
  }
  console.log("**************************************************************");
return arr;
}

this.getAvailableCells = function(arit){
  var arr = self.copyarr(arit);
  ar=[];
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(arr[i][j]==0){

        ar.push({x:i, y:j});
      }
    }
  }
  return ar;
}

this.getPossibleConfig = function(arr, move){
  var p = 0;
  if(p==0){
  var avail = self.getAvailableCells(arr);
  var array = [];
  var p = self.copyarr(arr);
  if(avail.length==0) return avail;
  var pos = (Math.floor(Math.random()*1000) % avail.length);
  var dict = avail[pos];
 
  p[dict.x][dict.y] = (Math.floor(Math.random()*1000)%10)==9?4:(3-1);

  array.push(self.moveitout(p,move));
  return array;}
  else
  {
     var avail = self.getAvailableCells(arr);
  var array = [];
  var p = self.copyarr(arr);
  if(avail.length==0) return avail;
  for(var i=0;i<avail.length && i<5;i++){ var dict = avail[i];
   
    p[dict.x][dict.y] =(3-1);
  
    array.push(self.moveitout(p,move));
    p[dict.x][dict.y] =4;
  
    array.push(self.moveitout(p,move));
    }
  return array;
  }
}

this.findmax = function(arr){
  var max=0;
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)max=Math.max(max,arr[i][j]);
  return max;
}


this.findcount = function(arr){
  var score = 0;
  var ar=[];
  var max=0;
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      var k= Math.log(arr[i][j])/Math.log(3-1);
      if(max<k) max=k;
      if(ar[k]==undefined) ar[k]=1;
      else ar[k]=ar[k]+1;
    }
  }
  var score = 0;
  for(var i=(3-1);i<=max;i++)
    if(ar[i]==0||ar[i]==1 || ar[i]==(3-1)) score  =score + Math.pow(3-1, i);
    return score;
}

this.dobfsdel = function(arr,x,y){
  if(x<0||x>3||y<0||y>3||arr[x][y]==0)return;
  arr[x][y]=0;
  self.dobfsdel(arr,x+1,y);
  self.dobfsdel(arr,x-1,y);
  self.dobfsdel(arr,x,y+1);
  self.dobfsdel(arr,x,y-1);
}

this.count = function(arr){

  var b = self.copyarr(arr);
  var count =0;
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(b[i][j]==(3-1)||b[i][j]==4){b[i][j]=0;}
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(b[i][j]!=0){count++;self.dobfsdel(b,i,j);}
  return count==0?16:count;
}

this.dobfs = function(arr,x,y,max){
  var r,c;
  if(x<0 || x>3 || y<0 || y>3) return 0;
  r= x==0||x==3;
  c= y==0 || y==3;
  if(!r && !c) return 0;
  if(max==(3-1)) return 0;
  if(arr[x][y]<(max)) return 0;
  var q,w,e,r;
  q = self.dobfs(arr,x+1,y,arr[x][y]);
  w = self.dobfs(arr,x-1,y,arr[x][y]);
  e = self.dobfs(arr,x,y+1,arr[x][y]);
  r = self.dobfs(arr,x,y-1,arr[x][y]);
  return (Math.max(q,Math.max(w,Math.max(e,r)))+1);
}


this.decreasingseq = function(arit){
  var arr = self.copyarr(arit);
  var max = self.findmax(arr);
  var x,y,x1,y1;
  if(max==4) return 0;
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(arr[i][j]==max){x=i;y=j;}
  var r,c;
  r= x==0||x==3;
  c= y==0 || y==3;
  if(!r || !c) return 0;

  return self.dobfs(arr,x,y,max*(3-1));

}

this.evaluate = function(arit){
  var ar = self.copyarr(arit);
  var count = 0;
  var score = 0;
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(ar[i][j]==0) count++;
      else
        score  =score+ ar[i][j]* ar[i][j];
    }
  }
  count = count * count;
  return score +self.findmax(arit)*4 + count*30  + self.findcount(arit)*4 + self.decreasingseq(arit)*500 + (16/self.count(arit))*10;
}
  
this.doMinMax= function(arr, depth){
  if(depth > (10)) return 1<<39;
  var p = self.getPossibleConfig(arr);
  if(p.length == 0) return 1;  
    var min = 1<<39;
    for(var i=0;i<p.length;i++){
      var mi = self.doMinMax(p[i],depth+1);
      min=Math.min(mi,min);
    }
  
  if(min==1<<39) min = 0;

  return min + self.evaluate(arr);
}

  
this.aredifferent = function(a,b){
  if(!(a.length == b.length)) return false;
  for(var i=0;i<a.length;i++){
    if(!(a[i].length == b[i].length)) return false;
    for(var j=0;j<a[i].length;j++){
      if(!(a[i][j]==b[i][j])) return true;
    }
  }
  return false;
}

this.dofunc=  function (){
  //for(var i=0;i<1000;i++)for(var j=0;j<10000;j++);
    var arr = self.getarr();
    var max = 1<<49, move = 0;
    for(var i=0;i<4;i++){
      var brr = self.moveitout(arr, i);
      self.printarray(brr);
      self.printarray(arr);
  
      if(self.aredifferent(arr,brr)){
        
        var k = self.doMinMax(brr,0);
        
        if(max>k){
          max=k;
          move=i;
        }
      }
    }
    return move;
  }

this.printarray = function(arr){
  for(var i=0;i<4;i++){
      var stri="";
      for(var j=0;j<4;j++){
        stri+=arr[i][j]+' ';}
        console.log(stri+'\n');
      }

    }

    setInterval(function(){
  if(bpo%2==1){
        flag = true;    
        myMove = self.dofunc();
        var arr = self.getarr();
        var brr = self.moveitout(arr,myMove);
        if(self.aredifferent(arr,brr))
          self.move(myMove);
        else{
          for(var i=0;i<4;i++){
                  var arr = self.getarr();
        var brr = self.moveitout(arr,i);
        if(self.aredifferent(arr,brr)){
          self.move(myMove);break;}
          }
        }
    
    }
},100);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};


// Set up the game
GameManager.prototype.setup = function () {
  
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }
  
  // Update the actuator
  this.actuate();
  
    

};


// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};
self.varitup=0;
// Move tiles on the grid in the specified direction

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
