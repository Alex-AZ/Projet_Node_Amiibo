import mysql from "mysql";


/* "multipleStatements: true"  
> ça permet de faire plusieurs requêtes d'un seul coup en les séparant par un ; */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: "8889",
    multipleStatements: true
});
