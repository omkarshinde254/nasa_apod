import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import setDateCtr from './pages/ApodHome'
import { useSelector, useDispatch } from "react-redux";
import { updateCtr } from './actions';

const MyDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();
  const count = useSelector((state) => state);

  const isFutureDate = (date) => {
    return date <= new Date();
  };

  const handleDateChange = (date) => {
    var timeDifference = new Date().getTime() - date.getTime();
    var dayDifference = timeDifference / (1000 * 3600 * 24);
    // setDateCtr(previousCount => dayDifference);
    // console.log("Day Difference: ", dayDifference)
    let roundedCount = -1 * Math.round(dayDifference);
    if (roundedCount >= 0){
      dispatch(updateCtr(0));
      setSelectedDate(new Date());
    }
    else {
      dispatch(updateCtr(-1 * Math.round(dayDifference)));
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    var today = new Date();
    today.setDate(today.getDate() + count);

    // var day = today.getDate();
    // var month = today.getMonth() + 1; // Months are zero-based
    // var year = today.getFullYear();

    // var formattedDate = day + "/" + month + "/" + year;
    // console.log(formattedDate);
    setSelectedDate(today);
  }, [count]);

  return (
    <div className="w-full max-w-xs">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMM dd, yyyy"
        placeholderText="Select a date"
        // className="w-full border border-blue-500  bg-[#a1a1aa] rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        className="w-full border border-[#393E46]  bg-[#e4e4e7] rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        filterDate={isFutureDate}
      />
    </div>
  );
};

export default MyDatePicker;