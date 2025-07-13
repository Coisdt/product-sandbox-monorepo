import { tool } from 'ai';
import { z } from 'zod';
import { fetchCars } from './assets/fetch';

// Define tools using Vercel AI SDK format (like Jack Harrington's approach)
export const getCarsSchema = z.object({
  // No parameters needed for getting all cars
});

export const getCarsTool = tool({
  description:
    'Get the current car inventory. Use this tool whenever a user asks about cars, car inventory, what cars are available, car models, car prices, or wants to see the car selection. This tool returns real car data from the dealership.',
  parameters: getCarsSchema,
  execute: async () => {
    console.log('🚗 getCars tool is being executed!');
    const cars = await fetchCars();
    console.log(`🚗 Found ${cars.length} cars in inventory`);

    return {
      cars: cars,
      count: cars.length,
      message: `Found ${cars.length} cars in the inventory`,
    };
  },
});

// Export all tools
export const tools = {
  getCars: getCarsTool,
};
