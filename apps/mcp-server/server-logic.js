import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fetch from 'node-fetch';

export const server = new McpServer({
  name: 'Fulfillment MCP Server',
  version: '1.0.0',
});
// Register getOrders tool
server.registerTool(
  'getCars',
  {
    description: 'Get car inventory',
    inputSchema: {},
  },
  async () => {
    console.error('Fetching cars');
    const res = await fetch('http://localhost:3333/api/cars');
    const orders = await res.json();

    return { content: [{ type: 'text', text: JSON.stringify(orders) }] };
  }
);

// // Register getInventory tool
// server.registerTool(
//   'getInventory',
//   {
//     description: 'Get product inventory',
//     inputSchema: {},
//   },
//   async () => {
//     console.error('Fetching inventory');
//     const res = await fetch('http://localhost:3333/api/cars');
//     const inventory = await res.json();

//     return { content: [{ type: 'text', text: JSON.stringify(inventory) }] };
//   }
// );

// // Register purchase tool
// server.registerTool(
//   'purchase',
//   {
//     description: 'Purchase a product',
//     inputSchema: {
//       items: z
//         .array(
//           z.object({
//             guitarId: z.number().describe('ID of the guitar to purchase'),
//             quantity: z.number().describe('Quantity of guitars to purchase'),
//           })
//         )
//         .describe('List of guitars to purchase'),
//       customerName: z.string().describe('Name of the customer'),
//     },
//   },
//   async ({ items, customerName }) => {
//     console.error('Purchasing', { items, customerName });
//     const res = await fetch('http://localhost:3333/api/cars', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         items,
//         customerName,
//       }),
//     });
//     const order = await res.json();

//     return { content: [{ type: 'text', text: JSON.stringify(order) }] };
//   }
// );

// // Register greetUser tool
// server.registerTool(
//   'greetUser',
//   {
//     description: 'Greet the user with a personalized message',
//     inputSchema: {
//       name: z.string().describe('Name of the user to greet'),
//     },
//   },
//   async ({ name }) => {
//     return {
//       content: [
//         {
//           type: 'text',
//           text: `Hello, ${name}! Welcome to the Fulfillment MCP Server.`,
//         },
//       ],
//     };
//   }
// );
