import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){

    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/');
    }

    const handleSignIn = () => {
        localStorage.clear();
        navigate('/signin')
    }

    return <div id="header">
        <Link to='/'><img src={require('../assets/logo.png')}/></Link>
        {localStorage.getItem('token')? 
            (<div className="headerButtons">
                <div className="headerButton" onClick={() => {navigate('/redirect')}}>
                    <i className="fa-solid fa-user"/>
                    Profile
                </div>
                <div className="headerButton" onClick={handleSignOut}>
                    <i className="fa-solid fa-right-from-bracket"/>
                    Sign out
                </div>
            </div>):
            (<div className="headerButtons">
                <div className="headerButton" onClick={handleSignIn}>
                    <i className="fa-solid fa-right-to-bracket"/>
                    Sign in
                </div>
            </div>)
        }
    </div>
}