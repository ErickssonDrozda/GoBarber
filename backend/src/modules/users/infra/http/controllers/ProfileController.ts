import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
    public async show(req: Request, res: Response): Promise<Response> {
        const userId = req.user.id;

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ userId });

        return res.json(classToClass(user));
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const userId = req.user.id;
        const { name, email, password, oldPassword } = req.body;

        const updateProfileService = container.resolve(UpdateProfileService);

        const user = await updateProfileService.execute({
            userId,
            name,
            email,
            password,
            oldPassword,
        });

        delete user.password;

        return res.json(classToClass(user));
    }
}
