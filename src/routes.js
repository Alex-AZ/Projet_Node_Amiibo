import { Router } from "express";
import amiiboController, { addAmiiboController } from "./controllers/amiibo";
import typeController, { addTypeController } from "./controllers/type";
import gameSeriesController from "./controllers/gameseries";
import seriesController from "./controllers/series";
import characterController from "./controllers/character";


const createRoutes = () => {
  const routes = Router();

  routes.post('/api/type', addTypeController);
  routes.post('/api/amiibo', addAmiiboController);
  
  routes.get('/api/amiibo', amiiboController);
  routes.get('/api/type', typeController);
  routes.get('/api/gameseries', gameSeriesController);
  routes.get('/api/amiiboseries', seriesController);
  routes.get('/api/character', characterController);

  return routes;
};

export default createRoutes;