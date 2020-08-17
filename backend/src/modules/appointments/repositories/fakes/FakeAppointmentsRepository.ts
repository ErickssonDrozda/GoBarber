import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository{
    private appointments: Appointment[] = []

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));
        return findAppointment;
    }

    public async create({ providerId, date }: ICreateAppointmentDTO): Promise<Appointment>{
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, providerId });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default FakeAppointmentsRepository;
