const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Attendance Logic & Shift Calculation Suite', () => {
  const formatTimeHM = (time) => {
    if (!time) return null;
    return time.slice(0, 5);
  };

  const calculateHours = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return '0.0h';

    const [inH, inM] = formatTimeHM(checkInTime).split(':').map(Number);
    const [outH, outM] = formatTimeHM(checkOutTime).split(':').map(Number);

    const mins = outH * 60 + outM - (inH * 60 + inM);
    return `${(Math.max(mins, 0) / 60).toFixed(1)}h`;
  };

  test('should format HH:MM:SS timestamps to HH:MM', () => {
    assert.equal(formatTimeHM('09:30:45'), '09:30');
    assert.equal(formatTimeHM('18:05:00'), '18:05');
    assert.equal(formatTimeHM(null), null);
    assert.equal(formatTimeHM(undefined), null);
  });

  test('should accurately calculate working shift hours', () => {
    assert.equal(calculateHours('09:00:00', '17:30:00'), '8.5h');
    assert.equal(calculateHours('10:00:00', '18:00:00'), '8.0h');
    assert.equal(calculateHours('09:15:00', '13:45:00'), '4.5h');
  });

  test('should return 0.0h if checkIn or checkOut is missing', () => {
    assert.equal(calculateHours(null, '17:00:00'), '0.0h');
    assert.equal(calculateHours('09:00:00', null), '0.0h');
    assert.equal(calculateHours(null, null), '0.0h');
  });

  test('should determine correct attendance status transitions', () => {
    const getStatus = (checkIn, checkOut) => {
      if (checkIn && checkOut) return 'CHECKED_OUT';
      if (checkIn && !checkOut) return 'CHECKED_IN';
      return 'NOT_CHECKED_IN';
    };

    assert.equal(getStatus(null, null), 'NOT_CHECKED_IN');
    assert.equal(getStatus('09:00:00', null), 'CHECKED_IN');
    assert.equal(getStatus('09:00:00', '17:00:00'), 'CHECKED_OUT');
  });

  test('should identify late check-ins (> 09:30 AM)', () => {
    const isLate = (checkInTime, standardTime = '09:30') => {
      if (!checkInTime) return false;
      const formatted = formatTimeHM(checkInTime);
      return formatted > standardTime;
    };

    assert.equal(isLate('09:15:00'), false);
    assert.equal(isLate('09:30:00'), false);
    assert.equal(isLate('09:45:00'), true);
    assert.equal(isLate('10:15:00'), true);
  });
});
