let board = ["","","","","","","","",""]

let xScore = 0
let oScore = 0

let gameOver = false

function draw(){

let b = document.getElementById("board")
b.innerHTML = ""

board.forEach((cell,i)=>{

let tile = document.createElement("div")
tile.className = "tile"
tile.innerText = cell

tile.onclick = ()=>playerMove(i)

b.appendChild(tile)

})

}

function playerMove(i){

if(board[i] !== "" || gameOver) return

board[i] = "X"

draw()

if(checkWinner()) return

aiMove()

draw()

checkWinner()

}

function aiMove(){

let bestScore = -Infinity
let move

for(let i=0; i<9; i++){
    if(board[i] === ""){
        board[i] = "O"
        let score = minimax(board, 0, false)
        board[i] = ""
        if(score > bestScore){
            bestScore = score
            move = i
        }
    }
}

board[move] = "O"

}

// ✅ Minimax Algorithm
function minimax(board, depth, isMaximizing){

let result = evaluate()

if(result !== null) return result

if(isMaximizing){
    let bestScore = -Infinity
    for(let i=0; i<9; i++){
        if(board[i] === ""){
            board[i] = "O"
            let score = minimax(board, depth + 1, false)
            board[i] = ""
            bestScore = Math.max(score, bestScore)
        }
    }
    return bestScore - depth   // win faster
}
else{
    let bestScore = Infinity
    for(let i=0; i<9; i++){
        if(board[i] === ""){
            board[i] = "X"
            let score = minimax(board, depth + 1, true)
            board[i] = ""
            bestScore = Math.min(score, bestScore)
        }
    }
    return bestScore + depth   // lose slower
}

}

// ✅ Evaluate board state
function evaluate(){

let win = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
]

for(let c of win){
    let [a,b,c2] = c
    if(board[a] && board[a] === board[b] && board[a] === board[c2]){
        if(board[a] === "O") return 10
        else if(board[a] === "X") return -10
    }
}

if(!board.includes("")) return 0

return null

}

function checkWinner(){

let win = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
]

for(let c of win){

let [a,b,c2] = c

if(board[a] && board[a] === board[b] && board[a] === board[c2]){

gameOver = true

highlight(a,b,c2)

if(board[a] == "X"){
xScore++
document.getElementById("xScore").innerText = xScore
}
else{
oScore++
document.getElementById("oScore").innerText = oScore
}

setTimeout(()=>{
alert(board[a] + " Wins 🎉")
restart()
},500)

return true

}

}

if(!board.includes("")){

setTimeout(()=>{
alert("Draw 🤝")
restart()
},500)

return true

}

return false

}

function highlight(a,b,c){

let tiles = document.querySelectorAll(".tile")

tiles[a].style.background = "#00ffcc"
tiles[b].style.background = "#00ffcc"
tiles[c].style.background = "#00ffcc"

}

function restart(){

board = ["","","","","","","","",""]

gameOver = false

draw()

}

draw()