import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

type signinForm = {
    email: string,
    password: string
}

const initialFormData = {
    email: "",
    password: ""
}

export default function Signin(props:{url: string}){
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("token")) navigate("/photographer", {state: localStorage.getItem('userId')});
    }, []);

    const [formData, setFormData] = useState<signinForm>(initialFormData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(props.url+'auth/signin', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                const response2 = await fetch(
                    props.url+'profil/' + data.userId,
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    }
                );
                const resp = await response2.json()
                if(resp === null) navigate('/profil', {state: data.userId})
                else navigate('/photographer', {state: data.userId})
                
            } else {
                throw new Error('login error');
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

    return <div id="signin" className="signPage">
        <form id="signinForm" className="signForm" onSubmit={handleSubmit}>

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

            <button type="submit">Sign in</button>
            <p>You don't have an account yet? <Link to='/signup'>Sign up</Link></p>
        </form>
    </div>
}