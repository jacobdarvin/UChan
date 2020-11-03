// Import
const express 	= require('express');
const fs 		= require('fs');
const hbs 		= require('hbs');
const mongoose 	= require('mongoose');
const path 		= require('path');

const app 		= express();

app.get('/', function (req, res) {
	res.render('index', {
		title: 'UChan',
	});
});

module.exports = app;