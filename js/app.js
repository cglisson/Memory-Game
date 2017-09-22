"use strict";

var seconds = 0,
    start;

function play() {
    // Hide play button.
    document.getElementsByClassName('play')[0].style.display = 'none';

    // Sets the time when the game started.
    start = setInterval(function() {
        seconds++;
        document.getElementsByClassName('time')[0].innerHTML = 'Time elapsed: ' + seconds;
    }, 1000);

    // Display Time.
    document.getElementsByClassName('time')[0].innerHTML = 'Time elapsed: ' + seconds;

    /*
     * Create a list that holds all of your cards
     */
    var cards = [
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-leaf',
        'fa-bicycle',
        'fa-bomb',
    ],
        openCards = [],
        matchingCards = [],
        stars,
        moveCounter = 0;

    // Add Matching Cards.
    var cardLength = cards.length;
    for (var i = 0; i < cardLength; i++) {
        cards.push(cards[i]);
    }

    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     *   - and create an event listener to the card.
     */
    cards = shuffle(cards);
    var deck = document.getElementById('deck');

    for (var i = 0; i < cards.length; i++) {
        let li = document.createElement('li'),
            italic = document.createElement('i');

        // Create class for attributes.
        li.setAttribute('class', 'card');
        italic.classList.add('fa', cards[i]);

        // Add Listener to card.
        li.addEventListener('click', cardListener, false);
        // Add italic element to the list.
        li.appendChild(italic);
        // Add new list element to unordered list.
        deck.appendChild(li);
    }

    displayMoves();

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

    /*
     * set up the event listener for a card. If a card is clicked:
     *  - display the card's symbol (put this functionality in another function that you call from this one)
     *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
     *  - if the list already has another card, check to see if the two cards match
     *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
     *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
     *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
     *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
     */

    function cardListener(event) {
        event.preventDefault();
        event.stopPropagation();

        let isMatch = false;

        display(this);

        if (openCards.length === 0) {
            openCards.push(this);
            // Avoid being able to click again for a match
            openCards[0].removeEventListener('click', cardListener);
        } else {
            isMatch = isMatched(this);

            moveCounter++;
            // How many stars are earned.
            if (moveCounter > 26) {
                let firstStar = document.getElementsByClassName('stars')[0].getElementsByClassName('fa')[1];
                firstStar.classList.remove('fa-star-o');
                firstStar.classList.add('fa-star');
                stars = 1;
            }else if (moveCounter > 18) {
                let secondStar = document.getElementsByClassName('stars')[0].getElementsByClassName('fa')[2];
                secondStar.classList.remove('fa-star-o');
                secondStar.classList.add('fa-star');
                stars = 2;
            }else {
                stars = 3;
            }

            displayMoves();
            removeEventListeners();

            if (isMatch) {
                matched(this);

                addEventListeners();

                // If game is won, calculate the time and display endgame menu.
                if (matchingCards.length == 16) {
                    let endgame = document.getElementsByClassName('endgame')[0],
                        game = document.getElementsByClassName('game')[0];

                    // Update score.
                    document.getElementsByClassName('score')[0].innerHTML = 'With ' + moveCounter + ' moves and ' + stars + ' Stars.';
                    document.getElementsByClassName('fTime')[0].innerHTML = 'Time: ' + seconds + ' seconds.';

                    game.style.display = 'none';
                    endgame.style.display = 'block';
                }
            } else {
                removeHide(this);
                addEventListeners();
                isMatch = false;
            }
        }
    };

    // Removes the cards from the open list and hides them from view.
    var removeHide = function(card) {
        // Shake when not matched.
        $('.open').effect('shake', {times:2, distance:10}, 500);

        // Change color of background
        card.style.background = '#FF5733';
        openCards[0].style.background = '#FF5733';

        // Allow some time to pass before hiding cards.
        setTimeout(function() {
            // Remove classes in order to hide card.
            card.classList.remove('open', 'show');
            openCards[0].classList.remove('open', 'show');
            // Empty openCards.
            openCards.splice(0, 1);
        }, 500);
    };

     // Display the card's symbol
     var display = function(card) {
        card.classList.add('open', 'show');
    };

     // Check to see if there is a match.
     function isMatched(card) {
        let card1 = card.firstChild,
            card2 = openCards[0].firstChild,
            isEqual = card1.isEqualNode(card2);

        if (isEqual) {
            return true;
        } else {
            return false;
        }
     };

    // The cards are a match, so the cards are to be locked in place.
    function matched(card) {
        $('.open').effect('bounce', {}, 'slow');
        // Lock the card in place.
        card.classList.add('match');
        card.classList.remove('open');
        // Lock the previous card in place.
        openCards[0].classList.add('match');
        openCards[0].classList.remove('open');
        // Empty the open cards array and move to matched cards.
        matchingCards.push(card, openCards[0]);
        openCards.splice(0,1);


    };

    // Displays the amount of moves.
    function displayMoves() {
        document.getElementsByClassName('moves')[0].innerHTML = moveCounter;
    };

    // Removes the event listener from all boxes.
    function removeEventListeners() {
        let cards = document.getElementsByClassName('card');

        for (let i = 0; i < cards.length; i++) {
            cards[i].removeEventListener('click', cardListener);
        }
    };

    // Adds the event listener to all boxes.
    function addEventListeners() {
        let cards = document.getElementsByClassName('card');

        // Prevent being able to click three boxes simultaneously.
        setTimeout(function() {
            for (let i = 0; i < cards.length; i++) {
                cards[i].addEventListener('click', cardListener, false);
            }
            // Remove event listener to matched cards.
            for (var i = 0; i < matchingCards.length; i++) {
                matchingCards[i].removeEventListener('click', cardListener, false);
            }
        }, 500);

    };
};

// Resets the board.
function reset() {
    let firstStar = document.getElementsByClassName('stars')[0].getElementsByClassName('fa')[0],
        secondStar = document.getElementsByClassName('stars')[0].getElementsByClassName('fa')[1],
        thirdStar = document.getElementsByClassName('stars')[0].getElementsByClassName('fa')[2];

    // Reset deck.
    document.getElementById('deck').innerHTML = "";

    // Reset stars.
    firstStar.classList.remove('fa-star');
    firstStar.classList.add('fa-star-o');
    secondStar.classList.remove('fa-star');
    secondStar.classList.add('fa-star-o');
    thirdStar.classList.remove('fa-star');
    thirdStar.classList.add('fa-star-o');

    // Hide endgame menu.
    document.getElementsByClassName('endgame')[0].style.display = 'none';

    // Reset time.
    document.getElementsByClassName('time')[0].innerHTML = '';
    clearInterval(start);
    seconds = 0;

    // Re-display game.
    document.getElementsByClassName('game')[0].style.display = 'flex';

    play();
};


var restart = document.getElementsByClassName('restart');
var playAgain = document.getElementsByClassName('playAgain');
var p = document.getElementsByClassName('play');

p[0].addEventListener('click', play, false);
restart[0].addEventListener('click', reset, false);
playAgain[0].addEventListener('click', reset, false);
