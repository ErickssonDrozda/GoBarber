import { uuid } from 'uuidv4';
import { isEqual, getDate, getMonth, getYear } from 'date-fns';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.providerId === providerId,
        );
        return findAppointment;
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const findAppointment = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });
        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const findAppointment = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });
        return findAppointment;
    }

    public async create({
        providerId,
        date,
        userId,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, providerId, userId });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default FakeAppointmentsRepository;
