import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotficationsRepository from '@modules/notifications/repositories/INotficationsRepository';

interface IRequest {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotficationsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ){}

    public async execute({ date, providerId, userId }: IRequest): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())){
            throw new AppError("You can't create an appointment on a past date");
        }

        if(userId === providerId){
            throw new AppError("You can't create an appointment with yourself");
        }

        const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentsInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError("You can only create appointment between 8am and 5pm");
        }

        const appointment = await this.appointmentsRepository.create({
            providerId,
            userId,
            date: appointmentDate,
        });

        const dateFormatted = format(appointmentDate, "dd-MM-yyyy HH:mm'h'");

        await this.notificationsRepository.create({
            recipientId: providerId,
            content: `New appointment for ${dateFormatted} o'clock`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${providerId}:${format(appointmentDate, 'yyyy-M-d')}`
        );

        return appointment;
    }
}

export default CreateAppointmentService;
