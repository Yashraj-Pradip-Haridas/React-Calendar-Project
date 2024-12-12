import './App.css';
import { startOfMonth, endOfMonth, getDay, subDays, addDays, getDate, format, addMonths, subMonths, isToday, isWeekend } from "date-fns";
import { useState } from "react";
import { saveAs } from "file-saver";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Function to generate the calendar grid dates
function generateCalendar(year, month) {
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

function App() {
  // State for the current year and month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({}); // Store events keyed by date string
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", startTime: "", endTime: "", type: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate the calendar days
  const calendarDays = generateCalendar(year, month);

  // Handle month transitions
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Open modal on date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  // Add event to selected date without overlapping
  const handleAddEvent = () => {
    if (newEvent.name.trim() && newEvent.startTime && newEvent.endTime) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      const dayEvents = events[dateKey] || [];

      const isOverlapping = dayEvents.some(event => {
        return (
          (newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
          (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime)
        );
      });

      if (isOverlapping) {
        alert("The new event's time overlaps with an existing event.");
      } else {
        setEvents((prevEvents) => ({
          ...prevEvents,
          [dateKey]: [...dayEvents, newEvent],
        }));
        setNewEvent({ name: "", startTime: "", endTime: "", type: "" });
        setModalOpen(false);
      }
    }
  };

  // Handle drag-and-drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const [sourceDate, sourceIndex] = result.source.droppableId.split("_");
    const destinationDate = result.destination.droppableId;

    const sourceEvents = [...(events[sourceDate] || [])];
    const destinationEvents = [...(events[destinationDate] || [])];

    const [movedEvent] = sourceEvents.splice(sourceIndex, 1);
    destinationEvents.splice(result.destination.index, 0, movedEvent);

    setEvents((prevEvents) => ({
      ...prevEvents,
      [sourceDate]: sourceEvents,
      [destinationDate]: destinationEvents,
    }));
  };

  // Export events to JSON or CSV
  const exportEvents = (formatType) => {
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

  return (
    <>
      <div className="p-5">
        <h1 className="text-xl font-bold mb-4">My Calendar</h1>

        {/* Month navigation bar */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="bg-gray-300 px-2 py-1 rounded">Previous</button>
          <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={handleNextMonth} className="bg-gray-300 px-2 py-1 rounded">Next</button>
        </div>

        {/* Export buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => exportEvents("JSON")} className="bg-blue-500 text-white px-4 py-2 rounded">Export JSON</button>
          <button onClick={() => exportEvents("CSV")} className="bg-green-500 text-white px-4 py-2 rounded">Export CSV</button>
        </div>

        {/* Days of the week header */}
        <div className="grid grid-cols-7 gap-2 w-1/3 text-center font-bold">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-gray-700">{day}</div>
          ))}
        </div>

        {/* Calendar grid with drag-and-drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-7 gap-2 w-1/3">
            {calendarDays.map((date, i) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const hasEvents = events[dateKey]?.length > 0;
              const isCurrentDay = isToday(date);
              const isWeekendDay = isWeekend(date);

              return (
                <Droppable droppableId={dateKey} key={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      onClick={() => handleDateClick(date)}
                      className={`h-20 w-20 rounded-md p-1 text-center cursor-pointer ${
                        isCurrentDay
                          ? "bg-blue-300 text-white"
                          : isWeekendDay
                          ? "bg-gray-200"
                          : format(date, "MM") === String(month + 1).padStart(2, "0")
                          ? "bg-gray-100"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      <p>{format(date, "d")}</p>
                      {events[dateKey]?.map((event, index) => (
                        <Draggable draggableId={`${dateKey}_${index}`} index={index} key={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mt-1 p-1 rounded text-xs ${
                                event.type === "work"
                                  ? "bg-blue-500 text-white"
                                  : event.type === "personal"
                                  ? "bg-green-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              {event.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>

        {/* Event Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-1/3">
              <h2 className="text-lg font-bold mb-4">Events for {format(selectedDate, "MMMM d, yyyy")}</h2>

              {/* Display existing events */}
              <div className="mb-4">
                {events[format(selectedDate, "yyyy-MM-dd")]?.map((event, index) => (
                  <div key={index} className="p-2 border-b border-gray-200">
                    <p className="font-bold">{event.name}</p>
                    <p>
                      {event.startTime} - {event.endTime} ({event.type})
                    </p>
                  </div>
                )) || <p>No events for this day.</p>}
              </div>

              {/* Add new event form */}
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Event name"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
              </div>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Select type</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  }

  export default App;

