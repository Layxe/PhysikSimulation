/**
 * -=-=-=-=-=-( Physik Editor )-=-=-=-=-=-=-
 * @author  = Alexander Niedermayer
 * @date    = 24.02.2016
 * @version = 1.5 Beta
 * @description = Editor zum verändern verschiedener Eigenschaften der Objekte
 *
 */

//############# Konstanten #############//

const MENU = document.getElementById("main-container");
const SETTINGS = document.getElementById("settings-container");
const strokeWidth = 3; //px

//#####################################//

//############# Variablen #############//

var selectedElement  = null;  // Ausgewähltes Objekt
var mouseDown        = false; // Wird die linke Maustaste gerade gedrückt?
var mousePos         = [0,0]; // Aktuelle Maus Position
var relativeMouse    = [0,0]; // Maus Position relativ zum ausgewählten Objekt

//#####################################//

// Funktion zum erhalten der Mausposition auf der Zeichenoberfläche
function getMousePos(e) {
    var r = DISPLAY.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];

}

//########### Event listener #############//
// Was ist ein Event Listener?
// -> Siehe Pdf Seite x

// Öffne das Fenster zum bearbeiten des Graphen
document.getElementById("graph-button").addEventListener("click", function() {
    var graphmenu = document.getElementById("graph-settings");
    graphmenu.style.display = "block";

    var selector = document.getElementById("selector");
    selector.innerHTML = "";
    for(var i = 0; i < MH.Entities.length; i++) {
        //selector.innerHTML += "<div class='element' onclick='Graph.setEntity(MH.getEntityById(" + MH.Entities[i].id + "))'> Object: " + MH.Entities[i].id + "</div>";
    }

});

// Schließe das Element

function close(el) {
    el.style.display = "none";
}

// Linke Maustaste wird losgelassen

window.addEventListener("mouseup", function(e) {
    mouseDown = false;
    if(selectedElement != null)
        if(selectedElement.hasVelocity)
            selectedElement.velocity = selectedElement.dragVelocity;
});

// Linke Maustaste wird gedrückt oder losgelassen
window.addEventListener("click", function(e) {
   if(selectedElement != null) {
       // Aktualisiere die boolschen Werte des ausgewählten Element mit dem Checkboxen
       selectedElement.hasGravity = document.getElementById("gravity-checkbox").checked;
       selectedElement.hasVelocity = document.getElementById("velocity-checkbox").checked;
       // Setze die y Geschwindigkeit zurück, falls die Gravitation deaktiviert wird
       if(!selectedElement.hasGravity)
           selectedElement.velocity[1] = 0;
       // Annulliere jegliche Bewegung, falls die Bewegungen ausgestellt werden
       if(!selectedElement.hasVelocity) {
           selectedElement.velocity = [0,0];
           selectedElement.dragVelocity = [0,0];
       }


   }
});

// Linke Maustaste wird gedrückt
DISPLAY.addEventListener("mousedown", function(e) {

    var position = getMousePos(e);
    mouseDown = true;

    // Das Ausgewählte Objekt wird nicht mehr ausgewählt
    if(selectedElement != null)
        selectedElement.selected = false;
    selectedElement = null;


    // Durchläuft alle Objekte und sucht nach einer Übereinstimmung der Koordinaten
    // um somit das schlussendliche Objekt auszuwählen
    for(var i = 0; i < MH.Entities.length; i++) {
        // Überprüfe ob die Positionen übereinstimmen
        if(position[0] > MH.Entities[i].x && position[0] < MH.Entities[i].x + MH.Entities[i].w && position[1] > MH.Entities[i].y && position[1] < MH.Entities[i].y + MH.Entities[i].h) {
            // Setzte das ausgewählte Element
            selectedElement = MH.Entities[i];
            MH.Entities[i].selected = true;
            // Berechnung der relativen Mausposition, somit wird das Objekt nicht an der
            // linken oberen Ecke gehalten wird
            relativeMouse[0] = position[0] - selectedElement.x;
            relativeMouse[1] = position[1] - selectedElement.y;
            // Anzeige der Elemente an der Seite
            displaySettings(selectedElement);

            return 0;

        }

    }

});

// Falls die Maus bewegt wird, wird die Mausposition aktualisiert
window.addEventListener("mousemove", function(e) {

    mousePos = getMousePos(e);

});

// Loop zum Bewegen des ausgewählten Elements
setInterval(function() {


    if(selectedElement != null && mouseDown) {
        // Setze die neuen Koordinaten des Elements
        selectedElement.x = mousePos[0] - relativeMouse[0];
        selectedElement.y = mousePos[1] - relativeMouse[1];
        // Berechne den Vektor, mit dem das Objekt geworfen wird
        selectedElement.dragVelocity = [(selectedElement.x - selectedElement.oldPosition[0])*THROW_STRENGTH, (selectedElement.y - selectedElement.oldPosition[1])*THROW_STRENGTH]
        // Annulliere die Geschwindigkeit
        selectedElement.velocity = [0,0];
        // Aktualisieren der boolschen Werte
        selectedElement.inAir = true;
        selectedElement.slidingObject = null;

    }

    if(selectedElement != null) {
        // Speichern der alten Position, zum berechnen des Wurfvektors
        selectedElement.oldPosition = [selectedElement.x, selectedElement.y];
        // Anzeige der Informationen auf der rechten Seite
        displayInfo(selectedElement);
        // Aktualisiere die Farbe des Objekts
        selectedElement.c = document.getElementById("input-color").value;

    } else {
        // Falls kein Element ausgewählt ist, soll das rechte Fenster leer sein
        SETTINGS.innerHTML = "";
        MENU.innerHTML     = "";
    }


}, 1000/FPS);

function displaySettings(el) {
    // Anzeigen des Menüs
    SETTINGS.innerHTML = "Color: <input id='input-color' class='single-value' value='" + el.c + "'>";
    SETTINGS.innerHTML += "<br> Gravity: <input id='gravity-checkbox' type='checkbox' value='true'>";
    SETTINGS.innerHTML += "<br> Velocity: <input id='velocity-checkbox' type='checkbox' value='true'>";
    SETTINGS.innerHTML += "<br><br> <input id='console' placeholder='Type in a command...'>";

    // Hinzufügen eines Event Listener, welcher ausgelößt wird, falls die Enter Taste betätigt wird
    document.getElementById("console").addEventListener("keydown", function(e) {
        if(e.keyCode == 13) {
            // Ausführen des eingegebenen Befehls
            var command = document.getElementById("console").value;
            var newCommand = command.replace("this", "selectedElement");
            eval(newCommand);
        }
    });

    // Füge den Checkboxen den Wert des jeweiligen boolschen Werts hinzu
    document.getElementById("gravity-checkbox").checked = selectedElement.hasGravity;
    document.getElementById("velocity-checkbox").checked = selectedElement.hasVelocity;
}

function displayInfo(el) {

    // Löschen der Informationen
    MENU.innerHTML = "";
    // Anzeigen der Informationen
    MENU.innerHTML += "Position: <span class='value'>y: " + Math.round(el.y) + "</span> <span class='value'>x: " + Math.round(el.x);
    MENU.innerHTML += "<br> Tempo: <span class='value'>y: " + Math.round(el.velocity[1]*100)/100 + " m/s</span> <span class='value'>x: " + Math.round(el.velocity[0]*100)/100 + " m/s";
    MENU.innerHTML += "<br> Maße: <span class='value'>height: " + el.h/SCALE + " m</span> <span class='value'>width: " + el.w/SCALE + " m";
    MENU.innerHTML += "<br>Masse: <span class='single-value'>" + el.m + "</span>";
    MENU.innerHTML += "<br>Reibung: <span class='single-value'>" + el.friction + "</span>";
    MENU.innerHTML += "<br>ID: <span class='single-value'>" + el.id + "</span>";
    MENU.innerHTML += "<br>Energiever.: <span class='single-value'>";

    var energyLossString = "Sehr gering";

    if(el.energyLoss == 0) {
        energyLossString = "Sehr groß";
    } else if(el.energyLoss < 0.25) {
        energyLossString = "Groß";
    } else if(el.energyLoss < 0.5) {
        energyLossString = "Mäßig";
    } else if(el.energyLoss < 0.75) {
        energyLossString = "Gering";
    }

    MENU.innerHTML += energyLossString + "</span>";

}

// ################## Seitliches Menü ################## //

/**
 * Funktion zum erstellen eines Objekts
 */

function addObject() {
    MH.createEntity(0,0,50,50,50);
}

/**
 * Funktion zum löschen eines Objekts
 */

function deleteObject() {
    if(selectedElement != null) {
        MH.deleteEntity(selectedElement);
    } else {
        alert("Bitte das Objekt zum löschen auswählen!");
    }
}

var GLOBAL_GRAVITY = false,
    RUNNING        = true;

/**
 *  Funktion zum de/aktivieren der Gravitation für jedes Objekt welches nicht statisch ist
 */

function toggleGravity() {

    if(selectedElement != null)
        selectedElement.selected = false;

    selectedElement = null;


    for(var i = 0; i < MH.Entities.length; i++) {
        if(MH.Entities[i].hasVelocity)
            MH.Entities[i].hasGravity = GLOBAL_GRAVITY;

    }
    GLOBAL_GRAVITY = !GLOBAL_GRAVITY;
}

/**
 * Funktion zum de/aktivieren der Zeichen/Physikberechnungsschleife
 */

function toggleAnimation() {
    if(RUNNING) {
        clearInterval(ANIMATION);
    } else {
        ANIMATION = setInterval(animate, 1000/FPS);
    }

    RUNNING = !RUNNING;

}

/**
 * Methode zum öffnen des Hilfe Dialogs
 */

var helpMenuIsOpen = false;

function toggleHelp() {
    var help_menu = document.getElementById("help-wrapper");
    if(!helpMenuIsOpen) {
        help_menu.style.display = "block";
    } else {
        help_menu.style.display = "none";
    }
    helpMenuIsOpen = !helpMenuIsOpen;
}

// Hinzufügen eines Event handlers falls eine Taste gedrückt wird
// Probleme beim Eingeben in der Konsole
/*document.addEventListener("keydown", function(e) {
    if(e.keyCode == 32) // Überprüfe ob die Leertaste gedrückt wird. Leertaste keycode = 32
        toggleAnimation();
}, false);*/

