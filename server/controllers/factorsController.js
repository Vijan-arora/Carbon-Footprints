const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getFactors = async (req, res, next) => {
  try {
    const factors = await prisma.emissionFactor.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    // Group by category
    const groupedFactors = factors.reduce((acc, factor) => {
      if (!acc[factor.category]) {
        acc[factor.category] = [];
      }
      acc[factor.category].push(factor);
      return acc;
    }, {});

    res.json(groupedFactors);
  } catch (error) {
    next(error);
  }
};

module.exports = { getFactors };
