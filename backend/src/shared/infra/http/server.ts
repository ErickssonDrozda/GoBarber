import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';
import '@shared/container/index';
import '@shared/infra/typeorm';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json({ status: 'error', message: err.message });
    }

    console.error(err);

    return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3333, () => {
    console.log('server started');
});
