
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      /* Handle module aliases (if you have them in your tsconfig.json)
         For example, if you have "@components": "<rootDir>/components" in your tsconfig, add: */
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust if your source code is in 'src'
    },
    testMatch: [
      '**/__tests__/**/*.[jt]s?(x)', // Look for tests in __tests__ folders
      '**/?(*.)+(spec|test).[jt]s?(x)', // Or files with .spec. or .test. extensions
    ],
    moduleDirectories: ['node_modules', '<rootDir>'], // Make sure Jest finds modules in node_modules and project root
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Use ts-jest to transform TS/TSX files
    },
  };