import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
// import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';


interface IRequest {
    providerId: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,
    ){}

    public async execute({ providerId, day, month, year }: IRequest): Promise<IResponse> {

        const appointmentsInDay = await this.appointmentsRepository.findAllInDayFromProvider({
            providerId, day, month, year
        });

        const hourStart = 8;
        const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart);

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {

            const hasAppointmentInHours = appointmentsInDay.find(appointment =>
                getHours(appointment.date) === hour
            );

            const appointmentDateToCompare = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointmentInHours && isAfter(appointmentDateToCompare, currentDate)
            }
        });
        return availability;
    }
}

export default ListProviderDayAvailabilityService;
