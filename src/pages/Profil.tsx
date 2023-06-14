import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

type SigninForm = {
    fullName: string;
    country: string;
    city: string;
    tagLine: string;
    dailyRate: number;
    file: File | null;
};
  
const initialFormData: SigninForm = {
    fullName: '',
    country: '',
    city: '',
    tagLine: '',
    dailyRate: 0,
    file: null,
};

export default function Profil(props:{url: string}){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem("token")) navigate("/signin");
    }, []);

    const [formData, setFormData] = useState<SigninForm>(initialFormData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
        const formDataWithFile: any = new FormData();
        formDataWithFile.append('fullName', formData.fullName);
        formDataWithFile.append('country', formData.country);
        formDataWithFile.append('city', formData.city);
        formDataWithFile.append('tagLine', formData.tagLine);
        formDataWithFile.append('dailyRate', String(formData.dailyRate));
        formDataWithFile.append('file', formData.file as File);

        const response = await fetch(props.url+'profil', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: formDataWithFile,
        });

        if (response.ok) {
            navigate('/photographer', {state: location.state})
        } else {
            throw new Error('Profile error');
        }
        } catch (error: any) {
            console.error('Error:', error.message);
        }

        setFormData(initialFormData);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const updatedFormData = { ...formData, file };
        setFormData(updatedFormData);
    }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    return <div>
    Hello. Please complete your profile

    <form id="signupForm" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full name</label>
        <input
        type="text"
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        />

        <label htmlFor="country">Country</label>
        <input
        type="text"
        id="country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
        />

        <label htmlFor="city">City</label>
        <input
        type="text"
        id="city"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
        />

        <label htmlFor="tagLine">Tag line</label>
        <input
        type="text"
        id="tagLine"
        name="tagLine"
        value={formData.tagLine}
        onChange={handleChange}
        required
        />

        <label htmlFor="dailyRate">Daily rate</label>
        <input
        type="number"
        id="dailyRate"
        name="dailyRate"
        value={formData.dailyRate}
        onChange={handleChange}
        required
        />

        <label htmlFor="file">Profile Picture</label>
        <input
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png"
        />

        <button type="submit">Update Profile</button>
    </form>
    </div>
}