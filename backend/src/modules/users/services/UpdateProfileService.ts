import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUserRepository';
import IHashPRovider from '../providers/HashProvider/models/IHashProvider';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashPRovider
    ){}

    public async execute({ userId, name, email, password, oldPassword }: IRequest): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if(!user){
            throw new AppError("User not found");
        }

        const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== userId){
            throw new AppError("Email already in use");
        }

        if(password && !oldPassword){
            throw new AppError("You need to inform the old password to set the new password");
        }



        if(password && oldPassword){
            const checkOldPassword = await this.hashProvider.compareHash(oldPassword, user.password);

            if(!checkOldPassword){
                throw new AppError("Old password does not match");
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        user.name = name;
        user.email = email;

        return this.userRepository.save(user);

    }
}

export default UpdateProfileService;
