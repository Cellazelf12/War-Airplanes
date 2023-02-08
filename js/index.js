
let indexAvion = 1;

let randomX;
let randomY;

let puntos = 0;
let monedas = 0;

let monedasEnJuego = [];
let avionSeleccionado = 1;

let sky = document.getElementById("js-cielo");
let style = document.getElementById("style");
let avion = document.getElementById("avion");
let contadorMonedas = document.getElementById("monedas");
let player = document.getElementById("player");

const DAY_STYLE = "styles/day.css";
const NIGHT_STYLE = "styles/night.css";

let posicionHorizontal = 0;

let posicionVertical = 0;

const TIME_BETWEEN_FONDOS = getMilliseconds("Minutes", 1);

const WIDTH = window.outerWidth;
const HEIGHT = window.outerHeight;

window.addEventListener("load", init);

function loadStats() {
    monedas = parseInt(localStorage.getItem("monedas")) || 0;
    avionesComprados = JSON.parse(localStorage.getItem("avionesComprados")) || [1];
    avionSeleccionado = parseInt(localStorage.getItem("avionActual")) || 1;

    document.getElementById("monedas").innerText = monedas;
}

function init() {
    loadStats();

    moveHorizontally(WIDTH / 2);
    moveVertically(HEIGHT / 2);

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(gameLoop);
    window.setInterval(() => {
        swapStyleSheet(style.getAttribute("href") === DAY_STYLE ? NIGHT_STYLE : DAY_STYLE);
    }, TIME_BETWEEN_FONDOS);
}

function swapStyleSheet(sheet) {
    style.setAttribute("href", sheet);
}

function handleKeyDown(event) {
    if (event.isComputing) {
        return;
    }

    switch (event.code) {
        case "ArrowRight":
        case "KeyD":
            moveHorizontally(9);
            break;
        case "ArrowLeft":
        case "KeyA":
            moveHorizontally(-9);
            break;
        case "ArrowDown":
        case "KeyS":
            moveVertically(9);
            break;
        case "ArrowUp":
        case "KeyW":
            moveVertically(-10);
            break;
    }
}

function updateAvionSprite() {
    avion.src = `assets/sprites/airplanes/${avionSeleccionado}/${indexAvion}.png`;

    indexAvion = (indexAvion + 2) % 4;
}

function updateMonedasText() {
    contadorMonedas.innerText = monedas;
}

function gameLoop() {

    updateAvionSprite();

    updateMonedasText();

    coinLoop();

    window.requestAnimationFrame(gameLoop);
}

function createCoin() {
    let coin = document.createElement('img');
    coin.src = "assets/sprites/coin/coin.png";
    coin.style.position = "absolute";
    coin.style.transition = "0.5s transform";
    let randomY = Math.floor((Math.random() * HEIGHT / 2) + 1);
    let randomX = Math.floor((Math.random() * WIDTH) + 1);
    coin.style.transform = `translate(${randomX}px, ${randomY}px)`;
    return coin;
}

function coinLoop() {
    if (monedasEnJuego.length >= 5) {
        return;
    }

    let coin = createCoin();
    sky.append(coin);
    monedasEnJuego.push(coin);
    localStorage.setItem("monedas", monedas);
}

function detectCollision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}


function moveVertically(i) {
    let vTop, vNum;
    vTop = player.offsetTop;
    vNum = parseInt(vTop);
    vNum += i;

    if (vNum + player.offsetHeight <= HEIGHT && vNum >= 0) {
        player.style.top = `${vNum}px`;
    }

    borrarMonedas(true);
}

function moveHorizontally(i) {
    let hLeft, hNum;
    hLeft = player.offsetLeft;
    hNum = parseInt(hLeft);
    hNum += i;

    if (hNum + player.offsetWidth <= WIDTH && hNum >= 0) {
        player.style.left = `${hNum}px`;
    }

    borrarMonedas(true);
}

function borrarMonedas(agregar) {
    monedasEnJuego.forEach(coin => {
        if (detectCollision(coin, avion)) {
            sky.removeChild(coin);
            const index = monedasEnJuego.indexOf(coin);
            if (index > -1) {
                monedasEnJuego.splice(index, 1);
            }
            if (agregar) {
                monedas++;
            }
        }
    });
}

function getMilliseconds(timeunit, time) {
    let response = 0;

    if (timeunit === "Seconds") {
        response = (time * 1000);
    } else if (timeunit === "Minutes") {
        response = (time * 60000);
    }

    return response;
}
