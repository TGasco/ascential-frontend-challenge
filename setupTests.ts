import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

if (matchers) {
  expect.extend(matchers);
} else {
  console.error('Failed to load matchers from @testing-library/jest-dom/matchers');
}