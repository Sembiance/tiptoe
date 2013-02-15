"use strict";

// Mostly copied from creatix step (https://github.com/creationix/step)
function tiptoe()
{
	var steps = Array.prototype.slice.call(arguments),
		pending, counter, results, lock, captureErrors;

	// Define the main callback that's given as 'this' to the steps.
	function next()
	{
		var args = Array.prototype.slice.call(arguments);

		counter = pending = 0;

		// Check if there are no steps left
		if(steps.length===0)
		{
			// Throw errors
			if(args[0])
				throw args[0];

			return;
		}

		// If we are not capturing errors, then if we have an error skip to the last step. Otherwise we continue along (but don't pass an error parameter as first arg)
		if(!captureErrors)
		{
			if(args[0])
				steps = steps.slice(steps.length-1);
			else if(steps.length>1)
				args = args.slice(1);
		}

		captureErrors = false;

		// Get the next step to execute
		var nextStep = steps.shift();
		results = [];

		var result;

		// Run the next step in a try..catch block so exceptions don't get out of hand.
		try
		{
			lock = true;
			captureErrors = false;
			result = nextStep.apply(next, args);
		}
		catch(e)
		{
			// Pass any exceptions on through the next callback
			next(e);
		}

		if(counter>0 && pending===0)
		{
			// If parallel() was called, and all parallel branches executed synchronously, go on to the next step immediately.
			next.apply(null, results);
		}
		else if(result!==undefined)
		{
			// If a synchronous return is used, pass it to the callback
			next(undefined, result);
		}

		lock = false;
	}

	// Add a special callback generator 'this.parallel()' that groups stuff.
	next.parallel = function()
	{
		var index = 1 + counter++;
		pending++;

		return function() {
			pending--;

			// Compress the error from any result to the first argument
			if(arguments[0])
				results[0] = arguments[0];

			// Send the other results as arguments
			results[index] = arguments.length>2 ? Array.prototype.slice.call(arguments, 1) : arguments[1];

			// When all parallel branches are done, call the callback
			if(!lock && pending===0)
				next.apply(null, results);
		};
	};

	next.capture = function()
	{
		captureErrors = true;
	};

	next.data = {};

	next.exit = function()
	{
		steps = [];
	};

	// Start the engine and pass nothing to the first step
	next();
}

// Tack on leading and tailing steps for input and output and return the whole thing as a function.  Basically turns step calls into function factories.
tiptoe.fn = function tiptoefn()
{
	var steps = Array.prototype.slice.call(arguments);

	return function() {
		var args = Array.prototype.slice.call(arguments);

		// Insert a first step that primes the data stream
		var toRun = [function() { this.apply(null, args); }].concat(steps);

		// If the last arg is a function add it as a last step
		if(typeof args[args.length-1]==="function")
			toRun.push(args.pop());

		tiptoe.apply(null, toRun);
	};
};

module.exports = tiptoe;
