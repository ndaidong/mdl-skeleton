#!/usr/bin/env node
var builder = require('./builder');

var config = require('../configs');
builder.reset(config);
