/*global tau */
(function () {
    var lightCmd = [];
    var lightCmdFull = [];
    var tempCmd = [];
    var tempCmdFull = [];
    var scenarios = [];

    lightCmd = JSON.parse(localStorage.getItem("lightCmd"));
    lightCmdFull = JSON.parse(localStorage.getItem("lightCmdFull"));
    tempCmd = JSON.parse(localStorage.getItem("tempCmd"));
    tempCmdFull = JSON.parse(localStorage.getItem("tempCmdFull"));
    scenarios = JSON.parse(localStorage.getItem("scenarios"));
    console.log(lightCmd);
    

	// ------------------------------------------------------------------------
	// Create views
	// ------------------------------------------------------------------------

	function createLights(list) {
		for (var i = 0; i < lightCmd.length; i++) {
			console.log('process LightCmd #' + i);

			var span = document.createElement('span');
			span.className = 'ui-li-sub-text li-text-sub';
			span.innerHTML = lightCmd[i].generic_type;
			var li = document.createElement('li');
			var cmdToLaunch = lightCmd[i].id;
			li.addEventListener('click', requestcommand.bind(this, cmdToLaunch), false);
			li.innerText = lightCmd[i].equipment;
			li.appendChild(span);
			list.appendChild(li);
        }
    }
  
	function createLightsToggle(list) {
		console.log(lightCmdFull);
		for (var i = 0; i < lightCmdFull.length; i++) {
			console.log('process LightCmdFull #' + i);

			var span = document.createElement('span');
			// span.className = 'ui-li-sub-text li-text-sub';
			span.className = 'li-text-sub';
			// span.innerHTML = lightCmdFull[i].state;

			var li = document.createElement('li');
			li.className = 'li-has-toggle';

			if (lightCmdFull[i].state >= 1) {var html = '<label class="ui-custom-toggleswitch-label">' + lightCmdFull[i].equipment + '<div class="ui-toggleswitch ui-custom-toggleswitch"><input id="mobile-data-switch-input" type="checkbox" class="ui-switch-input" checked/><div class="ui-switch-button"></div></div></label>';}
			else{var html = '<label class="ui-custom-toggleswitch-label">' + lightCmdFull[i].equipment + '<div class="ui-toggleswitch ui-custom-toggleswitch"><input id="mobile-data-switch-input" type="checkbox" class="ui-switch-input"/><div class="ui-switch-button"></div></div></label>';}
			var wrapper= document.createElement('div');
			wrapper.innerHTML = html;

			var cmdToLaunch = lightCmdFull[i].objectid;
			var cmdToLaunch2 = lightCmdFull[i].logicalid;
			li.addEventListener('click', requestcommandtoggle.bind(this, cmdToLaunch, cmdToLaunch2), false);

			li.appendChild(wrapper);

			li.appendChild(span);
			list.appendChild(li);

        }
	}
	
    function createScenarios(list) {
		
        for (var i = 0; i < scenarios.length; i++) {
			console.log('process scenarios #' + i);

			var span = document.createElement('span');
			span.className = 'ui-li-sub-text li-text-sub';
			var li = document.createElement('li');
			li.className = 'li-has-2line';
			var cmdToLaunch = scenarios[i].id;
			li.addEventListener('click', requestscenario.bind(this, cmdToLaunch), false);
			li.innerText = scenarios[i].name;
			li.appendChild(span);
			list.appendChild(li);
        }
    }
    
    function createTemperatures(list) {
		for (var i = 0; i < tempCmd.length; i++) {
			console.log('process tempCmds #' + i);

			var span = document.createElement('span');
			span.className = 'ui-li-sub-text li-text-sub';
			span.innerHTML = tempCmd[i].state + " °";
			var li = document.createElement('li');
			li.className = 'li-has-2line';
			var cmdToLaunch = tempCmd[i].id;
			li.addEventListener('click', requesttemp.bind(this, cmdToLaunch), false);
			li.innerText = tempCmd[i].equipment;
			li.appendChild(span);
			list.appendChild(li);
        }
    }
    
    function createTemperaturesHumi(list) {
		for (var i = 0; i < tempCmdFull.length; i++) {
			console.log('process temphumiCmds #' + i);

			var span = document.createElement('span');
			span.className = 'ui-li-sub-text li-text-sub';
			if (tempCmdFull[i].statehum === ""){
			span.innerHTML = tempCmdFull[i].statetemp + " °"}
			else{
			span.innerHTML = tempCmdFull[i].statetemp + " °/ " + tempCmdFull[i].statehum + " %";}
			var li = document.createElement('li');
			li.className = 'li-has-2line';
			var cmdToLaunch = tempCmdFull[i].tempid;
			li.addEventListener('click', requesttemp.bind(this, cmdToLaunch), false);
			li.innerText = tempCmdFull[i].equipment;
			li.appendChild(span);
			list.appendChild(li);
        }
    }	

	// ------------------------------------------------------------------------
	// Listeners
	// ------------------------------------------------------------------------

	document.addEventListener('pagecreate', function (event) {
		var page = event.target;
		console.log('-- pagecreate(' + page.id + ') --');
		var list = page.querySelector('.ui-listview');
		
		if (page.id === 'Lights') {
			createLights(list);
		} else

		if (page.id === 'LightsToggle') {
			requestcommandlistlight(localStorage.getItem("lightCmdFullIds"));
			createLightsToggle(list);
		} else

		if (page.id === 'Scenarios') {
			createScenarios(list);
		} else

		if (page.id === 'Temp') {
			createTemperatures(list);
		}

		if (page.id === 'TempHumi') {
			createTemperaturesHumi(list);
		}
	});

	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());