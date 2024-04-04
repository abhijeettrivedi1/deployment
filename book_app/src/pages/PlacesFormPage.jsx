import Perks from "../perks";
import { useEffect, useState } from "react";
import Photosuploader from "../Photosuploader";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
export default function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedphotos, setAddedphotos] = useState([])
    const [description, setDescription] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [perks, setPerks] = useState("")
    const [extraInfo, setExtraInfo] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [maxGuests, setMaxGuests] = useState(1)
    const [price, setPrice] = useState(100)
    useEffect(() => {
        if (!id) return;
        axios.get("/places/" + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedphotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        }).catch(error => {
            console.error("Error fetching place:", error);
        });
    }, [id]);

    function inputheader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>
    }
    function inputdescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }
    function preInput(header, description) {
        return (
            <>
                {inputheader(header)}
                {inputdescription(description)}

            </>
        )
    }
    async function saveplace(e) {
        e.preventDefault()
        const placedata = {
            title,
            address,
            addedphotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        }
        if (id) {
            await axios.put("/places", {
                id,
                ...placedata
            })
        }
        else {

            await axios.post('/places', placedata)

        }
        setRedirect(true)




    }
    if (redirect) {
        return <Navigate to={"/account/places"} />
    }
    return (

        <div>
            <AccountNav />
            <form onSubmit={saveplace}>
                {preInput("Title", "Title for your place.should be short and catchy")}
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="title for example:My place" />
                {preInput("Address", "Address to your place")}
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="address" />
                {preInput("Photos", "More=better")}
                <Photosuploader addedphotos={addedphotos} onChange={setAddedphotos} />

                {preInput("Description", "description of the place")}
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                    name="" id="" cols="30" rows="5"></textarea>
                {preInput("Perks", "select all perks of the place")}
                <Perks selected={perks} onChange={setPerks} />
                {preInput("Extra Info", "house rules ,etc")}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} rows="5"></textarea>
                {preInput("", "")}<h2 className="text-2xl mt-4">Check In&Out Times</h2>
                <p className="text-gray-500 text-sm">add check in and out time</p>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 ">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input value={checkIn} onChange={e => setCheckIn(e.target.value)} type="text" placeholder="14" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input value={checkOut} onChange={e => setCheckOut(e.target.value)} type="text" placeholder="22" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input value={maxGuests} onChange={e => setMaxGuests(e.target.value)} type="number" placeholder="5" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="5" />
                    </div>
                </div>

                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    )
}