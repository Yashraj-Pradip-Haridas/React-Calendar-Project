import { format } from "date-fns"
const  MonthNavBar = ({ handlePrevMonth, handleNextMonth, currentDate })=>{
    return(
        <div className="flex justify-around items-center mb-4 w-1/2 mb-6 justify-self-center border-b-2 p-2 mt-3">
        <button onClick={handlePrevMonth} className="bg-gray-300 px-2 py-1 rounded">Previous</button>
        <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth} className="bg-gray-300 px-2 py-1 rounded">Next</button>
    </div>
    )
}
export default MonthNavBar