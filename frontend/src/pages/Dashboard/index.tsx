import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import { isToday, format, isAfter } from 'date-fns';
import enAU from 'date-fns/locale/en-AU';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Section,
  Appointment,
} from './styles';
import LogoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface Appointment{
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatarUrl: string;
    }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const { signOut, user } = useAuth();

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      },
    }).then((response) => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => !monthDay.available)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => format(selectedDate, "MMMM ', ' dd", {
    locale: enAU,
  }), [selectedDate]);

  const selectedWeekDay = useMemo(() => format(selectedDate, 'cccc', { locale: enAU }), [selectedDate]);

  useEffect(() => {
    console.log({
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
    });
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      },

    }).then((response) => {
      const appointmentsFormatted = response.data.map((appointment) => ({
        ...appointment,
        hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
      }));
      setAppointments(appointmentsFormatted);
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() < 12), [appointments]);//eslint-disable-line

  const afternoonAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() >= 12), [appointments]);//eslint-disable-line

  const nextAppointment = useMemo(() => appointments.find((appointment) => isAfter(parseISO(appointment.date), new Date())), [appointments]);//eslint-disable-line
  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={LogoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatarUrl} alt={user.name} />
            <div>
              <span>Welcome</span>
              <Link to="/profile"><strong>{user.name}</strong></Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Schedule appointments</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>
                Next Appointment
              </strong>
              <div>
                <img src={nextAppointment.user.avatarUrl} alt={nextAppointment.user.name} />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  <span>{nextAppointment.hourFormatted}</span>
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Morning</strong>
            {morningAppointments.length === 0 && (<p>No one appointment</p>)}

            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <span>{appointment.hourFormatted}</span>
                </span>

                <div>
                  <img src={appointment.user.avatarUrl} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Afternoon</strong>
            {afternoonAppointments.length === 0 && (<p>No one appointment</p>)}
            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <span>{appointment.hourFormatted}</span>
                </span>

                <div>
                  <img src={appointment.user.avatarUrl} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            fromMonth={new Date()}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
