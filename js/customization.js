let indexAvion = 1;

let monedas = 0;

let avionPrecios = [0, 100, 50, 300];

let avionesComprados = [];

let avionSeleccionado = 1;

const slides = [...document.getElementsByName('slides')];

window.addEventListener("load", init);

function init() {
    loadStats();

    let buttons = [...document.querySelectorAll("[id^=btn-]")];
    buttons.forEach(evalBtn);

    buttons.forEach(btn => {
        btn.addEventListener("click", event => {
            evalEvent(event.target);
        });
    });

    window.requestAnimationFrame(animate);
};

function animate() {

    slides.forEach(slide => {
        if (slide.checked) {
            let avion = document.getElementById(`slide-${slide.id.charAt(slide.id.length - 1)}`);
            avion.src = avion.src.substring(0, avion.src.length - 5) + indexAvion + ".png";
            indexAvion++;
            if (indexAvion > 3) {
                indexAvion = 1;
            }
        }
    });

    window.requestAnimationFrame(animate);
}

function evalBtn(element) {
    if (!element) return;

    let nro = parseInt(element.id.slice(-1));
    let precio = avionPrecios[nro - 1];
    element.innerText = avionesComprados.includes(nro) ? 
        (avionSeleccionado === nro ? "Seleccionado" : "Seleccionar") : 
        (precio > 0 ? `$ ${precio}` : "Seleccionar");
}

function containsObject(obj, list) {
    return list.includes(obj);
}

function evalEvent(element) {
    if (element == null) return;
    let nro = parseInt(element.id.slice(-1));
    let precio = avionPrecios[nro - 1];

    if (element.innerText === "Seleccionar") {
        document.getElementById(`btn-${avionSeleccionado}`).innerText = "Seleccionar";
        avionSeleccionado = nro;
        saveStat("avionActual", avionSeleccionado);
        element.innerText = "Seleccionado";
    } else if (element.innerText === "Seleccionado") {
        return;
    } else {
        if (precio <= 0) {
            if (!containsObject(nro, avionesComprados)) {
                push(avionesComprados, nro);
                saveStat("avionesComprados", avionesComprados);
            }
            if (avionSeleccionado !== nro) {
                element.innerText = "Seleccionar";
            } else {
                element.innerText = "Seleccionado";
            }
        } else {
            if (monedas >= precio) {
                push(avionesComprados, nro);
                saveStat("avionesComprados", avionesComprados);
                saveStat("monedas", (monedas - precio));
                monedas -= precio;
                document.getElementById("monedas").innerText = monedas;
                element.innerText = "Seleccionar";
            } else {
                alert("No tienes suficientes monedas. Te faltan: " + (precio - monedas));
            }
        }
    }
}


function push(array, item) {
    if (!array.includes(item)) {
        array.push(item);
    }
}

function loadStats() {
    monedas = parseInt(localStorage.getItem("monedas")) || 0;
    avionesComprados = JSON.parse(localStorage.getItem("avionesComprados")) || [1];
    avionSeleccionado = parseInt(localStorage.getItem("avionActual")) || 1;

    document.getElementById("monedas").innerText = monedas;
}

function saveStat(stat, value) {
    localStorage.setItem(stat, JSON.stringify(value));
    // if (value instanceof Array) {
    //     value = removeDuplicates(value);
    // }
    // localStorage.removeItem(stat);
    // localStorage.setItem(stat, value);

}

function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}