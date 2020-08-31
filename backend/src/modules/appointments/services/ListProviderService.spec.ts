import 'reflect-metadata';
import ListProviderService from './ListProviderService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let listProviderService: ListProviderService;

describe('ListProvider', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviderService = new ListProviderService(fakeUsersRepository, fakeCacheProvider);
    });

    it("Should be able to list the providers", async () => {
        const user1 = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const user2 = await fakeUsersRepository.create({
            name: "Jhon Tree",
            email: "jhontree@example.com",
            password: "123456"
        });

        const loggedUser = await fakeUsersRepository.create({
            name: "Jhon Qua",
            email: "jhonqua@example.com",
            password: "123456"
        });


        const providers = await listProviderService.execute({
            userId: loggedUser.id
        });

        expect(providers).toEqual([
            user1, user2
        ]);
    });
});
