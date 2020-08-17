import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
// import AppError from '@shared/errors/AppError';
// import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository,
    ){}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if(!user){
            throw new AppError('User does not exists');
        }

        await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail(email, 'Password Recovery has been sent');
    }
}
export default SendForgotPasswordEmailService;
