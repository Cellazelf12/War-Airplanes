# War-Airplanes
Un videojuego basado en los juegos retro de avioncitos en 2D


Por este medio vengo a realizar la presentación de este proyecto final del curso de JavaScript para la plataforma de CoderHouse.

Partiendo de la base, la idea de hacer un videojuego llega a mi desde antes de iniciar este curso, los videojuegos como medio de entretenimiento son cruciales para mi, creci con ellos, y me interesa el aprender el como funcionan.
Dentro del rubro Videojuegos, hace muchisimo tiempo se dejo de lado el concepto de 2D, pasando a enfocarse todo en el 3D y los mundos abiertos, intentando añadirle un aire de complejidad.
Tenia ganas de darle una oportunidad a este tipo de juego y a la simplicidad, ya que es con lo que se forjo esta industria.

Mi idea esta basada en el videojuego Space Invaders y el videojuego 1942.

En esta sección voy a pasar a explicar el codigo del videojuego y las diferentes etapas que tuvo.

La primera etapa fue la mas simple e ironicamente la mas problematica.

Al principio para los elementos en pantalla utlicé mucho el DOM, un elemento para el jugador, uno para el fondo, uno para el HUD y varios para las monedas. Esto generaba que al interactuar y realizar una minima acción se sobrecargara el procesamiento, obteniendo una mala experiencia de juego, en mi caso la tasa de FPS(Frames Per Second) no superaba los 5.
Pero por otro lado me dio una idea de que estaba haciendo las cosas bien, solo ejecutandolas de forma erronea.

Para mover al jugador utilizaba las opciones de estilo "left" y "top" respectivamente.
Para animar los aviones, utilicé la propiedad src(Source), del elemento de indole Imagen, que trae HTML, actualizandolo cada frame.

En el caso de las monedas es un poco más complejo, en su momento seguía la misma formula del elemento jugador, solo que sin animación
Menciono que fue mas complejo ya que estas se generaban en una posición aleatoria de la pantalla, dificultando a quien no conocia de la función de Math.random(), el ubicar las monedas sin que se escapen de la pantalla.
Y tenia un limite de monedas en pantalla, que era de 5 monedas, hasta que no desapareciese una o más, no se generarian más.

En el HUD fue mas sencillo, solo creé un elemento de texto, y lo modificaba a antojo, utilizando innerText.

Aplicando así el requisito de interactuar con el DOM.

Para la animación del fondo utilizaba las animaciones que trae por defecto CSS, esto generaba muchisima ralentización por momentos.

Habia mucho codigo por optimizar además, quien corregía mis entregas (Walter), pudo ver la evolución en el codigo.

Esa fue la primera versión de este proyecto.

En la versión final del mismo, opte por investigar bastante mas por mi cuenta, topandome con el elemento Canvas de HTML(Introducido en HTML5, importado desde el navegador Safari de Apple, Fuente: https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
Este elemento permite el dibujado de graficos, tanto en 3D(Utilizando el contexto WebGL) como en 2D. WebGL admite 3D y 2D, pero por cuestiones de tamaño de proyecto, me incliné solo por 2D comun y corriente.
A diferencia de tener muchos elementos en el DOM e interactuar con ellos, Canvas lo que logra es en cuestión poder dibujar los elementos directamente, logrando asi solo tener 1 elemento en el DOM.
Generar las animaciones y los movimientos, es mucho mas facil. Simplemente creamos objetos en JavaScript, modificamos esos objetos, y luego se dibujan en el Canvas, leerlo hace parecerlo facil. No lo fue.

El portear todo el codigo para que funcione con Canvas, hizo que tenga que reescribir muchas partes del mismo y aprender muchisimos conceptos. Tuve que reescribir las colisiones, utlizando la Distancia euclidiana(Fuente: https://es.wikipedia.org/wiki/Distancia_euclidiana)
Al principio cuesta entender el concepto, pero luego de leerlo y experimentar, llegué a la conclusión de que para calcular su distancia lo que hace la formula es plantear un espacio, en este caso 2D, lanzar una linea, entre ambos objetos y de ahi medir la diferencia entre sus coordenadas, desde sus centros.

También pase de al necesitar un numero aleatorio generarlo en el momento, al iniciar el script, generar una cantidad de numeros aleatorios y reutilizarlos durante la partida, optimizando asi el procesamiento.

Añadí también un menu con opciones, para así cambiar de avion y de "mapa", ademas de agregar un boton de Acerca De, que lleva a mi github con el codigo fuente.

La bandera que se nota al principio es individual de cada uno, es decir, el jugador verá su bandera.
