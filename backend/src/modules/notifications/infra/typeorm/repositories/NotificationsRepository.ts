import { MongoRepository, getMongoRepository } from 'typeorm';

import Notification from '../schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotficationsRepository from '@modules/notifications/repositories/INotficationsRepository';

class NotificationsRepository implements INotficationsRepository{
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({ content, recipientId }: ICreateNotificationDTO): Promise<Notification>{
        const notification = this.ormRepository.create({ content, recipientId });
        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
