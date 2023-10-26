import * as  express from 'express';
import { fetchCarData, fetchState, getCarString, getStatesString } from '../controllers/statics.controller';


const staticsRouter = express.Router();

staticsRouter.get('/get-states-list/:page', getStatesString);
staticsRouter.get('/get-state/:page/:item', fetchState);


staticsRouter.get('/get-car-list/:page/:type', getCarString);
staticsRouter.get('/get-car/:page/:item/:type', fetchCarData);

export default staticsRouter;