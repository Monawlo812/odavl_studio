import { fixGofmt } from '../index.js';
test('gofmt trims whitespace', () => {
  expect(fixGofmt('package main  \n')).toBe('package main');
});
