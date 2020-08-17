import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
    public async generateHash(payLoad: string): Promise<string>{
        return payLoad;
    }

    public async compareHash(payLoad: string, hashed: string): Promise<boolean>{
        return payLoad === hashed;
    }
}

export default BCryptHashProvider;
