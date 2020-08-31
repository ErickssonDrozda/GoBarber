import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    uploadsFolder: string;
    multer: {
        storage: StorageEngine;
    };
    config: {
        disk: {

        },
        aws: {
            bucket: string;
        }
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,
    tmpFolder: tempFolder,
    uploadsFolder: path.resolve(tempFolder, 'uploads'),
    multer: {
        storage: multer.diskStorage({
            destination: tempFolder,
            filename(req, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const filename = `${fileHash}-${file.originalname}`;
                return callback(null, filename);
            },
        }),
    },
    config: {
        disk: {},
        aws: {
            bucket: 'app-gobarber-ericksson'
        }
    }
} as IUploadConfig;
