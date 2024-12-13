// Function to generate the calendar grid dates
import { startOfMonth, endOfMonth, getDay, getDate,subDays,addDays } from "date-fns";
export function generateCalendar(year, month) {
  const startOfMonthDate = startOfMonth(new Date(year, month));
  const endOfMonthDate = endOfMonth(new Date(year, month));

  const daysFromPrevMonth = getDay(startOfMonthDate); // Days from previous month
  const totalDays = getDate(endOfMonthDate); // Total days in the current month

  // Get days from the previous month to fill the grid
  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) =>
    subDays(startOfMonthDate, daysFromPrevMonth - i)
  );

  // Get all days in the current month
  const currentMonthDays = Array.from({ length: totalDays }, (_, i) =>
    addDays(startOfMonthDate, i)
  );

  // Get days from the next month to complete the grid (42 cells total)
  const daysFromNextMonth = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) =>
    addDays(endOfMonthDate, i + 1)
  );

  // Combine all days into a single array
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}
