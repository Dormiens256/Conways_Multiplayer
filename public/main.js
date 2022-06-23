randomColor = Math.floor(Math.random() * 100)


for(var i = 0; i < 30; i++){
    var row = document.createElement('div')
    row.classList.add('row')                    //creating a new row div

    for(var j = 0; j < 75; j++){
        var cell = document.createElement('div')
        cell.classList.add('cell')
        row.appendChild(cell)                   //creating a cell div and adding 10 of them to the row div to create a line
    }

    gridContainer.appendChild(row)                  //adding the row that is filled with cells to the container
}    


var grid = document.getElementById ('gridContainer')
grid.addEventListener ('click', squareClicked)

function squareClicked(event){
    var currentSquare = event.target
    currentSquare.classList.toggle('boxclicked')
}