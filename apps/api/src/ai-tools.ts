import { tool } from 'ai';
import { z } from 'zod';
import { fetchCars } from './assets/fetch';

// Define tools using Vercel AI SDK format (like Jack Harrington's approach)
export const getCarsSchema = z.object({
  // No parameters needed for getting all cars
});

export const getCarsTool = tool({
  description:
    'Get all cars from the inventory. Use this to see what cars are available before making recommendations.',
  parameters: getCarsSchema,
  execute: async () => {
    const cars = await fetchCars();

    return {
      cars: cars.map((car) => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        bodyType: car.bodyType,
        condition: car.condition,
        mileage: car.mileage,
        engine: car.engine,
        features: car.features,
      })),
      count: cars.length,
      message: `Found ${cars.length} cars in the inventory`,
    };
  },
});

export const searchCarsTool = tool({
  description:
    'Search for cars based on criteria like make, model, price range, body type, etc.',
  parameters: z.object({
    make: z.string().optional().describe('Car make (e.g., Toyota, BMW, Tesla)'),
    model: z
      .string()
      .optional()
      .describe('Car model (e.g., Camry, 3 Series, Model 3)'),
    maxPrice: z.number().optional().describe('Maximum price in dollars'),
    minPrice: z.number().optional().describe('Minimum price in dollars'),
    bodyType: z
      .enum([
        'sedan',
        'suv',
        'hatchback',
        'coupe',
        'convertible',
        'wagon',
        'pickup',
        'crossover',
      ])
      .optional()
      .describe('Body type'),
    condition: z
      .enum(['new', 'used', 'certified-pre-owned'])
      .optional()
      .describe('Car condition'),
    engineType: z
      .enum(['gasoline', 'diesel', 'electric', 'hybrid'])
      .optional()
      .describe('Engine type'),
  }),
  execute: async ({
    make,
    model,
    maxPrice,
    minPrice,
    bodyType,
    condition,
    engineType,
  }) => {
    const cars = await fetchCars();

    let filteredCars = cars;

    if (make) {
      filteredCars = filteredCars.filter((car) =>
        car.make.toLowerCase().includes(make.toLowerCase())
      );
    }

    if (model) {
      filteredCars = filteredCars.filter((car) =>
        car.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    if (maxPrice) {
      filteredCars = filteredCars.filter((car) => car.price <= maxPrice);
    }

    if (minPrice) {
      filteredCars = filteredCars.filter((car) => car.price >= minPrice);
    }

    if (bodyType) {
      filteredCars = filteredCars.filter((car) => car.bodyType === bodyType);
    }

    if (condition) {
      filteredCars = filteredCars.filter((car) => car.condition === condition);
    }

    if (engineType) {
      filteredCars = filteredCars.filter(
        (car) => car.engine.type === engineType
      );
    }

    return {
      cars: filteredCars.map((car) => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        bodyType: car.bodyType,
        condition: car.condition,
        mileage: car.mileage,
        engine: car.engine,
        features: car.features,
      })),
      count: filteredCars.length,
      filters: {
        make,
        model,
        maxPrice,
        minPrice,
        bodyType,
        condition,
        engineType,
      },
      message: `Found ${filteredCars.length} cars matching your criteria`,
    };
  },
});

export const recommendCarTool = tool({
  description:
    'Recommend a car to the user based on their preferences. First use getCars to see available cars, then recommend one by ID. The user will give their preferences in the chat for example: "I want a cheap car." or "can you recommend a fancy car for me?" Your job is to recommend a car that matches the user\'s preferences.',
  parameters: z.object({
    carId: z
      .string()
      .describe(
        'The ID of the car to recommend (e.g., car-001, car-002, etc.). Use getCars first to see available IDs.'
      ),
  }),
  execute: async ({ carId }) => {
    const cars = await fetchCars();
    const car = cars.find((c) => c.id === carId);

    if (!car) {
      return {
        error: `Car with ID ${carId} not found. Available cars: ${cars
          .map((c) => c.id)
          .join(', ')}`,
        availableCars: cars.map((c) => ({
          id: c.id,
          make: c.make,
          model: c.model,
          year: c.year,
          price: c.price,
        })),
      };
    }

    return {
      car: car,
      recommendation: `I recommend the ${car.year} ${car.make} ${
        car.model
      }. It's a ${car.condition} ${car.bodyType} with ${
        car.engine.horsepower
      } horsepower, priced at $${car.price.toLocaleString()}. ${
        car.description || ''
      }`,
      features: car.features,
      specs: {
        engine: car.engine,
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        fuelEconomy: car.fuelEconomy,
        mileage: car.mileage,
      },
    };
  },
});

// Export all tools
export const tools = {
  getCars: getCarsTool,
  searchCars: searchCarsTool,
  recommendCar: recommendCarTool,
};
