// Load Box value on start
// Indiquer l'adresse IP/url et la clé API de Jeedom (Jeedom_API_Key)

function initJeedomValue() {

    if (!localStorage.getItem("IP")) {
        localStorage.setItem("IP", "192.168.1.x");
    };
    if (!localStorage.getItem("KEY")) {
        localStorage.setItem("KEY", "Jeedom_API_Key");
    };
    if (!localStorage.getItem("KEY")) {
        localStorage.setItem("HTTPS", false);
    };

    document.getElementById("addressValue").value = localStorage.getItem("IP");
    document.getElementById("keyValue").value = localStorage.getItem("KEY");
    document.getElementById("httpsValue").checked = JSON.parse(localStorage.getItem("HTTPS"));

    console.log("initJeedomValue executed");

}

// Save Box value

function saveJeedomValue() {

    var addressValue = document.getElementById("addressValue").value;
    var keyValue = document.getElementById("keyValue").value;
    var httpsValue = document.getElementById("httpsValue").checked;

    localStorage.setItem("IP", addressValue);
    localStorage.setItem("KEY", keyValue);
    localStorage.setItem("HTTPS", httpsValue);
}

// Load Box JSON value on start
// Indiquer l'adresse IP/url et la clé API de Jeedom (votre_cle_API_jeedom)

function initJeedomJsonValue() {

    var myKeyValue, myIPValue;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }
    console.log("KEY Value: " + myKeyValue);
    console.log("IP Value: " + myIPValue);
    console.log("HTTPS: " + myHttps);

    var xhttp1; // JSON-Objects
    var xhttp2; // JSON-Commands
    var xhttp3; // JSON-Scenario
    var xhttp4; // JSON-All

    // JSON-Objects
    xhttp1 = new XMLHttpRequest();
    xhttp1.open("POST", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php");
    xhttp1.send(JSON.stringify({
        "jsonrpc": "2.0",
        "method": "object::all",
        "params": {
            "apikey": myKeyValue
        },
        "id": 1
    }));

    xhttp1.onreadystatechange = function () {
        if (xhttp1.readyState == 4 && xhttp1.status == 200) {
            var data = JSON.parse(xhttp1.responseText);
            localStorage.setItem("JSONObjects", JSON.stringify(data));
        }
    }

    // JSON-Commands
    xhttp2 = new XMLHttpRequest();

    xhttp2.open("POST", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php");
    xhttp2.send(JSON.stringify({
        "jsonrpc": "2.0",
        "method": "cmd::all",
        "params": {
            "apikey": myKeyValue
        },
        "id": 1
    }));

    xhttp2.onreadystatechange = function () {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
            var data = JSON.parse(xhttp2.responseText);
            // console.log(JSON.stringify(data));
            localStorage.setItem("JSONCommands", JSON.stringify(data));
        }
    }

    // JSON-Scenario
    xhttp3 = new XMLHttpRequest();

    xhttp3.open("POST", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php");
    xhttp3.send(JSON.stringify({
        "jsonrpc": "2.0",
        "method": "scenario::all",
        "params": {
            "apikey": myKeyValue
        },
        "id": 1
    }));

    xhttp3.onreadystatechange = function () {
        if (xhttp3.readyState == 4 && xhttp3.status == 200) {
            var data = JSON.parse(xhttp3.responseText);
            localStorage.setItem("JSONScenario", JSON.stringify(data));
        }
    }

    // JSON-All

    xhttp4 = new XMLHttpRequest();

    xhttp4.open("POST", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php");
    xhttp4.send(JSON.stringify({
        "jsonrpc": "2.0",
        "method": "object::full",
        "params": {
            "apikey": myKeyValue
        },
        "id": 1
    }));

    xhttp4.onreadystatechange = function () {
        if (xhttp4.readyState === 4 && xhttp4.status === 200) {
            var data = JSON.parse(xhttp4.responseText);
            localStorage.setItem("JSONfull", JSON.stringify(data));
        };
    };
    console.log("initJeedomJsonValue executed");
};


// Command setup

function commandSetup() {
    fullData = JSON.parse(localStorage.getItem("JSONfull"));
    fullScenario = JSON.parse(localStorage.getItem("JSONScenario"));
    var lightCmd = [];
    var tempCmd = [];
    var scenarios = [];
    var eqCategory;

    // LIGHTS
    $.each(fullData.result, function (key, valueeq) {
        $.each(valueeq.eqLogics, function (key, valueeqlogics) {
            $.each(valueeqlogics.cmds, function (key, valueeqlogicscmds) {
                if (valueeqlogicscmds.generic_type === "LIGHT_ON" || valueeqlogicscmds.generic_type === "LIGHT_OFF") {
                    lightCmd.push({
                        object: valueeq.name,
                        equipment: valueeqlogics.name,
                        generic_type: valueeqlogicscmds.generic_type,
                        id: valueeqlogicscmds.id
                    });
                }
            });
        });
    });
    localStorage.setItem("lightCmd", JSON.stringify(lightCmd));
    // console.log(lightCmd);

    //TEMPERATURE
    $.each(fullData.result, function (key, valueeq) {
        $.each(valueeq.eqLogics, function (key, valueeqlogics) {
            $.each(valueeqlogics.cmds, function (key, valueeqlogicscmds) {
                if (valueeqlogicscmds.generic_type === "TEMPERATURE") {
                    tempCmd.push({
                        object: valueeq.name,
                        equipment: valueeqlogics.name,
                        generic_type: valueeqlogicscmds.generic_type,
                        id: valueeqlogicscmds.id
                    });
                }
            });
        });
    });
    localStorage.setItem("tempCmd", JSON.stringify(tempCmd));
    // console.log(tempCmd);

    //SCENARIO
    $.each(fullScenario.result, function (key, valuescenario) {
        scenarios.push({
            name: valuescenario.name,
            id: valuescenario.id
        });
    });
    localStorage.setItem("scenarios", JSON.stringify(scenarios));
    // console.log(scenarios);

};



// Requette HTTP pour les Commandes
// Les commandes sont en HTTP. On peut mettre HTTPS si besoin.


function requestcommand(jeedomcmd) {

    var myKeyValue, myIPValue;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");

    var client = new XMLHttpRequest();
    client.open("GET", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomcmd);
    console.log("http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomcmd);
    client.onreadystatechange = function () {
        if (client.readyState == 4) {
            if (client.status == 200) {
                console.log(client.responseText);
                navigator.vibrate([500, 500, 500]);
            }
        }
    };
    client.send();
};

// Requette HTTP pour les Scenario
// Les commandes sont en HTTP. On peut mettre HTTPS si besoin.

function requestscenario(jeedomscenario) {

    var myKeyValue, myIPValue;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    console.log("KEY Value: " + myKeyValue);
    console.log("IP Value: " + myIPValue);

    var client = new XMLHttpRequest();
    client.open("GET", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=scenario&id=" + jeedomscenario + "&action=start");
    console.log("http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=scenario&id=" + jeedomscenario + "&action=start");
    client.onreadystatechange = function () {
        if (client.readyState == 4) {
            if (client.status == 200) {
                console.log(client.responseText);
                navigator.vibrate([500, 500, 500]);
            }
        }
    };
    client.send();
};


// Requette HTTP pour la requete temperature
// Les commandes sont en HTTP. On peut mettre HTTPS si besoin.

function requesttemp(jeedomtemp) {

    var myKeyValue, myIPValue;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    console.log("KEY Value: " + myKeyValue);
    console.log("IP Value: " + myIPValue);

    var client = new XMLHttpRequest();
    client.open("GET", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomtemp);
    console.log("http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomtemp);
    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {
                console.log(client.responseText);
                navigator.vibrate([500, 500, 500]);

                var message = client.responseText;
                console.log(message);
                var messageOut = document.getElementById("messageOut");
                console.log(messageOut);

                var timeOut = "2"; // Input timeOut en secondes
                messageOut.innerHTML = message;
                console.log(messageOut.innerHTML);


                tau.openPopup("#Popup");
                setTimeout(function () {
                        tau.closePopup();
                    }, // Alert Popup Toast
                    timeOut * 1000);
            }
        }
    };
    client.send();
}