// Juego Online
let myObj;

const xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
        //console.log(myObj);
    } else if(this.readyState == 4 && this.status != 200){
    	console.log(`Error: ${this.statusText}`);
    } else {
    	console.log('loading');
    }
};
xmlhttp.open("GET", "json/pregunta.json", true);
xmlhttp.send();
