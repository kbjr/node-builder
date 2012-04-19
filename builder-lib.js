/**
 * Library for defining build instructions
 */

var path = require('path');
var basePath = path.dirname(module.parent.filename);
var jsBasePath = null;
var cssBasePath = null;

var instructions = [ ];

exports.getInstructions = function() {
	return instructions;
};

// ------------------------------------------------------------------
//  JS

exports.JS = function(files) {
	files = Array.isArray(files) ? files : [files];
	var inst = instructions[instructions.length] = {
		type: 'js',
		input: files.map(function(file) {
			return path.join((jsBasePath || basePath), file);
		}),
		output: null,
		minify: false
	};
	return {
		outputTo: function(output) {
			inst.output = path.join((jsBasePath || basePath), output);
		},
		minifyTo: function(output) {
			inst.minify = true;
			inst.output = path.join((jsBasePath || basePath), output);
		}
	};
};

exports.JS.setBasePath = function(basepath) {
	jsBasePath = basepath;
};

// ------------------------------------------------------------------
//  CSS

exports.CSS = function(files) {
	files = Array.isArray(files) ? files : [files];
	var inst = instructions[instructions.length] = {
		type: 'css',
		input: files.map(function(file) {
			return path.join((cssBasePath || basePath), file);
		}),
		output: null,
		minify: false
	};
	return {
		outputTo: function(output) {
			inst.output = path.join((cssBasePath || basePath), output);
		},
		minifyTo: function(output) {
			inst.minify = true;
			inst.output = path.join((cssBasePath || basePath), output);
		}
	};
};

exports.CSS.setBasePath = function(basepath) {
	cssBasePath = basepath;
};

/* End of file builder-lib.js */
