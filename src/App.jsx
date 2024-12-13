import './App.css';
import { format, addMonths, subMonths } from "date-fns";
import { useState } from "react";
import { generateCalendar } from './components/Calendar';
import MonthNavBar from './components/MonthNavBar';
import CalendarComp from './components/CalendarComp';
import { exportEvents } from './components/Exports';
import EventModal from './components/EventModal';
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
// --------------------------------------------

const handleDeleteEvent = (startTime, endTime) => {
  // Find the correct date string format
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Create a copy of the events for the selected date
  const updatedEvents = [...(events[formattedDate] || [])];

  // Filter out the event with the matching start and end time
  const filteredEvents = updatedEvents.filter(
    (event) => event.startTime !== startTime || event.endTime !== endTime
  );

  // Update the events state
  // You should update the state with the filtered events for the selected date
  const updatedEventsObj = {
    ...events,
    [formattedDate]: filteredEvents,
  };
  
  setEvents(updatedEventsObj);  // Assuming you have a setEvents function to update the state
};

// ----------------------------------------------------------
  return (
    <>
      <div className="p-5">
        <h1 className="text-xl font-bold mb-4 text-center">My Calendar</h1>

        {/* Month navigation bar */}
        <MonthNavBar handlePrevMonth = {handlePrevMonth} handleNextMonth = {handleNextMonth} currentDate = {currentDate}></MonthNavBar>



        {/* Days of the week header */}
        <div className="grid grid-cols-7 gap-2 w-1/2 text-center font-bold justify-self-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-gray-700">{day}</div>
          ))}
        </div>


        {/* Actual calendar grid */}
        <CalendarComp handleDateClick = {handleDateClick} calendarDays ={calendarDays} events = {events} month = {month}></CalendarComp>
        
        {/* Export buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => exportEvents("JSON", currentDate,events)} className="bg-blue-500 text-white px-4 py-2 rounded">Export JSON</button>
          <button onClick={() => exportEvents("CSV", currentDate, events)} className="bg-green-500 text-white px-4 py-2 rounded">Export CSV</button>
        </div>

        {/* Event Modal */}
        {modalOpen && <EventModal selectedDate={selectedDate} events={events} handleAddEvent={handleAddEvent} newEvent={newEvent} setNewEvent={setNewEvent} setModalOpen={setModalOpen} handleDeleteEvent={handleDeleteEvent}></EventModal>}
      </div>
      </>
    );
  }

  export default App;

// The following code is the incomplete version of the drag and drop feature of the  tasks in the calendar

    // // Handle drag-and-drop functionality
  // const onDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const [sourceDate, sourceIndex] = result.source.droppableId.split("_");
  //   const destinationDate = result.destination.droppableId;

  //   const sourceEvents = [...(events[sourceDate] || [])];
  //   const destinationEvents = [...(events[destinationDate] || [])];

  //   const [movedEvent] = sourceEvents.splice(sourceIndex, 1);
  //   destinationEvents.splice(result.destination.index, 0, movedEvent);

  //   setEvents((prevEvents) => ({
  //     ...prevEvents,
  //     [sourceDate]: sourceEvents,
  //     [destinationDate]: destinationEvents,
  //   }));
  // };

          {/* Calendar grid with drag-and-drop */}
        {/* <DragDropContext onDragEnd={onDragEnd}>
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
        </DragDropContext> */}
