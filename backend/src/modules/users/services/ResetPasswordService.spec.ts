import 'reflect-metadata';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        );
    });

    it("Should be able to reset the password", async () => {

        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            token,
            password: '123123'
        });

        const updateUser = await fakeUsersRepository.findById(user.id);


        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it("Should not be able to reset the password with non-existing token", async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to reset the password with non-existing user", async () => {
        const { token } = await fakeUserTokenRepository.generate('non-existing-token');

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to reset the password if passed more than 2 hours", async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
