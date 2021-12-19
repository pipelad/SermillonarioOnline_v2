/// Comprobar que no usen ie viejo y no puedan jugar, recomendar firefox o chrome.


/// FALTANTES:
/// 1.) POSIBLES NUEVAS PREGUNTAS
/// 2.) CAMBIAR A CORREO CORRECTO


if (window.document.documentMode) {
  document.getElementById('ie').style.display = "block";
}

function Preguntas(pregunta, respuestas, correcta) {
	this.pregunta = pregunta;
	this.respuestas = respuestas;
	this.correcta = correcta;
}

///// Seccion para la preguntas

var q1 = new Preguntas('¿Qué es la Acreditación institucional?', 
	['Proyecto Integral de Mejoramiento', 'Proyecto Institucional de Mejoramiento', 'oferta y desarrollo de programas académicos de educación superior', 'Reconocimiento por parte del Estado que certifica la alta calidad y el impacto en la región y el país'], 
	3);

var q2 = new Preguntas('¿En qué fecha se obtuvo la Acreditación Institucional Multicampus?', 
	['20 de enero de 2010', '29 de enero de 2016', '11 de febrero de 2015', '22 de abril de 2013'], 
	1);

var q3 = new Preguntas('¿Cuál de las siguientes afirmaciones corresponde a una de las condiciones para la acreditación institucional multicampus?', 
	['Contar con una certificación internacional', 'Cada seccional deberá tener acreditados por lo menos el 40% de sus programas acreditables', 'Hacer un reconocimiento público del logro de altos niveles de calidad', 'Contar la certificación ISO 9001:2015'],
 	1);

var q4 = new Preguntas('¿Qué normas guían el proceso de acreditación institucional multicampus?', 
	['ISO 9001:2015', 'Los Lineamientos para la Acreditación Institucional del Consejo Nacional de Acreditación (CNA) 2015.', 'Plan Integral Multicampus', 'Decreto 1330 de julio 25 de 2019'],
	1);

var q5 = new Preguntas('¿Cuál es el sentido de renovar la acreditación institucional?', 
	['Identificar las fortalezas y las acciones de mejora implementadas en el periodo 2016 – 2020', 'Realizar auditoría externa', 'Crear alianzas estratégicas', 'Fortalecer las mesas nacionales'],
	0);

var q6 = new Preguntas('¿Quiénes participan en la renovación de Autoevaluación Multicampus?', 
	['Los estudiantes y los docentes', 'Toda la comunidad universitaria: estudiantes, docentes, administrativos, directivos, egresados, empleadores y aliados estratégicos.', 'Los rectores y vicerrectores de las sedes y seccionales', 'Los cuerpos colegiados de la Universidad a nivel nacional'],
	1);

var q7 = new Preguntas('¿Cuántos son los factores que se evalúan en la autoevaluación institucional multicampus?', 
	['12', '15', '20', '18'], 
	0);

var q8 = new Preguntas('¿Cuántas características establecen los lineamientos del CNA?', 
	['18', '23', '30', '12'], 
	2);

var q9 = new Preguntas('¿Quién realiza la evaluación externa en el proceso de Autoevaluación de Acreditación Multicampus?', 
	['Auditor Líder', 'Pares académicos', 'Icontec', 'Auditores internos'], 
	1);

var q10 = new Preguntas('¿En que año se implementó el modelo de evaluación multicampus en la Universidad?', 
	['2016', '2015', '2011', '2018'], 
	1);

var cuestionario = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];


//// Sección para Funciones

var number, puntaje, puntajeActual, ayuda, currentAyuda, pregarea, bien, mal, final, finTime, finPunt, ayudaUsed, aprender;

pregarea = document.getElementById('pregunta');
puntajeActual = document.getElementById('puntos');
bien = document.getElementById('correcto');
mal = document.getElementById('incorrecto');
final = document.getElementById('final');
finTime = document.getElementById('tiempofinal');
finPunt = document.getElementById('puntajefinal');
ayuda = document.getElementById('ayuda5050');
aprender = document.getElementById('aprender');
currentAyuda = [0, 1, 2, 3];
puntaje = 0;

/// funcion pregunta.

function preguntepues() {
	if(cuestionario.length !== 0) {
		number = Math.floor(Math.random() * cuestionario.length);
		pregarea.innerText = cuestionario[number].pregunta;
		currentAyuda.splice(cuestionario[number].correcta, 1);
		console.log(currentAyuda);
		console.log(cuestionario[number].correcta);
		respuestas();
	} else {
		/// método para finalizar.
		var finalTime = document.getElementById('timer').innerHTML;
		finTime.innerHTML = finalTime;
		finPunt.innerHTML = puntaje;
		final.classList.remove('hid');
	}
} 

/// funcion para imprimir respuestas random order

function respuestas() {
	var xRespuesta = Array.from(document.querySelectorAll('.respclic'));
	for(i = 0; i < cuestionario[number].respuestas.length; i++) {
		var n = Math.floor(Math.random() * xRespuesta.length);
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
	var ocultarDos = currentAyuda.length;
	for (i = 0; i < ocultarDos; i++) {
		document.getElementById('btn_' + currentAyuda[i]).classList.add('hid');
	}
	ayuda.classList.add('hid');
	ayudaUsed = true;
}

/// temporizador

function startTimer() {
  	var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = parseInt(timeArray[0]);
    var s = checkSecond((parseInt(timeArray[1]) + 1));
    if( s == 0) {m = m + 1}
    document.getElementById('timer').innerHTML =  m + ":" + s;
    temporizador = setTimeout(startTimer, 1000);
}
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec};
  if (sec == 60) {sec = "00"};
  return sec;
}






/// Inicializar
preguntepues();
startTimer();
