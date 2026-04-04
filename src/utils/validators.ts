import { KPICard, User, AcquisitionChannel, RevenueDataPoint } from '../types';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateKPICard = (data: unknown): data is KPICard => {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('KPI Card must be an object');
  }

  const card = data as Partial<KPICard>;

  if (!card.id || typeof card.id !== 'string') {
    throw new ValidationError('Invalid or missing id', 'id');
  }

  if (!card.chartData || !Array.isArray(card.chartData)) {
    throw new ValidationError('chartData must be an array', 'chartData');
  }

  if (card.chartData.length === 0) {
    throw new ValidationError('chartData cannot be empty', 'chartData');
  }

  return true;
};

export const validateUser = (data: unknown): data is User => {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('User must be an object');
  }

  const user = data as Partial<User>;

  if (!user.id || typeof user.id !== 'string') {
    throw new ValidationError('Invalid or missing id', 'id');
  }

  return true;
};

export const validateAcquisitionChannel = (data: unknown): data is AcquisitionChannel => {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('Acquisition Channel must be an object');
  }

  return true;
};

export const validateRevenueData = (data: unknown): data is RevenueDataPoint => {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('Revenue data must be an object');
  }

  return true;
};

export const validateArray = <T>(
  data: unknown[],
  validator: (item: unknown) => item is T,
  minLength = 0
): T[] => {
  if (!Array.isArray(data)) {
    throw new ValidationError('Expected an array');
  }

  if (data.length < minLength) {
    throw new ValidationError(`Array must have at least ${minLength} items`);
  }

  data.forEach((item, index) => {
    try {
      validator(item);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `Item at index ${index}: ${error.message}`,
          error.field
        );
      }
      throw error;
    }
  });

  return data as T[];
};