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
var gridobject = {
    type: 0,
    grid: JSONgrid
}

wss.on('connection', function connection(ws){
    ws.send(JSON.stringify(gridobject))
    ws.on('message', function message(data){
        object = JSON.parse(data)
        console.log(object)
        //upon recieving a change to the graph implements the change and send it to the other clients. 
        gridobject.grid[object.x][object.y] = 1
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
let timerID = setInterval((() => iterateConway(gridobject)), 5000)


//followning two functions are what iterate to the next step of conway
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

    message = JSON.stringify(gridobject)
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            client.send(message)
        }
    })


   
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