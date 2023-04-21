<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {
    let circleGame = document.getElementById("circleGame");
    let circleGameContainer = document.getElementById("circleGameContainer");

    let x = 50;
    let y = 50;
    let dx = Math.random();
    let dy = Math.random();

    function moveCircle() {
        x += dx;
        y += dy;

        // Change the horizontal direction of the circle when it hits an edge in the x-axis
        // into the opposite direction.
        if (x + circleGame.offsetWidth > circleGameContainer.offsetWidth || x < 0) {
            dx = -dx;

            // Also change the angle o the vertical direction at random.
            if (dy > 0) {
                dy = Math.random();
            } else {
                dy = -Math.random();
            }

        }

        // Change the vertical direction of the circle when it hits an edge in the y-axis
        // into the opposite direction.
        if (y + circleGame.offsetHeight > circleGameContainer.offsetHeight || y < 0) {
            dy = -dy;

            // Also change the angle of the horizontal direction at random.
            if (dx > 0) {
                dx = Math.random();
            } else {
                dx = -Math.random();
            }
        }

        // Update the
        circleGame.style.left = x + "px";
        circleGame.style.top = y + "px";
    }

    // Runs continuously after page is loaded, updates 100 times a second.
    setInterval(moveCircle, 10);
=======
document.addEventListener("DOMContentLoaded", function () {
    let circleGame = document.getElementById("circleGame");
    let circleGameContainer = document.getElementById("circleGameContainer");

    let x = 50;
    let y = 50;
    let dx = Math.random();
    let dy = Math.random();

    function moveCircle() {
        x += dx;
        y += dy;

        // Change the horizontal direction of the circle when it hits an edge in the x-axis
        // into the opposite direction.
        if (x + circleGame.offsetWidth > circleGameContainer.offsetWidth || x < 0) {
            dx = -dx;

            // Also change the angle o the vertical direction at random.
            if (dy > 0) {
                dy = Math.random();
            } else {
                dy = -Math.random();
            }

        }

        // Change the vertical direction of the circle when it hits an edge in the y-axis
        // into the opposite direction.
        if (y + circleGame.offsetHeight > circleGameContainer.offsetHeight || y < 0) {
            dy = -dy;

            // Also change the angle of the horizontal direction at random.
            if (dx > 0) {
                dx = Math.random();
            } else {
                dx = -Math.random();
            }
        }

        // Update the
        circleGame.style.left = x + "px";
        circleGame.style.top = y + "px";
    }

    // Runs continuously after page is loaded, updates 100 times a second.
    setInterval(moveCircle, 10);
>>>>>>> www/master
});