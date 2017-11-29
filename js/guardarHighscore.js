//función que guarda la puntación en el localStorage si está entre las 10 mejores 
function guardarHighscore(newscore){
	var highscores_stored = localStorage.getItem("highscores"); //obtenemos las puntuaciones almacenadas en el localStorage
	var name = ""; //nombre del usuario
	if(highscores_stored==null){ //si no hay puntuaciones almacenadas la guardamos direcctamente
		name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: "); //pedimos el nombre al usuario
		localStorage.setItem("highscores", '{"scores":['+newscore+'],"names":["'+name+'"]}'); //guardamos en formato JSON
	}else{   //si ya hay almacenadas
		highscores_stored = JSON.parse(highscores_stored); //pasamos de texto a JSON
		var scores_array = highscores_stored.scores; //obtenemos el array de puntuaciones
		var names_array = highscores_stored.names; //obtenemos el array de nombres asociado a las puntuaciones
		var changed = false; //si la puntuacioón no es superior a las almacenadas no se vuelve a guardar
		for(var i=0;i<scores_array.length && !changed;i++){ //recorremos el array de puntuaciones en orden descendente
			if(scores_array[i]<newscore){ //si la nueva puntuación es mayor
				name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: "); //pedimos el nombre
				var aux = [];
				var auxNames = [];
				if(i==0){ 
					aux[0] = newscore;
					aux = aux.concat(scores_array);
					auxNames[0] = name;
					auxNames = auxNames.concat(names_array);
				}else{
					aux = scores_array.slice(0,i);
					aux[i] = newscore;
					aux = aux.concat(scores_array.slice(i));
					auxNames = names_array.slice(0,i);
					auxNames[i] = name;
					auxNames = auxNames.concat(names_array.slice(i));
				}
					scores_array = aux.slice(0,10);
					names_array  = auxNames.slice(0,10);
					changed = true;
			}
		}
		if(!changed && scores_array.length<10){
			name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: ");	
			scores_array[scores_array.length] = newscore;
			names_array[names_array.length] = name;
		}
		highscores_stored.names = names_array;
		highscores_stored.scores = scores_array;
		localStorage.setItem("highscores", JSON.stringify(highscores_stored));
	}  
}
			
