const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const startBtn = $('.start-btn');
const playerInfo = $('.player-info');
const displayWinner = $('.congrats__msg');
const playMode = $('.play-mode-options > select');
const gameboardSquares = $$('.gameboard__square');
const firstLabel = $('form > div:nth-child(1) > label')
const secondLabel = $('form > div:nth-child(2) > label')
const firstInput = $('#player-one');
const secondInput = $('#player-two');

const Gameboard = (() => {
  const gameboard = new Array(9).fill('');
  return {
    gameboard
  };
})();

const displayController = (() => {
  const renderGameboard = () => {
    for (let i = 0; i < Gameboard.gameboard.length; i++) {
      gameboardSquares.forEach(square => {
        if (i == square.getAttribute('data')) {
          square.textContent = Gameboard.gameboard[i];
        };
      });
    };
  };
  return {
    renderGameboard
  };
})();

const gameResult = (() => {
  const checkGameResult = (playMode) => {
    const g = Gameboard.gameboard;
    if (
      (g[0] == g[1] && g[1] == g[2] && g[2] == 'X') ||
      (g[3] == g[4] && g[4] == g[5] && g[5] == 'X') ||
      (g[6] == g[7] && g[7] == g[8] && g[8] == 'X') ||
      (g[0] == g[3] && g[3] == g[6] && g[6] == 'X') ||
      (g[1] == g[4] && g[4] == g[7] && g[7] == 'X') ||
      (g[2] == g[5] && g[5] == g[8] && g[8] == 'X') ||
      (g[0] == g[4] && g[4] == g[8] && g[8] == 'X') ||
      (g[2] == g[4] && g[4] == g[6] && g[6] == 'X')
    ) {
      setTimeout(() => {
        displayWinner.textContent = `Winner: ${playMode.playerOne.name}`;
      }, 100);
      gameboardSquares.forEach(square => square.style.pointerEvents = 'none');
    } else if (
      (g[0] == g[1] && g[1] == g[2] && g[2] == 'O') ||
      (g[3] == g[4] && g[4] == g[5] && g[5] == 'O') ||
      (g[6] == g[7] && g[7] == g[8] && g[8] == 'O') ||
      (g[0] == g[3] && g[3] == g[6] && g[6] == 'O') ||
      (g[1] == g[4] && g[4] == g[7] && g[7] == 'O') ||
      (g[2] == g[5] && g[5] == g[8] && g[8] == 'O') ||
      (g[0] == g[4] && g[4] == g[8] && g[8] == 'O') ||
      (g[2] == g[4] && g[4] == g[6] && g[6] == 'O')
    ) {
      setTimeout(() => {
        displayWinner.textContent = `Winner: ${playMode.playerTwo.name}`;
      }, 100);
      gameboardSquares.forEach(square => square.style.pointerEvents = 'none');
    } else if (g.filter(Boolean).length == 9 && !(
        (g[0] == g[1] && g[1] == g[2] && g[2]) ||
        (g[3] == g[4] && g[4] == g[5] && g[5]) ||
        (g[6] == g[7] && g[7] == g[8] && g[8]) ||
        (g[0] == g[3] && g[3] == g[6] && g[6]) ||
        (g[1] == g[4] && g[4] == g[7] && g[7]) ||
        (g[2] == g[5] && g[5] == g[8] && g[8]) ||
        (g[0] == g[4] && g[4] == g[8] && g[8]) ||
        (g[2] == g[4] && g[4] == g[6] && g[6]))) {
      setTimeout(() => {
        displayWinner.textContent = "Tie game";
      }, 100);
      gameboardSquares.forEach(square => square.style.pointerEvents = 'none');
    };
  };
  return {
    checkGameResult
  }
})();

const player = (name, mark) => {
  const placeMarks = e => {
    if (!e.target.textContent) {
      for (let i = 0; i < Gameboard.gameboard.length; i++) {
        if (+e.target.getAttribute('data') === i) {
          Gameboard.gameboard[i] = mark;
          break;
        };
      };
    }
    displayController.renderGameboard();
  }
  return {
    name,
    mark,
    placeMarks
  };
};

const GameVsFriend = (() => {
  const playerOne = player('', 'X');
  const playerTwo = player('', 'O');
  const startGame = () => {
    gameboardSquares.forEach(square => square.style.pointerEvents = 'none');
    startBtn.addEventListener('click', () => {
      if (!Gameboard.gameboard.filter(Boolean).length) {
        // start game
        playerOne.name = playerInfo[0].value;
        playerTwo.name = playerInfo[1].value;
        gameboardSquares.forEach(square => square.style.pointerEvents = 'auto');
      } else {
        // restart game
        Gameboard.gameboard = new Array(9).fill('');
        displayController.renderGameboard();
        gameboardSquares.forEach(square => square.style.pointerEvents = 'auto');
        displayWinner.textContent = '';
      }
    });
  };
  const playTurn = () => {
    gameboardSquares.forEach(square => {
      square.addEventListener('click', e => {
        if (Gameboard.gameboard.filter(Boolean).length % 2 == 0) {
          playerOne.placeMarks(e);
          gameResult.checkGameResult(GameVsFriend);
        } else {
          playerTwo.placeMarks(e);
          gameResult.checkGameResult(GameVsFriend);
        };
      });
    });
  };

  return {
    playerOne,
    playerTwo,
    playTurn,
    startGame
  };
})();

const GameVsComputer = (() => {
  const playerOne = player('You', 'X');
  const playerTwo = player('Computer', 'O');
  playerTwo.placeMarks = () => {
    let emptyArr = Gameboard.gameboard.filter(item => !!item === false);
    let randomIndex = Math.floor(Math.random() * emptyArr.length);
    let a = 0;
    for (let i = 0; i < Gameboard.gameboard.length; i++) {
      if (Gameboard.gameboard[i] == '') {
        a++;
      };
      if (a == (randomIndex + 1)) {
        Gameboard.gameboard[i] = playerTwo.mark;
        break;
      };
    };
    displayController.renderGameboard();
  };
  const startGame = () => {
    gameboardSquares.forEach(square => square.style.pointerEvents = 'none');
    startBtn.addEventListener('click', () => {
      if (!Gameboard.gameboard.filter(Boolean).length) {
        // start game
        gameboardSquares.forEach(square => square.style.pointerEvents = 'auto');
      } else {
        // restart game
        Gameboard.gameboard = new Array(9).fill('');
        displayController.renderGameboard();
        gameboardSquares.forEach(square => square.style.pointerEvents = 'auto');
        displayWinner.textContent = '';
      }
    });
  };
  const playTurn = () => {
    gameboardSquares.forEach(square => {
      square.addEventListener('click', e => {
        if (!e.target.textContent) {
          playerOne.placeMarks(e);
          gameResult.checkGameResult(GameVsComputer);

          setTimeout(() => {
            if (!displayWinner.textContent) {
              setTimeout(playerTwo.placeMarks, 200);
              setTimeout(gameResult.checkGameResult, 300, GameVsComputer);
            };
          }, 100);
        };
      });
    });
  };

  return {
    playerOne,
    playerTwo,
    playTurn,
    startGame
  };
})();

const gameMode = (() => {
  const changePlayMode = () => {
    playMode.addEventListener('change', () => {
      if (playMode.value === 'computer') {
        // vs. computer
        firstLabel.textContent = 'Player One (X): You';
        secondLabel.textContent = 'Player Two (O): Computer';
        firstInput.parentNode.removeChild(firstInput);
        secondInput.parentNode.removeChild(secondInput);
        GameVsComputer.playTurn();
        GameVsComputer.startGame();
        playMode.disabled = true;
      } else if (playMode.value === 'friend') {
        // vs. a friend
        GameVsFriend.playTurn();
        GameVsFriend.startGame();
        playMode.disabled = true;
      };
    });
  };

  return {
    changePlayMode
  }
})();
gameMode.changePlayMode();

// ? Add a scoreboard to display the running score
// ? Make the 3 marks obvious to show the winning result
// ? Enable switching play modes back and forth (Add removeEventListener)