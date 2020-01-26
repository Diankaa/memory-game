/* eslint-env browser */

(function() {
  // all cards in game
  const cards = document.querySelectorAll('.card');

  // declaring move variable
  const counter = document.querySelector('.moves');
  let moves = 0;

  // declare letiables for star icons
  const stars = document.querySelectorAll('.fa-star');

  // declaring variable of matchedCards
  const matchedCard = document.getElementsByClassName('match');

  // declare popup
  const popup = document.getElementById('popup');

  // close icon in popup
  const closeIcon = document.querySelector('.close');

  // new game button
  const newGameBtn = document.getElementById('play-again');

  // restart game button
  const restartBtn = document.querySelector('.restart');

  // declare star rating variable
  const starRating = document.querySelector('.stars').innerHTML;

  // event listener on each card
  let initFlip;

  // check flipped cards
  let hasFlippedCard = false;

  // card access check
  let lockBoard = false;

  // first open card
  let firstCard;

  // second open card
  let secondCard;

  // timer components
  const timer = document.querySelector('.timer');
  let second = 0;
  let minute = 0;
  let interval;
  let finalTime;

  /**
  * @type {Function}
  * @description reset cards
  */
  const resetBoard = () => {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
  };

  /**
  * @type {Function}
  * @description disable cards if they match and add class for styling
  */
  const disableCards = () => {
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    firstCard.removeEventListener('click', initFlip);
    secondCard.removeEventListener('click', initFlip);
    resetBoard();
  };

  /**
  * @type {Function}
  * @description unflip cards if they don't match
  */
  const unflipCards = () => {
    setTimeout( () => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1500);
  };

  /**
  * @type {Function}
  * @description check if cards are match or not
  */
  const checkForMatch = () => {
    const isMatch = firstCard.dataset.type === secondCard.dataset.type;
    isMatch ? disableCards() : unflipCards();
  };

  /**
  * @type {Function}
  * @description  game timer
  */
  const startTimer = () => {
    interval = setInterval(function() {
      timer.innerHTML = minute + ' min(s) '+ second + ' sec(s)';
      second++;
      if (second == 60) {
        minute++;
        second=0;
      }
    }, 1000);
  };

  /**
  * @type {Function}
  * @description  count player's moves, init start timer
  */
  const moveCounter = () => {
    moves++;
    counter.innerHTML = moves;
    // start timer on first click
    if (moves == 1) {
      second = 0;
      minute = 0;
      startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12) {
      for (let i= 0; i < 3; i++) {
        if (i > 1) {
          stars[i].style.visibility = 'collapse';
        }
      }
    } else if (moves > 13) {
      for (let i= 0; i < 3; i++) {
        if (i > 0) {
          stars[i].style.visibility = 'collapse';
        }
      }
    }
  };

  /**
  * @type {Function}
  * @description  add opened cards to arrays, check if cards are match or not
  * and set counter
  * @param {string} card
  */
  const flipCard = (card) => {
    if (lockBoard) return;
    if (card == firstCard) return;
    if (card.classList.contains('flip')) return;

    if (!hasFlippedCard) {
      card.classList.add('flip');
      hasFlippedCard = true;
      firstCard = card;
      return;
    }
    if (hasFlippedCard) {
      secondCard = card;
      lockBoard = true;
      moveCounter();
    }
    card.classList.add('flip');
    checkForMatch();
  };

  /**
  * @type {Function}
  * @description  shuffle cards
  */
  const shuffle = () => {
    cards.forEach( (card) => {
      const ramdomPos = Math.ceil(Math.random() * 12);
      card.style.order = ramdomPos;
    });
  };

  /**
  * @type {Function}
  * @description close icon on popout
  */
  const closeModal = () => {
    closeIcon.addEventListener('click', () => {
      popup.style.visibility = 'hidden';
    });
  };

  /**
  * @type {Function}
  * @description congratulate when all cards match, show popup, moves,
  * time, rating
  * @param {string} finalTime
  */
  const congratulateWinner = (finalTime) => {
    if (matchedCard.length == 16) {
      clearInterval(interval);
      finalTime = timer.innerHTML;

      // show congratulations popup
      popup.style.visibility = 'visible';

      // showing move, rating, time on popup
      document.getElementById('finalMove').innerHTML = moves;
      document.getElementById('starRating').innerHTML = starRating;
      document.getElementById('totalTime').innerHTML = finalTime;

      // closeicon on popup
      closeModal();
    }
  };

  /**
  * @type {Function}
  * @description play Again, remove all exisiting classes from each card,
  * reset moves, rating, timer
  * @param {string} card
  */
  const startGame = (card) => {
    popup.style.visibility = 'hidden';
    card.classList.remove('flip', 'match');

    moves = 0;
    counter.innerHTML = moves;

    for (let i= 0; i < stars.length; i++) {
      stars[i].style.color = '#FFD700';
      stars[i].style.visibility = 'visible';
    }

    resetBoard();
    shuffle();

    second = 0;
    minute = 0;
    timer.innerHTML = '0 min(s) 0 sec(s)';
    clearInterval(interval);
  };

  // add event listeners to each card
  cards.forEach((card) => {
    document.body.onload = startGame(card);
    newGameBtn.addEventListener('click', () => {
      startGame(card);
    });
    restartBtn.addEventListener('click', () => {
      startGame(card);
    });
    card.addEventListener('click', function initFlip() {
      flipCard(card);
      congratulateWinner(finalTime);
    });
  });
})();
