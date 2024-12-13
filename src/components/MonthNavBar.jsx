import { format } from "date-fns"
const  MonthNavBar = ({ handlePrevMonth, handleNextMonth, currentDate })=>{
    return(
        <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="bg-gray-300 px-2 py-1 rounded">Previous</button>
        <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth} className="bg-gray-300 px-2 py-1 rounded">Next</button>
    </div>
    )
}
export default MonthNavBar