import 'reflect-metadata';
import UpdateProfileService from './UpdateProfileService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it("Should to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tree',
            email: 'jhontree@example.com'
        });

        expect(updatedUser.name).toBe('Jhon Tree');
        expect(updatedUser.email).toBe('jhontree@example.com');
    });

    it("Should not be able to update the profile from non existing user", async () => {

        await expect(updateProfileService.execute({
            userId: 'non existing user id',
            name: 'test',
            email: 'test@example.com'
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to change to another user email", async () => {
        await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const user = await fakeUsersRepository.create({
            name: "Jhon tree",
            email: "jhontree@example.com",
            password: "123456"
        });

        await expect(updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Doe',
            email: 'jhondoe@example.com'
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tree',
            email: 'jhontree@example.com',
            password: '123123',
            oldPassword: '123456',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it("Should not be able to update the password without old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await expect(updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tree',
            email: 'jhontree@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to update the password with wrong old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await expect(updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tree',
            email: 'jhontree@example.com',
            password: '123123',
            oldPassword: 'WrongOldPassword'
        })).rejects.toBeInstanceOf(AppError);
    });
});
