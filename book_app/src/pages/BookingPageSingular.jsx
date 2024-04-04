import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Addresslink from "../Addresslink";
import Placegallery from "../Placegallery";
import Bookingdates from "../Bookingdates";

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null)
    useEffect(() => {
        if (id) {
            axios.get("/bookings").then(response => {
                const foundbooking = response.data.find(({ _id }) => _id === id);
                if (foundbooking) {
                    setBooking(foundbooking);
                }
            })
        }
    }, [id])
    if (!booking) {
        return "";

    }
    return (
        <div className="my-8 ">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <Addresslink className="my-2 block"  >{booking.place.address} </Addresslink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-4">Your bookinh Info:</h2>
                    <Bookingdates booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>
                        Total price
                    </div>
                    <div className="text-3xl">
                        ${booking.price}
                    </div>
                    
                </div>
            </div>
            <Placegallery place={booking.place} />
        </div>
    )
}