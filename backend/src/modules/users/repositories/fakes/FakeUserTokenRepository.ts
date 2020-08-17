import UserToken from '../../infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';
import IUserTokenRepository from '../IUserTokenRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';

class FakeUserTokenRepository implements IUserTokenRepository{
    private userTokens: UserToken[] = [];

    public async generate(userId: string): Promise<UserToken>{
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.userTokens.push(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined>{
        const userToken = this.userTokens.find(findToken => findToken.token === token);

        return userToken;
    }
}

export default FakeUserTokenRepository;
