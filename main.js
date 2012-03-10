function drawBalance(xml)
{	
	var rub;
	{
		var errorCode = $("errorCode", xml);
		if (errorCode.length)
		{
			error = parseInt(errorCode[0].text);
			if (error == 1)		
				throw new Error(strings.inputError);
			else if (error == 2)
				throw new Error(strings.innerError);
			else if (error == 3)
				throw new Error(strings.methodNotFoundError);
		}
	
		var balance = $("balance", xml);
		if (balance.length)
		{
			rub = parseFloat(balance[0].text).toFixed(2);
			
			$('#balance').text(rub+' р.');
			$('#balance_docked').text(rub+' р.');
		}
		
		var debetBound = $("debetBound", xml);
		if (debetBound.length)
		{
			$('#debetBound').text(debetBound[0].text+ ' р.');
		}

		var days2BlockStr = $("days2BlockStr", xml);
		if (days2BlockStr.length)
		{
			$('#days2BlockStr').text(days2BlockStr[0].text);
			$('#days2BlockStr_docked').text(days2BlockStr[0].text);
		}
		
		
		var contractId = $("contractId", xml);
		if (contractId.length)
		{
			$('#contractId').text(contractId[0].text);
		}
		
		/*var promisedPayment = $("promisedPayment", xml);
		if (promisedPayment.length)
		{
			var isOpen = promisedPayment.find("isOpen");
			if (isOpen.length && isOpen[0].text == "1")
				$('#debet').get(0).style.display = '';
			else
				$('#debet').get(0).style.display = 'none';
		}*/
	
		var name = $("name", xml);
		if (name.length)
		{			
			var reg = /(\D+)\s(\D+)\s(\D+)/;
			var arr = reg.exec(name[0].text);
			
			var text = $('#first_name')[0].childNodes;
			text[0].nodeValue = arr[1];
			text[2].nodeValue = arr[2];
			text[4].nodeValue = arr[3];
		}	
	}

	if (rub)
	{
		var date = new Date();
		var strDate = date.getDate() + "."+ (date.getMonth()+1) + "." + date.getFullYear() + 
			" " + date.getHours() + ":" + date.getMinutes();
			
		$('#date').text(strDate);
	
		return true;
	}
	
	return false;
}

function draw()
{	
	var xmlhttp = new XMLHttpRequest();

	var login = xor(System.Gadget.Settings.readString('login'));
	var password = System.Gadget.Settings.readString('password');

	try 
	{
		xmlhttp.open('GET', 'https://api.novotelecom.ru/billing/?method=userInfo&login='+login+'&passwordHash=' + password+ "&clientVersion=2", true);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
		xmlhttp.setRequestHeader("Connection", "close");		
		xmlhttp.send(null);
		
		xmlhttp.onreadystatechange = function() 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				try
				{
					if (!drawBalance(xmlhttp.responseXML)){
						$('#gadgetContent').get(0).style.display = 'none';
						$('#message').get(0).style.display = '';
						$('#message').text(strings.connectError);								
					}
					else{		
						$('#gadgetContent').get(0).style.display = '';
						$('#message').get(0).style.display = 'none';
					}
				}
				catch (err)
				{
					$('#gadgetContent').get(0).style.display = 'none';
					$('#message').get(0).style.display = '';
					$('#message').text(err.message);
				}
		}
	}
	catch (exception_var) 
	{
	}	
}

function onSettingsClosed(event) {
    if (event.closeAction == event.Action.commit) {
		initSettings();	
    }
}

function initSettings() {
    System.Gadget.settingsUI = 'settings.html';
    System.Gadget.onSettingsClosed = onSettingsClosed;	
	
	//System.Gadget.Settings.write("PrivateSetting_GadgetOpacity", 40);
	
	// устанавливаем значения по умолчанию при первом запуске гаджета
	var login = System.Gadget.Settings.readString('login');
	var password = System.Gadget.Settings.readString('password');
	if(login == '' || password == '') {
		$('#gadgetContent').get(0).style.display = 'none';
		$('#message').text(strings.inputLogin);
		$('#message').get(0).style.display = 'inline-block';
	}
	else{
		$('#gadgetContent').get(0).style.display = 'none';
		$('#message').text(strings.connecting);
		$('#message').get(0).style.display = '';
		draw();
	}
}
	
function main()
{
    System.Gadget.onDock = dockStateChanged;
    System.Gadget.onUndock = dockStateChanged;
	
	initSettings();
	
	/*{
		// Для тестов
	
		$('#balance').text(194.41+' р.');
		$('#balance_docked').text(194.41+' р.');

		$('#debetBound').text(-300+ ' р.');	
		
		$('#days2BlockStr').text("Хватит примерно на 9 дней");
				
		$('#gadgetContent').get(0).style.display = '';
		$('#message').get(0).style.display = 'none';
	}*/
	
	window.setInterval(draw , 1000*60*60) 
}
	
function dockStateChanged() {

    if (System.Gadget.docked) {
		var width = '100px';
		var height = '85px';
	
		$('#background').css('width', width)
						.css('height', height)
						.attr('src', 'images/dockedBg.png');
	
        $(document.body).css('width', width)
						.css('height', height);
						
		 $('#docked').get(0).style.display = '';
		 $('#undocked').get(0).style.display = 'none';
						
	} else {
		var width = '220px'
		var height = '176px'
		
		$('#background').css('width', width)
						.css('height', height)
						.attr('src', 'images/dockedBg.png');

        $(document.body).css('width', width)
						.css('height', height);
						
		$('#docked').get(0).style.display = 'none';
		$('#undocked').get(0).style.display = '';
    }
	
	// Добавляем тень
	//$('#background').get(0).addShadow("black", 20, 80, 5, 5);
}

$(document).ready(main);