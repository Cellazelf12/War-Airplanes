window.addEventListener("load", init);

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

let background_anim = 0;

let BACKGROUND = new Image();

const path = "../assets/sprites/backgrounds";

//Funcion inicializadora
function init() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const background = localStorage.getItem("background") || "background1";

    BACKGROUND.src = `${path}/${background}.png`;

    window.addEventListener("click", handleButton);

    window.requestAnimationFrame(drawBackground);
}

//Defino segun el boton el fondo
function handleButton(button) {
    let text = button.target.id;

    switch (text) {
        case "option1":
            setBackground("background1");
            break;
        case "option2":
            setBackground("background2");
            break;
        default:
            break;
    }
}

//Evalua si el boton clickeado es el mismo si tiene elegido, si es el caso, corta la función, sino, continua.
function setBackground(background) {
    if(BACKGROUND.src == `${path}/${background}.png`){
        return;
    }
    localStorage.setItem("background", background);
    BACKGROUND.src = `${path}/${background}.png`;
}

//La función que dibuja el fondo
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(BACKGROUND, 0, background_anim, canvas.width, canvas.height);
    ctx.drawImage(BACKGROUND, 0, background_anim - canvas.height, canvas.width, canvas.height);

    background_anim += 1; // Velocidad de movimiento
    if (background_anim >= canvas.height) {
        background_anim = 0;
    }

    window.requestAnimationFrame(drawBackground);
}