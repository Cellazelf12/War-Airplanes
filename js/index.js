let player = {
    avion: new Image(),
    indexAvion: 1,
    x: 0,
    y: 0,
    avionSeleccionado: parseInt(localStorage.getItem("avionActual")) || 1,
    radio: 181.5
}

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

let variables = {
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

    BACKGROUND: new Image(),

    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight
};

window.addEventListener("load", init);

// Generar una cantidad de números aleatorios al principio del juego
let randomNumbers = [];

// Contador para saber qué número aleatorio usar
let randomCounter = 0;

//Funcion inicializadora.
function init() {

    //Generando numeros randoms al principio.
    for (let i = 0; i < 1000; i++) {
        randomNumbers.push({
            x: getRandomNumber(1, constants.WIDTH - 10),
            y: getRandomNumber(10, constants.HEIGHT / 2)
        });
    }
    //

    //Definiendo los diferentes fondos disponibles.
    const path = "../assets/sprites/backgrounds";

    const background = localStorage.getItem("background") || "background1";

    constants.BACKGROUND.src = `${path}/${background}.png`;
    //

    //Optimización del canvas
    constants.ctx = constants.canvas.getContext('2d', { desynchronized: true });
    constants.ctx.imageSmoothingEnabled = false;

    ctx.imageSmoothingEnabled = false;
    //

    //Parametros para definir la hitbox del avion.
    player.avion.width = 256;
    player.avion.height = 256;
    //

    //Parametro que define la localización del sprite de las monedas.
    moneda.coin.src = "assets/sprites/coin/1.png";
    //

    //Definiendo el tamaño del canvas.
    constants.canvas.width = constants.WIDTH;
    constants.canvas.height = constants.HEIGHT;
    canvas.height = constants.HEIGHT;
    canvas.width = constants.WIDTH;
    //

    //Mover al jugador hacia el centro de la pantalla.
    moveHorizontally(constants.WIDTH / 2);
    moveVertically(constants.HEIGHT / 2);
    //

    //Registrando el evento de teclado para generar el movimiento
    window.addEventListener("keydown", handleKeyDown);

    window.requestAnimationFrame(gameLoop);
}

//Función que analiza el evento de key down e identifica cual tecla fue presionada.
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
        case "Escape":
            window.location.href = "index.html";
            break;
    }
}

//Función que anima todos los sprites en pantalla.
function animate() {
    player.avion.src = `assets/sprites/airplanes/${player.avionSeleccionado}/${player.indexAvion}.png`;

    player.indexAvion = (player.indexAvion + 2) % 4;

    moneda.coin.src = `assets/sprites/coin/${moneda.indexCoin}.png`;

    moneda.indexCoin = (moneda.indexCoin + 2) % 8;
}

//Función principal de juego
function gameLoop() {

    animate();
    coinLoop();
    draw();

    window.requestAnimationFrame(gameLoop);
}

//Función para crear monedas.
function createCoin() {
    let randomNum = randomNumbers[randomCounter];

    randomNextIndex();

    gameObjects.monedasEnJuego.push({ x: randomNum.x, y: randomNum.y, radio: 21 });
}

function coinLoop() {
    if (gameObjects.monedasEnJuego.length >= 5) {
        return;
    }

    createCoin();
}

//Funcion para detectar las colisiones entre objetos.
function checkCollision(obj1, obj2) {
    // Calcula la distancia entre los centros de ambos objetos
    let distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));

    return (distance < (obj1.radio + obj2.radio));
}

//Funciones de movimiento del avion.
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
//

//Funcion de llamada recurrente para detectar colisiones entre avion y monedas.
function borrarMonedas() {
    gameObjects.monedasEnJuego.forEach(coin => {
        if (checkCollision(player, coin)) {
            const index = gameObjects.monedasEnJuego.indexOf(coin);
            if (index > -1) {
                //Reasignando una posición nueva para reutilizar el objeto de moneda y no crear uno nuevo.
                let randomNum = randomNumbers[randomCounter];
                gameObjects.monedasEnJuego[index] = { x: randomNum.x, y: randomNum.y, radio: 21 };
                randomNextIndex();
            }
            stats.monedas++;
            localStorage.setItem("monedas", stats.monedas);
        }
    });
}

function randomNextIndex() {
    randomCounter++;
    if (randomCounter >= randomNumbers.length) {
        randomCounter = 0;
    }
}

//Funciones que se encargan de dibujar sobre los canvas correspondientes. Una para los aviones y monedas y la otra para el fondo.
function draw() {
    constants.ctx.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);

    constants.ctx.drawImage(player.avion, player.x, player.y);

    gameObjects.monedasEnJuego.forEach(coin => {
        constants.ctx.drawImage(moneda.coin, coin.x, coin.y);
    });

    drawBackground();

    ctx.fillStyle = "#ffffff";
    ctx.font = '20px san-serif';
    ctx.fillText(stats.monedas, 50, 30, 70);
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(constants.BACKGROUND, 0, variables.background_anim, canvas.width, canvas.height);
    ctx.drawImage(constants.BACKGROUND, 0, variables.background_anim - canvas.height, canvas.width, canvas.height);

    variables.background_anim += 1; // Velocidad de movimiento
    if (variables.background_anim >= canvas.height) {
        variables.background_anim = 0;
    }
}
//

// Función para generar números aleatorios dentro de un rango
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
