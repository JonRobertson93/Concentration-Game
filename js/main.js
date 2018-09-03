	// Create a list that holds all of your cards
const cardNames = ['one', 'one', 'two', 'two', 'three', 'three', 'four', 'four','five', 'five', 'six', 'six', 'seven', 'seven', 'eight', 'eight'];
	// This list is JUST holding string names. The actual card elements/buttons are listed below.
const cardButtons = document.getElementsByClassName('card');

	//declaring 2 arrays to hold card data
let currentPairList = [];
let openCardsList = [];
let matches = [];
let movesCounter = 0;

	//Game Start
shuffle(cardNames);
createCards();


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
		deck.appendChild(liElement);
		liElement.classList.add("card", cardNames[i]);
		liElement.addEventListener('click', openCard); 
	}
}



function openCard(e) {	//(e) is the element that was clicked - a card tile
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


		} else {		// if the cards don't match...
			pairDoesNotMatch();
		}
		checkForWin();

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
			winGame();
	} else {
		increaseMoves();
	}
}

function pairDoesNotMatch() {
	console.log(`Those cards don't match silly!`);
	animateMismatch();
	closeCards();				
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
	setTimeout(function(){
			document.getElementById('winModal').classList.remove('hiddenModal');
		}, 1000);
}

	//TODO - Make it reload certain content, NOT refresh the entire page
function refreshPage() {
	window.location.reload();
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
	if (movesCounter === 15) {
		document.querySelector('.fa-star').remove();
	}
	if (movesCounter === 18) {
		document.querySelector('.fa-star').remove();
	}
	if (movesCounter === 20) {
		document.querySelector('.fa-star').remove();
		gameOver();
	}
}


function gameOver() {
	setTimeout(function(){
		//alert that you lost the game & "Play Again?" button
	let playAgain = confirm("GAME OVER! Would you like to play again?");
	if (playAgain == true) {
		refreshPage();
	}
	}, 2000);
	
}

function hideModal() {
	document.getElementById('winModal').classList.add('hiddenModal');
}
