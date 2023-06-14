import React from "react";
import { useState } from 'react';

interface PhotoForm {
  title: string;
  price: number;
}

const initialFormData: PhotoForm = {
  title: '',
  price: 0,
};

export default function Dbform(){

    const [formData, setFormData] = useState<PhotoForm>(initialFormData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/photos', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            if (response.ok) {
                const data = await response.json();
                console.log('Saved to database:', data, formData);
            } else {
                throw new Error('Error saving to database');
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
    return <div>
        <form id="Dbform" onSubmit={handleSubmit}>

            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <label htmlFor="price">Price:</label>
            <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
            />

            <button type="submit">Save</button>
        </form>
    </div>
}