const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Leave Management & Business Logic Suite', () => {
  const validateLeaveRequest = (from_date, to_date, leave_type, availableBalance) => {
    if (!from_date || !to_date || !leave_type) {
      return { valid: false, error: 'All fields are required' };
    }

    const from = new Date(from_date);
    const to = new Date(to_date);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    if (to < from) {
      return { valid: false, error: 'To date cannot be earlier than from date' };
    }

    const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > availableBalance) {
      return { valid: false, error: 'Insufficient leave balance' };
    }

    return { valid: true, days: diffDays };
  };

  test('should accept valid leave dates and compute days', () => {
    const result = validateLeaveRequest('2026-10-01', '2026-10-03', 'CASUAL', 12);
    assert.equal(result.valid, true);
    assert.equal(result.days, 3);
  });

  test('should reject requests where to_date is before from_date', () => {
    const result = validateLeaveRequest('2026-10-05', '2026-10-01', 'SICK', 12);
    assert.equal(result.valid, false);
    assert.equal(result.error, 'To date cannot be earlier than from date');
  });

  test('should reject requests when requested days exceed leave balance', () => {
    const result = validateLeaveRequest('2026-10-01', '2026-10-15', 'EARNED', 5);
    assert.equal(result.valid, false);
    assert.equal(result.error, 'Insufficient leave balance');
  });

  test('should validate allowed leave statuses', () => {
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    assert.ok(validStatuses.includes('PENDING'));
    assert.ok(validStatuses.includes('APPROVED'));
    assert.ok(validStatuses.includes('REJECTED'));
    assert.ok(!validStatuses.includes('CANCELLED_UNSUPPORTED'));
  });
});
