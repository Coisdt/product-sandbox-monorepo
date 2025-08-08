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

export interface CarFilters {
  make?: string;
  model?: string;
  yearRange?: {
    min: number;
    max: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  mileageRange?: {
    min: number;
    max: number;
  };
  bodyType?: Car['bodyType'];
  engineType?: Car['engine']['type'];
  transmission?: Car['transmission']['type'];
  drivetrain?: Car['drivetrain'];
  condition?: Car['condition'];
  features?: string[];
}

export interface CarSearchResult {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
  filters: CarFilters;
}

// Sample car dataset
export const carDataset: Car[] = [
  {
    id: 'car-001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Silver',
    bodyType: 'sedan',
    engine: {
      type: 'gasoline',
      displacement: 2.5,
      horsepower: 203,
      torque: 184,
    },
    transmission: {
      type: 'automatic',
      gears: 8,
    },
    drivetrain: 'fwd',
    fuelEconomy: {
      city: 28,
      highway: 39,
      combined: 32,
    },
    mileage: 15420,
    price: 28500,
    features: [
      'Bluetooth',
      'Backup Camera',
      'Lane Departure Warning',
      'Adaptive Cruise Control',
    ],
    condition: 'used',
    vin: '4T1C11AK5NU123456',
    dateAdded: new Date('2024-01-15'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1623869675991-5be8c6c8ba9b?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Well-maintained 2023 Toyota Camry with low mileage and excellent fuel economy.',
    seller: {
      name: 'Metro Toyota',
      contact: '(555) 123-4567',
      location: 'Los Angeles, CA',
    },
  },
  {
    id: 'car-002',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'Pearl White',
    bodyType: 'sedan',
    engine: {
      type: 'electric',
      horsepower: 283,
      torque: 307,
    },
    transmission: {
      type: 'automatic',
      gears: 1,
    },
    drivetrain: 'rwd',
    fuelEconomy: {
      city: 138,
      highway: 126,
      combined: 132,
    },
    mileage: 2500,
    price: 42990,
    features: [
      'Autopilot',
      'Premium Audio',
      'Glass Roof',
      'Supercharging',
      'Over-the-Air Updates',
    ],
    condition: 'certified-pre-owned',
    vin: '5YJ3E1EA5PF123789',
    dateAdded: new Date('2024-02-01'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Nearly new Tesla Model 3 with latest software updates and premium features.',
    seller: {
      name: 'Tesla Certified Pre-Owned',
      contact: '(555) 987-6543',
      location: 'San Francisco, CA',
    },
  },
  {
    id: 'car-003',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    color: 'Oxford White',
    bodyType: 'pickup',
    engine: {
      type: 'gasoline',
      displacement: 3.5,
      horsepower: 400,
      torque: 500,
    },
    transmission: {
      type: 'automatic',
      gears: 10,
    },
    drivetrain: '4wd',
    fuelEconomy: {
      city: 18,
      highway: 24,
      combined: 20,
    },
    mileage: 35000,
    price: 52000,
    features: [
      'Towing Package',
      '4WD',
      'Crew Cab',
      'Bed Liner',
      'Navigation System',
    ],
    condition: 'used',
    vin: '1FTFW1E84NFA12345',
    dateAdded: new Date('2024-01-20'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Powerful F-150 with towing capability and 4WD for all terrain driving.',
    seller: {
      name: 'AutoMax Dealership',
      contact: '(555) 456-7890',
      location: 'Dallas, TX',
    },
  },
  {
    id: 'car-004',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    color: 'Obsidian Blue Pearl',
    bodyType: 'suv',
    engine: {
      type: 'gasoline',
      displacement: 1.5,
      horsepower: 190,
      torque: 179,
    },
    transmission: {
      type: 'cvt',
      gears: 1,
    },
    drivetrain: 'awd',
    fuelEconomy: {
      city: 27,
      highway: 32,
      combined: 29,
    },
    mileage: 8750,
    price: 33500,
    features: [
      'All-Wheel Drive',
      'Honda Sensing Suite',
      'Apple CarPlay',
      'Android Auto',
      'Heated Seats',
    ],
    condition: 'used',
    vin: '2HKRW2H85NH123456',
    dateAdded: new Date('2024-01-30'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Reliable Honda CR-V with all-wheel drive and comprehensive safety features.',
    seller: {
      name: 'Honda of Springfield',
      contact: '(555) 234-5678',
      location: 'Springfield, IL',
    },
  },
  {
    id: 'car-005',
    make: 'BMW',
    model: '3 Series',
    year: 2024,
    color: 'Jet Black',
    bodyType: 'sedan',
    engine: {
      type: 'gasoline',
      displacement: 2.0,
      horsepower: 255,
      torque: 295,
    },
    transmission: {
      type: 'automatic',
      gears: 8,
    },
    drivetrain: 'rwd',
    fuelEconomy: {
      city: 26,
      highway: 36,
      combined: 30,
    },
    mileage: 0,
    price: 45900,
    features: [
      'Premium Package',
      'Sport Seats',
      'Harman Kardon Audio',
      'Wireless Charging',
      'Driver Assistance Package',
    ],
    condition: 'new',
    vin: 'WBA5R1C02PF123456',
    dateAdded: new Date('2024-02-10'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1563720223395-9a8c6aca4b7a?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Brand new BMW 3 Series with luxury features and sporty performance.',
    seller: {
      name: 'BMW of Manhattan',
      contact: '(555) 345-6789',
      location: 'New York, NY',
    },
  },
  {
    id: 'car-006',
    make: 'Subaru',
    model: 'Outback',
    year: 2021,
    color: 'Forest Green Metallic',
    bodyType: 'wagon',
    engine: {
      type: 'gasoline',
      displacement: 2.5,
      horsepower: 182,
      torque: 176,
    },
    transmission: {
      type: 'cvt',
      gears: 1,
    },
    drivetrain: 'awd',
    fuelEconomy: {
      city: 26,
      highway: 33,
      combined: 29,
    },
    mileage: 42000,
    price: 28900,
    features: [
      'Symmetrical AWD',
      'EyeSight Safety Suite',
      'Roof Rails',
      'Starlink Multimedia',
      'X-Mode',
    ],
    condition: 'used',
    vin: '4S4BSANC5M3123456',
    dateAdded: new Date('2024-01-25'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Adventure-ready Subaru Outback with standard all-wheel drive and excellent ground clearance.',
    seller: {
      name: 'Mountain View Subaru',
      contact: '(555) 567-8901',
      location: 'Denver, CO',
    },
  },
  {
    id: 'car-007',
    make: 'Porsche',
    model: '911',
    year: 2023,
    color: 'Guards Red',
    bodyType: 'coupe',
    engine: {
      type: 'gasoline',
      displacement: 3.0,
      horsepower: 379,
      torque: 331,
    },
    transmission: {
      type: 'manual',
      gears: 7,
    },
    drivetrain: 'rwd',
    fuelEconomy: {
      city: 18,
      highway: 25,
      combined: 20,
    },
    mileage: 5200,
    price: 115000,
    features: [
      'Sport Chrono Package',
      'BOSE Audio',
      'Heated Seats',
      'Sport Exhaust',
      'Ceramic Brakes',
    ],
    condition: 'used',
    vin: 'WP0AA2A96PS123456',
    dateAdded: new Date('2024-02-05'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Iconic Porsche 911 with manual transmission and track-ready performance features.',
    seller: {
      name: 'Porsche Center Beverly Hills',
      contact: '(555) 678-9012',
      location: 'Beverly Hills, CA',
    },
  },
  {
    id: 'car-008',
    make: 'Chevrolet',
    model: 'Bolt EV',
    year: 2024,
    color: 'Bright Blue Metallic',
    bodyType: 'hatchback',
    engine: {
      type: 'electric',
      horsepower: 200,
      torque: 266,
    },
    transmission: {
      type: 'automatic',
      gears: 1,
    },
    drivetrain: 'fwd',
    fuelEconomy: {
      city: 120,
      highway: 108,
      combined: 115,
    },
    mileage: 1200,
    price: 29995,
    features: [
      'DC Fast Charging',
      'Regen on Demand',
      'Teen Driver',
      'WiFi Hotspot',
      'Wireless Phone Charging',
    ],
    condition: 'certified-pre-owned',
    vin: '1G1FY6S07P4123456',
    dateAdded: new Date('2024-02-08'),
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1608222907050-ee5f7d20e2b9?w=800&h=600&fit=crop&crop=center'
    ],
    description:
      'Efficient electric vehicle with long range and modern technology features.',
    seller: {
      name: 'Chevrolet Electric Center',
      contact: '(555) 789-0123',
      location: 'Austin, TX',
    },
  },
];
