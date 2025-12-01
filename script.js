const board = document.querySelector('.board');
const buttonStart = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const restartGameModal = document.querySelector('.restart-game');
const restartButton = document.querySelector('.btn-restart');
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 20;
const blockWidth = 20;

let highScore = parseInt(localStorage.getItem('highscore')) || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;
const cols =Math.floor( board.clientWidth / blockWidth);
const rows =Math.floor( board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId = null;

let food = {x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        };

const blocks = [];
let snake = [
    {x:2, y:5}
];
let  direction = 'right';

//creating blocks

for(i=0; i<rows; i++){
    for(j=0; j<cols; j++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${i}-${j}`] = block;
    }
}


//render snake
function render(){
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y+1};
    }else if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y-1};
    }else if(direction === 'up'){
        head = {x: snake[0].x-1, y: snake[0].y}
    }else if(direction === 'down'){
        head = {x: snake[0].x+1, y: snake[0].y}
    }

    //wall collision
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        modal.style.display='flex';
        startGameModal.style.display = 'none'
        restartGameModal.style.display = 'flex'
        return;
    }


    //food consume
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 5;
        scoreElement.innerText= score;
        if(score>highScore){
            highScore = score;
            localStorage.setItem('highscore',highScore);
            highScoreElement.innerText= highScore;
        }
    }

    //moving snake
    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
}



buttonStart.addEventListener('click',()=>{
    modal.style.display = 'none';
    intervalId = setInterval(()=>render(),100)
    timerIntervalId = setInterval(()=>{
        let[min,sec] = time.split(":").map(Number);
        if(sec==59){
            min += 1; 
            sec = 0;
        }else{
            sec += 1;
        }

        time = `${min}:${sec}`
        timeElement.innerText = time;
    },1000)
})

restartButton.addEventListener('click',restartGame)


function restartGame(){
    modal.style.display='none'
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })


    direction='right';
    score = 0;
    scoreElement.innerText=score;
    time = `00:00`;
    timeElement.innerText=time;


    snake = [{x:2, y:5}];
    food = {x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        };
    intervalId = setInterval(()=>render(),100);

}

addEventListener('keydown',(e)=>{
    if(e.key == 'ArrowUp'){
        direction = 'up';
    }else if(e.key == 'ArrowDown'){
        direction = 'down';
    }else if(e.key == 'ArrowRight'){
        direction = 'right';
    }else if(e.key == 'ArrowLeft'){
        direction = 'left';
    }
})
