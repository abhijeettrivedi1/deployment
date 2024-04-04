import { useContext, useEffect, useState } from "react"
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Usercontext } from "./usercontext";
export default function BookingWidget({place}) {
    const [checkIn,setCheckIn]=useState("");
    const [checkOut,setCheckOut]=useState("");
    const [numberofguests,setNumberofguests]=useState("")
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("")
    const [redirect,setRedirect]=useState("")
    const {user}= useContext(Usercontext)
    useEffect(()=>{
        if(user){
            setName(user.name)
        }
    },[user])
    let numberofnights=0;
    if(checkIn && checkOut){
        numberofnights=differenceInCalendarDays(new Date (checkOut),new Date (checkIn));
    }
    async function bookthispace(){
        if(checkIn && checkOut && numberofguests && name && phone){
            const data={
                
                place:place._id,
                checkIn:checkIn,
                checkOut:checkOut,
                numberofguests:numberofguests,
                name:name,
                phone:phone,
                price:place.price *numberofnights,
                
            }
            // console.log(data);
            const response=await axios.post("/bookings",data);
            const bookingid=response.data._id;
            // console.log(bookingid)
            setRedirect(`/account/booking/${bookingid}`)
        }
    }
    if(redirect){
        return <Navigate to={redirect}/>
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price:${place.price}/night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4 ">
                        <label htmlFor="">Check in:</label>
                        <input type="date" 
                        value={checkIn} onChange={e=>setCheckIn(e.target.value)} />
                    </div>
                    <div className=" py-3 px-4 border-l">
                        <label htmlFor="">Check out:</label>
                        <input type="date" 
                        value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
                    </div>
                
                </div>
                <div className=" py-3 px-4 border-t">
                    <label htmlFor="">No of guests:</label>
                    <input type="number" 
                     value={numberofguests} onChange={e=>setNumberofguests(e.target.value)} />
                </div>
                {numberofnights>0 && (
                    <div className="py-3 px-4 border-t">
                        <label htmlFor="">Your full name:</label>
                        <input type="text" 
                        value={name}
                        onChange={e=>setName(e.target.value)} />
                        <label htmlFor="">Phone Number:</label>
                        <input type="tel" 
                        value={phone}
                        onChange={e=>setPhone(e.target.value)} />
                    </div>
                )}

            </div>
            <button onClick={bookthispace} className="primary mt-4">Book now
            {numberofnights>0 && (
                <span className="">({numberofnights *place.price}$)</span>
            )}
            </button>
        </div>
    )
}