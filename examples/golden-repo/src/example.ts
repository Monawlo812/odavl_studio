import { readFileSync } from 'fs'  // unused
const UNUSED_CONST = 42            // unused
export function sum(a: number, b: number) { return a + b }
export default function main() { const x = sum(1,2); console.log('demo', x); }