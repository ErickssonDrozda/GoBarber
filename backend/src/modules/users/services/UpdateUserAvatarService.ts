import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

interface IRequest {
    userId: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ){}

    public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }
        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFileName);

        user.avatar = filename;
        await this.userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
