import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';
import ensureAthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAthenticated);

appointmentsRouter.get('/', appointmentsController.list);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
