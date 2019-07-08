	// Create a list that holds all of your cards
let cardButtons = document.getElementsByClassName('card');

	//Global variable declarations 
let theme;
let cardNames = [];
let currentPairList = [];	//List of a pair of cards to perform comparisons on.
let openCardsList = [];		//Either 1 or 2 cards that is currently open. 
let matches = [];
let movesCounter = 0;
let stars = 3;
let starStars;	//Determins if star will be singular or plural for win modal
let mins = 0;	//counter variable
let secs = 0;	//counter variable
let minutes = document.getElementById('mins');	//minutes span
let seconds = document.getElementById('secs');	//seconds span
let allStars = document.querySelectorAll('#stars');		//All 3 font awesome stars
let win = document.getElementById('winModal');
let difficulty = '';
let timerInterval; 			//variable so we can work with setInterval and clearInterval
let runTimer = false;		//default is to not start the timer
let loseGame = false;		//variable to help with Game Over animations

	// WELCOME/CHOOSE DIFFICULTY SCREEN
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

function showDifficultyScreen() {
	setTimeout(function(){
		showWelcome();
		document.getElementById('easyMedHard').classList.remove('hidden');
	}, 500);
}

function hideDifficultyScreen() {
	setTimeout(function(){
		document.getElementById('easyMedHard').classList.add('hidden');
	}, 500);	
}

	//PICK THEME SCREEN
function pickTheme() {
	setTimeout(function(){
		document.getElementById('pickTheme').classList.remove('hidden');
	}, 500);
}

function disneyTheme() {
	theme = "disney";
	playGame();
}	

function videoGamesTheme() {
	theme = "videoGames";
	playGame();
}

function pokemonTheme() {
	theme = "pokemon";
	playGame();
}

	// PLAYING THE GAME
function playGame() {
	setTimeout(function(){
		loseGame = false;
		getTheme();				//Sets theme to theme clicked
		hideWelcome();			//Hides welcome screens (pick difficulty and theme)
		showInfobar();			//Shows stars, moves, time, restart button at top of card deck
		shuffle(cardNames);
		createCards();			//Builds our deck (ul) with 16 cards (li). Card images are determined by the array in the theme that was picked
		restartListener();		//Attaches event listener to restart button
	}, 500);
}

function getTheme() {
	if (theme === "disney") {
		cardNames = ['one', 'one', 'two', 'two', 'three', 'three', 'four', 'four','five', 'five', 'six', 'six', 'seven', 'seven', 'eight', 'eight'];
	}
	else if (theme === "videoGames") {
		cardNames = ['unreal', 'ea', 'nes', 'atari', 'xbox', 'sega', 'n64', 'play','unreal', 'ea', 'nes', 'atari', 'xbox', 'sega', 'n64', 'play'];
	}
	else {
		cardNames = ['pikachu','jigglypuff','charmander','eevee','bulbasaur','chikorita','pikachu','jigglypuff','charmander','eevee','bulbasaur','chikorita', 'umbreon', 'mewtwo', 'umbreon', 'mewtwo'];
	}
}

function hideWelcome() {
	document.getElementById('welcome').classList.add('hidden');
	document.getElementById('pickTheme').classList.add('hidden');
	//document.querySelector('.mainHeading').classList.remove('hidden');
}

function showInfobar() {
	document.querySelector('.score-panel').classList.remove('hidden');
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
	//2 TIMER FUNCTIONS
function startTimer(){
	for (let i=0; i<cardButtons.length; i++) {
		cardButtons[i].removeEventListener('click', startTimer);
	}
	if (runTimer = true){		//If it is appropriate to start the timer, run the myTimer function every 1 second until told to stop.
		timerInterval = setInterval(myTimer, 1000);
	} else { 
		return; 
	}
}

function myTimer() {
	minutes.innerHTML = 'Time '+mins+':';
	secs++;
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
}


function openCard(e) {
	e.target.classList.add('open', 'bounceIn');		// add classes to the "front" of the clicked card & animate the flip
	let icon = e.target.children[0];				// "icon" (img) is the child of the card (li). 
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
		increaseMoves();	//Once 2 cards are selected, we will increase our moves

		if (currentPairList[0] === currentPairList[1]) { 		// if all class names of BOTH elements are identical...
			pairMatches();
			checkForWin();
		
		} else {		// if the cards don't match...
			pairDoesNotMatch();
		}
	}
}	

	// Increases the moves counter and determines when to subtract stars
function increaseMoves() {
	movesCounter = movesCounter +1;
	moveOrMoves();	//Determines if text should say "move" or "moves"
	switch (difficulty) {		//When to remove a star based on difficulty set by user
		case "easy": 
			if (movesCounter === 16) {
				popAStar();
			}
			if (movesCounter === 20) {
				popAStar();
			}
			if (movesCounter === 25) {
				popAStar();
				gameOver();
			}
			break;
		case "medium": 
			if (movesCounter === 15) {
				popAStar();
			}
			if (movesCounter === 18) {
				popAStar();
			}
			if (movesCounter === 21) {
				popAStar();
				gameOver();
			}
			break;
		case "hard": 
			if (movesCounter === 12) {
				popAStar();
			}
			if (movesCounter === 15) {
				popAStar();
			}
			if (movesCounter === 18) {
				popAStar();
				gameOver();
			}
			break;
		default: 
			console.log('Unknown difficulty. Something went wrong.');
	}
}

function popAStar() {
	let remainingStars = document.querySelectorAll('.fa-star');
	remainingStars[0].classList.remove('fa-star');
	stars = stars - 1;
}

	//3 FUNCTIONS IF PAIR MATCHES

function pairMatches() {
	console.log('That is a match!');		// We have a match!	Add these 2 cards to our matches array.
	matches.push(openCardsList[0]);
	matches.push(openCardsList[1]);	
}

function matchAnimation() {
	openCardsList[0].removeEventListener('click', openCard);	//cannot click same card twice
	openCardsList[1].removeEventListener('click', openCard);	//cannot click same card twice
	setTimeout(function() {										//removes old animation and adds new animation and styling for a match!
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
			// Initialize our 2 working lists now that we are done with these 2 cards.
		currentPairList = [];
		openCardsList = [];
		}, 1000);
}

function checkForWin(){
	if (matches.length === 16) {
			winGame();
	} else {			// This way, if the game is won, the last match won't run animations twice, they will just jump up with the entire deck.
		matchAnimation();
	}
}

function winGame() {
	clearInterval(timerInterval);
	for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].classList.remove('bounce', 'bounceIn');
	}
	setTimeout(function(){
		for (let i=0; i<cardButtons.length; i++){
			cardButtons[i].classList.add('match', 'animated','bounce');
		}
			//WIN MODAL
		win.classList.remove('hidden');
		starOrStars();
		win.innerHTML = `<h2> You won! Congratulations! </h2> <p> You beat the game in ${movesCounter} moves, your time was ${mins} minutes and ${secs} seconds, and you have ${stars} ${starStars} left! </p> <p> Would you like to play again?</p><button class="modalButton" onClick="restartGame()"> Yes </button> <button class="modalButton" onClick="hideModal()"> No </button>`;
		}, 1000);
}

	// 3 FUNCTIONS FOR MISMATCHED PAIR

function pairDoesNotMatch() {
	if (loseGame == false) {	// If game is lost, we don't want to animate and close the match by itself. Another animation will run.
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

function gameOver() {
	loseGame = true;
	clearInterval(timerInterval);		//Stops timer from running
	for (let i=0; i<cardButtons.length; i++) {
			cardButtons[i].classList.remove('bounce', 'bounceIn','notMatch', 'animated', 'wobble');		//removes animations
			cardButtons[i].removeEventListener('click', openCard);										//locks cards
	}
		//Waits 1 second, animates mismatch on all cards, shows Lose Modal
	setTimeout(function(){	
		for (let i=0; i<cardButtons.length; i++){
			cardButtons[i].classList.add('showImage', 'notMatch', 'animated', 'wobble');
			cardButtons[i].children[0].classList.remove('hideImage');
			cardButtons[i].children[0].classList.add('showImage');
		}
		let lose = document.getElementById('loseModal');
		lose.classList.remove('hidden');
		lose.innerHTML = `<h2> GAME OVER! Oh no! </h2> <p> You were unable to beat the game in ${movesCounter} moves or less. Your game time was ${mins} minutes and ${secs} seconds.</p> <p> Would you like to play again? </p><button class="modalButton" onClick="restartGame()"> Yes </button><button class="modalButton" onClick="hideModal()"> No </button>`;
		}, 1000);
}

// RESTARTING THE GAME

function restartListener() {
	let restartButton = document.getElementById('restart');
	restartButton.addEventListener('click', restartGame);
}

function restartGame() {
	restartTimer();
	deleteCards();
	initializeThings();
	restoreStars();
	showDifficultyScreen();
}

function restartTimer() {
	clearInterval(timerInterval);
	runTimer = false;
	secs = 0;
	minutes.innerHTML = 'Time 0: 00';
	seconds.innerHTML = '';
}

function deleteCards() {
	let allCards = document.querySelectorAll('.card');
		for (i=0; i<allCards.length; i++) { 
		allCards[i].remove(); 
	}
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
	moveOrMoves();
	hideInfobar();
}

function hideModal() {
	document.getElementById('winModal').classList.add('hidden');
	document.getElementById('loseModal').classList.add('hidden');
}

function restoreStars() {
	allStars[0].classList.add('fa-star');
	allStars[1].classList.add('fa-star');
	allStars[2].classList.add('fa-star');
}

function showWelcome() {
	document.getElementById('welcome').classList.remove('hidden');
}

function hideInfobar() {
	document.querySelector('.score-panel').classList.add('hidden');
}

	//CHANGES TEXT BASED ON SINGULAR OR PLURAL MOVE(S)
function moveOrMoves() {		
	document.getElementById('moves').innerHTML = movesCounter;
	if (movesCounter === 1) {
		document.getElementById('moveOrMoves').innerHTML = "Move";
	} else {
		document.getElementById('moveOrMoves').innerHTML = "Moves";
	}
}

function starOrStars() {		//Correct grammar for win modal
	if (stars === 1) {
		starStars = "star";
	} else {
		starStars = "stars";
	}
}