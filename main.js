	// Create a list that holds all of your cards
let cardButtons = document.getElementsByClassName('card');

	//declaring 2 arrays to hold card data
let theme = '';
let cardNames = [];
let currentPairList = [];
let openCardsList = [];
let matches = [];
let movesCounter = 0;
let stars = 3;
let mins = 0;
let secs = 0;
let allStars = document.querySelectorAll('#stars');		//All 3 font awesome stars
let win = document.getElementById('winModal');
let difficulty = '';
let runTimer = "false";

	//Game Start
chooseDifficulty();

function playGame() {
	setTimeout(function(){
		getTheme();
		hideWelcome();
		showInfobar();
		shuffle(cardNames);
		createCards();
		restartListener();	
	}, 500);
}


	// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

	// Create each card's HTML and add to the page
function createCards(){
	for (let i=0; i<cardNames.length; i++) {
		let deck = document.querySelector('.deck');
		let liElement = document.createElement('li');
		let cardName = cardNames[i];
		liElement.innerHTML = `<img class="hideImage" src="icons/${cardName}.png">`;
		liElement.classList.add("card", cardNames[i]);
		deck.appendChild(liElement);
		liElement.addEventListener('click', startTimer); 
		liElement.addEventListener('click', openCard); 
	}
}



function openCard(e) {	//(e) is the element that was clicked - a card tile
	runTimer = "true";
	e.target.classList.add('open', 'bounceIn');		// adding these 3 classes to display the "front" of the clicked card & animate the flip
	let icon = e.target.children[0];
	icon.classList.remove('hideImage');
	icon.classList.add('showImage');
	openCardsList.push(e.target);
	checkForMatch(e);
}

function checkForMatch(e) {
		//Comparing 2 open cards for equality
	if (currentPairList.length < 2) {		// if there are only 0 or 1 cards in this list...
		currentPairList.push(e.target.className);		// adds element class names to the array as strings
		e.target.removeEventListener('click', openCard); 	//Prevents the card from matching itself
	}

	if (currentPairList.length === 2) {
		//REMOVE EVENT LISTENER SO CARD CANNOT BE CLICKED WHILE ANIMATIONS ARE RUNNING
		for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].removeEventListener('click', openCard);
			}

		if (currentPairList[0] === currentPairList[1]) { 		// if all class names of BOTH elements are identical...
			pairMatches();
			checkForWin();


		} else {		// if the cards don't match...
			pairDoesNotMatch();
		}
		increaseMoves();
	}
}	

function pairMatches() {
	console.log('That is a match!');		// We have a match!	
	matches.push(openCardsList[0]);
	matches.push(openCardsList[1]);
	matchAnimation();	
}

function matchAnimation() {
	openCardsList[0].removeEventListener('click', openCard);	//cannot click same card twice
	openCardsList[1].removeEventListener('click', openCard);	//cannot click same card twice
	setTimeout(function() {
		openCardsList[0].classList.remove('bounceIn');
		openCardsList[0].classList.add('match', 'animated', 'bounce');
		openCardsList[1].classList.remove('bounceIn');
		openCardsList[1].classList.add('match', 'animated','bounce');
			// Allow the cards to be clicked again
		for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].addEventListener('click', openCard);
			}
			// Lock any matched cards
		for (let i=0; i<matches.length; i++) {
				matches[i].removeEventListener('click', openCard);
			}
		currentPairList = [];
		openCardsList = [];
		}, 1000);

}

function checkForWin(){
	if (matches.length === 16) {
			// endTimer();
			winGame();
	}
}

function pairDoesNotMatch() {
	console.log(`Those cards don't match silly!`);
	if (movesCounter === 20) {
		gameOver();
	}
	else {
		animateMismatch();
		closeCards();	
		}			
}

function animateMismatch() {
	setTimeout(function() {
		openCardsList[0].classList.remove('bounceIn');
		openCardsList[1].classList.remove('bounceIn');
		openCardsList[0].classList.add('notMatch', 'animated', 'wobble');
		openCardsList[1].classList.add('notMatch', 'animated', 'wobble');
	}, 1000);
		
}


function closeCards() {	
				// Hide the cards
			setTimeout(function() {
			openCardsList[0].classList.remove('open','notMatch', 'animated', 'wobble');
			openCardsList[1].classList.remove('open','notMatch', 'animated', 'wobble');	
			let iconOne = openCardsList[0].children[0];
			iconOne.classList.add('hideImage');
			iconOne.classList.remove('showImage');
			let iconTwo = openCardsList[1].children[0];
			iconTwo.classList.add('hideImage');
			iconTwo.classList.remove('showImage');
				// Allow the cards to be clicked again
			for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].addEventListener('click', openCard);
			}
			// Lock any matched cards
			for (let i=0; i<matches.length; i++) {
				matches[i].removeEventListener('click', openCard);
			}
				// Clear the working lists
			openCardsList = [];	
			currentPairList = [];
			}, 2000);
			
}

function winGame() {
	runTimer = "false";
	for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].classList.remove('bounce');
	}
	setTimeout(function(){
		for (let i=0; i<cardButtons.length; i++){
			cardButtons[i].classList.add('bounce');
		}
		win.classList.remove('hidden');
		win.innerHTML = `<h2> You won! Congratulations! </h2> <p> You beat the game in ${movesCounter} moves, your time was ${mins} minutes and ${secs} seconds, and you have ${stars} stars left! </p> <p> Would you like to play again?</p><button class="modalButton" onClick="restartGame()"> Yes </button> <button class="modalButton" onClick="hideModal()"> No </button>`;
		}, 1000);
}

	// Increases the moves counter and determines when to subtract stars
function increaseMoves() {
	movesCounter = movesCounter +1;
	document.getElementById('moves').innerHTML = movesCounter;
	if (movesCounter === 1) {
		document.getElementById('moveOrMoves').innerHTML = "Move";
	} else {
		document.getElementById('moveOrMoves').innerHTML = "Moves";
	}
		// SEE IF THIS CAN BE TRIMMED DOWN SOME. ADD VARIABLES TO COMPARE, ADD TO, ETC... START WITH EASY. EASY-2, EASY-4 ETC...
	switch (difficulty) {
		case "easy": 
			if (movesCounter === 16) {
				allStars[0].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 20) {
				allStars[1].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 25) {
				allStars[2].classList.remove('fa-star');
				stars = stars - 1;
				gameOver();
			}
			break;
		case "medium": 
			if (movesCounter === 15) {
				allStars[0].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 18) {
				allStars[1].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 21) {
				allStars[2].classList.remove('fa-star');
				stars = stars - 1;
				gameOver();
			}
			break;
		case "hard": 
			if (movesCounter === 12) {
				allStars[0].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 15) {
				allStars[1].classList.remove('fa-star');
				stars = stars - 1;
			}
			if (movesCounter === 18) {
				allStars[2].classList.remove('fa-star');
				stars = stars - 1;
				gameOver();
			}
			break;
		default: 
			console.log('Unknown difficulty. Something went wrong.');
	}
}


function gameOver() {
	runTimer = "false";
	for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].classList.remove('bounce','notMatch', 'animated', 'wobble');
				cardButtons[i].removeEventListener('click', openCard);
	}
	setTimeout(function(){	
		for (let i=0; i<cardButtons.length; i++){
			cardButtons[i].classList.add('notMatch', 'animated', 'wobble');
		}
		let lose = document.getElementById('loseModal');
		lose.classList.remove('hidden');
		lose.innerHTML = `<h2> GAME OVER! Oh no! </h2> <p> You were unable to beat the game in ${movesCounter} moves or less. Your game time was ${mins} minutes and ${secs} seconds.</p> <p> Would you like to play again? </p><button class="modalButton" onClick="restartGame()"> Yes </button><button class="modalButton" onClick="hideModal()"> No </button>`;
		}, 1000);
}
	
function hideModal() {
	document.getElementById('winModal').classList.add('hidden');
	document.getElementById('loseModal').classList.add('hidden');
}

function getMoves() {
	console.log(movesCounter);
}

// function timerListener(){
// 	let startButton = document.getElementById('startButton');
// 	startButton.addEventListener('click', startTimer);
// }

function startTimer(e){
	for (let i=0; i<cardButtons.length; i++) {
		cardButtons[i].removeEventListener('click', startTimer);
	}
	if (runTimer="true") {	
	  setTimeout(function(){
		    let minutes = document.getElementById('mins');
		    let seconds = document.getElementById('secs');
		    minutes.innerHTML = 'Time '+mins+':';
		    if(secs <10) {
		      seconds.innerHTML = '0'+secs;
		    } 
		    else if(secs > 59) {
		    	secs = 0;
		    	mins++;  	
			} 
			else {
				seconds.innerHTML = secs;
				minutes.innerHTML = 'Time: '+mins+':';
			}
			secs++;
		    startTimer();
	  	},1000);
	}
}


// RESTARTING THE GAME

function restartListener() {
	let restartButton = document.getElementById('restart');
	restartButton.addEventListener('click', restartGame);
}

function restartGame() {
	deleteCards();
	chooseDifficulty();
	// shuffle(cardNames);
	// createCards();
	initializeThings();
	restoreStars();
	// restartListener();
}

function deleteCards() {
	let deck = document.querySelector('.deck');
	deck.innerHTML = '';
}
function initializeThings() {
	hideModal();
	currentPairList = [];
	openCardsList = [];
	matches = [];
	movesCounter = 0;
	stars = 3;
	mins = 0;
	secs = 0;
	document.getElementById('moves').innerHTML = movesCounter;
}

function restoreStars() {
	allStars[0].classList.add('fa-star');
	allStars[1].classList.add('fa-star');
	allStars[2].classList.add('fa-star');
}

	//TODO - CAN I COMBINE THE 3 FUNCTIONS BELOW INTO ONE FUNCTION?
function easyDifficulty() {
	difficulty = "easy";
	hideDifficultyScreen();
	pickTheme();
}

function mediumDifficulty() {
	difficulty = "medium";
	hideDifficultyScreen();
	pickTheme();
}

function hardDifficulty() {
	difficulty = "hard";
	hideDifficultyScreen();
	pickTheme();
}

function hideDifficultyScreen() {
	setTimeout(function(){
		document.getElementById('easyMedHard').remove();
	}, 500);	
}

function chooseDifficulty() {
	document.querySelector('.deck').insertAdjacentHTML('afterbegin', `
		<div id="welcome">
            <h1 id="welcomeHeading"> The Game of Concentration </h1>
            <div id="easyMedHard">
            <h2> Pick your difficulty level: </h2>
            <button class="welcomeButtons" onClick="easyDifficulty()">EASY</button>
            <button class="welcomeButtons" onClick="mediumDifficulty()">MEDIUM</button>
            <button class="welcomeButtons" onClick="hardDifficulty()">HARD</button>
            </div>
        </div>`);
}

function pickTheme() {		// ADD THIS AS LAST THEME LATER -- <button class="welcomeButtons" onClick="nintendoTheme()">HARD</button>
	setTimeout(function(){
		document.getElementById('welcome').insertAdjacentHTML('beforeend', `<div id="pickTheme">
                <h2> Now pick what characters you want to play with: </h2>
                <button class="welcomeButtons" onClick="frozenTheme()">FROZEN</button>
                <button class="welcomeButtons" onClick="disneyTheme()">DISNEY</button>
              	
            </div>`);
	}, 500);
}

function getTheme() {
	if (theme === "disney") {
		cardNames = ['one', 'one', 'two', 'two', 'three', 'three', 'four', 'four','five', 'five', 'six', 'six', 'seven', 'seven', 'eight', 'eight'];
	}
	else {
		cardNames = ['anna','elsa','hans','kristoff','olaf','duke','sven','marshmallow','anna','elsa','hans','kristoff','olaf','duke','sven','marshmallow'];
	}
}

function disneyTheme() {
	theme = "disney";
	playGame();
}	


function frozenTheme() {
	theme = "frozen";
	playGame();
}


function hideWelcome() {
	document.getElementById('welcome').remove();
	document.querySelector('.mainHeading').classList.remove('hidden');
}

function showInfobar() {
	document.querySelector('.score-panel').classList.remove('hidden');
}