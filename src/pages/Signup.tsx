import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type signinForm = {
    email: string,
    password: string
}

const initialFormData = {
    email: "",
    password: ""
}

export default function Signup(props:{url: string}){
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("token")) navigate("/profil");
    }, []);
    if(localStorage.getItem("token")) navigate('/profil');

    const [success, setSuccess] = useState<boolean>(false);

    const [formData, setFormData] = useState<signinForm>(initialFormData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(props.url+'auth/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            if (response.ok) {
                const data = await response.json();
                setSuccess(true);
            } else {
                throw new Error('Sign up error');
            }
        } catch (error: any) {
        console.error('Error:', error.message);
        }
        
        setFormData(initialFormData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    return <div id="signup" className="signPage">
        {success? (<div id="creation"><div>User created !</div>
        <Link to='/signin'>Sign in</Link>
        </div>):(
            <form id="signupForm" className="signForm" onSubmit={handleSubmit}>

            <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
    
                <label htmlFor="password">Password</label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
    
                <button type="submit">Sign up</button>
                <p>You already have an account? <Link to='/signin'>Sign in</Link></p>
            </form>
        )}
    </div>
}