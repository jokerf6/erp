export function calTime() {
  const currentDate = new Date();

  // Add 3 hours to the current date
  const threeHoursLater = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
  return threeHoursLater;
}
function getFirstAndLastDayOfMonth(): { firstDay: Date; lastDay: Date } {
  const currentDate = calTime(); // Current date
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of the current month at 00:00:00
  const firstDayOf = new Date(year, month, 1, 0, 0, 0, 0);
  const firstDay = new Date(firstDayOf.getTime() + 2 * 60 * 60 * 1000);

  // Last day of the current month at 23:59:59
  const lastDayOf = new Date(year, month + 1, 0, 23, 59, 59, 999);
  const lastDay = new Date(lastDayOf.getTime() + 2 * 60 * 60 * 1000);

  return { firstDay, lastDay };
}
function getFirstAndLastDayOfYear(): { firstDay: Date; lastDay: Date } {
  const currentDate = calTime(); // Current date
  const year = currentDate.getFullYear();

  // First day of the current year at 00:00:00
  const firstDayOf = new Date(year, 0, 1, 0, 0, 0, 0);
  const firstDay = new Date(firstDayOf.getTime() + 2 * 60 * 60 * 1000);

  // Last day of the current year at 23:59:59
  const lastDayOf = new Date(year, 11, 31, 23, 59, 59, 999);
  const lastDay = new Date(lastDayOf.getTime() + 2 * 60 * 60 * 1000);

  return { firstDay, lastDay };
}
function getFirstAndLastDayOfWeek(): { firstDay: Date; lastDay: Date } {
  const currentDate = calTime(); // Current date
  const currentDayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const firstDayOf = new Date(currentDate);
  const lastDayOf = new Date(currentDate);

  // Calculate the first day of the week (Sunday) at 00:00:00
  firstDayOf.setDate(currentDate.getDate() - currentDayOfWeek);
  firstDayOf.setHours(0, 0, 0, 0);
  const firstDay = new Date(firstDayOf.getTime() + 2 * 60 * 60 * 1000);

  // Calculate the last day of the week (Saturday) at 23:59:59
  lastDayOf.setDate(currentDate.getDate() + (6 - currentDayOfWeek));
  lastDayOf.setHours(23, 59, 59, 999);
  const lastDay = new Date(lastDayOf.getTime() + 2 * 60 * 60 * 1000);

  return { firstDay, lastDay };
}
export function dates(x: string) {
  if (x === "Year") {
    return getFirstAndLastDayOfYear();
  } else if (x === "Month") {
    return getFirstAndLastDayOfMonth();
  } else {
    return getFirstAndLastDayOfWeek();
  }
}
