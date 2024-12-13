import { format, isToday, isWeekend } from 'date-fns';

const CalendarComp = ({handleDateClick, calendarDays, events, month})=>{
    return(
        <div className="grid grid-cols-7 gap-2 w-1/2 justify-self-center">
          {calendarDays.map((date, i) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const hasEvents = events[dateKey]?.length > 0;
            const isCurrentDay = isToday(date);
            const isWeekendDay = isWeekend(date);
            return (
              <div
                key={i}
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
                  <div
                    key={index}
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
                ))}
              </div>
            );
            })}
        </div>
    )
}

export default CalendarComp