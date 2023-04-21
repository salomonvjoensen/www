<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function (){
    let dotCounterDiv = document.getElementById("dotCounter");
    let container = document.getElementById("container");
    let circleSizeRange = document.getElementById('circleSizeRange');
    let circleElement = document.getElementById('circle');
    let circleSizeSpan = document.getElementById("circleSizeSpan");
    let circleAreaSpan = document.getElementById("circleAreaSpan");
    // the offset correction for the container used for radius of the circle.
    const CONTAINER_HALF_SIZE = container.offsetWidth/2;
    let dotCounter = 0;  // dot counter.
    let collision = 0;
    let collisionCounter = document.getElementById("collisions");
    let radius = parseInt(circleSizeRange.value); // initial radius of 100
    let timeoutId;
    let startButton = document.getElementById('start');
    let stopButton = document.getElementById('stop');
    let clearButton = document.getElementById('clear');
    // The initial area of the circle for a circle of 100 pixel radius.
    let circleArea = Math.floor(radius * radius * Math.PI);
    let probabilitySpan = document.getElementById("probabilitySpan");
    let updateCycle = document.getElementById("updateCycle");
    let dots = [];  // array that will store all the dots.
    let circleArray = new Array(CONTAINER_HALF_SIZE*2); // Array for the size of the container div.

    for (let i=0; i < circleArray.length; i++) {
        // For using in the grid for the circle.
        circleArray[i] = new Array(circleArray.length).fill(false);
    }

    // Recursively call generateDot() function.
    function generateDots() {
        for (let i = 0; i < updateCycle.value; i++) {
            generateDot();
        }

        timeoutId = setTimeout(generateDots, 1);
    }

    // Pythagorean theorem to check if point is within radius.
    function isDotInsideCircle(x, y, radius) {
        return (x * x + y * y) <= (radius * radius);
    }

    // Generates dot inside the array, based on radius of the circle.
    function generateDot() {
        // Generate random left and top positions within the circle.
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius * Math.random();
        let y = Math.sin(angle) * radius * Math.random();
        let left = Math.floor(circleElement.offsetWidth / 2 + x);
        let top = Math.floor(circleElement.offsetHeight/ 2 + y);

        // Check for collision
        if (circleArray[left][top] === true) {
            // Collision detected
            collisionCounter.textContent = (++collision).toString();
        } else {
            // Update circleArray
            circleArray[left][top] = true;
            dotCounterDiv.textContent = (++dotCounter).toString();

            if (dotCounter/circleArea < 1) {
                probabilitySpan.textContent = (100 * (dotCounter) / circleArea).toFixed(3).toString();
            } else {
                // can't have more than 100% probability for collision ...
                probabilitySpan.textContent = "100";
            }

            // Create a dot element and set its left and top positions.
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.left = left + CONTAINER_HALF_SIZE - 1 - radius + "px"; // centering correction.
            dot.style.top = top + CONTAINER_HALF_SIZE - 1 - radius + "px";

            // Append the dot to the circle element
            circleElement.appendChild(dot);
            dots.push(dot);
        }
    }

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        stopButton.disabled = false;
        clearButton.disabled = true;
        startButton.innerHTML = 'Continue';
        generateDots();
    });

    stopButton.addEventListener('click', () => {
        clearTimeout(timeoutId);
        startButton.disabled = false;
        stopButton.disabled = true;
        clearButton.disabled = false;
    });

    function updateCircleSize() {
        radius = circleSizeRange.value;
        circleSizeSpan.textContent = circleSizeRange.value.padStart(4, "0");
        circleArea = Math.ceil(Math.PI * Math.pow(radius, 2));
        circleAreaSpan.textContent = circleArea.toLocaleString("da-DK");

        updateCircle();
        updateDots();
    }

    circleSizeRange.addEventListener('input', updateCircleSize);

    // Updates the dots.
    function updateDots() {
        // Iterate through all the dots to see if they're inside the circle.
        dots = dots.filter(dot => {
            let left = parseInt(dot.style.left);
            let top = parseInt(dot.style.top);
            let x = left - container.offsetWidth / 2;
            let y = top - container.offsetHeight / 2;

            // If they're not inside the circle, they're removed.
            if (!isDotInsideCircle(x, y, radius)) {
                dot.remove();
                circleArray[left][top] = false;

                return false;
            }
            return true;
        });

        // Re-count dots
        dotCounter = document.getElementsByClassName("dot").length;

        // Update the new dot amount.
        dotCounterDiv.innerText = dotCounter.toString();

        if (dotCounter/circleArea < 1) {
            probabilitySpan.textContent = (100 * (dotCounter) / circleArea).toFixed(3).toString();
        } else {
            probabilitySpan.textContent = "100";
        }
    }

    // Clear all the dots.
    clearButton.addEventListener('click', () => {
        container.innerHTML = '<div id="circle"></div>';
        circleElement = document.getElementById('circle');
        updateCircle();
        dotCounter = 0;
        dotCounterDiv.innerText = collisionCounter.innerText = '0';
        startButton.innerHTML = "Start";
        probabilitySpan.textContent = "0.000";

        // re-clear circleArray.
        for (let i=0; i <circleArray.length; i++) {
            // For using in the grid for the circle.
            circleArray[i] = new Array(800).fill(false);
        }
    });

    // Function used in the updateCircleSize() function and circleSizeRange input event listener.
    function updateCircle() {
        circleElement.style.width = circleElement.style.height = circleSizeRange.value * 2 + 'px';
        circleElement.style.borderRadius = circleSizeRange.value + 'px';
        circleElement.style.left = (container.offsetWidth - circleSizeRange.value) + 'px';
        circleElement.style.top = (container.offsetHeight - circleSizeRange.value) + 'px';
    }
=======
document.addEventListener("DOMContentLoaded", function (){
    let dotCounterDiv = document.getElementById("dotCounter");
    let container = document.getElementById("container");
    let circleSizeRange = document.getElementById('circleSizeRange');
    let circleElement = document.getElementById('circle');
    let circleSizeSpan = document.getElementById("circleSizeSpan");
    let circleAreaSpan = document.getElementById("circleAreaSpan");
    let dotCounterPS = document.getElementById("dotCounterPS");
    let collisionPS = document.getElementById("collisionPS");
    let oldDotCounter = 0;
    let oldCollision = 0;
    let updatesPerSecond;
    // the offset correction for the container used for radius of the circle.
    const CONTAINER_HALF_SIZE = container.offsetWidth/2;
    let dotCounter = 0;  // dot counter.
    let collision = 0;
    let collisionCounter = document.getElementById("collisions");
    let radius = parseInt(circleSizeRange.value); // initial radius of 100
    let timeoutId;
    let startButton = document.getElementById('start');
    let stopButton = document.getElementById('stop');
    let clearButton = document.getElementById('clear');
    // The initial area of the circle for a circle of 100 pixel radius.
    let circleArea = Math.floor(radius * radius * Math.PI);
    let probabilitySpan = document.getElementById("probabilitySpan");
    let updateCycle = document.getElementById("updateCycle");
    let dots = [];  // array that will store all the dots.
    let circleArray = new Array(CONTAINER_HALF_SIZE*2); // Array for the size of the container div.

    for (let i=0; i < circleArray.length; i++) {
        // For using in the grid for the circle.
        circleArray[i] = new Array(circleArray.length).fill(new Boolean(false));
    }

    // average of the counts and collisions per second, updates every second.
    function perSecond() {
        // Difference is recorded.
        dotCounterPS.textContent = dotCounter - oldDotCounter
        collisionPS.textContent = collision - oldCollision

        // Value stored in 
        oldDotCounter = dotCounter;
        oldCollision = collision;
    }

    // Recursively call generateDot() function.
    function generateDots() {
        for (let i = 0; i < updateCycle.value; i++) {
            generateDot();
        }

        timeoutId = setTimeout(generateDots, 1);
    }

    // Pythagorean theorem to check if point is within radius.
    function isDotInsideCircle(x, y, radius) {
        return (x * x + y * y) <= (radius * radius);
    }

    // Generates dot inside the array, based on radius of the circle.
    function generateDot() {
        // Generate random left and top positions within the circle.
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius * Math.random();
        let y = Math.sin(angle) * radius * Math.random();
        let left = Math.floor(circleElement.offsetWidth / 2 + x);
        let top = Math.floor(circleElement.offsetHeight/ 2 + y);

        // Check for collision
        if (circleArray[left][top] === true) {
            // Collision detected
            collisionCounter.textContent = (++collision).toString();
        } else {
            // Update circleArray
            circleArray[left][top] = true;
            dotCounterDiv.textContent = (++dotCounter).toString();

            if (dotCounter/circleArea < 1) {
                probabilitySpan.textContent = (100 * (dotCounter) / circleArea).toFixed(3).toString();
            } else {
                // can't have more than 100% probability for collision ...
                probabilitySpan.textContent = "100";
            }

            // Create a dot element and set its left and top positions.
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.left = left + CONTAINER_HALF_SIZE - 1 - radius + "px"; // centering correction.
            dot.style.top = top + CONTAINER_HALF_SIZE - 1 - radius + "px";

            // Append the dot to the circle element
            circleElement.appendChild(dot);
            dots.push(dot);
        }
    }

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        stopButton.disabled = false;
        clearButton.disabled = true;
        startButton.innerHTML = 'Continue';
        generateDots();
            
        // Updates dots and collisions 10 times per second
        updatesPerSecond = setInterval(perSecond, 1000);
    });

    stopButton.addEventListener('click', () => {
        clearTimeout(timeoutId);
        startButton.disabled = false;
        stopButton.disabled = true;
        clearButton.disabled = false;

        clearInterval(updatesPerSecond);
    });

    function updateCircleSize() {
        radius = circleSizeRange.value;
        circleSizeSpan.textContent = circleSizeRange.value.padStart(4, "0");
        circleArea = Math.ceil(Math.PI * Math.pow(radius, 2));
        circleAreaSpan.textContent = circleArea.toLocaleString("da-DK");

        updateCircle();
        updateDots();
        perSecond();  // force updates, since the resized circle truncates dots/size.
    }

    circleSizeRange.addEventListener('input', updateCircleSize);

    // Updates the dots.
    function updateDots() {
        // Iterate through all the dots to see if they're inside the circle.
        dots = dots.filter(dot => {
            let left = parseInt(dot.style.left);
            let top = parseInt(dot.style.top);
            let x = left - container.offsetWidth / 2;
            let y = top - container.offsetHeight / 2;

            // If they're not inside the circle, they're removed.
            if (!isDotInsideCircle(x, y, radius)) {
                dot.remove();
                circleArray[left][top] = false;

                return false;
            }
            return true;
        });

        // Re-count dots
        dotCounter = document.getElementsByClassName("dot").length;

        // Update the new dot amount.
        dotCounterDiv.innerText = dotCounter.toString();

        if (dotCounter/circleArea < 1) {
            probabilitySpan.textContent = (100 * (dotCounter) / circleArea).toFixed(3).toString();
        } else {
            probabilitySpan.textContent = "100";
        }
    }

    // Clear all the dots.
    clearButton.addEventListener('click', () => {
        startButton.innerHTML = "Start";
        container.innerHTML = '<div id="circle"></div>';  // Effectively removes all dots.
        circleElement = document.getElementById('circle');  // Re-assign circleElement.
        updateCircle();
        dotCounter = 0;
        collision = 0;
        oldDotCounter = 0;
        oldCollision = 0;
        dotCounterDiv.innerText = collisionCounter.innerText = '0';
        probabilitySpan.textContent = "0.000";
        dotCounterPS.innerText = "0";
        collisionPS.innerText = "0";

        // re-clear circleArray.
        for (let i=0; i <circleArray.length; i++) {
            // For using in the grid for the circle.
            circleArray[i] = new Array(800).fill(new Boolean(false));
        }
    });

    // Function used in the updateCircleSize() function and circleSizeRange input event listener.
    function updateCircle() {
        circleElement.style.width = circleElement.style.height = circleSizeRange.value * 2 + 'px';
        circleElement.style.borderRadius = circleSizeRange.value + 'px';
        circleElement.style.left = (container.offsetWidth - circleSizeRange.value) + 'px';
        circleElement.style.top = (container.offsetHeight - circleSizeRange.value) + 'px';
    }
>>>>>>> www/master
});