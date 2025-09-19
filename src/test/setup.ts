import '@testing-library/jest-dom';

// Mock environment variables if needed
global.process = global.process || {};
global.process.env = global.process.env || {};

// Custom render function for React Testing Library with providers
export * from '@testing-library/react';