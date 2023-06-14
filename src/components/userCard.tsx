import React from "react";
import { Link } from "react-router-dom";
type userProp = {
    user: {id: number, name: string, city: string, country: string, tagline: string, price: number, portrait: string}
} 

export default function userCard(props: userProp){
    const user = props.user
    const photo = user.portrait
    return <Link to='./Photographer' state={user.id} className="userCard">
        <div className="userPhoto"><img src={user.portrait}/></div>
        <div className="userName">{user.name}</div>
        <div className="userLocation">{user.city}, {user.country}</div>
        <div className="userDescription">{user.tagline}</div>
        <div className="userRates">{user.price}€/jour</div>
    </Link>
}