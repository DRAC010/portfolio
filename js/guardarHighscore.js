function guardarHighscore(newscore){
	var highscores_stored = localStorage.getItem("highscores");
    var name = "";
	if(highscores_stored==null){
		name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: ");
		localStorage.setItem("highscores", '{"scores":['+newscore+'],"names":["'+name+'"]}');
	}else{    
		highscores_stored = JSON.parse(highscores_stored);
		var scores_array = highscores_stored.scores;
		var names_array = highscores_stored.names;
		var changed = false;
		for(var i=0;i<scores_array.length && !changed;i++){
			if(scores_array[i]<newscore){
				name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: ");
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
			
