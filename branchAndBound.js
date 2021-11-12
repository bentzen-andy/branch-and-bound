class TrainSorter {
  constructor(incomingCars) {
    this.stopEvaluating = false;
    this.minNumDiscardedCars = Number.MAX_VALUE;
    this.numCars = incomingCars[0];
    this.incomingCars = [...incomingCars];
    this.incomingCars.shift();
    this.permutations = [];
    this.longestPath = 0;
  }

  // ==========================================
  // public interface
  // ------------------------------------------
  sort() {
    // get a list of permutations of valid train car orders
    this.dfs(1, [this.incomingCars[0]], this.incomingCars);

    // the algorithm should produce a fairly short list of valid permutations.
    // find the longest permutation and return its length.
    this.longestPath = this.permutations.reduce((max, curr) => {
      return Math.max(max, curr.length);
    }, 0);

    // Debugging
    // let longestPath;
    // let longestPathLength;
    // longestPathLength = this.permutations.reduce((max, curr) => {
    //   longestPath = curr.length > max ? curr : longestPath;
    //   return Math.max(max, curr.length);
    // }, 0);
    // console.log(`optimal path: ${longestPath}`);
    // console.log(longestPathLength);
  }

  getLongestPath() {
    return this.longestPath;
  }

  // ================================================
  // helper functions (only to be used within class)
  // ------------------------------------------------

  /**
   * main depth-first search function to create the search tree
   * @param {number} i The counter that tracks the item in incomingCars that's currently being evaluated.
   * @param {Array} currPath The current list of train cars that the algorithm is building.
   * @param {Array} incomingCars The array of incoming train cars. Some are already evaluated and some are yet to be evaluated (depending on where the counter variable is pointing).
   * @returns Void. This algorithm instead adds its result to the permutations array as a side effect.
   */
  dfs(i, currPath, incomingCars) {
    // stop evaluating altogether if the optimal solution was found.
    if (this.stopEvaluating) return;

    // stop evaluating this branch if the permutation contains any unsorted elements.
    // the solution must be sorted to be a valid solution.
    if (!this.isSorted(currPath)) return;

    // must check if solution is sorted prior to this check
    this.checkOptimalSolution(currPath);

    // stop evaluating this branch if we have discarded too many train cars
    // the optimal solution is the one that maintains sorted order while also
    // retaining as many train cars as possible.
    if (this.isWorseThanBestSolutionSoFar(i, currPath)) return;

    // base case
    // when the pointer gets to the end of the array, add the permutation to the list.
    if (i === this.numCars) {
      this.permutations.push(currPath);
      // console.log(currPath);
      // sets a global variable to keep track of whether we've discarded too many train cars.
      this.updateNumDiscardedCars(currPath);
      return;
    }

    // add this element to the FRONT of the array and continue down that branch
    this.dfs(i + 1, [incomingCars[i], ...currPath], incomingCars);

    // add this element to the BACK of the array and continue down that branch
    this.dfs(i + 1, [...currPath, incomingCars[i]], incomingCars);

    // SKIP this element altogether and continue down that branch
    this.dfs(i + 1, [...currPath], incomingCars);
  }

  // simple check: function checks for if the array is in sorted order.
  // returns true if arr is sorted in descending order.
  isSorted(arr) {
    let isSorted = true;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < arr[i + 1]) {
        isSorted = false;
        break;
      }
    }
    return isSorted;
  }

  // checks if an obviously optimal solution has been found or the train car problem
  // an obviously optimal solution is one where all the train cars are used.
  // warning: this function assumes that currPath is already in sorted order.
  // if an optimal solution is found, this function sets a global flag to
  // true--signaling the algorithm to quit evaluating any further.
  checkOptimalSolution(currPath) {
    if (currPath.length === this.numCars) {
      this.stopEvaluating = true;
      this.permutations.push(currPath);
    }
  }

  // checks if the algorithm can quit evaluating its current branch.
  // specifically, this function takes a look at how many train cars have been
  // discarded in the current branch, and then checks if it has discarded more
  // than that of the best known solution found so far.
  // the logic here is that if I find that a valid solution that only discards say,
  // three train cars, then I know for a fact that if a subsequent branch discards
  // four branches will be automatically ineligible. that goes for the current
  // permutation in that branch as well as any children of that branch (so you can
  // safely cut the branch short at that point).
  isWorseThanBestSolutionSoFar(counter, currPath) {
    let numDiscardedCars = counter - currPath.length;
    return numDiscardedCars > this.minNumDiscardedCars;
  }

  // updates the global value that tracks the minimum number of discarded train cars
  // for all previous solutions.
  updateNumDiscardedCars(currPath) {
    let numDiscardedCars = this.numCars - currPath.length;
    if (numDiscardedCars <= this.minNumDiscardedCars) {
      this.minNumDiscardedCars = numDiscardedCars;
    }
  }
}

// ==========================================
// testing / driver code
// ------------------------------------------

console.log("Test 1");
let input1 = [4, 4, 5, 2, 1];
let ts1 = new TrainSorter(input1);
let permutations = ts1.sort();
let solution1 = ts1.getLongestPath();
console.log(`input: ${input1}`);
console.log(`actual  : ${solution1}`);
console.log("expected: 4");
console.log();

console.log("Test 2");
let input2 = [10, 11, 5, 13, 15, 7, 1, 18, 12, 16, 17];
let ts2 = new TrainSorter(input2);
permutations = ts2.sort();
let solution2 = ts2.getLongestPath();
console.log(`input: ${input2}`);
console.log(`actual  : ${solution2}`);
console.log("expected: 7");
console.log();

console.log("Test 3");
let input3 = [
  25, 31, 19, 17, 4, 10, 37, 42, 35, 15, 43, 45, 30, 39, 9, 21, 33, 25, 3, 47,
  41, 50, 18, 11, 26, 28,
];
let ts3 = new TrainSorter(input3);
permutations = ts3.sort();
let solution3 = ts3.getLongestPath();
console.log(`input: ${input3}`);
console.log(`actual  : ${solution3}`);
console.log("expected: 12");
console.log();

console.log("Test 4");
let input4 = [10, 5, 6, 4, 7, 3, 8, 2, 9, 1, 10];
let ts4 = new TrainSorter(input4);
permutations = ts4.sort();
let solution4 = ts4.getLongestPath();
console.log(`input: ${input4}`);
console.log(`actual  : ${solution4}`);
console.log("expected: 10");
console.log();

console.log("Test 5");
let input5 = [
  50, 5, 24, 84, 58, 21, 57, 98, 51, 6, 16, 75, 95, 11, 23, 92, 85, 29, 56, 45,
  55, 73, 20, 4, 34, 76, 96, 63, 30, 93, 2, 19, 39, 14, 71, 80, 40, 69, 54, 62,
  42, 1, 10, 35, 8, 22, 70, 67, 15, 27, 38,
];
let ts5 = new TrainSorter(input5);
permutations = ts5.sort();
let solution5 = ts5.getLongestPath();
console.log(`input: ${input5}`);
console.log(`actual  : ${solution5}`);
console.log("expected: 14");
console.log();
