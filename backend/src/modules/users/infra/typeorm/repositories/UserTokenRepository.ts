import { Repository, getRepository } from 'typeorm';

import UserToken from '../entities/UserToken';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

class UserTokenRepository implements IUserTokenRepository{
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined>{
        const userToken = await this.ormRepository.findOne({
            where: {
                token
            }
        });
        return userToken;
    }

    public async generate(userId: string): Promise<UserToken>{
        const userToken = await this.ormRepository.create({
            userId
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokenRepository;
