var Logger = {
	len : 0,

	log : function(s) {
		$('#log-window').prepend("<div>" + s + "</div>");
		++Logger.len;
		if(Logger.len > 5) {
			$('#log-window :last-child').remove();
		}
		console.log(s);
	}
};