var arrLang = {
	'es': {
		'1 jugador': '1 JUGADOR',
		'2 jugadores': '2 JUGADORES',
		'puntuaciones': 'PUNTUACIONES',
		'creditos': 'CREDITOS'
	},
	'en': {
		'1 jugador': 'SINGLE PLAYER',
		'2 jugadores': 'SPLIT SCREEN',
		'puntuaciones': 'SCORES',
		'creditos': 'CREDITS'
	}
}

$(function(){
	$('.idiomas').click(function(){
		var lang = $(this).attr('id');
		
		$('.boton').each(function(index, element){
			$(this).attr('value',arrLang[lang][$(this).attr('key')]);
		});
	});
});