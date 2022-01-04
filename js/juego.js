// Juego Online
'use strict';

(function() {
	//// 1. Sección para Variables globales

	const loadCircle = document.querySelector('#loader--circle'),
			  loadPath = document.querySelector('#loader--chulo'),
			  loaderArea = document.querySelector('#loader'),
			  areaRespuesta = document.querySelector('#respuestas'),
			  startBoton = document.querySelector('#start-btn'),
			  puntajeActual = document.querySelector('#puntos'), 
			  ayuda = document.querySelector('#ayuda5050'),
			  preguntaArea = document.querySelector('#pregunta'), 
			  respuestaBien = document.querySelector('#correcto'), 
			  respuestaMal = document.querySelector('#incorrecto'), 
			  final  = document.querySelector('#final'), 
			  finalTime = document.querySelector('#tiempofinal'), 
			  finalPuntaje = document.querySelector('#puntajefinal'),
			  aprender = document.querySelector('#aprender'),
			  volverAjugar = document.querySelector('#restart-btn');

	let	cuestionarioObj = '',
			cuestionario = [],
			cuestionarioLen,
			number = '', 
			puntaje = 0,
			currentAyuda = [0, 1, 2, 3]; // diseñado el 50/50 a base de 4 preguntas a futuro pensar en solución dinámica
		

	//// 2. Sección preaload
	const loadQuestionario = fetch('json/preguntas.json')
													 .then(data => {
													 	if(!data.ok) throw new Error(`El cuestionario no pudo ser cargado, ${data.status}`);
													 	const response =  data.json();
													 	return response
													 })
													 .then(response => {
													 	cuestionarioObj = response;
										       	cuestionario = cuestionarioObj.Cuestionario;
										     		cuestionarioLen = cuestionario.length;
													 	//console.log('questionario termino de cargar');
													 })
													 .catch(err => console.log(err.message))
								
	const toPreload = (['images/fondo_bien.jpg',
											'images/pregunta-02.png',
											'images/pregunta-04.png']);

	const imageLoader = function(imagePath) {
		return new Promise(function(resolve, reject) {
			let image = document.createElement('img');
				  image.src = imagePath;
			image.addEventListener('load', () => {
				loaderArea.appendChild(image).style.display = 'none';
				resolve(image)
			} )
			image.addEventListener('error', () => reject(new Error(`Image not found 🙈`)))
		})
	}

	const wait = function(seconds) {
		return new Promise(function(resolve) {
			setTimeout(resolve, seconds * 1000);
		})
	}

	const loadAll = async function(imgArr) {
		try {
			const imgs = imgArr.map(async img => await imageLoader(img)),
			      imgsElems = await Promise.all(imgs)
			      .then(() => {
			      	wait(2)
			      	.then(()=> {
			      		animateLoader(loadPath, false, 2, 0.7);
			        	loadPath.classList.remove('hid');	
			      	})
			        wait(3)
			        .then(() => {
			        	loaderArea.classList.add('hid');
			        })	
			      });
			
		} catch(err) {
			console.log(err)
		}
	}

	loadAll(toPreload);

	// forma antigua
	// xmlhttp.onreadystatechange = function() {
	// 	if(this.readyState == 4 && this.status == 200) {
	//         cuestionarioObj = JSON.parse(this.responseText);
	//         cuestionario = cuestionarioObj.Cuestionario;
	//         cuestionarioLen = cuestionario.length;
	//         setTimeout(function() {
	//         	animateLoader(loadPath, false, 2, 0.7);
	//         	loadPath.classList.remove('hid');
	//         	setTimeout(function() {
	// 	        	document.querySelector('#loader').classList.add('hid');
	// 	        }, 2000)
	//         }, 1000)
	        
	//         //console.log(cuestionarioObj);
	//     } else if(this.readyState == 4 && this.status != 200){
	//     	console.log(`Error: ${this.statusText}`);
	//     } 
	// };
	// xmlhttp.open("GET", "json/preguntas.json", true); // url del cuestionario y filename
	// xmlhttp.send();

	//// 3. Funcion para seleccionar preguntas, elminiar esa pregunta para no repetir y cuando no haya más preguntas terminar el juego. 

	function preguntepues() {
		if(cuestionario.length !== 0) {
			number = Math.floor(Math.random() * cuestionario.length);
			preguntaArea.innerText = cuestionario[number].pregunta;
			currentAyuda.splice(cuestionario[number].correcta, 1); //splice de la respuesta correcta para que sea Array de respuestas incorrectas
			//console.log(currentAyuda);
			//console.log(cuestionario[number].correcta);
			respuestas();
		} else {
			/// método para finalizar.
			const finalTimeStamp = document.querySelector('#timer').innerHTML,
				    goldSilver = document.querySelector('#gold-silver'),
				    champ = document.querySelector('#ganador');
			finalTime.innerHTML = `${finalTimeStamp} ${finalTimeStamp[0] == '0' ? 'segundos' : 'minutos'}`;
			finalPuntaje.innerHTML = puntaje;
			if(puntaje < cuestionarioLen * 0.6) {
				champ.classList.add('silver');
				goldSilver.innerText = 'Lo has hecho bien, aún puedes aprender sobre el proceso de Acreditación Institucional Multicampus.';
			}
			final.classList.remove('hid');
		}
	} 

	//// 4. Función para imprimir respuestas en ordern random, 4 fijas, para mejor practica y respuestas variables en un futuro usar innerHtml

	function respuestas() {
		// version 1, con 4 respuestas fijas, es restrictivo.
		/*
		let xRespuesta = Array.from(document.querySelectorAll('.respclic'));
		for(let i = 0; i < cuestionario[number].respuestas.length; i++) {
			let n = Math.floor(Math.random() * xRespuesta.length);
			xRespuesta[n].innerHTML = `<div class="respuesta" onclick="siguiente(${i}" id="btn_${i}"><div class="txt">${cuestionario[number].respuestas[i]}</div></div>`
			xRespuesta.splice(n, 1);
		}
		*/
		// version innerHtml -- en esta versión no depende de un numero que corresponde a la respuesta correcta, en el momento limitado a 4 por la ayuda 50/50 
		
		let xRespuestas = [...cuestionario[number].respuestas].sort(() => Math.random() - 0.5); 
		// usar sort para randomizar aparición de las respuestas esto implica un problma porque la key del array ya no equivaldría a la respuesta correcta, complica la función actual del juego
		for(let i = 0; i < xRespuestas.length; i++ ) {
			let respuestaLiteral = 
			`<div class="rcont">
					<img src="images/pregunta-02.png">
					<div class="pc respclic">
						<div class="respuesta" id="btn_${i}">${cuestionario[number].respuestas[i]}</div>
					</div>
				</div>`;
			areaRespuesta.insertAdjacentHTML('afterbegin', respuestaLiteral);
		}
		
	}


	//// 5. Función siguiente ==> ejecutada cuando se responde. evalua el evento contra el objeto para determinar si acerto o se equivocó el usuario

	areaRespuesta.addEventListener('click', function siguiente(event) {
		const e = event.target.innerText;
		const correcta = String(cuestionario[number].respuestas[cuestionario[number].correcta]);
		if (e === correcta) {
			cuestionario.splice(number, 1); /// remover pregunta para no repetir
			puntaje++;
			puntajeActual.innerHTML = puntaje;
			// Mostrar Correcto!
			respuestaBien.classList.remove('hid');
		} else {
			/// Mostar incorrecto!
			aprender.innerHTML = `"${cuestionario[number].respuestas[cuestionario[number].correcta]}"`;
			cuestionario.splice(number, 1); /// remover pregunta para no repetir
			respuestaMal.classList.remove('hid');
			/// En caso de restar puntaje acá seria.
		}
		// nueva pregunta 
		currentAyuda = [0, 1, 2, 3];
		areaRespuesta.innerHTML = '';
		preguntepues(); 
		
	})

	//// 6. Función ocultar intermedio y continuar juego, los intermedios informan sobre el intento anterior

	respuestaBien.addEventListener('click', function() { respuestaBien.classList.add('hid'); });
	respuestaMal.addEventListener('click', function() { respuestaMal.classList.add('hid'); });
	volverAjugar.addEventListener('click', function() { location.reload(); });

	//// 7. Función para ayuda 50/50, elimina 2 respuestas incorrectas del Array de respuestas incorrectas es decir 'currentAyuda' con el splice de la respuesta correcta

	ayuda.addEventListener('click', ayuda50);

	function ayuda50() {
		currentAyuda.splice(Math.floor(Math.random() * currentAyuda.length), 1);
		let ocultarDos = currentAyuda.length;
		// oculta dos elmentos incorrectos
		for (let i = 0; i < ocultarDos; i++) {
			document.getElementById('btn_' + currentAyuda[i]).classList.add('hid');
		}
		// ayuda de 50/50 consumida
		// ayuda.classList.add('hid'); v1.0 ocultar
		document.querySelector('#ayuda').innerHTML = ''; //v2.0 eliminar 
	}

	//// 8. temporizador

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


	//// 9. inicializar le juego.


	//// 9.1 Loader function

	function animateLoader(item, repeat, begin, duration) {

		const pathLenght = item.getTotalLength();

		item.setAttribute('stroke-dasharray', pathLenght);
		item.setAttribute('stroke-dashoffset', pathLenght);

		let repeater = repeat === true ? 'repeatCount="indefinite"' : 'fill="freeze"';

		item.innerHTML = `<animate attributeName="stroke-dashoffset" begin="${Number(begin)}s" dur="${Number(duration)}s" to="0" ${repeater} />`;

		//console.log(pathLenght);

	}


	//// 9.2 accion inicial
	animateLoader(loadCircle, true, 0, 1.5);

	startBoton.addEventListener('click', function(e) {
		document.querySelector('#start--game').classList.add('hid');
		preguntepues();
		startTimer();
	})



})()