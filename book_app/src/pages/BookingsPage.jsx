import { useEffect } from "react";
import AccountNav from "../AccountNav";
import { useState } from "react";
import axios from "axios";
import PlaceImg from "../Placeimg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import Bookingdates from "../Bookingdates";
export default function BookingsPage() {
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        axios.get("/bookings").then(response => {
            setBookings(response.data)
        })
    }, [])
    return (
        <div>
            <AccountNav />
            <div>
                {bookings?.length > 0 && (
                    bookings.map(booking => {
                        return (
                            <Link to={`/account/booking/${booking._id}`}
                             className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                                <div className="w-48">
                                    <PlaceImg place={booking.place} />
                                </div>
                                <div className="py-3 pr-3 grow ">
                                    <h2 className="text-xl">{booking.place.title}</h2>
                                    <Bookingdates booking={booking} />
                                    <div>
                                        {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights <br />
                                        Total price:${booking.price}
                                    </div>
                                </div>
                            </Link>
                        )

                    })
                )}
            </div>
        </div>
    )
}