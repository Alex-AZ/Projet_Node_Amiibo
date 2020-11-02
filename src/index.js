import express from "express";
import createRoutes from "./routes";
import dataImportES6 from "./import/ES6";
import bodyParser from "body-parser";
import loadDatabase from "./db/connector.js";

// Avant Express:
/* const create = ((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Mon premier serveur Node");
    response.end();
})

const server = http.createServer(create);

server.listen(8888);
*/
//////////////////////////////////////////////////////////////


// Doc Express pour affichage erreur:
/* app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}); */
// root: path.join(__dirname, 'public'),
/////////////////////////////////////////////////////////////



const success = () => {
    // Lors du lancement du serveur avec npm run local, 
    // le port doit être préciser en troisième arguement, ex: npm run local 8853;
    // Si le port n'est pas spécifié, alors le port par defaut sera 8888.
    const port = process.argv[2] || 8888;

    //Lancement Express 
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', 'src/resources/ejsViews/')

    //Lancement api Amiibo:
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use('/', express.static('src/resources/static/jquery-amiibo'));

    app.use('/', createRoutes());

    app.get('/', (req, res) => { res.render('index', { port }) })
    app.get('/addType', (req, res) => res.render('addType', {type: dataImportES6.getTypes.amiibo}))
    app.get('/addAmiibo', (req, res) => res.render('addAmiibo', {
        type: dataImportES6.getTypes.amiibo, gameSeries: dataImportES6.getGameSeries.amiibo,
        amiiboSeries: dataImportES6.getAmiiboSeries.amiibo, character: dataImportES6.getCharacter.amiibo 
    }));

    // Il faut que l'erreur 500 soit avant l'erreur 404
    app.use((error, request, response, next) => {
        response.status(500).send('Erreur 500 WTF ??')
    });

    // Erreur 404 avec affichage image
    app.use((error, request, response, next) => {
        response.status(404).sendFile(__dirname + '/public/error-404-found.jpg')
    });

    console.log("Server started on port " + port);

    app.listen(port);
}

const error = () => {
    console.log("Error");
}

/* dataImportES6.load(success, error); */
loadDatabase(success, error);


////////////////////////////////////////////////////////
// Les différentes routes avant la crétion de routes:
/* app.get('/', (request, response) => {
    response.send('Hello World!');
}); */

/* app.get('/api/amiibo', (request, response) => {
    response.send('Hello Amiibo!')
});

app.get('/api/type', (request, response) => {
    //throw (new Error ("error")); > balance une erreur
    response.send('Hello Amiibo Type!')
});

app.get('/api/gameseries', (request, response) => {
    response.send('Hello Amiibo Game Series!')
});

app.get('/api/series', (request, response) => {
    response.send('Hello Amiibo Series!')
});

app.get('/api/character', (request, response) => {
    response.send('Hello Amiibo Character!')
}); */

