import dataImportES6 from "../import/ES6";

const amiiboController = (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    /* const urlParameters = re.query;

    let amiiboList = dataImportES6.amiibo.amiibo;

    if (urlParameters.type) {
        amiiboList = dataImportES6.getAmiiboByFilter(amiiboList, "type", urlParameters.type)
    } */

    let amiiboFilteredArray = dataImportES6.getDataAmiibo;

    // Boucle for...in est une boucle pour les objets
    // Le "query" renvoie ce qui est dans l'adresse url
    // Le "property" renvoie la propriété (type, series, ...) 
    for (const property in req.query) {
        amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, property, req.query[property]);
    }

    res.status(200).json(amiiboFilteredArray);
}

export const addAmiiboController = (req, res) => {
    const newAmiibo = {
        name: req.body.name,
        amiiboSeries: req.body.amiiboSeries,
        character: req.body.character,
        gameSeries: req.body.gameSeries,
        image: req.body.image,  
        type: req.body.type,
    }
    
    dataImportES6.addAmiibo(newAmiibo);
    res.status(200).json({result: true});
    console.log(newAmiibo);
}

export default amiiboController;


