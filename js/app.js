	// Create a list that holds all of your cards
var cardNames = ['one', 'one', 'two', 'two', 'three', 'three', 'four', 'four','five', 'five', 'six', 'six', 'seven', 'seven', 'eight', 'eight'];
	// This list is JUST holding string names. The actual card elements/buttons are listed below.
const cardButtons = document.getElementsByClassName('card');

	//declaring 2 arrays to hold card data
let currentPairList = [];
let openCardsList = [];
let matches = [];
let movesCounter = 0;


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
		liElement.innerHTML = '#' + cardName;
		deck.appendChild(liElement);
		liElement.classList.add("card", cardNames[i]);
		liElement.addEventListener('click', openCard); 
	}
}



function openCard(e) {	//(e) is the element that was clicked - a card tile
	e.target.classList.add('show', 'open', 'bounceIn');		// adding these 2 classes to display the "front" of the clicked card
	openCardsList.push(e.target);

	checkForMatch(e);
}

function checkForMatch(e) {
		//Comparing 2 open cards for equality
	if (currentPairList.length < 2) {		// if there are only 0 or 1 cards in this list...
		currentPairList.push(e.target.className);		// adds element class names to the array as strings
	}

	if (currentPairList.length === 2) {
			//remove the "click" Event Listener from ALL CARDS
			for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].removeEventListener('click', openCard);
			}

			if (currentPairList[0] === currentPairList[1]) { 		// if all class names of BOTH elements are identical...
				pairMatches();

			} else {		// if the cards don't match...
				pairDoesNotMatch();
			}
			increaseMoves();
		}
	}	

function pairMatches() {
	console.log('That is a match!');		// We have a match!
	for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].addEventListener('click', openCard);
			}
	openCardsList[0].classList.add('match');
					// Add this match to the list of matched cards.
	matches.push(openCardsList[0]);
	matches.push(openCardsList[1]);

		
		// Check if there are 16 cards in the matched array
	if (matches.length === 16) {
			winGame();
	}
		// reset our two working lists
	currentPairList = [];
	openCardsList = [];
}

function pairDoesNotMatch() {
	console.log(`Those cards don't match silly!`);
		//remove bounceIn class so they will bounce again next time.
		// FLIP BACK OVER
	closeCards();				
}


function closeCards() {	
		setTimeout(function() {
				// Hide the cards
			openCardsList[0].classList.remove('show', 'open', 'bounceIn');
			openCardsList[1].classList.remove('show', 'open', 'bounceIn');	
				// Allow the cards to be clicked again
			for (let i=0; i<cardButtons.length; i++) {
				cardButtons[i].addEventListener('click', openCard);
			}
				// Clear the working lists
			openCardsList = [];	
			currentPairList = [];
			}, 1500);
			
}

function winGame() {
	setTimeout(function(){
			alert(`Congratulations! You won the game in ${movesCounter} moves!`);
		}, 1000);
}

	//JS for Refresh button
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
	if (movesCounter === 12) {
		document.querySelector('.fa-star').remove();
	}
	if (movesCounter === 15) {
		document.querySelector('.fa-star').remove();
	}
	if (movesCounter === 18) {
		document.querySelector('.fa-star').remove();
		gameOver();
	}
}


function gameOver() {
	//alert that you lost the game & "Play Again?" button
	let playAgain = confirm("GAME OVER! Would you like to play again?");
	if (playAgain == true) {
		refreshPage();
	} else {
		window.close();
	}
}
