// Declaración de una variable para almacenar el índice del avión seleccionado, util para la animación del mismo.
let indexAvion = 1;

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
let background_anim = 0;

let BACKGROUND = new Image();

// Objeto que almacena las estadísticas del juego, que se obtienen del LocalStorage.
let stats = {
    monedas: parseInt(localStorage.getItem("monedas")) || 0,
    avionesComprados: JSON.parse(localStorage.getItem("avionesComprados")) || [1],
    avionSeleccionado: parseInt(localStorage.getItem("avionActual")) || 1
}

// Array que almacena los precios de los aviones.
const avionPrecios = [0, 100, 50, 300];

// Obtiene los elementos del DOM que tengan el atributo 'name' igual a 'slides'.
const slides = [...document.getElementsByName('slides')];

// Evento que se dispara al cargar la página, que además ejecuta la function que inicializa todo.
window.addEventListener("load", init);

// Funcion que inicializa todo el menu.
function init() {

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const path = "../assets/sprites/backgrounds";

    const background = localStorage.getItem("background") || "background1";

    BACKGROUND.src = `${path}/${background}.png`;

    // Obtiene todos los botones cuyo id empiece con 'btn-'
    let buttons = [...document.querySelectorAll("[id^=btn-]")];

    // Por cada botón, se ejecuta la función 'handleButton' y se añade un evento 'click'
    buttons.forEach(btn => {
        handleButton(btn);
        btn.addEventListener("click", event => {
            handleEvent(event.target);
        });
    });

    window.addEventListener("keydown", handleKeyDown);

    // Inicia la animación
    window.requestAnimationFrame(animate);

};

//Función que analiza el evento de key down e identifica cual tecla fue presionada.
function handleKeyDown(event) {
    if (event.isComputing) {
        return;
    }

    switch (event.code) {
        case "Escape":
            window.location.href = "index.html";
            break;
    }
}


// Función que anima los aviones
function animate() {
    drawBackground();

    // Por cada slide, verifica si está seleccionado y actualiza la imagen del avión correspondiente
    slides.forEach(slide => {
        if (slide.checked) {
            let avion = document.getElementById(`slide-${slide.id.charAt(slide.id.length - 1)}`);
            avion.src = avion.src.substring(0, avion.src.length - 5) + `${indexAvion}.png`;

            indexAvion = (indexAvion + 2) % 4;
        }
    });

    // Vuelvo a llamar a la función para crear una animación continua
    window.requestAnimationFrame(animate);
}

// Función que maneja el aspecto de los botones.
function handleButton(element) {
    // Si el elemento no existe, se detiene la función
    if (!element) return;

    let nro = parseInt(element.id.slice(-1));
    let precio = avionPrecios[nro - 1];

    // Cambia el texto del botón según el estado de los objetos.
    element.innerText = stats.avionesComprados.includes(nro) ?
        (stats.avionSeleccionado === nro ? "Seleccionado" : "Seleccionar") :
        (precio > 0 ? `$ ${precio}` : "Seleccionar");
}

//Funcion que analiza el evento de click y ejecuta la acción correspondiente, segun el boton clickeado. 
function handleEvent(element) {
    // Si el elemento no existe, se detiene la función
    if (!element) return;

    let nro = parseInt(element.id.slice(-1));

    // Si el número es inválido, se detiene la función
    if (isNaN(nro) || nro < 1 || nro > avionPrecios.length) return;

    let precio = avionPrecios[nro - 1];

    if (stats.avionesComprados.includes(nro)) {
        // Si el avion seleccionado actualmente es el mismo al que el boton se refiere, la funcion se detiene.
        if (stats.avionSeleccionado === nro) {
            return;
        } else {
            // Cambia el avión seleccionado y actualiza el estado en el LocalStorage
            // Además modifico el texto del boton referido al anterior avion seleccionado antes de cambiar su estado.
            document.getElementById(`btn-${stats.avionSeleccionado}`).innerText = "Seleccionar";
            stats.avionSeleccionado = nro;
            saveStat("avionActual", stats.avionSeleccionado);
            element.innerText = "Seleccionado";
        }
        // Si el precio es menor o igual a cero, es decir, GRATIS, no se procede a restar monedas al jugador, en cambio solo se añade a los aviones comprados.
    } else if (precio <= 0) {
        stats.avionesComprados.push(nro);
        saveStat("avionesComprados", stats.avionesComprados);
        element.innerText = "Seleccionar";
    } else {
        // En esta linea se prevee si el jugador posee mayor o igual cantidad a las requeridas para comprar el avion, si es asi, procede la función, caso contrario se alerta al jugador y se detiene la función.
        if (stats.monedas >= precio) {
            stats.avionesComprados.push(nro);
            saveStat("avionesComprados", stats.avionesComprados);
            stats.monedas -= precio;
            saveStat("monedas", stats.monedas);
            document.getElementById("monedas").innerText = stats.monedas;
            element.innerText = "Seleccionar";
        } else {
            let faltante = (precio - stats.monedas);
            Swal.fire(
                "You don't have enough coins.",
                `You need: ${faltante} coins`,
                'error'
            )
            return;
        }
    }
}

//Funcion que dibuja el fondo en el canvas.
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(BACKGROUND, 0, background_anim, canvas.width, canvas.height);
    ctx.drawImage(BACKGROUND, 0, background_anim - canvas.height, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = '20px san-serif';
    ctx.fillText(stats.monedas, 50, 30, 70);

    background_anim += 1; // Velocidad de movimiento
    if (background_anim >= canvas.height) {
        background_anim = 0;
    }
}

function saveStat(stat, value) {
    localStorage.setItem(stat, JSON.stringify(value));
}