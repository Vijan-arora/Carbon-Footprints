const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emissionFactors = [
    { category: 'Transport', name: 'Petrol Car', factor_per_unit: 0.21, unit: 'km', description: 'Average petrol car emissions per kilometer' },
    { category: 'Transport', name: 'Diesel Car', factor_per_unit: 0.19, unit: 'km', description: 'Average diesel car emissions per kilometer' },
    { category: 'Transport', name: 'Bus', factor_per_unit: 0.089, unit: 'km', description: 'Public bus emissions per kilometer' },
    { category: 'Transport', name: 'Metro', factor_per_unit: 0.041, unit: 'km', description: 'Metro/subway emissions per kilometer' },
    { category: 'Transport', name: 'Bicycle', factor_per_unit: 0, unit: 'km', description: 'Zero emissions - cycling' },
    { category: 'Transport', name: 'Domestic Flight', factor_per_unit: 0.255, unit: 'km', description: 'Domestic flight emissions per kilometer' },
    { category: 'Transport', name: 'Auto-Rickshaw', factor_per_unit: 0.075, unit: 'km', description: 'Three-wheeler auto-rickshaw emissions per kilometer' },
    { category: 'Transport', name: 'Electric Car', factor_per_unit: 0.053, unit: 'km', description: 'Electric vehicle emissions (grid average) per kilometer' },
    { category: 'Energy', name: 'Electricity', factor_per_unit: 0.708, unit: 'kWh', description: 'India grid average emissions per kWh' },
    { category: 'Energy', name: 'LPG Cooking', factor_per_unit: 0.52, unit: 'hour', description: 'LPG gas stove emissions per hour of use' },
    { category: 'Energy', name: 'Diesel Generator', factor_per_unit: 2.68, unit: 'hour', description: 'Diesel generator emissions per hour' },
    { category: 'Energy', name: 'Air Conditioner', factor_per_unit: 1.06, unit: 'hour', description: 'AC emissions per hour (1.5 kWh average)' },
    { category: 'Energy', name: 'Water Heater', factor_per_unit: 2.12, unit: 'hour', description: 'Electric water heater emissions per hour' },
    { category: 'Energy', name: 'Ceiling Fan', factor_per_unit: 0.05, unit: 'hour', description: 'Ceiling fan emissions per hour' },
    { category: 'Food', name: 'Beef Meal', factor_per_unit: 6.0, unit: 'meal', description: 'Average beef meal carbon footprint' },
    { category: 'Food', name: 'Chicken Meal', factor_per_unit: 1.8, unit: 'meal', description: 'Average chicken meal carbon footprint' },
    { category: 'Food', name: 'Vegetarian Meal', factor_per_unit: 0.8, unit: 'meal', description: 'Average vegetarian meal carbon footprint' },
    { category: 'Food', name: 'Vegan Meal', factor_per_unit: 0.4, unit: 'meal', description: 'Average vegan meal carbon footprint' },
    { category: 'Food', name: 'Dairy', factor_per_unit: 1.2, unit: '100g', description: 'Cheese/dairy products per 100 grams' },
    { category: 'Food', name: 'Eggs', factor_per_unit: 0.25, unit: 'unit', description: 'Single egg carbon footprint' },
    { category: 'Food', name: 'Rice', factor_per_unit: 0.28, unit: '100g', description: 'Rice per 100 grams' },
    { category: 'Shopping', name: 'New Clothing Item', factor_per_unit: 15.0, unit: 'item', description: 'Average new clothing item footprint' },
    { category: 'Shopping', name: 'Electronics Device', factor_per_unit: 350.0, unit: 'device', description: 'Average electronics device footprint' },
    { category: 'Shopping', name: 'Online Delivery Package', factor_per_unit: 0.5, unit: 'package', description: 'Online shopping delivery emissions' },
    { category: 'Shopping', name: 'Plastic Bag', factor_per_unit: 0.08, unit: 'bag', description: 'Single-use plastic bag footprint' },
  ];

  await prisma.emissionFactor.deleteMany({});
  await prisma.emissionFactor.createMany({ data: emissionFactors });

  console.log(`Seeded ${emissionFactors.length} emission factors`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
