const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('CORS and Routing Sanitization Suite', () => {
  const sanitizeOrigin = (frontendUrl) => {
    return frontendUrl ? frontendUrl.replace(/\/+$/, '') : '*';
  };

  const cleanUrl = (rawUrl) => {
    return decodeURIComponent(rawUrl || '').trim().replace(/\/+$/, '');
  };

  test('should strip trailing slash from FRONTEND_URL to prevent CORS mismatches', () => {
    assert.equal(
      sanitizeOrigin('https://employee-management-system-ebon-mu.vercel.app/'),
      'https://employee-management-system-ebon-mu.vercel.app'
    );
    assert.equal(
      sanitizeOrigin('https://employee-management-system-ebon-mu.vercel.app///'),
      'https://employee-management-system-ebon-mu.vercel.app'
    );
    assert.equal(
      sanitizeOrigin('https://employee-management-system-ebon-mu.vercel.app'),
      'https://employee-management-system-ebon-mu.vercel.app'
    );
    assert.equal(sanitizeOrigin(''), '*');
    assert.equal(sanitizeOrigin(undefined), '*');
  });

  test('should clean and normalize incoming request URLs', () => {
    assert.equal(cleanUrl('/auth/login/'), '/auth/login');
    assert.equal(cleanUrl('/api/admin/employees/'), '/api/admin/employees');
    assert.equal(cleanUrl('/attendance/today'), '/attendance/today');
    assert.equal(cleanUrl(''), '');
  });

  test('should correctly match auth routes', () => {
    const isAuthRoute = (method, url) => {
      const cleaned = cleanUrl(url);
      return method === 'POST' && cleaned === '/auth/login';
    };

    assert.equal(isAuthRoute('POST', '/auth/login'), true);
    assert.equal(isAuthRoute('POST', '/auth/login/'), true);
    assert.equal(isAuthRoute('GET', '/auth/login'), false);
    assert.equal(isAuthRoute('POST', '/other/path'), false);
  });
});
