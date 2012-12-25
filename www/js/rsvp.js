function callVarnish(url) {
	$.get(url, function(data) {
		modalMessageBox(data);
	});	
}

	
function modalMessageBox(message) {
	if(message.trim()==''){ 
		message='Hmmm, no, nothing to say…';
	}
	$('#ServerMessage > .modal-body > p').text(message);
	$('#ServerMessage').modal();
}

function updateStat() {
	$.getJSON('/cgi-bin/varnishstat.json', function(data) {
		// for each value:
		$.each(data, function(key, val) {
				// we remove any character that cold cause trouble:
				var ekey=key.replace(/[\.\(\),]/gi,'_');
				// if this is the timestamp:
				if(ekey=='timestamp'){
					$('#s_'+ekey+' > td:first').text(key);
					$('#s_'+ekey+' > td:last').text(val);
				// if this value is already in the html table, we just update its value:
				}else if($('#s_'+ekey).length > 0){
					$('#s_'+ekey+' > td:first').html('<a href="#" class="key" rel="tooltip" title="'+val['description']+'">' + key + '</a>');
					$('#s_'+ekey+' > td:last').html('<label>'+val['value']+'</label>');
				// else we add a new row to the html table:
				}else{
					$('#stat').append( '<tr id="s_'+ekey+'"><td><a href="#" class="key" rel="tooltip" title="'+val['description']+'">' + key + '</a></td><td>' + val['value'] + '</td></tr>');
				}
		});
		$('.key').tooltip();
	});
	setTimeout(updateStat, 1000);
}

function banCache() {
	callVarnish('/cgi-bin/ban.txt');
}


function rebootVarnish() {
	callVarnish('/cgi-bin/reboot.txt');	
}


function startLog(){
	callVarnish('/cgi-bin/startlog.txt');
}

function stopLog(){
	callVarnish('/cgi-bin/stoplog.txt');
}

function stopAll(){
	callVarnish('/cgi-bin/stopall.txt');
}

function clearLog(){
	callVarnish('/cgi-bin/clearlog.txt');
}

function updateLog() {
	$.get('/cgi-bin/getpid.txt', function(pid) {
	if(pid.trim()==''){
		$('#status').text('Stopped');
		$('#status').removeClass('badge-success');
	}else{
		$('#status').text('Running '+pid);
		$('#status').addClass('badge-success');
		$.get('/cgi-bin/readlog.txt', function(data) {
			$('#logs').text(data);
			$("#logs").animate({ scrollTop: $('#logs')[0].scrollHeight}, 1000);
		});
	}
	setTimeout(updateLog, 2000);
	});
}
	
	
	
	
	
	
