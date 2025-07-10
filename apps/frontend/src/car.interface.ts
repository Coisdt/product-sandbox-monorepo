export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  bodyType:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'wagon'
    | 'pickup'
    | 'crossover';
  engine: {
    type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    displacement?: number; // in liters
    horsepower: number;
    torque: number; // in lb-ft
  };
  transmission: {
    type: 'manual' | 'automatic' | 'cvt';
    gears: number;
  };
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  fuelEconomy: {
    city: number; // mpg
    highway: number; // mpg
    combined: number; // mpg
  };
  mileage: number;
  price: number;
  features: string[];
  condition: 'new' | 'used' | 'certified-pre-owned';
  vin: string;
  dateAdded: Date;
  isAvailable: boolean;
  images?: string[];
  description?: string;
  seller?: {
    name: string;
    contact: string;
    location: string;
  };
}
