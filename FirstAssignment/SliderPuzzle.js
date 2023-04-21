// Global variables.
let puzzleSize;
let container;
let tile_counter = 1;
const TILE_SIZE = 100;
let puzzleContainer;
let tiles;
let emptyTileIndex;
let emptyTileRow;
let emptyTileCol;
let puzzle = [];  // Tiles are stored here.
let isAnimating = false;  // To check if the animation still runs in the isPuzzleSolved() function.
let isSolved = false;
let firstShuffle = true;  // Boolean flag to check if the puzzle has been shuffled at least once.
let reShuffle;
let reShuffleButton;
let fastReShuffleButton;
let moves = 0;
let movesSpan;
let movesContainer;
let parentContainer;
let shuffleCounterContainer;
let shuffleCounterSpan;
let shuffleCounter = 0;
let timer;   // timer that is used for setInterval().
let time = 0;  // time during start of puzzle.
let timeSpan;

function init(puzzleSizeAsk) {
    // DOM and variable declarations.
    puzzleSize = parseInt(puzzleSizeAsk); // cast to an int.
    parentContainer = document.getElementById("parentContainer");
    puzzleContainer = document.getElementById("puzzleContainer");
    puzzleContainer.style.width = (puzzleSize * TILE_SIZE) + "px";
    puzzleContainer.style.height = (puzzleSize * TILE_SIZE) + "px";
    container = document.querySelector('#puzzleContainer');
    reShuffle = document.getElementById("reShuffle");
    reShuffleButton = document.getElementById("reShuffleButton");
    fastReShuffleButton = document.getElementById("fastReShuffleButton");
    movesSpan = document.getElementById("moves");
    movesContainer = document.getElementById("movesContainer");
    shuffleCounterContainer = document.getElementById("shuffleCounterContainer");
    shuffleCounterSpan = document.getElementById("shuffleCounterSpan");
    document.getElementById("playAgain").style.visibility = "visible";
    timeSpan = document.createElement("span");

    // make the shuffle buttons visible and align them and playAgain accordingly.
    parentContainer.style.width = (puzzleSize * TILE_SIZE) + "px";
    parentContainer.style.height = (puzzleSize * TILE_SIZE) + "px";
    reShuffle.style.visibility = "visible";
    reShuffle.style.top = (puzzleSize * TILE_SIZE)/2 + 50 + "px";
    document.getElementById("playAgain").style.top = (puzzleSize * TILE_SIZE)/2 + 55 + "px";
    movesContainer.style.top = (puzzleSize * TILE_SIZE)/2 + 70 + "px";
    movesContainer.style.visibility = "visible";
    shuffleCounterContainer.style.top = (puzzleSize * TILE_SIZE)/2 + 80 + "px";
    shuffleCounterContainer.style.visibility = "visible";

    for (let row = 0; row < puzzleSize; row++) {
        for (let col = 0; col < puzzleSize; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile', 'no-click');
            tile.style.backgroundPosition = `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`;
            tile.style.left = `${col * TILE_SIZE}px`;
            tile.style.top = `${row * TILE_SIZE}px`;
            tile.innerHTML = tile_counter.toString();  // assign tile number.
            tile_counter++;

            if (puzzleSize === 3) {
                tile.style.backgroundImage = "url('Tiger-300x300.jpg')";
            } else if (puzzleSize === 4) {
                tile.style.backgroundImage = "url('coast-400x400.png')";
            } else if (puzzleSize === 5) {
                tile.style.backgroundImage = "url('elephant-500x500.jpg')";
            } else {
                tile.style.backgroundImage = "url('secretsauce.jpg')";
            }

            container.appendChild(tile);
        }
    }

    tiles = document.querySelectorAll('.tile');   // all the tiles.

    // Make the last tile white.
    emptyTileIndex = tiles.length - 1;
    tiles[emptyTileIndex].classList.add("last-tile");
    tiles[emptyTileIndex].style.backgroundImage = 'none';
    tiles[emptyTileIndex].innerHTML = "";
    tiles[emptyTileIndex].appendChild(timeSpan);


    // Initialize puzzle array
    for (let row = 0; row < puzzleSize; row++) {
        puzzle[row] = [];
        for (let col = 0; col < puzzleSize; col++) {
            puzzle[row][col] = row * puzzleSize + col;
        }
    }

    // Find the position of the empty tile
    emptyTileRow = puzzleSize - 1;
    emptyTileCol = puzzleSize - 1;
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            // Calculate row and column of clicked tile and empty space
            const tileRow = parseInt(tile.style.top) / TILE_SIZE;
            const tileCol = parseInt(tile.style.left) / TILE_SIZE;
            const emptyTileRow = parseInt(tiles[emptyTileIndex].style.top) / TILE_SIZE;
            const emptyTileCol = parseInt(tiles[emptyTileIndex].style.left) / TILE_SIZE;

            // Check if clicked tile is adjacent to empty space
            if ((Math.abs(tileRow - emptyTileRow) === 1 && tileCol === emptyTileCol) ||
                (Math.abs(tileCol - emptyTileCol) === 1 && tileRow === emptyTileRow)) {
                // amount of moves is updated and written to div.
                moves++;
                movesSpan.textContent = moves;

                // Swap positions of clicked tile and empty space
                [tile.style.left, tiles[emptyTileIndex].style.left]
                    = [tiles[emptyTileIndex].style.left, tile.style.left];
                [tile.style.top, tiles[emptyTileIndex].style.top]
                    = [tiles[emptyTileIndex].style.top, tile.style.top];

                // Set isAnimating to true
                isAnimating = true;

                // Check if puzzle is solved after animation has completed
                setTimeout(() => {
                    // Set isAnimating back to false.
                    isAnimating = false;

                    if (isPuzzleSolved() && !isSolved) {
                        isSolved = true; // To make sure the end puzzle is only fired once.
                        pauseTimer();  // Stops the timer.

                        // Remove the tiles, except the last one, this also unloads the event handlers.
                        for (let i=0; i < tiles.length - 1; i++) {
                            tiles[i].remove();
                        }
                        tiles[emptyTileIndex].style.zIndex = "1";  // To move the last tile in front to see time.

                        // Re-apply the full background image.
                        if (puzzleSize === 3) {
                            puzzleContainer.style.backgroundImage = "url('Tiger-300x300.jpg')";
                        } else if (puzzleSize === 4) {
                            puzzleContainer.style.backgroundImage = "url('coast-400x400.png')";
                        } else if (puzzleSize === 5) {
                            puzzleContainer.style.backgroundImage = "url('elephant-500x500.jpg')";
                        } else {
                            // for illegal puzzleSizeAsk values.
                            puzzleContainer.style.backgroundImage = "url('secretsauce.jpg')";
                        }

                        document.getElementById("playAgain").textContent = "Play again?"
                        reShuffleButton.disabled = true;  // Have to reload the game to shuffle again.
                        fastReShuffleButton.disabled = true;

                        // Display winScreen div.
                        document.getElementById("winScreen").style.visibility = "visible";
                    }
                }, 500);
            }
        });
    });
}

// Function to start the timer, updates 10 times a second.
function startTimer() {
    timer = setInterval(() => {
        time += 0.1;

        if (time < 60) {
            // Displays seconds.
            timeSpan.textContent = time.toFixed(1) + "s";
        } else {
            // Displays minutes and seconds in Xm XXs format.
            timeSpan.textContent = Math.floor(time/60)
                + "m " + (time % 60). toFixed(1).toString().padStart(2, "0") + "s";
        }

    }, 100)
}


// Function to pause the timer.
function pauseTimer() {
    // Clear the timer interval, pausing the timer.
    clearInterval(timer);
}


// Function to shuffle tiles, takes a boolean argument
// if the shuffling should be with or without animation.
function shuffleTiles(isFast) {
    // Removes no-click class from the tiles when one of the
    // shuffle buttons have been clicked.
    if (firstShuffle) {
        for (let tile of tiles) {
            tile.classList.remove('no-click');
        }
        firstShuffle = false;

        //startTime = new Date().getTime();
        startTimer();  // Timer counter begins.
    }

    // Add to shuffle count.
    shuffleCounterSpan.textContent = ++shuffleCounter;

    // Shuffles either 81, 144 or 225 times, legally ...
    const numShuffles = Math.pow(puzzleSize * 3, 2);
    const shuffleDelay = 50; // delay in milliseconds
    let shuffleCount = 0;
    reShuffleButton.disabled = true;
    fastReShuffleButton.disabled = true;
    shuffle();

    if (!isFast) {
        pauseTimer();
        // Sets the transition to 0.05s for all tiles with slow shuffle.
        for (let tile of tiles) {
            tile.style.transition = "left 0.05s, top 0.05s";
        }
    }

    function shuffle() {
        // Find all legal moves
        let legalMoves = [];
        if (emptyTileRow > 0) {
            legalMoves.push([emptyTileRow - 1, emptyTileCol]);
        }
        if (emptyTileRow < puzzleSize - 1) {
            legalMoves.push([emptyTileRow + 1, emptyTileCol]);
        }
        if (emptyTileCol > 0) {
            legalMoves.push([emptyTileRow, emptyTileCol - 1]);
        }
        if (emptyTileCol < puzzleSize - 1) {
            legalMoves.push([emptyTileRow, emptyTileCol + 1]);
        }

        // Select a random legal move
        const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        const [moveRow, moveCol] = move;

        // Swap the empty tile with the selected tile
        [puzzle[emptyTileRow][emptyTileCol], puzzle[moveRow][moveCol]]
            = [puzzle[moveRow][moveCol], puzzle[emptyTileRow][emptyTileCol]];
        emptyTileRow = moveRow;
        emptyTileCol = moveCol;

        // Update tile positions based on shuffled puzzle array
        for (let row = 0; row < puzzleSize; row++) {
            for (let col = 0; col < puzzleSize; col++) {
                const index = puzzle[row][col];
                tiles[index].style.left = `${col * TILE_SIZE}px`;
                tiles[index].style.top = `${row * TILE_SIZE}px`;
            }
        }

        // Increment shuffle count in this recursive function call.
        shuffleCount++;

        // Without delay.
        if (isFast) {
            if (shuffleCount < numShuffles) {
                shuffle();
            } else {
                    reShuffleButton.disabled = false; // Can shuffle again.
                    fastReShuffleButton.disabled = false;
            }

        // With delay animation.
        } else {
            if (shuffleCount < numShuffles) {
                setTimeout(shuffle, shuffleDelay);
            } else {
                // Sets the transition from 0.05s to 0.5s for all tiles again on the last shuffle.
                for (let tile of tiles) {
                    tile.style.transition = "left 0.5s, top 0.5s";
                    reShuffleButton.disabled = false; // Can shuffle again.
                    fastReShuffleButton.disabled = false;
                }
                startTimer();  // Continue Timer.
            }
        }
    }
}

// Returns true if the puzzle pieces are back together.
function isPuzzleSolved() {
    // Only check if puzzle is solved if animation is not currently playing
    if (!isAnimating) {
        for (let i = 0; i < tiles.length; i++) {
            const row = Math.floor(i / puzzleSize);
            const col = i % puzzleSize;
            
            // A clever predicate that uses the left and top location 
            // of a tile and its index to check if they're not the same.
            if ((tiles[i].style.left !== `${col * TILE_SIZE}px`)
                || (tiles[i].style.top !== `${row * TILE_SIZE}px`)) {
                    return false;  // If the slider pieces are out-of-order it returns false.
            }
        }
        return true;
    }
}