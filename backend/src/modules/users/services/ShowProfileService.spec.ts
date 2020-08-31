import 'reflect-metadata';
import ShowProfileService from './ShowProfileService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it("Should be able to show the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "Jhon Doe",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const profile = await showProfileService.execute({
            userId: user.id,
        });

        expect(profile.name).toBe('Jhon Doe');
        expect(profile.email).toBe('jhondoe@example.com');
    });

    it("Should not be able to show the profile from non existing user", async () => {

        await expect(showProfileService.execute({
            userId: 'non existing user id',
        })).rejects.toBeInstanceOf(AppError);
    });
});
