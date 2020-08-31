import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';


export default class AppointmentsController {
    public async create(req:  Request, res: Response): Promise<Response> {
        const userId = req.user.id;
        const { providerId, date } = req.body;

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            date,
            userId,
            providerId,
        });

        return res.json(appointment);
    }
}
