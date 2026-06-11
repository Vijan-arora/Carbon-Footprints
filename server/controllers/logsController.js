const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getLogs = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    let whereClause = { user_id: userId };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.logged_at = {
        gte: startDate,
        lte: endDate
      };
    }

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { logged_at: 'desc' }
    });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const createLog = async (req, res, next) => {
  try {
    const { category, activity_name, quantity, emission_factor } = req.body;
    const userId = req.user.id;

    if (!category || !activity_name || quantity === undefined || emission_factor === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const total_kg = parseFloat(quantity) * parseFloat(emission_factor);

    const log = await prisma.activityLog.create({
      data: {
        user_id: userId,
        category,
        activity_name,
        quantity: parseFloat(quantity),
        emission_factor: parseFloat(emission_factor),
        total_kg
      }
    });

    // Update streak
    await updateStreak(userId);

    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const log = await prisma.activityLog.findFirst({
      where: { id: parseInt(id), user_id: userId }
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    await prisma.activityLog.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateStreak = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Get today's total emissions
  const todayLogs = await prisma.activityLog.findMany({
    where: {
      user_id: userId,
      logged_at: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  });

  const todayTotal = todayLogs.reduce((sum, log) => sum + log.total_kg, 0);

  // Check if user met goal yesterday to continue streak
  const yesterdayLogs = await prisma.activityLog.findMany({
    where: {
      user_id: userId,
      logged_at: {
        gte: yesterday,
        lt: today
      }
    }
  });

  const yesterdayTotal = yesterdayLogs.reduce((sum, log) => sum + log.total_kg, 0);

  // If yesterday was under goal, streak continues
  // Otherwise, if today is under goal, streak restarts at 1
  if (yesterdayTotal <= user.daily_goal_kg && yesterdayLogs.length > 0) {
    // Continue streak from yesterday
    // Check if today already counted
    const alreadyCountedToday = todayLogs.some(log => {
      const logDate = new Date(log.logged_at);
      return logDate >= today && logDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    if (!alreadyCountedToday && todayTotal <= user.daily_goal_kg) {
      await prisma.user.update({
        where: { id: userId },
        data: { streak_days: user.streak_days + 1 }
      });
    }
  } else if (todayTotal <= user.daily_goal_kg) {
    // New streak
    await prisma.user.update({
      where: { id: userId },
      data: { streak_days: 1 }
    });
  }
};

module.exports = { getLogs, createLog, deleteLog };
