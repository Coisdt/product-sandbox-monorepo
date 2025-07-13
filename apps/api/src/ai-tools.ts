import { fetchCars } from './assets/fetch';

// Tool definitions for OpenAI
export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'getCars',
      description:
        'Get a list of all cars in the inventory with details like make, model, year, price, etc.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

// Tool execution handler
export async function executeToolCall(toolName: string, parameters: any) {
  switch (toolName) {
    case 'getCars':
      return await fetchCars();
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
