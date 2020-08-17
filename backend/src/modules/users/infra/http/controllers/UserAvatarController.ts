import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(req: Request, res: Response): Promise<Response>{
        try {
            const updateUserAvatar = container.resolve(UpdateUserAvatarService);

            const user = await updateUserAvatar.execute({
                userId: req.user.id,
                avatarFileName: req.file.filename,
            });

            delete user.password;

            return res.json(user);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
