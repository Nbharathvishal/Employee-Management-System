

export const getWorkingDaysInMonth = (
  year: number,
  month: number // 0-based (Jan = 0)
): number => {
  let workingDays = 0;
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      workingDays++;
    }
    date.setDate(date.getDate() + 1);
  }

  return workingDays;
};

// src/utils/date.utils.ts

export const isNewMonth = (lastReset: Date | null): boolean => {
  if (!lastReset) return true;

  const now = new Date();

  return (
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  );
};

