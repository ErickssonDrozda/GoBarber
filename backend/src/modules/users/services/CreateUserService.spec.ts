import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it("Should to create a new user", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(user).toHaveProperty('id');
    });

    it("Should not be able to create a new user with the same  email from another", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(
            createUser.execute({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError);
    });
});
