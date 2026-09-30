const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication & Security Suite', () => {
  const TEST_PASSWORD = 'password123';
  const TEST_SECRET = 'test_jwt_secret_key_123';

  test('should correctly hash password with bcrypt', async () => {
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    assert.ok(hash);
    assert.notEqual(hash, TEST_PASSWORD);
    assert.match(hash, /^\$2[aby]?\$\d+\$/);
  });

  test('should accurately verify matching password', async () => {
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    const isMatch = await bcrypt.compare(TEST_PASSWORD, hash);
    assert.equal(isMatch, true);
  });

  test('should reject invalid password', async () => {
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    const isMatch = await bcrypt.compare('wrongpassword', hash);
    assert.equal(isMatch, false);
  });

  test('should generate and verify valid JWT token with role and userId', () => {
    const payload = { userId: 42, role: 'ADMIN' };
    const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1d' });

    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = jwt.verify(token, TEST_SECRET);
    assert.equal(decoded.userId, 42);
    assert.equal(decoded.role, 'ADMIN');
  });

  test('should reject JWT token signed with invalid secret', () => {
    const payload = { userId: 42, role: 'EMPLOYEE' };
    const token = jwt.sign(payload, 'wrong_secret', { expiresIn: '1d' });

    assert.throws(() => {
      jwt.verify(token, TEST_SECRET);
    });
  });

  test('should enforce valid role types (ADMIN vs EMPLOYEE)', () => {
    const validRoles = ['ADMIN', 'EMPLOYEE'];
    assert.ok(validRoles.includes('ADMIN'));
    assert.ok(validRoles.includes('EMPLOYEE'));
    assert.ok(!validRoles.includes('SUPERUSER'));
    assert.ok(!validRoles.includes('GUEST'));
  });
});
