function settingsClosing(event) {
    if (event.closeAction == event.Action.commit) {
		
		// убираем выделение ошибок
		$('.error').removeClass('error');
		
		if(!$('#login').val()) {
			event.cancel = true;
					
			// показываем ошибку
			$('#login').addClass('error');
		}
		
		if (!$('#password').val())
		{
			event.cancel = true;
			
			// показываем ошибку
			$('#password').addClass('error');			
		}
		
		if(!event.cancel) {	
			System.Gadget.Settings.writeString('login', xor($('#login').val()));
			System.Gadget.Settings.writeString('password', hex_md5($('#password').val()));
		}		
    }
}

function main() {
    System.Gadget.onSettingsClosing = settingsClosing;
	
	// считываем старые значения настроек и показываем их в форме
	$('#login').val(xor(System.Gadget.Settings.readString('login')));
	$('#password').val("");
}

$(document).ready(main);