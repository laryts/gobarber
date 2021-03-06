import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsReposity from '../repositories/AppointmentsRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsReposity);
  const appointments = await appointmentsRepository.find();
  return response.status(200).send(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();
  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
