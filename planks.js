// Length = 488
// Width: 35 boards
var numBoards = Math.ceil(197 / 5.75);
var replace = [
  { quantity: 2 * numBoards, length: 192 },
  { quantity: numBoards, length: 488 - (2 * 192) },
];

var extend = [
  { quantity: 1, length: 38 },  // angle
  { quantity: 1, length: 49 },  // angle
  { quantity: 1, length: 39 },  // angle
  { quantity: 1, length: 61 },  // angle
  { quantity: 1, length: 39 },  // angle
  { quantity: 1, length: 56 },  // angle
  { quantity: 1, length: 50 },
  { quantity: 5, length: 79 },
  { quantity: 1, length: 110 },
  { quantity: 5, length: 62 },
  { quantity: 4, length: 50 },
  { quantity: 2, length: 94 },
  { quantity: 1, length: 143 },
];

var crossover = [
  { quantity: 1, length: 122 },
  { quantity: 1, length: 192 }, { quantity: 1, length: 62 },
  { quantity: 1, length: 126 },
  { quantity: 6, length: 192 }, { quantity: 3, length: 104 },
  { quantity: 1, length: 192 }, { quantity: 1, length: 111 },
  { quantity: 2, length: 103 },
  { quantity: 1, length: 174 },
];

// After cockup
var crossover = [
  { quantity: 1, length: 122 },
  { quantity: 1, length: 192 }, { quantity: 1, length: 62 },
  { quantity: 1, length: 126 },
  { quantity: 3, length: 192 }, { quantity: 3, length: 190 }, { quantity: 3, length: 106 },
  { quantity: 1, length: 192 }, { quantity: 1, length: 111 },  // TODO: Check can use full 196
  { quantity: 1, length: 120 }, { quantity: 1, length: 86 },
  { quantity: 1, length: 174 },
];

var repair = [
  { quantity: 1, length: 81 },
  { quantity: 1, length: 144 },
  { quantity: 1, length: 171 },
  { quantity: 1, length: 187 },
  { quantity: 5, length: 192 },
];

var edges = [
  { quantity: 1, length: 52 },
  { quantity: 1, length: 67 },
  { quantity: 1, length: 35 },
  { quantity: 1, length: 70 },
  { quantity: 1, length: 149 },
];

var data = [].concat(replace, edges);
var data = [].concat(extend, repair, crossover, edges);
var data = [].concat(extend, repair, crossover);
//var data = [].concat(edges)

var stock = [
  // { length: 96, cost: 12.72, quantity: Infinity },   //  8
  { length: 120, cost: 15.90, quantity: Infinity },  // 10
  { length: 144, cost: 19.03, quantity: Infinity },  // 12
  // { length: 168, cost: 22.20, quantity: Infinity },  // 14
  { length: 192, cost: 25.25, quantity: Infinity },  // 16
];

// Afer cockup
var stock = [
  { length: 120, cost: 15.90, quantity: Infinity },  // 10
  { length: 144, cost: 19.03, quantity: Infinity },  // 12
  { length: 192, cost: 25.25, quantity: Infinity },  // 16
  { cost: 1, quantity: 1, length: 38 },
  { cost: 1, quantity: 1, length: 50 },
  { cost: 1, quantity: 1, length: 104 },
  { cost: 1, quantity: 1, length: 39 },
  { cost: 1, quantity: 1, length: 49 },
  { cost: 1, quantity: 1, length: 104 },
  { cost: 1, quantity: 1, length: 39 },
  { cost: 1, quantity: 1, length: 50 },
  { cost: 1, quantity: 1, length: 103 },
  { cost: 1, quantity: 1, length: 50 },
  { cost: 1, quantity: 1, length: 61 },
  { cost: 1, quantity: 1, length: 81 },
  { cost: 1, quantity: 1, length: 79 },
  { cost: 1, quantity: 1, length: 192-111 },
  { cost: 1, quantity: 1, length: 79 },
  { cost: 1, quantity: 1, length: 192-110 },
  { cost: 1, quantity: 1, length: 62 },
  { cost: 1, quantity: 1, length: 192-126 },
  { cost: 1, quantity: 1, length: 62 },
  { cost: 1, quantity: 1, length: 192-122 },
];

var planks = [];
data.forEach(function(e) {
  var length = e.length;
  for (var i = 0; i < e.quantity; ++i) {
    planks.push(length);
  }
});

function Stack(x) {
  this.x_ = x ? x : [];
}

Stack.prototype.peek = function() {
  return this.x_[this.x_.length - 1];
};

Stack.prototype.pop = function() {
  var val = this.peek();
  this.x_.length = this.x_.length - 1;
  return val;
};

Stack.prototype.push = function(x) {
  this.x_.push(x);
};

Stack.prototype.isEmpty = function() {
  return this.x_.length === 0;
};

Stack.prototype.toString = function(x) {
  return '[' + this.x_ + ']';
};

Stack.prototype.asArray = function(x) {
  return this.x_.slice();
};

// Returns the indices of the best planks, in ascending order.
// Assumes planks is sorted in order of increasing length.
function getBestPlanks(targetLength, planks) {
  console.assert(targetLength >= 0);

  var nextIndex = 0;

  var selectedIndices = new Stack();
  var currentLength = 0;

  var bestIndices = [];
  var bestLength = 0;

  while (true) {

    // Keep adding planks until the target length is exceeded or we run out of planks.
    while (nextIndex < planks.length) {
      var nextLength = planks[nextIndex];
      if (currentLength + nextLength > targetLength) {
        // No later planks will fit because input is sorted.
        //console.log('Would exceed target length ' + targetLength + ' with selected indices ' + selectedIndices.toString() + ' and current length ' + currentLength + ' with next index ' + nextIndex + ' and next length ' + nextLength);
        break;
      }
      selectedIndices.push(nextIndex);
      currentLength += nextLength;
      //console.log('Added index ' + nextIndex + ', selected indices is now ' + selectedIndices.toString() + ' and current length is ' + currentLength);
      ++nextIndex;
    }

    // See if this is a better solution. If we didn't add any planks above, we know this is not an improvement, but this
    // isn't worth checking for.
    //console.log('Testing indices ' + selectedIndices.toString() + ' and current length ' + currentLength);
    if (currentLength > bestLength) {
      //console.log('New best ' + selectedIndices.toString() + ' and current length ' + currentLength);
      bestLength = currentLength;
      bestIndices = selectedIndices.asArray();
    }

    // Termination condition.
    if (selectedIndices.isEmpty()) {
      return bestIndices;
    }

    // Remove the last plank and try again.
    currentLength -= planks[selectedIndices.peek()];
    nextIndex = selectedIndices.pop() + 1;
    //console.log('Looping with indices ' + selectedIndices.toString() + ' and current length ' + currentLength + ' and next index ' + nextIndex);
  }

  console.assert(false);
}

function numericSorter(a, b) {
  return a - b;
}

// stock is a list of (length, cost, quantity) tuples, planks is a list of lengths
function getBestStock(stock, planks) {

  planks.sort(numericSorter);

  var chosenStock = {};

  // TODO: Do not modify stock!
  for (var i = 0; i < stock.length; ++i) {
    stock[i].remainingQuantity = stock[i].quantity;
  }

  while (planks.length > 0) {
    var bestPlankIndices = null;
    var bestStock = null;
    var bestCostPerUnitLength = Infinity;
    for (var i = 0; i < stock.length; ++i) {
      if (stock[i].remainingQuantity <= 0) {
        continue;
      }
      var plankIndices = getBestPlanks(stock[i].length, planks);
      var costPerUnitLength = stock[i].cost / plankIndices.map(function(index) {
        return planks[index];
      }).reduce(function(a, b) {
        return a + b;
      }, 0);
      //console.log('Got plank lengths ' + plankIndices.map(function(i) { return planks[i]; }) + ' for stock length ' + stock[i].length + ' with cost per unit length ' + costPerUnitLength);
      if (costPerUnitLength < bestCostPerUnitLength) {
        bestPlankIndices = plankIndices;
        bestCostPerUnitLength = costPerUnitLength;
        bestStock = stock[i];
      }
    }
    console.log('Got best plank lengths ' + bestPlankIndices.map(function(i) { return planks[i]; }) + ' for stock length ' + bestStock.length + ' with cost per unit length ' + bestCostPerUnitLength);

    bestPlankIndices.reverse().forEach(function(i) {
      planks.splice(i, 1);
    });

    if (chosenStock[bestStock.length] === undefined) {
      chosenStock[bestStock.length] = { stock: bestStock, count: 0};
    }
    chosenStock[bestStock.length].count += 1;
    bestStock.remainingQuantity -= 1;
  }
  return Object.getOwnPropertyNames(chosenStock).map(function(length) {
    return chosenStock[length];
  });
}

var stock = getBestStock(stock, planks);
var cost = stock.map(function(x) {
  return x.stock.cost * x.count;
}).reduce(function(a, b) {
  return a + b;
}, 0);
stock.forEach(function(x) {
  console.log(x.count + ' No. ' + x.stock.length + '"');
});
console.log('$' + cost);
