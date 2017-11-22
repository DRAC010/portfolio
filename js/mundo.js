//constructor del mundo de juego
function Mundo(ctxt,player2, movil)
{	
	//contexto gráfico donde se va a mostrar el mundo
	var contexto=ctxt;
	//actual entrada de teclado introducida por el jugador
	this.pulsacion = NOACCION;
	var puntos = 0;
	var mouse = (player2) ? new Actor(2,2):new Actor(2,0);
	var nivel=1;
	//array que representa el suelo
	var mapa = nivel1.slice();
	var desplazamiento = 0;
	var aux_personaje = true;
	var aux_titulo = 100;
	var started = false;
	var escala = (movil) ? 2 : 1;
	this.state = 0; //perder 1, ganar 2
	
	this.init = function(){
		started = true;	
	}
	
	this.getPuntos = function(){
		return puntos;
	}
	
	//devuelve TRUE si la casilla se puede atravesar o FALSE en caso contrario
	var esAtravesable= function(x)
	{
		var y = Math.ceil(desplazamiento);
		var casilla = y*ANCHOMAPA+ANCHOMAPA-x-1;

		if (mapa[casilla]<13 && x>-1 && x<ANCHOMAPA){
			return true;
		}
		return false;
		
	}
			
	//comprueba si el personaje se puede mover en la direccion indicada
	//y actualiza sus coordenadas de destino
	this.validaActualizaMovimiento = function()
	{
		//calculamos la futura casilla según la dirección de movimiento
		var futuraX;
		switch(this.pulsacion)
		{
			case DERECHA:
				futuraX = Math.floor(mouse.x) + 1;	
				break;
			case IZQUIERDA:
				futuraX = Math.floor(mouse.x) - 1;							
				break;
		}
		//comprobamos que su casilla futura es atravesable
		if (esAtravesable(futuraX) == true){
			//actualizamos las coordenadas de destino del personaje
			mouse.xDestino = futuraX;
		}
		this.pulsacion = NOACCION;
	}
								
	//desplaza el personaje hacia su destino
	this.muevePersonaje = function()
	{
		//DERECHA
		if (mouse.x < mouse.xDestino)
		{
			mouse.x = mouse.x+0.5;
		}//IZQUIERDA
		else if (mouse.x > mouse.xDestino)
		{
			mouse.x = mouse.x-0.5;
		}	
		if(aux_personaje){
			mouse.actualizaSprite();
		}
		aux_personaje = !aux_personaje;
	}
		
	
	this.resolverColisiones = function()
	{
		var y = Math.ceil(desplazamiento);
		var x = mouse.x;
		var casilla = y*ANCHOMAPA+ANCHOMAPA-x-1;
		if(mapa[casilla]==2)
		{
			trampa.play();
			grito.play();
			if(player2){	
				mouse.cambiarSprite(27);
				mapa[casilla]=5;
			}else{
				mouse.cambiarSprite(29);	
				mapa[casilla]=4;
			}
			this.state = 1;
		}else if (mapa[casilla]==10 || mapa[casilla]==11 || mapa[casilla]==12){
			if(player2){
				mouse.cambiarSprite(22);
			}else{
				mouse.cambiarSprite(23);
			}
			grito.play();
			this.state = 1;
		}else if (mapa[casilla]==1){
			puntos += 10;
			morder_trozo.play();
			mapa[casilla]=0;
		}else if (mapa[casilla]==3){
			puntos += 30;
			morder_queso.play();
			mapa[casilla]=0;
		}else if (mapa[casilla]==9){
			if(puntos >0)
				puntos -= 10;
			asco.play();
			mapa[casilla]=0;
		}else if(desplazamiento>=(mapa.length/5) && nivel==3){
			this.state = 2;
		}
	}
	
	var cambiarNivel = function(){
		if(desplazamiento>=(mapa.length/5)){
			if(nivel==1){
				mapa = nivel2.slice();
				desplazamiento=0;	
				aux_titulo=100;	
				victoria.play();
				nivel++;
			}else if(nivel==2){
				mapa = nivel3.slice();
				desplazamiento=0;	
				aux_titulo=100;	
				victoria.play();
				nivel++;
			}
		}
	}
	
	var pintarVictoria = function(){
		var tam = 60*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.lineWidth = 5*escala;
		contexto.strokeStyle = 'black';
		contexto.fillStyle="lime";
		contexto.strokeText("VICTORY!",20*escala,300*escala);	
		contexto.fillText("VICTORY!",20*escala,300*escala);		
	}
	
	var pintarGameOver = function(){
		var tam = 60*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.lineWidth = 5*escala;
		contexto.strokeStyle = 'black';
		contexto.fillStyle="red";
		contexto.strokeText("GAME",70*escala,280*escala);	
		contexto.fillText("GAME",70*escala,280*escala);
		contexto.strokeText("OVER",70*escala,340*escala);	
		contexto.fillText("OVER",70*escala,340*escala);
	}	
	
	var pintarTituloNivel = function(){
		var tam = 50*escala;
		if(aux_titulo>0){
			contexto.font = "bold "+tam+"px arial";
			contexto.fillStyle = "white";
			contexto.lineWidth = 5*escala;
			contexto.strokeStyle = 'black';
			contexto.strokeText("LEVEL "+nivel,60*escala,280*escala);	
			contexto.fillText("LEVEL "+nivel,60*escala,280*escala);	
			aux_titulo--;
		}		
	}
	
	var pintarPuntos = function(){
		var tam = 25*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.fillStyle = "yellow";
		contexto.fillText(puntos,10*escala,30*escala);
		contexto.lineWidth = 1*escala;
		contexto.strokeStyle = 'black';
		contexto.strokeText(puntos,10*escala,30*escala);		
	}
	
	this.parar = function()
	{
		started = false;
		//paramos la actualización del estado del juego
		if(player2){
			clearInterval(actualiza2);
		}else{
			clearInterval(actualiza1);
		}
		this.pulsacion = NOACCION;
	}
			
	//muestra el mundo por pantalla
	this.render = function()
	{
		//borramos todo el contexto gráfico
		contexto.clearRect(0,0,ANCHOMAPA*TAMANIOSPRITE,ALTOMAPA*TAMANIOSPRITE);

		for(var j=0+Math.floor(desplazamiento);j<Math.floor(desplazamiento)+ALTOMAPA+1;j++)
		{
			for(var i=0;i<ANCHOMAPA;i++)
			{
				listaSprites[7].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				var casilla = mapa[(j)*ANCHOMAPA+i];
				//trozo queso
				if(casilla==1)
					listaSprites[5].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//trampa
				if(casilla==2)
					listaSprites[4].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//queso
				if(casilla==3)
					listaSprites[6].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player1 muerto ratonera
				if(casilla==4)
					listaSprites[25].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player2 muerto ratonera
				if(casilla==5)
					listaSprites[26].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player1 muerto choque
				if(casilla==6)
					listaSprites[23].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player2 muerto choque
				if(casilla==7)
					listaSprites[24].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//casilla final nivel
				if(casilla==8)
					listaSprites[27].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//trozo queso malo
				if(casilla==9)
					listaSprites[28].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//MUEBLES
				//borde inf izq
				if(casilla==10)
					listaSprites[13].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde inf der
				if(casilla==11)
					listaSprites[18].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde inf cen
				if(casilla==12)
					listaSprites[8].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad izq
				if(casilla==13)
					listaSprites[14].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad der
				if(casilla==14)
					listaSprites[19].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad cen
				if(casilla==15)
					listaSprites[9].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup izq
				if(casilla==16)
					listaSprites[15].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup der
				if(casilla==17)
					listaSprites[20].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup cen
				if(casilla==18)
					listaSprites[10].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera izq
				if(casilla==19)
					listaSprites[16].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera der
				if(casilla==20)
					listaSprites[21].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera cen
				if(casilla==21)
					listaSprites[11].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
		
				//encimera sup izq
				if(casilla==22)
					listaSprites[17].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera sup der
				if(casilla==23)
					listaSprites[22].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera sup cen
				if(casilla==24)
					listaSprites[12].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				}
		}
		if(started){
			desplazamiento += 0.1;
		}
		mouse.render(contexto,escala);
		pintarPuntos();
		if(this.state==2)
			pintarVictoria();
		if(this.state==1)
			pintarGameOver();
		cambiarNivel();
		pintarTituloNivel();
	}
	
}
