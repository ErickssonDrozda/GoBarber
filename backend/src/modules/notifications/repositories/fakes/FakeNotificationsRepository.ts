import { ObjectId } from 'mongodb';

import Notification from '../../infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotficationsRepository from '@modules/notifications/repositories/INotficationsRepository';

class FakeNotificationsRepository implements INotficationsRepository{

    private notifications: Notification[] = [];

    public async create({ content, recipientId }: ICreateNotificationDTO): Promise<Notification>{
        const notification = new Notification();

        Object.assign(notification, { id: new ObjectId() ,content, recipientId });

        this.notifications.push(notification);

        return notification;
    }
}

export default FakeNotificationsRepository;
