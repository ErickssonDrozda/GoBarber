import 'reflect-metadata';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    it("Should to create a new user", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'qualquer_coisa.jpg'
        });

        expect(user.avatar).toBe('qualquer_coisa.jpg');
    });

    it("Should not be able to update avatar without account", async () => {
        expect(updateUserAvatar.execute({
            userId: 'non_existing_id',
            avatarFileName: 'qualquer_coisa.jpg'
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should delete old avatar when updating a new one", async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'qualquer_coisa.jpg'
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'qualquer_coisa2.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('qualquer_coisa.jpg');
        expect(user.avatar).toBe('qualquer_coisa2.jpg');
    });
});
