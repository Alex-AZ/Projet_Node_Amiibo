import dataImportES6 from "../import/ES6";
import {getTypeFromDatabase} from "../db/connector"

const typeController = (req, res) => {
    console.log(getTypeFromDatabase());
    console.log(dataImportES6.type);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.status(200).json(dataImportES6.getTypes);
}

const addTypeController = (req, res) => {
    dataImportES6.addType(req.body.value);
    res.status(200).json({result: true}); 
}

export {addTypeController};
export default typeController;