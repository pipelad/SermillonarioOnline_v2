// Juego Online
'use strict';

//// 1. Sección para Variables globales

const xmlhttp = new XMLHttpRequest();

let	cuestionarioObj = '',
	cuestionario = [],
	number = '', 
	puntaje = 0,
	startBtn = document.querySelector('#start-btn'),
	puntajeActual = document.querySelector('#puntos'), 
	ayuda = document.querySelector('#ayuda5050'), 
	currentAyuda = [0, 1, 2, 3], 
	pregarea = document.querySelector('#pregunta'), 
	bien = document.querySelector('#correcto'), 
	mal = document.querySelector('#incorrecto'), 
	final  = document.querySelector('#final'), 
	finTime = document.querySelector('#tiempofinal'), 
	finPunt = document.querySelector('#puntajefinal'), 
	ayudaUsed = false,
	aprender = document.querySelector('#aprender');


//// 2. Sección buscar archivo cuestionario

xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
        cuestionarioObj = JSON.parse(this.responseText);
        cuestionario = cuestionarioObj.Cuestionario;
        //console.log(cuestionarioObj);
    } else if(this.readyState == 4 && this.status != 200){
    	console.log(`Error: ${this.statusText}`);
    } else {
    	console.log('loading');
    }
};
xmlhttp.open("GET", "json/preguntas.json", true); // url del cuestionario y filename
xmlhttp.send();


//// 3. Funcion para seleccionar preguntas, elminiar esa pregunta para no repetir y cuando no haya más preguntas terminar el juego. 

function preguntepues() {
	if(cuestionario.length !== 0) {
		number = Math.floor(Math.random() * cuestionario.length);
		pregarea.innerText = cuestionario[number].pregunta;
		currentAyuda.splice(cuestionario[number].correcta, 1);
		//console.log(currentAyuda);
		//console.log(cuestionario[number].correcta);
		respuestas();
	} else {
		/// método para finalizar.
		let finalTime = document.getElementById('timer').innerHTML;
		finTime.innerHTML = finalTime;
		finPunt.innerHTML = puntaje;
		final.classList.remove('hid');
	}
} 

//// 4. Función para imprimir respuestas, 4 fijas, para mejor practica y respuestas variables en un futuro usar appendChild

function respuestas() {
	let xRespuesta = Array.from(document.querySelectorAll('.respclic'));
	for(let i = 0; i < cuestionario[number].respuestas.length; i++) {
		let n = Math.floor(Math.random() * xRespuesta.length);
		xRespuesta[n].innerHTML = '<div class="respuesta" onclick="siguiente(' + i + ')"><div class="txt">' + cuestionario[number].respuestas[i] + '</div></div>';	
		xRespuesta[n].setAttribute('id', "btn_" + i);
		xRespuesta.splice(n, 1);
	}
}


/// siguiente == funcion ejecutada cuando se responde.

bien.addEventListener('click', function() { bien.classList.add('hid'); });
mal.addEventListener('click', function() { mal.classList.add('hid'); });

function siguiente(e) {
	if (e == cuestionario[number].correcta) {
		cuestionario.splice(number, 1); /// remover pregunta para no repetir
		puntaje++;
		puntajeActual.innerHTML = puntaje;
		// Mostrar Correcto!
		bien.classList.remove('hid');
	} else {
		/// Mostar incorrecto!
		aprender.innerHTML = cuestionario[number].respuestas[cuestionario[number].correcta];
		cuestionario.splice(number, 1); /// remover pregunta para no repetir
		mal.classList.remove('hid');
		/// En caso de restar puntaje acá seria.
	}
	// nueva pregunta 
	currentAyuda = [0, 1, 2, 3];
	if(ayudaUsed === true) {
		for (i = 0; i < currentAyuda.length; i++) {
			document.getElementById('btn_' + currentAyuda[i]).classList.remove('hid');
		}
	}
	preguntepues(); 
}

/// Funcion para ayuda 50/50

ayuda.addEventListener('click', ayuda50);

function ayuda50() {
	currentAyuda.splice(Math.floor(Math.random() * currentAyuda.length), 1);
	let ocultarDos = currentAyuda.length;
	for (i = 0; i < ocultarDos; i++) {
		document.getElementById('btn_' + currentAyuda[i]).classList.add('hid');
	}
	ayuda.classList.add('hid');
	ayudaUsed = true;
}

/// temporizador

function startTimer() {
  	let presentTime = document.getElementById('timer').innerHTML,
        timeArray = presentTime.split(/[:]+/),
        m = parseInt(timeArray[0]),
        s = checkSecond((parseInt(timeArray[1]) + 1));
    if( s == 0) {m = m + 1}
    document.getElementById('timer').innerHTML =  m + ":" + s;
    let temporizador = setTimeout(startTimer, 1000);
}
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec};
  if (sec == 60) {sec = "00"};
  return sec;
}


//// X. inicializar le juego.
startBtn.addEventListener('click', function(e) {
	preguntepues();
	startTimer();
})