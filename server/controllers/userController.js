const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const updateGoal = async (req, res, next) => {
  try {
    const { daily_goal_kg } = req.body;
    const userId = req.user.id;

    if (daily_goal_kg === undefined) {
      return res.status(400).json({ error: 'Daily goal is required' });
    }

    const goal = parseFloat(daily_goal_kg);
    if (isNaN(goal) || goal < 1 || goal > 50) {
      return res.status(400).json({ error: 'Goal must be between 1 and 50 kg' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { daily_goal_kg: goal }
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      daily_goal_kg: user.daily_goal_kg,
      streak_days: user.streak_days
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        daily_goal_kg: true,
        streak_days: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateGoal, getMe };
