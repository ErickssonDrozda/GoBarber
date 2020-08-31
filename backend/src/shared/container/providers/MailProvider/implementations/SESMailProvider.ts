import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;
    constructor(
        @inject("MailTemplateProvider")
        private mailTemplateProvider: IMailTemplateProvider,
    ){
        // create Nodemailer SES transporter
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region:'us-east-1'
            })
        });
    }

    public async sendMail({ to, from, template, subject}: ISendMailDTO): Promise<void> {
        const { name, address } = mailConfig.defaults.from;

        // await this.client.sendMail({
        //     from: {
        //         name: from?.name || name,
        //         address: from?.email || address
        //     },
        //     to: {
        //         name: to.name,
        //         address: to.email,
        //     },
        //     subject,
        //     html: await this.mailTemplateProvider.parse(template),
        // });

        // send some mail
        await this.client.sendMail({
            from: 'ericksson@ericksson.tech',
            to: 'erickssondrozda@outlook.com',
            subject: 'Message',
            text: 'I hope this message gets sent!',
        }, (err, info) => {
            console.log(err, info);
        });
    }
}
