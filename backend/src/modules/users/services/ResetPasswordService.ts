import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ){}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);
        if(!userToken){
            throw new AppError('User token does not exists');
        }

        const user = await this.userRepository.findById(userToken.userId);

        if(!user){
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = userToken.createdAt;

        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('Token Expired');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.userRepository.save(user);
    }
}
export default ResetPasswordService;