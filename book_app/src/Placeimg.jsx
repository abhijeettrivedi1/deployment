import React from 'react';

export default function PlaceImg({ place, index = 0, className = null }) {
    if (!place.photos || !place.photos.length) {
        return null; 
    }
    
    className = className || "object-cover";

    return (
        <img className={className} src={"http://localhost:3000/uploads/" + place.photos[index]} alt="" />
    );
}
