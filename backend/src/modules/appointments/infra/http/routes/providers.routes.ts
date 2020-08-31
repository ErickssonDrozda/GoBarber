import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProviderController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ensureAthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const providerRouter = Router();
const providerController = new ProviderController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providerRouter.use(ensureAthenticated);

providerRouter.get('/', providerController.index);

providerRouter.get('/:providerId/month-availability', celebrate({
    [Segments.PARAMS]:{
        providerId: Joi.string().uuid().required()
    }
}), providerMonthAvailabilityController.index);

providerRouter.get('/:providerId/day-availability',  celebrate({
    [Segments.PARAMS]:{
        providerId: Joi.string().uuid().required()
    }
}),providerDayAvailabilityController.index);

export default providerRouter;
