import 'reflect-metadata';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
        fakeAppointmentsRepository, fakeCacheProvider
    );
  });

  it('Should be able to list the appointments on a specific day', async () => {
    const appointmentOne = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2020, 10, 20, 14, 0, 0),
    });

    const appointmentTwo = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2020, 10, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      providerId: 'provider',
      year: 2020,
      month: 11,
      day: 20,
    });

    expect(appointments).toEqual([
        appointmentOne, appointmentTwo
    ]);
  });
});
