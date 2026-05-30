import { validateEmail, validatePasswordStrength } from '../lib/validation.js';

console.log('\n=================================================');
console.log('STARTING FRONTEND VALIDATION FLOW UNIT TESTS...');
console.log('=================================================\n');

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${name} ${details ? `- ${details}` : ''}`);
    failed++;
  }
}

// 1. Email validation tests
assert('Valid email format passes', validateEmail('admin@lotoks.com') === true);
assert('Email missing domain extension fails', validateEmail('admin@lotoks') === false);
assert('Email missing @ symbol fails', validateEmail('adminlotoks.com') === false);
assert('Email with spaces fails', validateEmail('admin space@lotoks.com') === false);

// 2. Password strength validation tests
const weakPass1 = validatePasswordStrength('weak');
assert('Password < 8 characters is invalid', weakPass1.isValid === false && weakPass1.length === false);

const weakPass2 = validatePasswordStrength('nouppercase123!');
assert('Password missing uppercase letter is invalid', weakPass2.isValid === false && weakPass2.uppercase === false);

const weakPass3 = validatePasswordStrength('NOLOWERCASE123!');
assert('Password missing lowercase letter is invalid', weakPass3.isValid === false && weakPass3.lowercase === false);

const weakPass4 = validatePasswordStrength('NoNumbers!');
assert('Password missing numeric digits is invalid', weakPass4.isValid === false && weakPass4.number === false);

const strongPass = validatePasswordStrength('StrongPass123!');
assert('Password meeting all criteria is valid', 
  strongPass.isValid === true && 
  strongPass.length === true && 
  strongPass.uppercase === true && 
  strongPass.lowercase === true && 
  strongPass.number === true
);

console.log('\n=================================================');
console.log(`FRONTEND VALIDATION TEST SUMMARY:`);
console.log(`Passed: ${passed} | Failed: ${failed}`);
console.log('=================================================\n');

if (failed > 0) {
  throw new Error(`Frontend validation tests failed: ${failed} assertion(s) failed.`);
}
