// links
const randomBtn = document.getElementById('randomColorBtn');
const cycleBtn = document.getElementById('cycleColorBtn');
const body = document.body;

// 1. Random colors

/**
 * @returns {string} Random hex-colorт.
 */
function getRandomHexColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + color.padStart(6, '0');
}

randomBtn.addEventListener('click', () => {
    const newColor = getRandomHexColor();
    body.style.backgroundColor = newColor;
});


// 2. Colors cycle

const predefinedColors = [
    '#f7a7a3', 
    '#a3c1f5', 
    '#a3f5b7', 
    '#f5eda3', 
    '#e1a3f5'  
];

let colorIndex = 0;

cycleBtn.addEventListener('click', () => {
    const newColor = predefinedColors[colorIndex];
    body.style.backgroundColor = newColor;
    colorIndex++;
    if (colorIndex >= predefinedColors.length) {
        colorIndex = 0;
    }
});