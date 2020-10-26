import React, { useState } from 'react'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
function Datefce() {
    const [data, setData] = useState(new Date());
    return (
        <div>
            <div className="mb-3">
                <div>           
                    Date Of Birth <DatePicker showPopperArrow={false} placeholderText="Select Date" selected={data} onChange={date => setData(date)} />
                </div>
            </div>
        </div>
    )
}

export default Datefce;