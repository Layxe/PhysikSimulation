/**
 *  -=-=-=-=-=-=( "Bibliothek" mit nützlichen Funktionen )=-=-=-=-=-=-
 *  @author Alexander Niedermayer
 *  @date 25.05.2016
 *  @version 1.0
 *
 * */

function roundArray(array, psi) {

    for(var i = 0; i < array.length; i++) {

        if(array[i] instanceof Array) {
            array[i] = roundArray(array[i], psi);
        } else {
            array[i] = round(array[i], psi);
        }

    }

    return array;

}

function round(number, psi) {

    var divisionNumber = "1";

    for(var i = 0; i < psi; i++) {
        divisionNumber += "0";
    }

    divisionNumber = parseInt(divisionNumber);

    return Math.round(number*divisionNumber)/divisionNumber;


}