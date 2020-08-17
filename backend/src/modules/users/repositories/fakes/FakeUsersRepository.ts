import User from '../../infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';

class FakeUsersRepository implements IUserRepository{
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined>{
        const user = this.users.find(user => user.id === id);
        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined>{
        const user = this.users.find(user => user.email === email);
        return user;
    }

    public async create({ name, email, password }: ICreateUserDTO): Promise<User>{
        const user = new User();

        Object.assign(user, { id: uuid(), name, email, password });
        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User>{
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
        this.users[findIndex] = user;
        return user;
    }
}

export default FakeUsersRepository;
