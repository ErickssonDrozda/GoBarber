import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';


export default class ProviderDayAvailabilityController {

    public async index(req:  Request, res: Response): Promise<Response> {
        const providerId = req.params.providerId;
        const { day, month, year } = req.body;

        const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

        const availability = await listProviderDayAvailability.execute({
            providerId, day, month, year
        });

        return res.json(availability);
    }
}
