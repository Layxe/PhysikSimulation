/**
 * Created by Alexander on 26.05.2016.
 */

function displayTextField(data) {

    var sceneRoot = document.createElement("div");
    sceneRoot.setAttribute("id", "scene-root");
    document.body.appendChild(sceneRoot);

    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", "sceneInput");
    textarea.innerHTML = data;
    sceneRoot.appendChild(textarea);

    sceneRoot.innerHTML += "<br><br>";

    var verifyButton = document.createElement("span");
    verifyButton.innerHTML = "Bestätigen";
    verifyButton.setAttribute("id", "sceneButton");
    sceneRoot.appendChild(verifyButton);

    verifyButton.addEventListener("click", function() {

        var data = document.getElementById("sceneInput").value;
        document.body.removeChild(sceneRoot);
        executeData(data);
    });

}

function executeData(data) {

    eval(data);

}

function saveScene() {

    var dataString = "MH.clearScene();";

    dataString += "SOLID_BORDERS=" + SOLID_BORDERS + ";";
    dataString += "CIRCLE_COLLISION=" + CIRCLE_COLLSISION + ";";

    for(var i = 0; i < MH.Entities.length; i++) {
        var e = MH.Entities[i];
        dataString += "var o" + i + " = MH.createEntity(" + e.x + "," + e.y + "," + e.w + "," + e.h + "," + e.m + ");";
        dataString += "o" + i + ".energyLoss=" + e.energyLoss + ";";
        dataString += "o" + i + ".friction=" + e.friction + ";";
        dataString += "o" + i + ".c='" + e.c + "';";
        dataString += "o" + i + ".id=" + e.id + ";";
        dataString += "o" + i + ".hasGravity=" + e.hasGravity + ";";
        dataString += "o" + i + ".hasVelocity=" + e.hasVelocity + ";";
        dataString += "o" + i + ".velocity[0]=" + e.velocity[0] + ";";
        dataString += "o" + i + ".velocity[1]=" + e.velocity[1] + ";";

    }

    displayTextField(dataString);

}