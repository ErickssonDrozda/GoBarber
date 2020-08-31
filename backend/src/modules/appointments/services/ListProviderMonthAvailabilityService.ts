import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
// import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';


interface IRequest {
    providerId: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,
    ){}

    public async execute({ providerId, month, year }: IRequest): Promise<IResponse> {
        const appointmentsInMonth = await this.appointmentsRepository.findAllInMonthFromProvider({
            providerId,
            month,
            year
        });

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from({ length: numberOfDaysInMonth }, (_, index)=> index + 1,);

        const availability = eachDayArray.map(day => {
            const appointmentsInDay = appointmentsInMonth.filter(appointment => {
                return getDate(appointment.date) === day
            });

            return {
                day,
                available: appointmentsInDay.length < 10,
            };

        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
