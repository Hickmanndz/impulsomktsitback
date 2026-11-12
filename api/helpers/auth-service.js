const crypto = require('crypto');

const LEGACY_PASSWORD_SALT = process.env.PASSWORD_SALT || 'impulso-mkt-2026';
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const HASH_LENGTH = 64;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, HASH_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION
  });

  return `scrypt$${SCRYPT_COST}$${SCRYPT_BLOCK_SIZE}$${SCRYPT_PARALLELIZATION}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') {
    return false;
  }

  if (storedHash.startsWith('scrypt$')) {
    const [, cost, blockSize, parallelization, saltHex, hashHex] = storedHash.split('$');
    if (Number(cost) !== SCRYPT_COST || Number(blockSize) !== SCRYPT_BLOCK_SIZE || Number(parallelization) !== SCRYPT_PARALLELIZATION
      || !/^[a-f0-9]{32}$/i.test(saltHex || '') || !/^[a-f0-9]{128}$/i.test(hashHex || '')) {
      return false;
    }

    const salt = Buffer.from(saltHex || '', 'hex');
    const expectedHash = Buffer.from(hashHex || '', 'hex');

    if (!salt.length || expectedHash.length !== HASH_LENGTH) {
      return false;
    }

    try {
      const actualHash = crypto.scryptSync(String(password), salt, expectedHash.length, {
        N: Number(cost),
        r: Number(blockSize),
        p: Number(parallelization)
      });
      return crypto.timingSafeEqual(actualHash, expectedHash);
    } catch (erro) {
      return false;
    }
  }

  if (!/^[a-f0-9]{128}$/i.test(storedHash)) {
    return false;
  }

  const legacyHash = crypto.pbkdf2Sync(String(password), LEGACY_PASSWORD_SALT, 120000, 64, 'sha512');
  return crypto.timingSafeEqual(legacyHash, Buffer.from(storedHash, 'hex'));
}

function isLegacyPasswordHash(storedHash) {
  return typeof storedHash === 'string' && /^[a-f0-9]{128}$/i.test(storedHash);
}

module.exports = {
  hashPassword,
  isLegacyPasswordHash,
  normalizeEmail,
  verifyPassword
};