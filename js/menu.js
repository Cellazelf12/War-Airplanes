window.addEventListener("load", init);

let flagCache = localStorage.getItem("cacheFlag") || null;

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

let background_anim = 0;

let BACKGROUND = new Image();

function init() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const path = "../assets/sprites/backgrounds";
    const background = localStorage.getItem("background") || "background1";

    BACKGROUND.src = `${path}/${background}.png`;

    window.addEventListener("click", handleButton);

    loadFlag();

    window.requestAnimationFrame(drawBackground);
}

function handleButton(button) {
    let text = button.target.innerText;

    switch (text) {
        case "Empezar":
            window.location.href = "juego.html";
            break;
        case "Aviones":
            window.location.href = "customization.html";
            break;
        case "Backgrounds":

            break;
        case "Opciones":
            window.location.href = "opciones.html";
            break;
        case "Acerca De":
            window.location.href = "https://github.com/Cellazelf12/War-Airplanes";
            break;
        default:
            break;
    }
}

async function loadFlag() {
    let flag = document.getElementById("flag");

    if (flag == null) {
        return;
    }

    if (flagCache !== null) {
        flag.src = flagCache;
        return;
    }

    //Aca consigo el codigo country del usuario y luego consigo su bandera.
    await fetch("https://ipinfo.io/json?token=ec6c8a3b6fd206").then(
        (response) => response.json()
    ).then(
        (jsonResponse) => flagCache = "https://raw.githubusercontent.com/cristiroma/countries/master/data/flags/PNG-128/" + jsonResponse.country + "-128.png" 
    ).finally(
        (finallyresponse) => {

            if (flagCache !== null) {
                localStorage.setItem("cacheFlag", flagCache);
                flag.src = flagCache;
            }
        }
    );
}

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