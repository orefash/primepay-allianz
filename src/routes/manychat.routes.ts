import * as express from 'express';
import { callbackManyChatController } from '../controllers/manychat.controller';

const manychatRouter = express.Router();

// Define the route and link it to the controller
manychatRouter.get('/api/callback-manychat/user/:txt', callbackManyChatController);

export default manychatRouter;
