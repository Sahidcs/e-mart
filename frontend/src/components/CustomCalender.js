import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css'; 

const CustomCalendar = ({dateArray}) => {
    const [date, setDate] = useState(new Date());
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                console.log(dateArray[date.getDate()-1]);
                if(dateArray[date.getDate()-1] === "Complete")
                {
                    return "Complete";
                }
                else if(dateArray[date.getDate()-1]==="Pending")
                {
                   return "pending";
                }
                else if(dateArray[date.getDate()-1]==="Incomplete")
                {
                    return "incomplete";
                }
                else{
                    return "free";
                }
            }
            
        }
        return "displaynone";
    };

    return (
        <div>
            <h3>{monthName}</h3>
          <Calendar
            onChange={setDate}
            value={date}
            view="month"
            tileClassName={tileClassName}
            showNavigation={false}
        />
        </div>
        
    );
};

export default CustomCalendar;
