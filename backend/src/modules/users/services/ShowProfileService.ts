import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUserRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    userId: string;
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
    ){}

    public async execute({ userId }: IRequest): Promise<User> {



        const user = await this.userRepository.findById(userId);

        if(!user){
            throw new AppError("User not found");
        }

        return user;
    }
}

export default ShowProfileService;
