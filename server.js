var fs = require('fs')
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
var JSONgrid = require('./grid.json')
var gridobject = {
  grid: JSONgrid
}

const { stringify } = require('querystring')
app.get('/', function(req, res, next){
    res.status(200).render('main')
})

app.listen(port, function () {
	console.log("== Server is listening on port " + port) 
})

let timerID = setInterval((() => iterateConway(gridobject)), 5000)

function iterateConway(gridobject){
    
    var grid2 = Array(30)
    for(var i = 0; i < 30; i++){
        grid2[i] = Array(75).fill(0)
    }
    
    for(var i = 0; i < 30; i++){
        for(var j = 0; j < 75; j++){
            grid2[i][j] = checkSquares(gridobject.grid, i, j)
        }
    }
    gridobject.grid = grid2
    fs.writeFile('./grid.json', JSON.stringify(grid2, null, 2),function (err) {
        if (!err) {
          
        } else {
          
        }})
    console.log(gridobject.grid)

   
}

function checkSquares(grid, x, y){
    count = 0

    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            if(i !== 0 || j !== 0){
                if(grid[(((i + x)%30)+30)%30][(((j + y)%75)+75)%75] === 1){
                    count++
                }
            }
        }
    }
    if(count === 3){
        return 1
    }else if(grid[x][y] === 1 && count === 2){
        return 1
    }else{
        return 0
    }
}