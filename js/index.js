let player = {
    avion: new Image(),
    indexAvion: 1,
    x: 0,
    y: 0,
    avionSeleccionado: parseInt(localStorage.getItem("avionActual")) || 1,
    radio: 181.5
}

let variables = {
    randomX: 0,
    randomY: 0,
    fps: 0,
    lastTime: 0,
    prevTime: 0,
    frames: 0,
    background_anim: 0
};

let stats = {
    monedas: parseInt(localStorage.getItem("monedas")) || 0,
};

let gameObjects = {
    monedasEnJuego: [],
    enemigosEnJuego: [],
};

let moneda = {
    indexCoin: 1,
    coin: new Image()
}

const constants = {
    canvas: document.getElementById("game-canvas"),
    ctx: null,

    DAY_BACKGROUND: new Image(),
    NIGHT_BACKGROUND: new Image(),
    TIME_BETWEEN_FONDOS: getMilliseconds("Minutes", 1),
    TIME_BETWEEN_ENEMIES: getMilliseconds("Seconds", 5),

    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight
};


window.addEventListener("load", init);

// Generar una cantidad de números aleatorios al principio del juego
let randomNumbers = [];

// Contador para saber qué número aleatorio usar
let randomCounter = 0;

async function init() {

    for (let i = 0; i < 1000; i++) {
        randomNumbers.push({
            x: getRandomNumber(1, constants.WIDTH),
            y: getRandomNumber(10, constants.HEIGHT / 2)
        });
    }

    const path = "../assets/sprites/backgrounds";

    constants.DAY_BACKGROUND.src = `${path}/background.png`;

    constants.NIGHT_BACKGROUND.src = `${path}/backgroundNight.png`;

    lastTime = performance.now();

    //Optimización del canvas
    constants.ctx = constants.canvas.getContext('2d', { alpha: false, desynchronized: true });
    constants.ctx.imageSmoothingEnabled = false;

    player.avion.width = 256;
    player.avion.height = 256;
    moneda.coin.src = "assets/sprites/coin/1.png";

    constants.canvas.width = constants.WIDTH;
    constants.canvas.height = constants.HEIGHT;

    moveHorizontally(constants.WIDTH / 2);
    moveVertically(constants.HEIGHT / 2);

    window.addEventListener("keydown", handleKeyDown);

    window.setInterval(async function () {

        moneda.coin.src = `assets/sprites/coin/${moneda.indexCoin}.png`;

        moneda.indexCoin = (moneda.indexCoin + 2) % 8;

    }, (variables.frames / (performance.now() - variables.lastTime) * 1000).toFixed());

    window.requestAnimationFrame(gameLoop);
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

function animate() {
    player.avion.src = `assets/sprites/airplanes/${player.avionSeleccionado}/${player.indexAvion}.png`;

    player.indexAvion = (player.indexAvion + 2) % 4;
}

function gameLoop() {

    variables.frames++;
    const currentTime = performance.now();

    animate();
    coinLoop();
    draw();

    constants.ctx.fillText("FPS: " + (variables.frames / (currentTime - variables.lastTime) * 1000).toFixed(), 10, 60);

    if (currentTime - variables.lastTime >= 1000) {
        variables.lastTime = currentTime;
        variables.frames = 0;
    }

    window.requestAnimationFrame(gameLoop);
}

function coinLoop() {
    if (gameObjects.monedasEnJuego.length >= 5) {
        return;
    }
}

function checkCollision(obj1, obj2) {
    // Calcula la distancia entre los centros de ambos objetos
    let distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));

    return (distance < (obj1.radio + obj2.radio));
}

function moveVertically(i) {
    player.y += i;
    player.y = Math.min(Math.max(player.y, 0), constants.HEIGHT - player.avion.height);

    borrarMonedas();
}

function moveHorizontally(i) {
    player.x += i;
    player.x = Math.min(Math.max(player.x, 0), constants.WIDTH - player.avion.width);

    borrarMonedas();
}

function borrarMonedas() {
    gameObjects.monedasEnJuego.forEach(coin => {
        if (checkCollision(player, coin)) {
            const index = gameObjects.monedasEnJuego.indexOf(coin);
            if (index > -1) {
                //Reasignando una posición nueva para reutilizar el objeto de moneda y no crear uno nuevo.
                let randomNum = randomNumbers[randomCounter];
                gameObjects.monedasEnJuego[index] = { x: randomNum.x, y: randomNum.y, radio: 21 };
                randomCounter++;
                if (randomCounter >= randomNumbers.length) {
                    randomCounter = 0;
                }
            }
            stats.monedas++;
            localStorage.setItem("monedas", stats.monedas);
        }
    });
}

function draw() {
    constants.ctx.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);

    // Dibuja la imagen del fondo
    constants.ctx.drawImage(constants.DAY_BACKGROUND, 0, variables.background_anim);
    constants.ctx.drawImage(constants.DAY_BACKGROUND, 0, variables.background_anim - constants.DAY_BACKGROUND.height);

    variables.background_anim++;
    if (variables.background_anim >= constants.DAY_BACKGROUND.height) {
        variables.background_anim = 0;
    }

    constants.ctx.drawImage(player.avion, player.x, player.y);

    gameObjects.monedasEnJuego.forEach(coin => {
        constants.ctx.drawImage(moneda.coin, coin.x, coin.y);
    });

    constants.ctx.fillStyle = "#ff0000";
    constants.ctx.fillText("Monedas: " + stats.monedas, 10, 40);
}

function getMilliseconds(unit, value) {
    switch (unit) {
        case "Seconds":
            return value * 1000;
        case "Minutes":
            return value * 1000 * 60;
        case "Hours":
            return value * 1000 * 60 * 60;
        default:
            return value;
    }
}

// Función para generar números aleatorios dentro de un rango
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
