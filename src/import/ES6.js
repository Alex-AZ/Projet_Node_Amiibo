import https from "https";

/* L'objet Set (Ensemble en français) 
permet de stocker des valeurs uniques, 
de n'importe quel type, que ce soit des valeurs d'un type primitif ou des objets. */
let dataAmiibo = [];
const typeSet = new Set();
const gameSeriesSet = new Set();
const amiiboSeriesSet = new Set();
const characterSet = new Set();


class ES6 {
    // kiki["type"] > pour passer une chaîne de caractère avec JSON
    /* param = param > 12 
    est pareil que : 
    (param) => {
        return param > 12
    }*/

    //Faire une fonction amiiboArray pour éviter les répétitions dans les get
    amiiboElements = (amiiboArray) => {
        let formatedElements = {
            amiibo: []
        };

        amiiboArray.forEach(element => {
            formatedElements.amiibo.push({ name: element });
        });

        return formatedElements;
    }

    get getDataAmiibo() {
        return {amiibo: dataAmiibo};
    }

    get getTypes() {
        /* let formatedTypes = {
            amiibo: []
        };

        types.forEach(type => {
            formatedTypes.amiibo.push({name: type});
        }); */

        return this.amiiboElements(typeSet);
    }

    get getAmiiboSeries() {
        /* let formatedAmiiboSeries = {
            amiibo: []
        };

        amiiboSeries.forEach(séries => {
            formatedAmiiboSeries.amiibo.push({name: séries});
        }); */
        return this.amiiboElements(amiiboSeriesSet);
    }

    get getGameSeries() {
        /* let formatedGameSeries = {
            amiibo: []
        };

        gameSeries.forEach(gameseries => {
            formatedGameSeries.amiibo.push({name: gameseries});
        }); */

        return this.amiiboElements(gameSeriesSet);
    }


    get getCharacter() {
        /* let formatedCharacter = {
            amiibo: []
        };

        character.forEach(character => {
            formatedCharacter.amiibo.push({name: character});
        }); */

        return this.amiiboElements(characterSet);
    }

    getAmiiboByFilter(amiiboArray, fieldToTest, filterValue) {
        // Pareil que la méthode filter avec if/else mais là tout est sur une ligne
        amiiboArray.filter(value => value[fieldToTest] === filterValue);
    }

    addType(type) {
        typeSet.add(type);
    }

    addAmiibo(amiibo) {
        dataAmiibo.push(amiibo);
    } 

    request(url, successCallback, errorCallback) {
        https.get(url, (res) => {
            console.log(res.statusCode);
            if (res.statusCode === 308) {
                this.request(res.headers.location, successCallback, errorCallback);
                return;
            }

            res.setEncoding("utf8");

            let str = "";

            res.on("data", (data) => {
                str += data;
            });

            res.on("end", () => {
                /* La méthode JSON.parse() 
                analyse une chaîne de caractères JSON 
                et construit la valeur JavaScript ou l'objet décrit par cette chaîne. */
                const parseData = JSON.parse(str);
                parseData.amiibo.forEach(element => {
                    dataAmiibo.push(element);
                    /* La méthode add() 
                    permet d'ajouter un nouvel élément ayant une valeur donnée à un ensemble Set. 
                    Cette valeur sera ajoutée à la fin de l'objet Set */
                    typeSet.add(element.type);
                    gameSeriesSet.add(element.gameSeries);
                    amiiboSeriesSet.add(element.amiiboSeries);
                    characterSet.add(element.character);
                });
                //console.log(this.getCharacter())
                //console.log(types); 
                successCallback()
            });

        });
    }

    load(successCallback, errorCallback) {
        this.request("https://www.amiiboapi.com/api/amiibo", successCallback, errorCallback);
    }

}

const dataImportES6 = new ES6();
export default dataImportES6;