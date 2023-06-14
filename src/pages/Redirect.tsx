import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Redirect(){
    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        navigate('/photographer', {state: localStorage.getItem('userId')});
    })
    
    return <div>

    </div>
}