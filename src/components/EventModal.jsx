import { format } from "date-fns"

const EventModal = ({selectedDate, events, handleAddEvent, newEvent, setNewEvent, setModalOpen})=>{
  return(
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
  )
}

export default EventModal