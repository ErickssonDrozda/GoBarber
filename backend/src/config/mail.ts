interface IMailConfig{
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            address: string;
            name: string;
        }
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',
    defaults: {
        from: {
            address: 'ericksson@ericksson.tech',
            name: 'Ericksson from GoBarber'
        }
    }
} as IMailConfig;
