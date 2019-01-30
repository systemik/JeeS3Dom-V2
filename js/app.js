/*global tau */
(function () {
    var selectedLight = null;
    var selectedTemp = null;
    var selectedScenarios = null;

    var lightCmd = [];
    var tempCmd = [];
    var scenarios = [];

    lightCmd = JSON.parse(localStorage.getItem("lightCmd"));
    tempCmd = JSON.parse(localStorage.getItem("tempCmd"));
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
			var li = document.createElement('li');
			var cmdToLaunch = lightCmd[i].id;
			li.addEventListener('click', requestcommand.bind(this, cmdToLaunch), false);
			li.innerText = lightCmd[i].equipment + " - " + lightCmd[i].generic_type;
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
			var li = document.createElement('li');
			li.className = 'li-has-2line';
			var cmdToLaunch = tempCmd[i].id;
			li.addEventListener('click', requesttemp.bind(this, cmdToLaunch), false);
			li.innerText = tempCmd[i].equipment + "/" + tempCmd[i].generic_type;
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
		
		if (page.id === 'lights') {
			createLights(list);
		} else

		if (page.id === 'scenarios') {
			createScenarios(list);
		} else

		if (page.id === 'temperatures') {
			createTemperatures(list);
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