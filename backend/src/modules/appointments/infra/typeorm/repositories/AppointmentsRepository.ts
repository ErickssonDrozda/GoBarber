import { Repository, getRepository, Raw } from 'typeorm';
import Appointment from '../entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class AppointmentsRepository implements IAppointmentsRepository{
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: {
                date,
            },
        });
        return findAppointment || undefined;
    }

    public async findAllInDayFromProvider({ providerId, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointment = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`)
            }
        });

        return appointment;
    }

    public async findAllInMonthFromProvider({ providerId, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointment = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`)
            }
        });

        return appointment;
    }

    public async create({ providerId, date, userId }: ICreateAppointmentDTO): Promise<Appointment>{
        const appointment = this.ormRepository.create({providerId, userId, date});
        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
