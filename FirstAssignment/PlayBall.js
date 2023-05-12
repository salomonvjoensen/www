function init() {
    let startTime;    // store game start time.
    let timer;        // current time after start time.
    let isRunning = true;
    let tries = 0;
    let mouseClicks = 0;
    let amountOfBalls = document.getElementById("amountOfBalls");
    let ballsLeft = document.getElementById("amountOfBlueBalls");
    let amountOfClicks = document.getElementById("amountOfClicks");
    let startAmountOfBalls = amountOfBalls.value;
    ballsLeft.innerHTML = amountOfBalls.value;

    let speed = document.getElementById("speedOption").value;
    let ballSize = document.getElementById("ballSizeOption").value;
    let circleWindowPosition
        = document.getElementById("circle").getBoundingClientRect();

    // Get the width and height of the window
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Make the center, time elapsed and quit divs visible.
    document.getElementById("centerDiv").style.visibility = "visible";
    document.getElementById("timeDiv").style.visibility = "visible";
    document.getElementById("quitDiv").style.visibility = "visible";

    // hide the "Play Ball!" menu screen and remove the start and circle div.
    document.getElementById("backSignImg").remove();
    document.getElementById("start").remove();
    document.getElementById("showCircleDiv").remove();
    document.getElementById("menu").style.visibility = "hidden";

    startTimer();

    // Function to start the timer.
    function startTimer() {
        // Get the current time and store it in the startTime variable.
        startTime = new Date().getTime();

        // Update the timer every 100 milliseconds.
        timer = setInterval(updateTimer, 100);
    }

    // Function to update the timer.
    function updateTimer() {
        // Calculate the time elapsed in seconds.
        let timeElapsed = (new Date().getTime() - startTime) / 1000;

        // Round the time elapsed to two decimal places
        // to display hundredths of a second.
        timeElapsed = timeElapsed.toFixed(2);

        // Update the timer display.
        document.getElementById("timer").textContent = timeElapsed + " s";
    }

    // Function to stop the timer.
    function stopTimer() {
        // Clear the timer interval.
        clearInterval(timer);
    }

    function clickBalls() {
        {
            // Game ends and the finishing touches are added.
            if (this === balls[greenBallIndex]) {
                stopTimer();
                this.classList.add('green');
                isRunning = false;
                document.getElementById("quitDiv").style.visibility
                    = "hidden";

                // fancy-pants innerHTML editing instead of document.writeln.
                document.getElementById("centerDiv").innerHTML =
                    "<h1 style='z-index: 100'>It took "
                    + tries + " red balls out of "
                    + startAmountOfBalls
                    + " blue balls, and "
                    + document.getElementById("timer").innerHTML
                    + "econds.<br />"
                    + "You clicked the screen " + mouseClicks + " times. at " + speed + " speed.</h1>";
                this.innerHTML = "You<br/>win!";
                this.style.setProperty("font-size",ballSize/2 + "px");
                this.style.width = ballSize*2 + "px";
                this.style.height = ballSize*2 + "px";
                this.style.borderRadius = ballSize + "px";
                this.style.left = parseInt(this.style.left)
                    - (ballSize/2) + "px";
                this.style.top = parseInt(this.style.top)
                    - (ballSize/2) + "px";

                // All the event listeners for the balls are removed.
                for (let ball of balls) {
                    ball.removeEventListener("click", clickBalls);
                }

                document.getElementById("timeDiv").remove();
                document.removeEventListener("click", mouseClickHandler);
                document.removeEventListener("resize", windowResize);
                ballSizeOption.removeEventListener("input", this);
                document.getElementById("menu").style.visibility = "visible";

                // Adds the play again button,
                // which reloads the page when clicked.
                let endDiv = document.createElement("div");
                endDiv.classList.add('endScreenStyle', 'endDiv');
                endDiv.textContent = "Play again?";
                endDiv.addEventListener("click", function() {
                    location.reload();
                });
                document.getElementById("menu").appendChild(endDiv);

                // Adds the button to return to the previous page.
                let returnDiv = document.createElement("div");
                returnDiv.classList.add('endScreenStyle', 'returnDiv');
                returnDiv.textContent = "Return to menu.";
                returnDiv.addEventListener("click", function() {
                    window.history.back();
                });
                document.getElementById("menu").appendChild(returnDiv);

            } else {

                // The ball clicked wasn't the green ball, and it is removed
                // after 1.5 seconds.
                if (this.className === 'ball') {
                    this.classList.add('red');
                    this.style.width = "0"
                    this.style.height = "0";
                    tries++;
                    amountOfBalls.value--;
                    ballsLeft.innerHTML = amountOfBalls.value;
                    setTimeout(() => {
                        this.removeEventListener("click", clickBalls);
                        this.remove();
                    }, 1500);
                }
            }
        }
    }
    // Updates the amount of clicks.
    function mouseClickHandler() {
        mouseClicks++;
        amountOfClicks.innerHTML = mouseClicks.toString();
    }

    // Event handler for updates the amount of clicks on the document.
    document.addEventListener("click", mouseClickHandler);

    // Create div elements based on amountOfBalls.
    let balls = [];
    for (let i = 0; i < amountOfBalls.value; i++) {
        let ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.width = ballSize + "px";
        ball.style.height = ballSize + "px";
        ball.style.borderRadius = ballSize/2 + "px";

        // Set the initial position at the same position
        // as the display ball at random direction times speed.
        ball.x = circleWindowPosition.left;
        ball.y = circleWindowPosition.top;
        ball.dx = (Math.random() * 2 - 1) * speed;
        ball.dy = (Math.random() * 2 - 1) * speed;

        // Add an event listener to change the color of the ball when clicked.
        ball.addEventListener('click', clickBalls);

        balls.push(ball);
        document.body.appendChild(ball);
    }

    // Select one ball to be green.
    let greenBallIndex = Math.floor(Math.random() * balls.length);

    // Update the position of the Balls.
    function update() {
        if (!isRunning) return;

        updateTimer();

        for (let ball of balls) {
            // Update the position of the ball.
            let newX = ball.x + ball.dx;
            let newY = ball.y + ball.dy;

            // Check for collision with the edges of the window.
            if (newX < 0 || newX > (windowWidth - ballSize)) {
                ball.dx = -ball.dx;
            } else {
                ball.x = newX;
            }
            if (newY < 0 || newY > (windowHeight - ballSize)) {
                ball.dy = -ball.dy;
            } else {
                ball.y = newY;
            }

            // Update the position of the ball element.
            ball.style.left = ball.x + 'px';
            ball.style.top = ball.y + 'px';
        }

        requestAnimationFrame(update);
    }

    // function to re-assign window width and height upon resizing.
    function windowResize() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        for (let ball of balls) {
            // Check if the ball is outside the window.
            if (ball.x > (windowWidth - ballSize)) {
                ball.x = windowWidth - ballSize;
            }
            if (ball.y > (windowHeight - ballSize)) {
                ball.y = windowHeight - ballSize;
            }

            // Update the position of the ball element.
            ball.style.left = ball.x + 'px';
            ball.style.top = ball.y + 'px';
        }
    }
    window.addEventListener("resize", windowResize);
    update();
}

let ballSizeOption;  // Size of the blue ball.

// Loads the event listener to be able to re-size the preview size of the
// ball, after page loads.
document.addEventListener("DOMContentLoaded", function() {
    ballSizeOption = document.querySelector('#ballSizeOption');

    ballSizeOption.addEventListener('input', (event) => {
        // update upon value change
        const value = event.target.value;
        document.getElementById("circle").style.width = value + "px";
        document.getElementById("circle").style.height = value + "px";
        document.getElementById("circle").style.borderRadius = value/2 +"px";
        document.getElementById("ballSizeShower").innerHTML = value;
    });
});

// Prompt to quit the game. Reloads the page if confirmed.
function quit() {
    if (confirm("Are you sure you want to quit?")) {
        location.reload();
    }
}
