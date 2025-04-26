import * as  express from 'express';
import { validateDataPoint } from '../controllers/validator.controller';

const validatorRouter = express.Router();


validatorRouter.get('/validate/:dataPoint/:dataValue', validateDataPoint);


export default validatorRouter;
