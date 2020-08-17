import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
    public async generateHash(payLoad: string): Promise<string>{
        return hash(payLoad, 8);
    }

    public async compareHash(payLoad: string, hashed: string): Promise<boolean>{
        return compare(payLoad, hashed);
    }
}

export default BCryptHashProvider;
