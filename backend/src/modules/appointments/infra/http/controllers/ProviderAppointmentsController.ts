import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
    public async index(req: Request, res: Response): Promise<Response> {
        const providerId = req.user.id;
        const { day, month, year } = req.query;

        const createAppointment = container.resolve(
            ListProviderAppointmentsService,
        );

        const appointments = await createAppointment.execute({
            providerId,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return res.json(classToClass(appointments));
    }
}
