/**
 * -=-=-=-=-=-( Graph Anzeige )-=-=-=-=-=-=-
 * @author  = Alexander Niedermayer
 * @date    = 26.02.2016
 * @version = 1.5 Beta
 * @description = Datei zum Anzeigen verschiedener Werte in einem Graphen
 *
 */

//############# Konstanten #############//

const G_DISPLAY  = document.getElementById("graphdisplay");
const G_WIDTH    = G_DISPLAY.width;
const G_HEIGHT   = G_DISPLAY.height;
const G_CTX      = G_DISPLAY.getContext("2d");

var DRAW_COLOR = "White";

//####################################//

//######## Erstellen der Y Achse #############//

function yAxis(scale) {

    this.scale = scale; // Um wie viel wird die Skala der Y-Achse pro Abschnitt erhöht
    this.startLine = 0; // Anfagslinie

    this.drawLine = function drawLine() {
        var mirrorI = 13+(this.startLine/this.scale);
        for(var i = 1; i < G_HEIGHT+10/20; i++) {
            // Zeichne die Linie mit den Nummern
            G_CTX.fillStyle = "Black";
            G_CTX.beginPath();
            G_CTX.moveTo(0, 20*i);
            G_CTX.lineTo(10, 20*i);
            G_CTX.strokeStyle = DRAW_COLOR;
            G_CTX.stroke();
            // Zeichnen der Nummern
            G_CTX.font = "12px Arial";
            G_CTX.fillStyle = DRAW_COLOR;
            if(mirrorI != 0)
                G_CTX.fillText((Math.round(this.scale* mirrorI)).toString(),13,20*i+3);
            mirrorI--;
        }

    }
}

function Graph(yAxis) {
    this.yAxis = yAxis;
    this.displayData = null;
    this.entity = null;

    this.setEntity = function setEntity(ent) {
        this.displayData = ent.data;
        this.entity = ent;
    }

    this.drawGraph = function drawGraph() {
        // Draw the graph
        G_CTX.strokeStyle = DRAW_COLOR;
        G_CTX.beginPath();

        /*
        * ------------>   Wegen der invertierten Y-Achse
        * |               muss zuerst der Wert mit der
        * |               Höhe der Zeichenoberfläche
        * |               subtrahiert werden
        */

        // Anfang der Linie
        G_CTX.moveTo(20,G_HEIGHT - yAxis.scale * this.displayData[0] * 20);
        for(var i = 0; i < this.displayData.data.length; i++) {
            // Berechnen des Y-Werts
            var y = G_HEIGHT - (20/this.yAxis.scale) * (this.displayData.data[i]- (this.yAxis.startLine));
            // Berechnen des X-Werts
            var x = i*1;
            // Zeichnen der Linie
            G_CTX.lineTo(x,y);
        }
        G_CTX.stroke();
    }

}

var Y_AXIS = new yAxis(1);
var Graph  = new Graph(Y_AXIS);

// Zurücksetzen des Graphen
function resetGraph() {
    Graph.entity.data = new Data();
    Graph.entity = null;
    Graph.displayData = null;
}

// Speichern der Einstellungen aus dem Einstellungsfenster
function saveGraphSettings() {

    var scaleInput = document.getElementById("scale-input");
    Y_AXIS.scale = parseFloat(scaleInput.value);

    var startlineInput = document.getElementById("line-input");
    Y_AXIS.startLine = parseFloat(startlineInput.value);
    if(selectedElement != null)
        Graph.setEntity(selectedElement);
    else
        alert("Bitte Element auswählen!");

}

// Aktualisierung der Leinwand für den Graphen
setInterval(function() {
    G_CTX.clearRect(0,0,G_WIDTH,G_HEIGHT);
    Y_AXIS.drawLine();
    if(Graph.displayData != null) {
        Graph.drawGraph();
    }
}, 1000/10);
