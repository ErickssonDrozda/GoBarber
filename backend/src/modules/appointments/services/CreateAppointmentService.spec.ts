import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;


describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider
        );
    });

    it("Should to create a new appointment", async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5 , 10, 12).getTime();
        });
        const appointment = await createAppointment.execute({ date: new Date(2020, 5, 11, 13), userId: 'user', providerId: '12255514' });

        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('12255514');
    });

    it("Should not be able to create a new appointment on the same date", async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5 , 10, 12).getTime();
        });

        const appointmentDate = new Date(2020, 5, 10, 13);

        await createAppointment.execute({ date: appointmentDate, userId: 'user',providerId: '12255514' });

        expect(createAppointment.execute({
            date: appointmentDate,
            userId: 'user',
            providerId: '12255514'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5 , 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 3, 1, 11),
            userId: 'user',
            providerId: '12255514'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5 , 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 3, 1, 13),
            userId: '12255514',
            providerId: '12255514'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5 , 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 5, 11, 7),
            userId: 'user',
            providerId: '12255514'
        })).rejects.toBeInstanceOf(AppError);

        await expect(createAppointment.execute({
            date: new Date(2020, 5, 11, 18),
            userId: 'user',
            providerId: '12255514'
        })).rejects.toBeInstanceOf(AppError);
    });
});
