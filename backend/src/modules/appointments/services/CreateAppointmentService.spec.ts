import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it("Should to create a new appointment", async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointment = await createAppointment.execute({ date: new Date(), providerId: '12255514' });

        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('12255514');
    });

    it("Should not be able to create a new appointment on the same date", async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({ date: appointmentDate, providerId: '12255514' });

        expect(createAppointment.execute({ date: appointmentDate, providerId: '12255514' })).rejects.toBeInstanceOf(AppError);
    });
});
