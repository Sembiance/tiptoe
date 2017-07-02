# tiptoe

Yet another node async control flow library for handling callbacks. This one was forked from <a href="https://github.com/creationix/step">step</a> and then modified a bit.

## How to install

npm install tiptoe

## How to use

	var tiptoe = require("tiptoe"),
		fs = require("fs");

	tiptoe(
		function readSelf() {
			fs.readFile(__filename, "utf8", this);
		},
		function capitalize(selfText) {
			return selfText.toUpperCase();
		},
		function showIt(err, newText) {
			if(err)
			{
				console.error(err);
				process.exit(1);
			}

			console.log(newText);
			process.exit(0);
		}
	);

tiptoe will execute each function, in serial sequence, one after the other.

You use `this` as the callback to any asynchronous functions you call.

You can also use run calls in parallel:

	var tiptoe = require("tiptoe"),
		fs = require("fs");

	tiptoe(
		function loadStuff() {
			fs.readFile(__filename, "utf8", this.parallel());
			fs.readFile("/etc/passwd", "utf8", this.parallel());
		},
		function saveToTmp(selfText, passwd) {
			fs.writeFile("/tmp/selfText", selfText, "utf8", this.parallel());
			fs.writeFile("/tmp/passwd", passwd, "utf8", this.parallel());
		},
		function finish(err) {
			if(err)
			{
				console.error(err);
				process.exit(1);
			}

			console.log("Done!");
			process.exit(0);
		}
	);

The results from the parallel callbacks will be passed to the next function in the chain, in the order the parallel calls were first created (not the order the parallel callbacks were called in).

If a parallel callback returns more than 1 argument, the corresponding argument to the next function will be an array of arguments.

You can also save data for use in later functions by using the `this.data` object:

	var tiptoe = require("tiptoe"),
		fs = require("fs");

	tiptoe(
		function loadSelf() {
			fs.readFile(__filename, "utf8", this);
		},
		function saveToTmp(selfText) {
			this.data.selfText = selfText;

			fs.readFile("/etc/passwd", "utf8", this);
		},
		function finish(err, passwd) {
			if(err)
			{
				console.error(err);
				process.exit(1);
			}

			console.log("Self text: %s", this.data.selfText);
			console.log("passwd: %s", passwd);

			process.exit(0);
		}
	);

To skip all remaining function steps, call `this.exit()`

To skip to the last function step, call `this.finish()`. Any arguments you pass (including error as argument 1) will be passed into the last function call.

To go back to the previous step instead of the next one, call `this.back()`. Any arguments you pass (including error as argument 1) will be passed into the previous function call.

## Error Handling

In my experience any errors encountered along the way are fatal and you don't want to do the remaning functions.

If an error is thrown or the `this` callback or a `this.parallel()` callback receives an error (as the first argument, node standard behavior) then all remaining functions will be skipped except for the last function.

Thus the last method will always receive a first argument that may contain an error.

If you want to handle errors that occur from one function in the next function, you can call `this.capture()` and the next step will receive a possible error as the first argument.

## Why not just use step?

I've been using step for many years now. It's absolutely awesome!

I just noticed that 99% of the time I was just doing `if(err) throw err;` at the beginning of every function.

Except for the last one, where I would actually handle any errors that took place.

So tiptoe has that behavior now by default.

Also with step, since I was just throwing errors from one function to the next, you never knew if the error you got was from the exact preceding function or from an earlier function.

This made it difficult to actually recover from errors that you COULD recover from, because you didn't know where they came from.

tiptoe also handles that with the `this.capture()` feature.

step also threw away extra arguments from parallel callbacks, where as tiptoe will keep these and pass them as an array.

Also I added the `this.data` `this.exit()` and `this.finish()` features.

Lastly, I removed the step.fn() functionality. I personally never used it.

So tiptoe is the next evolution of step in my opinion. Still very basic and simple, but with just a little but more power while requiring a bit less code.
