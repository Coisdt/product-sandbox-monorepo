import { carDataset } from '../car.interface';

export const fetchCars = async () => {
  // Return the car dataset directly instead of making a circular API call
  return carDataset;
};
