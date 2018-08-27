	// Create a list that holds all of your cards
var cardNames = ['one', 'one', 'two', 'two', 'three', 'three', 'four', 'four','five', 'five', 'six', 'six', 'seven', 'seven', 'eight', 'eight'];
	// This list is JUST holding string names. The actual card elements/buttons are listed below.

const cardButtons = document.getElementsByClassName('card');

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

let currentPairList = [];
let openCardsList = [];

	//TODO - PUT THE EVENT LISTENER FUNCTION ABOVE IN THIS FUNCTION
function openCard(e) {
			e.target.classList.add('show', 'open');
			e.target.removeEventListener('click', openCard);
}




 // if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 // if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 // increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 // if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)