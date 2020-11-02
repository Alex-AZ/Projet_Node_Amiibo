import dataImportES6 from "../import/ES6";
import mysql from "mysql";
import Importer from "mysql-import";
import { json } from "body-parser";

/* "multipleStatements: true"  
> ça permet de faire plusieurs requêtes d'un seul coup en les séparant par un ; */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    databaseName: 'amiibo',
    port: "8889"
})


const getTypeFromDatabase = async () => {
    const sql = "SELECT * FROM type";
    const result = await db.query(sql);
    return result;
}


//Check if db exist, yes -> drop it and make it again, no -> make it
//Function called in index.js
const loadDatabase = (successCallback, errorCallback) => {
    db.connect(
        (err) => {
            if (err) {
                errorCallback(err);
                return;
            }
            db.query(
                "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'amiibo'",
                (err, results) => {
                    if (err) {
                        errorCallback(err);
                        return;
                    }
                    if (results.length > 0) {
                        console.log("database already exist, DROP !!!");
                        db.query(
                            "DROP DATABASE amiibo",
                            (err, results) => {
                                createDatabase(successCallback, errorCallback)
                            }
                        );
                    } else {
                        createDatabase(successCallback, errorCallback)
                    }
                }
            );
        }
    );
}

//DB creation with .sql import:
const createDatabase = (successCallback, errorCallback) => {
    console.log("Ready to create database");
    const importer = new Importer({ 
        host: 'localhost', 
        user: 'root', 
        password: 'root', 
        databaseName: 'amiibo', 
        port: "8889" 
    });
    importer.import('./src/db/test.sql').then(() => {
        let files_imported = importer.getImported();
        console.log(`${files_imported.length} SQL file(s) imported.`);
        db.query(
            "USE amiibo",
            (err, results) => {
                if (err) {
                    errorCallback(err);
                    return;
                }
                importES6Data(successCallback, errorCallback);
            }
        );
    }).catch(err => {
        errorCallback(err);
    });
}


// Data for linked tables (type, characters ...):
// "index + 1" c'est pour commencer à l'index 1 car les tables SQL commence a cet indice.
// "element.name" entre double quotes car si le nom d'un amiibo à une apostrophe le script casse.
const loadSubTable = (tableName, dataToLoad) => {
    const dataMap = new Map();
    dataToLoad.forEach(
        (element, index) => {
            const sql = `INSERT INTO ${tableName} (id, name) VALUES (${index + 1}, "${element.name}");`;
            dataMap.set(element.name, index + 1);
            db.query(sql);
        }
    );
    /* console.log(dataMap); */
    return dataMap;
}


//Data for amiibo with foreign key:
const loadMainTable = (typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap) => {
    console.log(amiiboSeriesMap);
    
    dataImportES6.getDataAmiibo.amiibo.forEach((item, i) => {

        let sql = `INSERT INTO amiibo (id, name, image, type_id, amiiboseries_id, gameseries_id, characters_id) 
        VALUES (NULL,
            "${item.name}", 
            "${item.image}", 
            '${typeMap.get(item.type)}',
            '${amiiboSeriesMap.get(item.amiiboSeries)}', 
            '${gameSeriesMap.get(item.gameSeries)}',
            '${charactersMap.get(item.character)}');`;
            /* console.log(sql); */
            

        db.query(sql)
    });
}


//Import of data from API:
const importES6Data = (successCallback, errorCallback) => {
    console.log("Ready to import ES6 data");
    dataImportES6.load(
        () => {
            const typeMap = loadSubTable('type', dataImportES6.getTypes.amiibo);
            const amiiboSeriesMap = loadSubTable('amiiboseries', dataImportES6.getAmiiboSeries.amiibo);
            const gameSeriesMap = loadSubTable('gameseries', dataImportES6.getGameSeries.amiibo);
            const charactersMap = loadSubTable('characters', dataImportES6.getCharacter.amiibo);
            console.log(dataImportES6.getCharacter.amiibo);
            
            loadMainTable(typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap);
            successCallback();
        },
        errorCallback
    )
}


export default loadDatabase;
export { getTypeFromDatabase };