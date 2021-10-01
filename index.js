"use strict";
/* eslint-disable no-var, prefer-rest-params, init-declarations, unicorn/prefer-negative-index, prefer-spread, vars-on-top, no-throw-literal, unicorn/prefer-reflect-apply */

// Original inspiration: https://github.com/creationix/step
function tiptoe()
{
	var originError = new Error();	// eslint-disable-line unicorn/error-message
	var steps = Array.prototype.slice.call(arguments),
		pending, counter, results, lock, captureErrors, curStep, lastStep;

	// Define the main callback that's given as 'this' to the steps.
	// Make sure I never "return" any thing from this function here in tiptoe as that would mess all sorts of stuff up when folks call return this();
	function next()
	{
		var args = Array.prototype.slice.call(arguments);

		counter = pending = 0;

		// Check if there are no steps left
		if(steps.length===0)
		{
			// Throw errors
			if(args[0])
				throw {err : args[0], origin : originError, curLoc : new Error("tiptoe uncaught error at final step")};

			return;
		}

		// If we are not capturing errors, then if we have an error skip to the last step. Otherwise we continue along (but don't pass an error parameter as first arg)
		if(!captureErrors)
		{
			if(args[0])
			{
				// Let's embed some helpful meta info about where this error took place into the error arg. Don't do this when capturing errors, because then they are expected and we don't want to pollute it
				if(typeof args[0]==="object")
				{
					args[0]._tiptoeRemainingSteps = steps.map(step => step.name);
					args[0]._tiptoeOrigin = originError;
					//args[0]._tiptoeLoc = new Error();
				}
				steps = steps.slice(steps.length-1);
			}
			else if(steps.length>1)
			{
				args = args.slice(1);
			}
		}

		captureErrors = false;

		// Get the next step to execute
		if(curStep)
			lastStep = curStep;
		curStep = steps.shift();
		if(!curStep)
			throw new Error(`noCurStep [${curStep}] at origin: ${originError.message}`);
		
		results = [];

		var result;

		// Run the next step in a try..catch block so exceptions don't get out of hand.
		try
		{
			lock = true;
			captureErrors = false;
			result = curStep.apply(next, args);
		}
		catch(err)
		{
			// Pass any exceptions on through the next callback
			next(err);

			// WARNING: What about the rest of the code after this catch? Am I not calling next() twice? test-error-capture.js seems to show things are ok?
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
	next.parallel = function parallel(noerrarg)
	{
		var index = 1 + counter++;
		pending++;

		return function parallelReturn()
		{
			pending--;

			// Compress the error from any result to the first argument
			if(!noerrarg && arguments[0])
				results[0] = arguments[0];

			// Send the other results as arguments
			results[index] = arguments.length>(noerrarg ? 1 : 2) ? Array.prototype.slice.call(arguments, (noerrarg ? 0 : 1)) : arguments[(noerrarg ? 0 : 1)];

			// When all parallel branches are done, call the callback
			if(!lock && pending===0)
				next.apply(null, results);
		};
	};

	next.capture = function capture()
	{
		captureErrors = true;
	};

	next.data = {};

	next.exit = function exit()
	{
		steps = [];
	};

	next.finish = function finish()
	{
		steps = steps.slice(steps.length-1);
		next.apply(null, arguments);
	};

	// Will jump to a given step offset. Use negative numbers to jump backwards from the last step
	next.jump = function jump(offset)
	{
		if(offset===0)
			throw new Error(`Invalid tiptoe.jump(offset) of: ${offset}`);
			
		steps = steps.slice(offset>0 ? offset-1 : offset+-1);
		next.apply(null, Array.prototype.slice.call(arguments, 1));
	};

	next.back = function back()
	{
		steps = [lastStep, curStep, ...steps];
		next.apply(null, arguments);
	};

	// Start the engine and pass nothing to the first step
	next();
}

if(typeof module!=="undefined" && "exports" in module)
	module.exports = tiptoe;
