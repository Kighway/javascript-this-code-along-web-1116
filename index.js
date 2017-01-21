const app = "I don't do much."

// We can create objects in JavaScript to associate values to properties, like a sandwich:
console.log("part 1")

var pbj = {
  bread: "white",
  ingredients: ["peanut butter", "jelly"],
  cut: "triangles"
}

console.log(pbj)

// We can also use a constructor function to create all kinds of sandwich objects:
console.log("part 2")

function Sandwich(bread, ingredients, cut) {
  this.bread = bread
  this.ingredients = ingredients
  this.cut = cut
}

var blt = new Sandwich("white", ["bacon","lettuce","tomato","mayo"],"rectangle")
var reuben = new Sandwich("rye", ["corned beef","sauerkraut","swiss","russian dressing"],"diagonal")

console.log(blt)
console.log(reuben)

// And we can even attach a function to an object like this:
console.log("part 3")

var pbj = {
  bread: "white",
  ingredients: ["peanut butter", "jelly"],
  cut: "triangles",
  name: "peanut butter and jelly",
  serve: function() {
    console.log("here's your " + this.name + ", enjoy!")
  }
}

console.log(pbj)
pbj.serve()

// But, what we need is a way to invoke serve with a value for THIS that we can control.
// We can use call() or apply() to invoke a function with an explicit value for this.

/* //uncomment block for part 4
console.log("part 4")

function Sandwich(bread, ingredients, name) {
  this.bread = bread;
  this.ingredients = ingredients;
  this.name = name;
}

function serve() {
  console.log("here's your " + this.name + ", enjoy!");
}

var gc = new Sandwich("white", ["cheese"], "Grilled Cheese");
var pbj = new Sandwich("wheat", ["peanut butter", "raspberry jam"], "Peanut Butter & Jelly");

serve.call(gc);
serve.call(pbj);

serve.apply(gc);
serve.apply(pbj);

*/

// a function is also an object having properties and its own methods
// so we're invoking the call() method of the serve function
// (Instead of invoking the serve() function directly)
//using call(gc) on the serve function sets THIS to our gc sandwich object
//so inside of the function, this.name knew the right sandwich

// For a simple, no argument function like serve(),
// we can use apply() interchangeably with call().
// The first argument for apply() is also always the object that we want to assign to THIS

////////////////////////////////////////////////////////////////////////////////////////

// The choice to use call or apply here is essentially down to preference.
//  They do the same things, with slightly different ways to pass arguments to the target function.

// Let's modify our serve function to be a little friendlier.
// Now, to serve () we  set THIS and pass in a customer
console.log("part 5")

//only uncomment the block for part 5

function Sandwich(bread, ingredients, name) {
  this.bread = bread;
  this.ingredients = ingredients;
  this.name = name;
}

function serve(customer) {
  console.log("Hey " + customer + ", here's your " + this.name + ", enjoy!");
}

var gc = new Sandwich("white", ["cheese"], "Grilled Cheese")
var pbj = new Sandwich("wheat", ["peanut butter", "raspberry jam"],
"Peanut Butter & Jelly")

serve.call(gc, "Terry")
serve.call(pbj, "Jesse")

serve.apply(gc, ["Terry"])
serve.apply(pbj, ["Jesse"])

function deliverFood(customer, table) {
  console.log("Delivering " + this.name + " to " + customer + " at table " + table);
}

deliverFood.call(gc, "Terry", "4")
deliverFood.apply(pbj, ["Jesse", "15"])

// APPLY works very similar to call, except that apply only takes two arguments:
// the value of THIS, and then an ARRAY of arguments to PASS to the target function

////////////////////////////////////////////////////////////////////////////////////////

// One place where apply and call get more interesting is when working with variadic functions
// or functions that take a variable number of arguments.
console.log("part 6")

function serve() {
//ARGUMENTS is an object  JavaScript provides within a function containing all arguments passed in
    if(arguments.length > 0) {       //check length of ARGUMENTS-- here we have some customers
        var customers = Array.prototype.slice.call(arguments)
        // arguments is not a true array, but  an array-like object
        // slice function  "converts" an array-like object to an array of its values
        // since arguments object as a non-array has no slice method
        // MUST go through Array.prototype to get to the slice function
        last = customers.pop();
        console.log(this.name + " for " + customers.join(", ") + " and " + last + ". Enjoy!")
    }
    else { //no customers
        console.log(this.name + ". Order up!")
    }
}

serve.call(gc)
serve.apply(pbj, ["Terry", "Tom", "Tabitha"])

/* Note Well:

FUNCTIONS have an ARGUMENTS object, and you can use the ARRAY prototype's SLICE function on it

//ARGUMENTS is an object  JavaScript provides within a function containing all arguments passed in
    if(arguments.length > 0) {       //check length of ARGUMENTS-- here we have some customers
        var customers = Array.prototype.slice.call(arguments)
        // arguments is not a true array, but  an array-like object
        // slice function  "converts" an array-like object to an array of its values
        // since arguments object as a non-array has no slice method
        // MUST go through Array.prototype to get to the slice function

        PROTOTYPE property of  object is template for NON-INSTANTIATED version
        SINCE here SLICE is on A PROTOTYPE rather than INSTANCE
        the valid owner on which it is performed is specified by CALL
*/

////////////////////////////////////////////////////////////////////////////////////////

// Function borrowing is a great way to use the functions of another object without having to explicitly write them into your object.

console.log("part 7")

function Sandwich(bread, ingredients, name) {
  this.bread = bread;
  this.ingredients = ingredients;
  this.name = name;
  this.describe = function() {
    console.log("Your " + this.name + " includes: " + this.ingredients.join(", ") + ". Yum!");
  }
}

var pbj = new Sandwich("wheat", ["chunky peanut butter", "blackberry preserves"], "PB&Jam");

pbj.describe();

var salad = {
  ingredients: ["croutons", "romaine hearts", "steak", "parmesan", "caesar dressing"],
  name: "Steak Caesar"
}

pbj.describe.call(salad)
// Sandwich.prototype.describe.call(salad)  //Answer: Sandwich isnt a class yet...
 //THIS DOESNT WORK BECAUSE IT WASNT ADDED TO THE SANDWICH PROTOTYPE (???) it looks like it is.....

/*
 This works- but  semantically very ugly - code should be communicative and clear
 nonsensical to describe a salad from a sandwich.
 goal: borrow the describe function in a way that we can call it from our salad.
 That's where bind comes in.
 */

 ////////////////////////////////////////////////////////////////////////////////////////

 // BIND is SIMILAR to call in that the first argument will be the value for this in the target function, then any arguments for the target function
 /*
  the DIFFERENCE between bind and call is in the execution
  When we use call, we execute the function immediately.
  When we use bind, we actually create a new function with that this value set, and we can execute later
  */

console.log("part 8")
 pbj.describe.bind(salad)
 var describeSalad = pbj.describe.bind(salad)
describeSalad()

// bound, saved, exected! but we're here to borrow a function and make our code read nice, so let's try something else.
//using our same Sandwich object, we're now borrowing describe from pbj using bind, and assigning it to salad as salad.describe so it can be used whenever!

salad.describe = pbj.describe.bind(salad)
salad.describe()

////////////////////////////////////////////////////////////////////////////////////////
/*
using BIND to create a new function that we can use later by passing them to functions that take time like setTimeout or setInterval, or other functions that take their time complete, is the definition of ASYNCHROSITY
*/
console.log("part 9")

function visitTable() {
  console.log("The server is visiting " + this.name + " at table number " + this.tableNumber)
}

function Customer(name, tableNumber) {
  this.name = name;
  this.tableNumber = tableNumber;
}

var sally = new Customer("Sally", "4")

var visitSally = visitTable.bind(sally)

console.log("computer is computing...")
setTimeout(visitSally, 2000);

// using bind to create new functions for each customer that comes in, setting the this for the function to that customer, and giving those functions to setTimeout to schedule table visits for each person.
