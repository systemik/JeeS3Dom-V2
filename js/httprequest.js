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
    
    console.log("saveJeedomValue executed");

}

// Load Box JSON value on start
// Indiquer l'adresse IP/url et la clé API de Jeedom (votre_cle_API_jeedom)

function initJeedomJsonValue() {

    var myKeyValue, myIPValue;

    var myKeyValue = localStorage.getItem("KEY");
    var myIPValue = localStorage.getItem("IP");
    var myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }
    console.log("KEY Value: " + myKeyValue);
    console.log("IP Value: " + myIPValue);
    console.log("HTTPS: " + myHttps);

    localStorage.setItem("JSONCommands", "");
    localStorage.setItem("JSONObjects", "");
    localStorage.setItem("JSONScenario", "");
    localStorage.setItem("JSONfull", "");
    localStorage.setItem("lightCmd", "");
    localStorage.setItem("lightCmdFull", "");
    localStorage.setItem("lightCmdFullIds", "");
    localStorage.setItem("lightCmdIds", "");
    localStorage.setItem("scenarios", "");
    localStorage.setItem("tempCmd", "");
    localStorage.setItem("tempCmdFull", "");
    localStorage.setItem("tempCmdFullIds", "");
    localStorage.setItem("tempCmdIds", "");





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
    navigator.vibrate([100, 100, 100]);
};


// Command setup

function commandSetup() {
    fullData = JSON.parse(localStorage.getItem("JSONfull"));
    fullScenario = JSON.parse(localStorage.getItem("JSONScenario"));
    var lightCmd = [];
    var lightCmdFull = []; 
    var tempCmd = [];
    var tempCmdFull = [];
    var scenarios = [];
    var lightCmdIds = [];
    var lightCmdFullIds = [];
    var tempCmdIds = [];
    var tempCmdFullIds = [];
    var eqCategory;
    var lightonid,lightoffid,lightstateid;
    var temptempid,temphumid,temptempstateid,temphumstateid;


    // LIGHTS
    $.each(fullData.result, function (key, valueeq) {
        $.each(valueeq.eqLogics, function (key, valueeqlogics) {
            $.each(valueeqlogics.cmds, function (key, valueeqlogicscmds) {
                if (valueeqlogicscmds.generic_type === "LIGHT_ON" || valueeqlogicscmds.generic_type === "LIGHT_OFF") {
                    lightCmd.push({
                        object: valueeq.name,
                        equipment: valueeqlogics.name,
                        generic_type: valueeqlogicscmds.generic_type,
                        id: valueeqlogicscmds.id,
                        state: ""
                    });
                    lightCmdIds.push(valueeqlogicscmds.id);
                }
            });
        });
    });
    localStorage.setItem("lightCmd", JSON.stringify(lightCmd));
    localStorage.setItem("lightCmdIds", JSON.stringify(lightCmdIds));

    //LIGHTS FULL
    $.each(fullData.result, function (key, valueeq) {
        $.each(valueeq.eqLogics, function (key, valueeqlogics) {
            $.each(valueeqlogics.cmds, function (key, valueeqlogicscmds) {
                if (valueeqlogicscmds.generic_type === "LIGHT_ON" || valueeqlogicscmds.generic_type === "LIGHT_OFF" || valueeqlogicscmds.generic_type === "LIGHT_STATE"){
                    if (valueeqlogicscmds.generic_type === "LIGHT_ON"){lightonid=valueeqlogicscmds.id;}
                    else if (valueeqlogicscmds.generic_type === "LIGHT_OFF"){lightoffid=valueeqlogicscmds.id;}
                    else if (valueeqlogicscmds.generic_type === "LIGHT_STATE"){
                        lightstateid=valueeqlogicscmds.id;
                        lightCmdFull.push({
                            object: valueeq.name,
                            objectid: valueeq.id,
                            equipment: valueeqlogics.name,
                            equipmentid: valueeqlogics.id,
                            lighton:lightonid,
                            lightoff:lightoffid,
                            lightstate:lightstateid,
                            state:valueeqlogicscmds.state
                        });
                        lightCmdFullIds.push(valueeqlogicscmds.id);
                    }
                    else {}
            }
            });
        });
    });
    localStorage.setItem("lightCmdFull", JSON.stringify(lightCmdFull));
    localStorage.setItem("lightCmdFullIds", JSON.stringify(lightCmdFullIds));
    
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
                        id: valueeqlogicscmds.id,
                        state: ""
                    });
                    tempCmdIds.push(valueeqlogicscmds.id);
                }
            });
        });
    });
    localStorage.setItem("tempCmd", JSON.stringify(tempCmd));
    localStorage.setItem("tempCmdIds", JSON.stringify(tempCmdIds));

    // console.log(tempCmd);

    //TEMPERATURE FULL
    $.each(fullData.result, function (key, valueeq) {
        $.each(valueeq.eqLogics, function (key, valueeqlogics) {
            temptempid="";
            temphumid="";
            $.each(valueeqlogics.cmds, function (key, valueeqlogicscmds) {
                if (valueeqlogicscmds.generic_type === "TEMPERATURE"|| valueeqlogicscmds.generic_type === "HUMIDITY") {
                    if (valueeqlogicscmds.generic_type === "TEMPERATURE"){
                        temptempid=valueeqlogicscmds.id;
                        temptempstateid=valueeqlogicscmds.state;
                    }
                    else if (valueeqlogicscmds.generic_type === "HUMIDITY"){
                        temphumid=valueeqlogicscmds.id;
                        temphumstateid=valueeqlogicscmds.state;
                    }
                }
            });
            if (temptempid !== ""){
                tempCmdFull.push({
                    object: valueeq.name,
                    equipment: valueeqlogics.name,
                    // generic_type: valueeqlogicscmds.generic_type,
                    tempid: temptempid,
                    humid: temphumid,
                    statetemp: temptempstateid,
                    statehum: temphumstateid
                });
                // tempCmdFullIds.push(valueeqlogicscmds.id);
            }

        });
    });
    localStorage.setItem("tempCmdFull", JSON.stringify(tempCmdFull));
    localStorage.setItem("tempCmdFullIds", JSON.stringify(tempCmdFullIds));

    // console.log(tempCmd);


    //SCENARIO
    $.each(fullScenario.result, function (key, valuescenario) {
        if (valuescenario.isActive === "1"){
            scenarios.push({
                name: valuescenario.name,
                id: valuescenario.id
            });
        };  
    });
    localStorage.setItem("scenarios", JSON.stringify(scenarios));
    // console.log(scenarios);

    console.log("commandSetup executed");

};



// Requette HTTP pour les Commandes
// Les commandes sont en HTTP. On peut mettre HTTPS si besoin.


function requestcommand(jeedomcmd) {

    var myKeyValue, myIPValue, myHttps;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }

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

    var myKeyValue, myIPValue, myHttps;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }


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

function requestcommandlisttemp(jeedomcmd) {

    var myKeyValue, myIPValue, myHttps;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }

    var client = new XMLHttpRequest();
    client.open("GET", "http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomcmd);
    console.log("http" + myHttps + "://" + myIPValue + "/core/api/jeeApi.php?apikey=" + myKeyValue + "&type=cmd&id=" + jeedomcmd);
    client.onreadystatechange = function () {
        if (client.readyState == 4) {
            if (client.status == 200) {
                console.log(client.responseText);
                navigator.vibrate([500, 500, 500]);
                var responseTemp = JSON.parse(client.responseText);
                var eqTemp = JSON.parse(localStorage.getItem("tempCmd"));
                // console.log(responseTemp);
                // console.log(eqTemp);

                for (const key of Object.keys(responseTemp)) {
                    // console.log(key, responseTemp[key]);
                    $.each(eqTemp, function (key2, valueeqtemp) {
                        // console.log(valueeqtemp.id);
                        // console.log(key);

                        if (key === valueeqtemp.id) {
                            valueeqtemp.state = responseTemp[key];
                            localStorage.setItem("tempCmd",JSON.stringify(eqTemp));
                        };
                        for (const key2 of Object.keys(valueeqtemp)) {
                            if (key === key2){
                        }
                    }                
                    });
                }
            }
        }
    };
    client.send();
};


requestcommandlisttemp(localStorage.getItem("tempCmdIds"));

// Requette HTTP pour la requete temperature
// Les commandes sont en HTTP. On peut mettre HTTPS si besoin.

function requesttemp(jeedomtemp) {

    var myKeyValue, myIPValue, myHttps;

    myKeyValue = localStorage.getItem("KEY");
    myIPValue = localStorage.getItem("IP");
    myHttps = "";
    if (JSON.parse(localStorage.getItem("HTTPS"))) {
        myHttps = "s";
    }


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