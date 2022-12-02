const emojis = [
   {
    name: 'peache',
    fruit: '🍑'
   },
   {
    name: 'pear',
    fruit: '🍐'
   },
   {
    name: 'cherry',
    fruit: '🍒'
   },
   {
    name: 'apple',
    fruit: '🍎',
   },
   {
    name: 'carrot',
    fruit: '🥕',
   },
   {
    name: 'grape',
    fruit: '🍇',
   },
   {
    name: 'melon',
    fruit: '🍉',
   },
   {
    name: 'mango',
    fruit: '🥭',
   },
   {
    name: 'banana',
    fruit: '🍌'
   },
   {
    name: 'pineapple',
    fruit: '🍍',
   },
   {
    name: 'strawberry',
    fruit: '🍓'
   },
   {
    name: 'kiwi',
    fruit: '🥝'
   },
];


//Variables for start-game-container
const startGameContainer = document.querySelector('.start-game-container');
const inputPlayerOne = document.querySelector('#player-1');
const inputPlayerTwo = document.querySelector('#player-2');
const startBtn = document.querySelector('.start-game-btn');
const resetBtn = document.querySelector('.reset-game')

//Variables for game-container
const gameContainer = document.querySelector('.game-container');
const cardContainer = document.querySelector('.card-container');
const scoreboard = document.querySelector('.scoreboard');
const playerOneName = document.querySelector('.player-one-name');
const playerTwoName = document.querySelector('.player-two-name');
const currentPlayer = document.querySelector('.current-player');
const playerOneWins = document.querySelector('.player-one-wins');
const playerTwoWins = document.querySelector('.player-two-wins');
const historyContainer = document.querySelector('.history-container');


//We use this function to update the display. for example if someone gains a score we will call this function to show it on the screen.
function updateDisplay() {
    currentPlayer.innerText = `${players[gameTurn].name} Turn`;

    playerOneName.innerText = `${players[0].name} pairs: ${players[0].score}`;
    playerTwoName.innerText = `${players[1].name} pairs: ${players[1].score}`;
    playerOneWins.innerText = `${players[0].name} won: ${player1WinCount} games`;
    playerTwoWins.innerText = `${players[1].name} won: ${player2WinCount} games`;
}


//Function that updates the games history and what pair each player has found.
function updateHistory(emoji) {
    for(let i = 0; i < emojis.length; i++) {
        if(emoji.innerText == emojis[i].fruit){
            let para = document.createElement('p');
            para.innerText = `${players[gameTurn].name} found ${emojis[i].name}s${emojis[i].fruit}`;
            historyContainer.append(para);
        }
    }
}


let gameTurn = 0;
let players = [];
let player1WinCount = 0;
let player2WinCount = 0;


// Starting the game
startBtn.addEventListener('click', startGame);


// Input value becomes the players names.
function startGame() {

    gameTurn = 0;
    let playerOne = {
        name: inputPlayerOne.value,
        score: 0,
    };
    let playerTwo = {
        name: inputPlayerTwo.value,
        score: 0,
    };

    // If theres no input value, the players name will be "Player 1" and "Player 2"
    if (inputPlayerOne.value == '') {
        playerOne.name = 'Player 1';
    } 
    if (inputPlayerTwo.value == '') {
        playerTwo.name = 'Player 2';
    }
    
    players = [playerOne, playerTwo]
   
    cardContainer.style.display = 'flex'

    updateDisplay();

    // When we press 'Start Game' we hide the start menu and show the game.
    startGameContainer.style.display = 'none'; 
    gameContainer.style.display = 'flex'; 

    
    shuffleEmojiArray();
}



//startGame();


//Function that shuffles array of emojis
function shuffleEmojiArray() {
    let randomArray = [];
    for (let i = 0; i < emojis.length; i++) {
        for (let j = 0; j < 2; j++) { //Adds 2 of every emoji
            randomArray.push(emojis[i].fruit);
        }
    } 

    randomArray.sort( () => Math.random() - 0.5); //Randomizes the array

    cardGenerator(randomArray);
};



function cardGenerator(arr) { //Appends memory-cards to cardcontainer
    for(let i = 0; i < arr.length; i++) {

        //Creates the elements for the memory cards
        let card = document.createElement('article');
        let cardFront = document.createElement('div');
        let cardBack = document.createElement('div');

        //Adds classes to the card elements
        card.classList.add('card');
        cardFront.classList.add('card-front');
        cardBack.classList.add('card-back');

        //Adds the emoji to the backside of the card
        cardBack.textContent = arr[i];
        cardFront.textContent = '?'

        //Appends the card elements
        cardContainer.append(card);
        card.append(cardFront, cardBack);
    }
    
    //Adds eventlistener to all cards
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
    card.addEventListener('click', flipCards);
})
}


let cardOne;
let cardTwo;


//Listening for the first and second click and saves them.
function flipCards (event) {

    let clickedCard = event.target;
    let cardParent = clickedCard.parentElement;
    let clickedCardBack = cardParent.querySelector('.card-back');
    
    if(clickedCardBack != cardOne) {
        // Lägger till en flip
        clickedCard.parentElement.classList.add('card-flip');
        if(!cardOne) {
        return cardOne = clickedCardBack;
    }

    cardTwo = clickedCardBack;

    matchCards(cardOne, cardTwo);
    } 
}


// Here we check if click 1 and click 2 are the same, if they are the current player will get +1 points
function matchCards(emoji1, emoji2) {

    if(emoji1.innerText == emoji2.innerText) {
        
        updateHistory(emoji1);

        players[gameTurn].score = players[gameTurn].score + 1;
        
        let emoji1Parent = emoji1.parentElement
        let emoji2Parent = emoji2.parentElement

        //After finding a pair the card will disappear after 1,5s with this function / method
        setTimeout(() => {
            emoji1Parent.style.visibility = 'hidden';
            emoji2Parent.style.visibility = 'hidden';
        },1500)
        
        //Updating the display / the score
        updateDisplay();

        //After every pair found we call our checkWinner function to check if the game is over.
        setTimeout(() =>{
            checkWinner()
        }, 1500);
        
        //If pairs aren't matching we remove the card-flip and they turn back around.
        } else {
            setTimeout(() => {
                emoji1.parentElement.classList.remove('card-flip');
                emoji2.parentElement.classList.remove('card-flip');
            }, 1200)
        
        
        console.log('Cards did not match');

        //Making gameturn always 0 or 1 with the modulus operator
        gameTurn = (gameTurn + 1) % 2;

        updateDisplay();
    }

    //Here we clear the variables of its content.
    cardOne = '';
    cardTwo = '';
}
    


//Variables for winner-container
const winnerContainer = document.querySelector('.winner-container');
const winnerMessage = document.querySelector('.winner-message');
const restartGameBtn = document.querySelector('.restart-game');


// We check if the score of both players add up to 12,
// when it does the game will check who has the highest score and print out the winner.
function checkWinner() {
    if(players[0].score + players[1].score == 12) {
        
        if(players[0].score > players[1].score) {
            
            winnerMessage.innerText = `${players[0].name} Is The Winner!`
            player1WinCount++;

        }else if(players[0].score < players[1].score) {
            
            winnerMessage.innerText = `${players[1].name} Is The Winner!`
            player2WinCount++;
            
        } else {
            console.log(`It's a draw!`);
            winnerMessage.innerText = `It's a draw!`
        }

        gameContainer.style.display = 'none';
        
        winnerContainer.style.display = 'flex';
        
        updateDisplay();
    } 
}


// We added 2 buttons, one that pops up when the game is finished and one that you can press during the game that will reset the game.
restartGameBtn.addEventListener('click', restartGame);
resetBtn.addEventListener('click', restartGame);


//Resetting the game and removes all the values stored.
function restartGame() {
    winnerContainer.style.display = 'none';

    while(cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.lastChild)
    }

    let removeParas = historyContainer.querySelectorAll('p');

    removeParas.forEach(para => {
        para.remove();
    });

    startGame();
}




