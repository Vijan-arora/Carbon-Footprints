const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const WORLD_AVG_DAILY = 4.0; // Average world daily emissions in kg

const getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const logs = await prisma.activityLog.findMany({
      where: {
        user_id: userId,
        logged_at: { gte: startDate, lte: endDate }
      },
      orderBy: { logged_at: 'asc' }
    });

    // Group by day
    const dailyTotals = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyTotals[dateStr] = 0;
    }

    logs.forEach(log => {
      const dateStr = new Date(log.logged_at).toISOString().split('T')[0];
      if (dailyTotals[dateStr] !== undefined) {
        dailyTotals[dateStr] += log.total_kg;
      }
    });

    const days = Object.entries(dailyTotals).map(([date, total]) => ({
      date,
      total: Math.round(total * 100) / 100,
      dateObj: new Date(date)
    }));

    // Find best and worst days
    let bestDay = days[0];
    let worstDay = days[0];

    days.forEach(day => {
      if (day.total < bestDay.total) bestDay = day;
      if (day.total > worstDay.total) worstDay = day;
    });

    res.json({
      days,
      bestDay: { date: bestDay.date, total: bestDay.total },
      worstDay: { date: worstDay.date, total: worstDay.total },
      goal: user.daily_goal_kg,
      weekTotal: Math.round(days.reduce((sum, d) => sum + d.total, 0) * 100) / 100
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const logs = await prisma.activityLog.findMany({
      where: {
        user_id: userId,
        logged_at: { gte: startDate, lte: endDate }
      },
      orderBy: { logged_at: 'asc' }
    });

    // Group by day
    const dailyTotals = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyTotals[dateStr] = 0;
    }

    logs.forEach(log => {
      const dateStr = new Date(log.logged_at).toISOString().split('T')[0];
      if (dailyTotals[dateStr] !== undefined) {
        dailyTotals[dateStr] += log.total_kg;
      }
    });

    const days = Object.entries(dailyTotals).map(([date, total]) => ({
      date,
      total: Math.round(total * 100) / 100
    }));

    const monthTotal = Math.round(days.reduce((sum, d) => sum + d.total, 0) * 100) / 100;
    const worldAvgTotal = WORLD_AVG_DAILY * 30;
    const savedVsWorldAvg = Math.round((worldAvgTotal - monthTotal) * 100) / 100;

    res.json({
      days,
      monthTotal,
      worldAvgDaily: WORLD_AVG_DAILY,
      savedVsWorldAvg,
      goal: user.daily_goal_kg
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeeklyStats, getMonthlyStats };
