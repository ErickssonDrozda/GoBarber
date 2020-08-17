import 'reflect-metadata';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/fakeMailProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokenRepository
        );
    });

    it("Should be able to recover the password using the email", async () => {

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: "jhondoe@example.com",
        });

        expect(sendEmail).toHaveBeenCalled();
    });

    it("Should not be able to recover password with non-existing account", async () => {
        expect(sendForgotPasswordEmail.execute({
            email: "jhondoe@example.com",
        })).rejects.toBeInstanceOf(AppError);
    });

    it("Should generate a forgot password token", async () => {
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: "jhondoe@example.com",
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);

    });
});
