const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');

const {
  hashPassword,
  isLegacyPasswordHash,
  normalizeEmail,
  verifyPassword
} = require('./auth-service');

test('normalizes email consistently', () => {
  assert.equal(normalizeEmail('  User@Example.COM  '), 'user@example.com');
});

test('hashes new passwords with unique salts and verifies them', () => {
  const firstHash = hashPassword('correct horse battery staple');
  const secondHash = hashPassword('correct horse battery staple');

  assert.match(firstHash, /^scrypt\$/);
  assert.notEqual(firstHash, secondHash);
  assert.equal(verifyPassword('correct horse battery staple', firstHash), true);
  assert.equal(verifyPassword('wrong password', firstHash), false);
});

test('verifies existing PBKDF2 password hashes for transparent migration', () => {
  const password = 'existing-account-password';
  const legacyHash = crypto.pbkdf2Sync(password, 'impulso-mkt-2026', 120000, 64, 'sha512').toString('hex');

  assert.equal(isLegacyPasswordHash(legacyHash), true);
  assert.equal(verifyPassword(password, legacyHash), true);
  assert.equal(verifyPassword('incorrect', legacyHash), false);
  assert.equal(isLegacyPasswordHash('not-a-hash'), false);
});