/* Displays a message */
function modalMessageBox(message) {
	if(message.trim()==''){ 
		message='Hmmm, no, nothing to say…';
	}
	$('#ServerMessage > .modal-body > p').text(message);
	$('#ServerMessage').modal();
}

/* Call a cgi-bin functio then displays the returned valu in modal box */
function callVarnish(url) {
	$.get(url, function(data) {
		modalMessageBox(data);
	});	
}

/* Update statistics table */
function updateStat() {
	// Get varnishd pid
	// ps aux | grep varnishd | grep -v grep | awk '{print $2}'
	$.get('/cgi-bin/getvrnpid.txt', function(pid) {
	// In case Varnishd is not running:
	if(pid.trim()==''){
		$('#pid').text('Stopped');
		$('#pid').removeClass('badge-success');
	// Varnishd is running:
	}else{
		$('#pid').text('Varnish Running ('+pid.trim()+')');
		$('#pid').addClass('badge-success');	
	
		// Get varnish status
		// varnishadm -S /etc/varnish/secret.www-data -T 127.0.0.1:6082 status
			$.get('/cgi-bin/status.txt', function(status) {
	// varnish is stopped:
	if(status.indexOf('running')==-1){
		$('#status').text('Stopped');
		$('#status').removeClass('badge-success');
	// varnish has started:
	}else{	
			$('#status').text(status.trim());
		$('#status').addClass('badge-success');	
	// get varnishstat
   //	varnishstat -j -1
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
					$('#stat').append( '<tr id="s_'+ekey+'" class="secondary"><td><a href="#" class="key" rel="tooltip" title="'+val['description']+'">' + key + '</a></td><td>' + val['value'] + '</td></tr>');
				}
		});
		// we calculate the ratio HIT/(HIT+MISS)
		ratio=Math.floor(data['cache_hit']['value'] / (data['cache_miss']['value'] + data['cache_hit']['value']) * 100);
		// Depending on the ratio we change the badge color:
		if(isNaN(ratio)){
			$('#ratio').removeClass('badge-inverse badge-important badge-warning badge-success');
		} else if(ratio<15){
			$('#ratio').removeClass('badge-inverse badge-important badge-warning badge-success').addClass('badge-inverse');
		} else if(ratio<50){
			$('#ratio').removeClass('badge-inverse badge-important badge-warning badge-success').addClass('badge-important');
		} else if(ratio<90){
			$('#ratio').removeClass('badge-inverse badge-important badge-warning badge-success').addClass('badge-warning');
		} else {
			$('#ratio').removeClass('badge-inverse badge-important badge-warning badge-success').addClass('badge-success');
		}
		$('#ratio').text(ratio+"%");
		$('.key').tooltip();
	});
	}
	// come back in 1 second:
	setTimeout(updateStat, 1000);
	});
	}
		});
}

/* Ban everything */
function banCache() {
	callVarnish('/cgi-bin/ban.txt');
}

/* Stops the starts Varnish */
function rebootVarnish() {
	callVarnish('/cgi-bin/reboot.txt');	
}

/* Starts logging */
function startLog(){
	callVarnish('/cgi-bin/startlog.txt');
}

/* Stops logging */
function stopLog(){
	callVarnish('/cgi-bin/stoplog.txt');
}

/* Stops all logging processes */
function stopAll(){
	callVarnish('/cgi-bin/stopall.txt');
}

/* Empties log file */
function clearLog(){
	callVarnish('/cgi-bin/clearlog.txt');
}

/* update log */
function updateLog() {
	// Gets log process pid:
	$.get('/cgi-bin/getlogpid.txt', function(pid) {
	// if no log process is running for this public ip:
	if(pid.trim()==''){
		$('#pid').text('Stopped');
		$('#pid').removeClass('badge-success');
		// Gets log in case there is an old one worth reading:
		if($('#logs').text()==''){
			getLog();
		}
	// a log process is currently running:
	}else{
		$('#pid').text('Log Running ('+pid.trim()+')');
		$('#pid').addClass('badge-success');
      // get log content:
		getLog();
	}
	// come back in 2 seconds:
	setTimeout(updateLog, 2000);
	});
}
/* Gets log content and scrolls down */
function getLog(){
	$.get('/cgi-bin/readlog.txt', function(data) {
		$('#logs').text(data);
		$("#logs").animate({ scrollTop: $('#logs')[0].scrollHeight}, 1000);
	});
}
	
	
	
