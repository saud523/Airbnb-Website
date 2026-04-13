import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../Context/ListingContext";
import { userDataContext } from "../Context/UserContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { FaStar } from "react-icons/fa";
import { bookingDataContext } from "../Context/BookingContext";
import { toast } from "react-toastify";

function ViewCard() {
    const navigate = useNavigate();
    const { cardDetails } = useContext(listingDataContext);
    const { userData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);

    if (!cardDetails || !userData) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl">
                Loading...
            </div>
        );
    }

    // States
    const [updatePopUp, setUpdatePopUp] = useState(false);
    const [bookingPopUp, setBookingPopUp] = useState(false);

    // Edit listing states
    const [title, setTitle] = useState(cardDetails?.title || "");
    const [description, setDescription] = useState(cardDetails?.description || "");
    const [rent, setRent] = useState(cardDetails?.rent || "");
    const [city, setCity] = useState(cardDetails?.city || "");
    const [landmark, setLandmark] = useState(cardDetails?.landMark || "");

    const [backEndImage1, setBackEndImage1] = useState(null);
    const [backEndImage2, setBackEndImage2] = useState(null);
    const [backEndImage3, setBackEndImage3] = useState(null);

    const { updating, deleting } = useContext(listingDataContext);

    // Booking states
    const {
        checkIn, setCheckIn,
        checkOut, setCheckOut,
        night, setNight,
        total, setTotal,
        handleBooking, booking
    } = useContext(bookingDataContext);

    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        setMinDate(new Date().toISOString().split("T")[0]);
    }, []);

    // Auto price calculation
    useEffect(() => {
        if (checkIn && checkOut) {
            let inDate = new Date(checkIn);
            let outDate = new Date(checkOut);

            let nights = (outDate - inDate) / (1000 * 60 * 60 * 24);
            setNight(nights);

            if (nights > 0) {
                let serviceFee = cardDetails.rent * 0.07;
                let tax = cardDetails.rent * 0.07;

                setTotal((cardDetails.rent * nights) + serviceFee + tax);
            } else {
                setTotal(0);
            }
        }
    }, [checkIn, checkOut]);

    // ================= UPDATE LISTING =================
    const handleUpdateListing = async () => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("rent", rent);
            formData.append("city", city);
            formData.append("landMark", landmark);

            if (backEndImage1) formData.append("image1", backEndImage1);
            if (backEndImage2) formData.append("image2", backEndImage2);
            if (backEndImage3) formData.append("image3", backEndImage3);

            await axios.post(
                `${serverUrl}/api/listing/update/${cardDetails._id}`,
                formData,
                { withCredentials: true }
            );

            toast.success("Listing Updated!");
            navigate("/");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    // ================= DELETE LISTING =================
    const handleDeleteListing = async () => {
        try {
            await axios.delete(
                `${serverUrl}/api/listing/delete/${cardDetails._id}`,
                { withCredentials: true }
            );
            toast.success("Listing Deleted!");
            navigate("/");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // ================= RENDER UI =================
    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center overflow-auto relative">

            {/* Back Button */}
            <div
                className="w-[50px] h-[50px] bg-red cursor-pointer absolute top-[5%] left-[20px]
                rounded-full flex items-center justify-center"
                onClick={() => navigate("/")}
            >
                <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
            </div>

            {/* Title */}
            <div className="w-[95%] md:w-[80%] mt-10">
                <h1 className="text-[22px] md:text-[30px] font-semibold text-gray-800">
                    In {cardDetails.landMark?.toUpperCase() || ""}, {cardDetails.city?.toUpperCase() || ""}
                </h1>
            </div>

            {/* Images */}
            <div className="w-[95%] md:w-[80%] h-[400px] flex flex-col md:flex-row gap-2 mt-4">
                <div className="w-full md:w-[70%] h-full overflow-hidden border">
                    <img src={cardDetails.image1} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-[30%] flex flex-col gap-2">
                    <img src={cardDetails.image2} className="w-full h-full object-cover" />
                    <img src={cardDetails.image3} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Description */}
            <div className="w-[95%] md:w-[80%] mt-4 text-[20px] font-semibold">
                {cardDetails.title?.toUpperCase() || ""} • {cardDetails.category?.toUpperCase() || ""}
            </div>

            <div className="w-[95%] md:w-[80%] text-gray-700 text-[18px] mt-2">
                {cardDetails.description}
            </div>

            <div className="w-[95%] md:w-[80%] text-[22px] font-semibold mt-3">
                ₹{cardDetails.rent}/day
            </div>

            {/* Buttons */}
            <div className="w-[95%] md:w-[80%] mt-4 flex gap-4">
                {String(cardDetails.host) === String(userData._id) ? (
                    <button
                        className="px-[40px] py-[12px] bg-red text-white rounded-lg"
                        onClick={() => setUpdatePopUp(true)}
                    >
                        Edit Listing
                    </button>
                ) : (
                    <button
                        className="px-[40px] py-[12px] bg-red text-white rounded-lg"
                        onClick={() => setBookingPopUp(true)}
                    >
                        Reserve
                    </button>
                )}
            </div>

            {/* ================= BOOKING POPUP ================= */}
            {bookingPopUp && (
                <div className="w-full min-h-screen absolute top-0 left-0 bg-[#00000060] backdrop-blur-sm
                flex justify-center items-center">
                    
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-[450px] relative">

                        <RxCross2
                            className="w-[30px] h-[30px] absolute -top-4 -right-4 bg-red text-white rounded-full cursor-pointer"
                            onClick={() => setBookingPopUp(false)}
                        />

                        <h2 className="text-xl font-semibold text-center mb-4">Confirm & Book</h2>

                        <label className="text-lg">Check-In</label>
                        <input
                            type="date"
                            min={minDate}
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full border rounded-lg p-2 mb-3"
                        />

                        <label className="text-lg">Check-Out</label>
                        <input
                            type="date"
                            min={minDate}
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full border rounded-lg p-2 mb-3"
                        />

                        <button
                            className="w-full bg-red text-white py-3 rounded-lg mt-4"
                            disabled={booking}
                            onClick={() => handleBooking(cardDetails._id)}
                        >
                            {booking ? "Booking..." : "Book Now"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ViewCard;
