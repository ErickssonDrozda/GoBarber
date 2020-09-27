import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderService from '@modules/appointments/services/ListProviderService';
import { classToClass } from 'class-transformer';

export default class ProviderController {
    public async index(req: Request, res: Response): Promise<Response> {
        const userId = req.user.id;

        const createAppointment = container.resolve(ListProviderService);

        const providers = await createAppointment.execute({
            userId,
        });

        return res.json(classToClass(providers));
    }
}
