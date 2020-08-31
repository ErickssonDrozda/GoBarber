import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(
            fakeUsersRepository, fakeHashProvider, fakeCacheProvider
        );
    });

    it("Should to create a new user", async () => {
        const user = await createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(user).toHaveProperty('id');
    });

    it("Should not be able to create a new user with the same  email from another", async () => {
        await createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await expect(
            createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError);
    });
});
