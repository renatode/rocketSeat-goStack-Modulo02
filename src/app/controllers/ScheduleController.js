import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    /**
     * Check if provider_id exists and is an provider
     */
    const checkProvider = await User.findOne({ where: { id: req.userId } });

    if (!checkProvider || !checkProvider.provider) {
      return res.status(401).json({ error: 'User is not an provider' });
    }
    const { date } = req.query;
    const parsedDate = parseISO(date);

    const schedules = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.status(200).json(schedules);
  }
}

export default new ScheduleController();
