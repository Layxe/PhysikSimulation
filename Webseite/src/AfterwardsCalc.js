/**
 * -=-=-=-=-=-( Nachträgliche Anzeige )-=-=-=-=-=-=-
 * @author  = Alexander Niedermayer
 * @date    = 16.03.2016
 * @version = 1.5 Beta
 * @description = Datei zum Anzeigen vergangener physikalischer Aktionen
 *
 */

/**
 * Hauptklasse zum speichern alter Daten Aufbau:
 * 0     = Modus
 * 1 - x = Daten
 * --------------------------------------------
 * Verschiedene Modi:
 * 0 = undefiniert
 * 1 = elastischer Stoß
 * 2 = inelastischer Stoß
 * --------------------------------------------
 * Datenspeicherung elastischer Stoß:
 * data[0] = Neue Geschwindigkeit Element 1 [x,y]
 * data[1] = Neue Geschwindigkeit Element 2 [x,y]
 * data[2] = Alte Geschwindigkeit Element 1 [x,y]
 * data[3] = Alte Geschwindigkeit Element 2 [x,y]
 *
 * @constructor
 */

// ######## Konstanten #########//

const AC_CONTENT    = document.getElementById("ac-content");
const AC_ROOT       = document.getElementById("ac-root");
const LOADING_BAR = document.getElementById("loading");

//######### Variablen ###########//

var displayedData = 0;
var displayedElement = null;

//###############################//

function AfterwardsCalc() {

    this.dataSlots = 3;
    // Datenspeicher mit verschiedenen Datenspeichern
    this.data = new Array(this.dataSlots);

    for(var i = 0; i < this.data.length; i++) {
        this.data[i] = new Array(10);
    }

    /**
     * Funktion zum hinzufügen einer Datensammlung
     * @param pdata
     */
    this.addDataSlot = function addDataSlot(pdata) {


        for(var i = 0; i < this.data.length-1; i++) {

            /* Kopieren der Werte einer 3 Dimensionalen Reihung
               Somit wird mit dieser Technik niemals ein Array kopiert, was
               wiederrum nur die Referenz übergeben würde, sondern die
               einzelnen Werte */
            for(var k = 0; k < this.data[i].length; k++) {
                if(this.data[i][k] instanceof Array) {
                    this.data[i+1][k] = new Array(2);
                    for (var j = 0; j < this.data[i][k].length; j++) {
                        this.data[i+1][k][j] = this.data[i][k][j];
                    }
                } else {
                    this.data[i+1][k] = this.data[i][k];
                }
            }

        }

        // Datenübertragung, call by value anstelle von call by reference!
        var _dataSlot = this.data[0];
        for(var i = 0; i < pdata.length; i++) {
            // Verhindern von call by reference ( BÖSE )
            if(pdata[i] instanceof Array) {
                _dataSlot[i] = new Array(2);
                for(var k = 0; k < pdata[i].length; k++) {
                    _dataSlot[i][k] = pdata[i][k];
                }
            } else {
                _dataSlot[i] = pdata[i];
            }

        }

    }

    /**
     * Funktion zum erstellen einer Datensammlung
     * @param modus
     * @param pdata
     * @returns {*}
     */
    this.createData = function createData(modus, pdata) {

        var returndata = new Array(pdata.length+1);

        for(var i = 0; i < pdata.length; i++) {
            returndata[i] = new Array(2);
        }

        returndata[0] = modus;

        for(var i = 0; i < pdata.length; i++) {
            returndata[i+1] = pdata[i];
        }

        return returndata;

    }

    /**
     * Funktion zum Anzeigen der gespeicherten Daten
     * @param dataSlot
     */
    this.displayData = function displayData(dataSlot) {

        var data = this.data[dataSlot];

        // Bestimmen des verwendeten Modus
        switch(data[0]) {
            case 1:
                // elastischer Stoß
                console.log(data[1][0]);
                console.log(data[2]);
                console.log(data[3]);
                break;
            case 2:
                // inelastischer Stoß

                break;
            default:
                console.log("Data Slot is unused!");
                break;
        }

    }

}

//################## Menü Einstellungen ###################//

document.getElementById("ac-button").addEventListener("click", function() {
    if(selectedElement != null) {

        displayedElement = selectedElement;

        AC_ROOT.style.display = "block";

        setTimeout(function () {
            // Ändern des Ladebalken
            LOADING_BAR.style.width = 100 + "%";
        }, 100);

        setTimeout(function () {
            // Anzeigen des Inhalts
            drawAfterwardsCalc(displayedElement);


        }, 700);
    } else {
        alert("Bitte Element auswählen");
    }
});

function drawAfterwardsCalc() {

    AC_CONTENT.innerHTML = '<div id="number-container">';
    for(var i = 1; i <= 3; i++) {
        if(displayedElement.dataStorage.data[i-1][0] != null)
            AC_CONTENT.innerHTML += '<div class="number">' + i + '</div>';
    }
    AC_CONTENT.innerHTML += "</div><br><br>";

    var number = document.getElementsByClassName("number");
    for(var i = 0; i < number.length; i++) {
        number[i].setAttribute("onclick", "displayedData = " + i + "; drawAfterwardsCalc()");
    }

    var data = displayedElement.dataStorage.data[displayedData]; // Wähle den Datenslot aus
    data = roundArray(data, 2);

    switch(data[0]) {
        case 1:
            AC_CONTENT.innerHTML += "<h3>Elastischer Stoß</h3>";
        break;
        case 2:
            AC_CONTENT.innerHTML += "<h3>Inelastischer Stoß</h3>";
        break;
        default:
            AC_CONTENT.innerHTML += "<h3>Undefinierte Datenspeicherung</h3>";
            break;
    }

    AC_CONTENT.innerHTML += "Neue Geschwindigkeit Objekt 1: <br> x: " + data[1][0] + " m/s y: " + data[1][1] + " m/s<br><hr>";
    AC_CONTENT.innerHTML += "Neue Geschwindigkeit Objekt 2: <br> x: " + data[2][0] + " m/s y: " + data[2][1] + " m/s<br><hr>";
    AC_CONTENT.innerHTML += "Alte Geschwindigkeit Objekt 1: <br> x: " + data[3][0] + " m/s y: " + data[3][1] + " m/s<br><hr>";
    AC_CONTENT.innerHTML += "Alte Geschwindigkeit Objekt 2: <br> x: " + data[4][0] + " m/s y: " + data[4][1] + " m/s<br><br>";
    AC_CONTENT.innerHTML += "<div id='close-button' onclick='closeAc()'>Schließen</div>";
}

function closeAc() {
    AC_ROOT.style.display = "none";
    AC_CONTENT.innerHTML = "";
    LOADING_BAR.style.width = "0%";
}
