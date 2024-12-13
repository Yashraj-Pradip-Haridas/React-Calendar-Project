 import { format } from "date-fns";
 import {saveAs} from "file-saver"
 // Export events to JSON or CSV
  const exportEvents = (formatType, currentDate, events) => {
    const monthKey = format(currentDate, "yyyy-MM");
    const monthEvents = Object.keys(events)
      .filter((key) => key.startsWith(monthKey))
      .reduce((acc, key) => ({
        ...acc,
        [key]: events[key],
      }), {});

    if (formatType === "JSON") {
      const blob = new Blob([JSON.stringify(monthEvents, null, 2)], { type: "application/json" });
      saveAs(blob, `${monthKey}-events.json`);
    } else if (formatType === "CSV") {
      const csvRows = ["Date,Event Name,Start Time,End Time,Type"];
      Object.entries(monthEvents).forEach(([date, dayEvents]) => {
        dayEvents.forEach(({ name, startTime, endTime, type }) => {
          csvRows.push(`${date},${name},${startTime},${endTime},${type}`);
        });
      });
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      saveAs(blob, `${monthKey}-events.csv`);
    }
  };

  export {exportEvents}