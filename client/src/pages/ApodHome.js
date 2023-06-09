import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';
import MyDatePicker from "../DatePicker";
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { Spinner } from "@material-tailwind/react";
import { CloudDownloadIcon } from '@heroicons/react/solid';
import nasalogo from "../img/nasa.png"
import nasadefault from "../img/nasalogo.png"
import { useSelector, useDispatch } from "react-redux";
import { decrementCtr, incrementCtr } from "../actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApodHome = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [apodData, setApodData] = useState({ "T": "M" });
    // const [count, setDateCtr] = useState(() => { return 0 });
    const [loading, setLoading] = useState(false);
    const count = useSelector((state) => state);
    const dispatch = useDispatch();
    // console.log("My Date Counter--> ",myDateCounter);

    async function download_img(url) {
        // M.toast({ html: 'Downloading ...', classes: 'green black-text' })
        toast.success('Downloading ...', {
            position: "top-left",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        const name = url.split('/').pop();
        // console.log(name);
        let proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
        // let proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
        let blob = await fetch(proxyUrl + url).then((r) => r.blob());
        saveAs(blob, name);
    }

    // function incrementDateCtr() {
    //     setDateCtr(prevCount => prevCount + 1);
    //     if (count > 0) {
    //         setDateCtr(prevCount => prevCount - prevCount);
    //     }
    // }

    // function decrementDateCtr() {
    //     setDateCtr(prevCount => prevCount - 1);
    // }

    // To disable forward arrow when date is current date
    useEffect(() => {
        if (count >= 0) {
            // document.getElementById('incDate').setAttribute("disabled", "");
            document.getElementById('incDate').classList.add('disabled-button');
        }
        else {
            // document.getElementById('incDate').removeAttribute("disabled");
            document.getElementById('incDate').classList.remove('disabled-button');
        }
    }, [count]);


    // Api Call
    async function apod() {
        try {
            let fetch_date = new Date()
            fetch_date.setDate(fetch_date.getDate() + count);
            if (fetch_date > new Date()) {
                fetch_date = new Date();
            }

            let offset = fetch_date.getTimezoneOffset();
            fetch_date.setMinutes(fetch_date.getMinutes() - offset);
            let year = fetch_date.getFullYear();
            let month = (fetch_date.getMonth() + 1).toString().padStart(2, "0");
            let day = fetch_date.getDate().toString().padStart(2, "0");
            let estfetch_date = `${year}-${month}-${day}`;
            // console.log(estfetch_date);
            // console.log("Final Fetch Date", fetch_date.toISOString().split('T')[0]);
            setLoading(true);
            const response = await fetch(baseUrl + '/api/nasa_apod?'
                + new URLSearchParams({ date: estfetch_date })
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

            const data = await response.json();
            if (data.media_type == 'video') {
                data.explanation = 'Video is not supported by this app !! Here is the url to the video- \n' + data.url;
                data.url = nasadefault
                data.title = data.title + ' (Video)';
            }
            if (data.status == 'error') {
                data.url = nasadefault
                data.title = 'NASA API looks down !!';
            }

            setApodData(data);
            // console.log("Apod Data",data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { apod(); }, [count]);

    return (
        <div className="flex h-screen bg-[#222831]">
            {/* Part 1 || Image || */}
            <div className="flex flex-grow-0 flex-shrink-0 w-10/12 p-0.5 justify-center items-center h-screen">
                {loading ? <Spinner className="h-16 w-16 text-yellow-500" /> : <img src={apodData.url} alt="" className="w-full h-full" />}
            </div>

            {/* Part 2 || Other Stuff || */}
            <div className="flex-none flex-grow-0 flex-shrink-0 w-2/12 border-s border-l-[#393E46]">
                {/* Logo and Title */}
                <img src={nasalogo} alt="NASA" className="w-auto h-fit pt-4 pl-10 pr-10" />
                {/* <p className="antialiased text-xl font-bold text-center text-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Astronomy Picture of Day</p> */}
                {/* <p className="antialiased text-xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Astronomy Picture of Day</p> */}
                <p className="font-mono antialiased text-xl font-bold text-center text-[#EEEEEE]">Astronomy Picture of Day</p>

                {/* Command Center */}
                <hr className="w-9/10 border-[#393E46] mx-2 mt-6 pb-1" />
                <p className="font-mono antialiased text-xl font-bold text-center text-[#EEEEEE] pb-2">Command Center</p>
                {/* Date Picker */}
                <div className="pl-2 pr-2"> <MyDatePicker /> </div>
                {/* arrow icon */}
                <div className="grid grid-cols-2 pt-2">
                    <div className="flex justify-center">
                        <button className="rounded-l-lg rounded-r-lg bg-blue-400 w-20 h-10 flex items-center justify-center bg-[#00ADB5]" onClick={() => dispatch(decrementCtr())} >
                            <div> <ChevronLeftIcon className="w-6 h-6 text-[#393E46]" /></div>
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button id="incDate" className="rounded-l-lg rounded-r-lg bg-blue-400 w-20 h-10 flex items-center justify-center bg-[#00ADB5]" onClick={() => dispatch(incrementCtr())}>
                            <div> <ChevronRightIcon className="w-6 h-6 text-[#393E46]" /></div>
                        </button>
                    </div>
                </div>
                {/* Arrows done */}

                {/* Description Text */}
                {/* <div> <span className="font-bold">Title: </span>{apodData.title}</div> */}
                {/* <div> <span className="font-bold">CopyRight: </span>{apodData.copyright}</div> */}
                {/* <div> <span className="font-bold">Date: </span>{apodData.date}</div> */}

                {/* Yellow title floating in left */}
                <div>
                    <span className="font-mono antialiased absolute left-0 top-0 pl-2 pt-2 text-[#FFFF00] text-3xl">
                        {loading ? "" : apodData.title}
                    </span>
                </div>

                <hr className="w-9/10 border-[#393E46] mx-1 mt-4" />
                <p className="font-mono antialiased text-xl font-bold text-center text-[#EEEEEE] pb-2 pt-1">Description:</p>
                <div className="h-auto w-9/10 mx-2">
                    <p className="w-9/10 h-56 antialiased text-base text-[#EEEEEE] overflow-x-auto overflow-y-auto whitespace-normal break-words scroll-smooth">{apodData.explanation}</p>
                </div>
                {/* Description Done */}

                {/* Download Button */}
                <div className="flex-col absolute bottom-0 pl-1/2 w-1/6 pb-4">
                    <hr className="w-9/10 border-[#393E46] mx-2 pb-1" />
                    <p className="font-mono antialiased text-xl font-bold text-center text-[#EEEEEE] pb-2">Download Records</p>
                    <div className="flex item-center justify-center">
                        <button className="rounded-lg w-60 h-10 flex items-center justify-center mb-2 font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg hover:bg-gradient-to-r hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500"
                            onClick={() => download_img(apodData.hdurl)}>

                            Download HD <CloudDownloadIcon className="w-6 h-6 pl-1 pt-1" />
                        </button>

                    </div>
                    <div className="flex item-center justify-center">
                        <button className="rounded-lg w-60 h-10 flex items-center justify-center mb-2 font-semibold bg-green-500 text-white hover:bg-green-600"
                            onClick={() => download_img(apodData.url)}>
                            Download <CloudDownloadIcon className="w-6 h-6 pl-1 pt-1" />
                        </button>
                    </div>
                    <hr className="w-9/10 border-[#393E46] mx-2 pt-1 -mb-4" />
                </div>
                {/* Download Button Done */}
            </div>
            <ToastContainer
                position="top-left"
                autoClose={6000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}


export default ApodHome;
