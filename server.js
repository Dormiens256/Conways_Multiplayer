var fs = require('fs')
var path = require('path') 
var express = require('express') 
var exphbs = require('express-handlebars')
var WebSocket = require('ws')

var port = process.env.PORT || 3000 
var app = express() 

app.engine('handlebars', exphbs.engine({defaultLayout: 'mainlayout'})) 
app.set('view engine', 'handlebars')


app.use(express.static('public')) 
const { stringify } = require('querystring')


//start server + create websocket server
var server = app.listen(port, function () {
	console.log("== Server is listening on port " + port) 
})
const wss = new WebSocket.Server({ server:server })

//grab the grid from the json and put it into an object
var JSONgrid = require('./grid.json')
var JSONcolors = require('./color.json')
const { count } = require('console')
var gridobject = {
    type: 0,
    grid: JSONgrid,
    color: JSONcolors
}

wss.on('connection', function connection(ws){
    ws.send(JSON.stringify(gridobject))

    ws.on('message', function incoming(data){
        object = JSON.parse(data)
        console.log(object)
        //upon recieving a change to the graph implements the change and send it to the other clients. 
        gridobject.grid[object.x][object.y] = 1
        gridobject.color[object.x][object.y] = object.color
        wss.clients.forEach(function(client){
            if (client !== ws && client.readyState === WebSocket.OPEN){
                client.send(data)
            }
        })

    })
})


app.get('/', function(req, res, next){
    res.status(200).render('main')
})


//sets life to update and send to client every 5 seconds
let timerID = setInterval((() => iterateConway(gridobject)), 2000)


//followning two functions are what iterate to the next step of conway
function iterateConway(gridobject){
    
    var grid2 = Array(30)
    var color2 = Array(30)
    for(var i = 0; i < 30; i++){
        grid2[i] = Array(75).fill(0)
        color2[i] = Array(75).fill(0)
    }
    
    for(var i = 0; i < 30; i++){
        for(var j = 0; j < 75; j++){
            cur = checkSquares(gridobject.grid,gridobject.color, i, j)
            if(cur !== -1){
                grid2[i][j] = 1
                color2[i][j] = cur
            }else{
                grid2[i][j] = 0
            }
        }
    }
    gridobject.grid = grid2
    fs.writeFile('./grid.json', JSON.stringify(grid2, null, 2),function (err) {
        if (!err) {
          console.log(gridobject.grid) 
    }})

    gridobject.color = color2
    fs.writeFile('./color.json', JSON.stringify(color2, null, 2),function (err) {
        if (!err) {
          console.log(gridobject.color) 
    }})
    

    message = JSON.stringify(gridobject)
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            client.send(message)
        }
    })


   
}

function checkSquares(grid,color, x, y){
    var count = 0
    var curcolor = 0
    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            if(grid[(((i + x)%30)+30)%30][(((j + y)%75)+75)%75] === 1){      //all the extra maths here is just modulo
                curcolor += color[(((i + x)%30)+30)%30][(((j + y)%75)+75)%75]
                if(i !== 0 || j !== 0){
                    count++
                }
            }
        }
    }
    if(grid[x][y] === 1){
        curcolor /= count + 1
    }else{
        curcolor /= count
    }
    curcolor = Math.floor(curcolor%360)
    if(count === 3){
        return curcolor
    }else if(grid[x][y] === 1 && count === 2){
        return curcolor
    }else{
        return -1
    }
}

