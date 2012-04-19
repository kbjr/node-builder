#!/usr/bin/env node

var fs        = require('fs');
var path      = require('path');
var async     = require('async');
var cssmin    = require('cssmin').cssmin;
var uglifyjs  = require('uglify-js');

var opts = {
	verbose: true,
	buildfile: 'Build.js'
};

// Parse command line arguments
var args = process.argv.slice(2);
while (args.length) {
	switch (args.shift()) {
		
		case '-h':
		case '--help':
			console.log([
				
			].join('\n'));
			process.exit(0);
		break;
		
		case '-v':
		case '--version':
			console.log(require('../package.json').version);
			process.exit(0);
		break;
		
		case '-i':
		case '--input':
			opts.buildfile = args.shift();
		break;
		
		case '--quiet':
			opts.verbose = false;
		break;
		
		case '--verbose':
			opts.verbose = true;
		break;
		
	}
}

var builder = require('../builder-lib');
require(path.resolve(opts.buildfile)).call(builder, builder);

async.mapSeries(builder.getInstructions(), function(inst, done) {
	
	// Log..
	if (opts.verbose) {
		console.log((opts.minify ? 'Minifying' : 'Concatenating') + ' ' + inst.type + ' files to ' + inst.output);
		inst.input.forEach(function(file) {
			console.log('  ' + file);
		});
	}
	
	// Read the input file(s)
	async.map(inst.input, fs.readFile, function(err, results) {
		if (err) {throw err;}
		
		// Process content
		results = results.map(String);
		switch (inst.type) {
			case 'js':
				results = results.join(';\n');
				if (inst.minify) {
					results = uglifyjs(results);
				}
			break;
			case 'css':
				results = results.join('\n');
				if (inst.minify) {
					results = cssmin(results);
				}
			break;
		}
		
		// Output the content
		fs.writeFile(inst.output, results, function(err) {
			if (err) {throw err;}
			done();
		});
		
	});
	
}, function() {
	console.log('Build complete');
});

