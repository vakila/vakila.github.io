//var chosenColor;

function getNextColorClass() {
    var themePrefix = "theme-base-"
    var colors = ['08', // Red
                  '09', // Orange
                //'0a', // Yellow
                  '0b', // Green
                  '0c', // Cyan
                  '0d', // Blue
                  '0e', // Magenta
                  '0f', // Brown
    ];

    var currentClass = document.body.className
    var currentColor = currentClass.slice(-2);
    var currentIndex = colors.indexOf(currentColor); // -1 if no color class
    var nextIndex = (currentIndex == colors.length ? 0 : currentIndex + 1);
    var nextColor = colors[nextIndex];
    var nextClass;
    if (nextColor) {
        nextClass = themePrefix + nextColor;
    } else {
        nextClass = ""
    }
    console.log(currentClass, " to ", nextClass);
    return nextClass;
    //chosenColor = nextClass;
}

function updateColor() {
    var nextClass = getNextColorClass();
    document.body.className = nextClass;
    console.log("Changed color.")
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem("colorClass", nextClass);
        console.log("Saved color choice to web storage.");
        console.log(localStorage);
    } else {
        console.log("No web storage support, color won't be saved.");
    }
}

function addColorButton() {
    var buttonList = document.getElementById("sidebar-buttons");
    var colorButton = document.createElement("li");
    colorButton.id = "color-button";
    colorButton.onclick = function() { updateColor(); };
    colorButton.innerHTML = '<a class="btn-social btn-outline" title="I wonder what this does..."><i class="fa fa-fw fa-question-circle"></i></a>';
    console.log(colorButton);
    buttonList.appendChild(colorButton);
}

function addColorLink() {
    var credits = document.getElementById("credits");
    var colorlink = document.createElement("a");
    var linkText = document.createTextNode("Want a new color?");
    colorlink.appendChild(linkText);
    colorlink.title = "Click for relief!";
    colorlink.href = "#";
    colorlink.onclick = function() { updateColor(); };
    credits.innerHTML += " ";
    credits.appendChild(colorlink);
}

function restoreColorChoice() {
    var savedColor = localStorage.getItem("colorClass");
    if (savedColor !== null) {
        document.body.className = savedColor;
        console.log("Found saved color: ", savedColor);
    } else {
        console.log("No saved color.");
    }
}

function initializeColors() {
    restoreColorChoice();
    addColorButton();
    //addColorLink();
}

window.onload = initializeColors;
