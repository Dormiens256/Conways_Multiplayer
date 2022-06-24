var socket = new WebSocket('ws://localhost:4000')
randomColor = Math.floor(Math.random() * 360)
var allCells = document.getElementsByClassName("cell")


for(var i = 0; i < 30; i++){
    var row = document.createElement('div')
    row.classList.add('row')                    //creating a new row div

    for(var j = 0; j < 75; j++){
        var cell = document.createElement('div')
        cell.classList.add('cell')
        row.appendChild(cell)                   //creating a cell div and adding 75 of them to the row div to create a line
    }

    gridContainer.appendChild(row)                  //adding the row that is filled with cells to the container
}    

socket.addEventListener('message', function(e){
    object = JSON.parse(e.data)
    if(object.type === 1){
        updatesquare(object)
    }else{
        updategrid(object)
    }
})


var grid = document.getElementById ('gridContainer')
grid.addEventListener ('click', squareClicked)

function squareClicked(event){
    var currentSquare = event.target
    if(!currentSquare.classList.contains('boxclicked') && currentSquare.classList.contains('cell')){
        currentSquare.classList.toggle('boxclicked')
        currentSquare.setAttribute("style", "background-color: hsl("+ randomColor + ", 50%, 50%)")
        var ind = Array.from(allCells).indexOf(currentSquare)
        message = {
            x: Math.floor(ind/75),
            y: ind % 75,
            color: randomColor,
            type: 1
        }
        if(message.x !== -1 && message.y !== -1){
            socket.send(JSON.stringify(message))
        }
        
        
    }
    
}

function updategrid(grid){
    for(var i = 0; i < 30; i++){
        for(var j = 0; j < 75; j++){
            if(allCells[(i * 75) + j].classList.contains('boxclicked') && grid.grid[i][j] === 0){
                allCells[(i * 75) + j].removeAttribute('style')
                allCells[(i * 75) + j].classList.toggle('boxclicked')
            }else if(!allCells[(i * 75) + j].classList.contains('boxclicked') && grid.grid[i][j] === 1){
                allCells[(i * 75) + j].classList.toggle('boxclicked')
                allCells[(i * 75) + j].setAttribute("style", "background-color: hsl("+ grid.color[i][j] + ", 50%, 50%)")
            }else if(grid.grid[i][j] === 1){
                allCells[(i * 75) + j].setAttribute("style", "background-color: hsl("+ grid.color[i][j] + ", 50%, 50%)")
            }
        }
    }
}

function updatesquare(square){
    var ind = (square.x * 75) + square.y
    var currentSquare = allCells[ind]
    if(!currentSquare.classList.contains('boxclicked')){
        currentSquare.classList.toggle('boxclicked')
        currentSquare.setAttribute("style", "background-color: hsl("+ square.color + ", 50%, 50%)")
        
    }
}