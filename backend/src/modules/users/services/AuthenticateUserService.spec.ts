import 'reflect-metadata';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it("Should to be able to authenticate", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const response = await authenticateUser.execute({
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it("Should not to be able to authenticate with non existing user", async () => {
        await expect(authenticateUser.execute({
            email: "jhondoe@example.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should not to be able to authenticate with wrong password", async () => {
        await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await expect(authenticateUser.execute({
            email: "jhondoe@example.com",
            password: "wrong-password"
        })).rejects.toBeInstanceOf(AppError);
    });
});
