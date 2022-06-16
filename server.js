var path = require('path') 
var express = require('express') 
var exphbs = require('express-handlebars')

var port = process.env.PORT || 3000 
var app = express() 

app.engine('handlebars', exphbs.engine({defaultLayout: 'mainlayout'})) 
app.set('view engine', 'handlebars')
//set it to use main handlebars then anything you render will be inside of the {{{body}}}

//serves the index template
app.use(express.static('public')) 

var grid = require('./grid.json')

app.get('/', function(req, res, next){
    res.status(200).render('main')
})

app.listen(port, function () {
	console.log("== Server is listening on port " + port) 
})