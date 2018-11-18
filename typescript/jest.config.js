module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1'
  }
};