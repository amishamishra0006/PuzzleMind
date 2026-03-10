let board = [1,2,3,4,5,6,7,8,0];
let goal = "1,2,3,4,5,6,7,8,0";

let moves = 0;
let seconds = 0;
let timerInterval = null;

const boardDiv = document.getElementById("board");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");
const statusText = document.getElementById("status");

document.getElementById("shuffleBtn").onclick = shuffleBoard;
document.getElementById("solveBtn").onclick = solvePuzzle;
document.getElementById("resetBtn").onclick = resetGame;

function startTimer(){
    seconds = 0;
    clearInterval(timerInterval);

    timerInterval = setInterval(()=>{
        seconds++;
        timerText.innerText = seconds;
    },1000);
}

function renderBoard(){

    boardDiv.innerHTML="";

    board.forEach((val,index)=>{

        const tile=document.createElement("div");
        tile.className="tile";

        if(val===0){
            tile.classList.add("empty");
        }else{
            tile.innerText=val;
            tile.onclick=()=>moveTile(index);
        }

        boardDiv.appendChild(tile);

    });

    movesText.innerText = moves;
}

function moveTile(index){

    let empty = board.indexOf(0);

    let valid=[empty-1,empty+1,empty-3,empty+3];

    if(valid.includes(index)){

        [board[index],board[empty]]=[board[empty],board[index]];

        moves++;

        renderBoard();

        checkWin();
    }
}

function shuffleBoard(){

    do{
        board.sort(()=>Math.random()-0.5);
    }while(!isSolvable(board));

    moves=0;

    startTimer();

    statusText.innerText="Shuffled";

    renderBoard();
}

function resetGame(){

    board=[1,2,3,4,5,6,7,8,0];

    moves=0;
    seconds=0;

    clearInterval(timerInterval);

    timerText.innerText=0;
    statusText.innerText="Ready";

    renderBoard();
}

function checkWin(){

    if(board.toString()===goal){

        clearInterval(timerInterval);

        statusText.innerText="You Won 🎉";

    }
}

function isSolvable(state){

    let inv=0;

    for(let i=0;i<8;i++){
        for(let j=i+1;j<9;j++){

            if(state[i] && state[j] && state[i]>state[j]){
                inv++;
            }

        }
    }

    return inv%2===0;
}

function heuristic(state){

    let dist=0;

    state.forEach((val,i)=>{

        if(val!==0){

            let gx=Math.floor((val-1)/3);
            let gy=(val-1)%3;

            let x=Math.floor(i/3);
            let y=i%3;

            dist+=Math.abs(gx-x)+Math.abs(gy-y);

        }

    });

    return dist;
}

function getNeighbors(state){

    let neighbors=[];

    let empty=state.indexOf(0);

    let x=Math.floor(empty/3);
    let y=empty%3;

    let dirs=[[1,0],[-1,0],[0,1],[0,-1]];

    dirs.forEach(d=>{

        let nx=x+d[0];
        let ny=y+d[1];

        if(nx>=0 && nx<3 && ny>=0 && ny<3){

            let newState=state.slice();

            let newIndex=nx*3+ny;

            [newState[empty],newState[newIndex]]=
            [newState[newIndex],newState[empty]];

            neighbors.push(newState);
        }

    });

    return neighbors;
}

function solvePuzzle(){

    statusText.innerText="AI Solving...";

    let open=[];
    let visited=new Set();

    open.push({state:board.slice(),g:0,h:heuristic(board),parent:null});

    while(open.length>0){

        open.sort((a,b)=>(a.g+a.h)-(b.g+b.h));

        let current=open.shift();

        if(current.state.toString()===goal){

            animateSolution(current);

            return;
        }

        visited.add(current.state.toString());

        getNeighbors(current.state).forEach(neighbor=>{

            if(!visited.has(neighbor.toString())){

                open.push({
                    state:neighbor,
                    g:current.g+1,
                    h:heuristic(neighbor),
                    parent:current
                });

            }

        });
    }
}

function animateSolution(node){

    let path=[];

    while(node){
        path.unshift(node.state);
        node=node.parent;
    }

    let i=0;

    let interval=setInterval(()=>{

        board=path[i];

        renderBoard();

        i++;

        if(i>=path.length){

            clearInterval(interval);

            statusText.innerText="Solved by AI ✅";

        }

    },350);
}

renderBoard();