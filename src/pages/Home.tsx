import React, { useEffect, useState } from "react";
import UserCard from "../components/userCard";

interface Photographer {
    id: number;
    name: string;
    city: string;
    country: string;
    tagline: string;
    price: number;
    portrait: string;
}

export default function Home(props:{url: string}) {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(props.url+`profil`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.ok) {
        const array: Photographer[] = data.map((profil: any) => {
          const imageBuffer = profil.file.data.data;
          const bytes = new Uint8Array(imageBuffer);

          let binary = "";
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const imageSrc = `data:${profil.file.contentType};base64,${btoa(
            binary
          )}`;

          return {
            id: profil.photographer,
            name: profil.fullName,
            city: profil.city,
            country: profil.country,
            tagline: profil.tagLine,
            price: profil.dailyRate,
            portrait: imageSrc
          };
        });
        setPhotographers(array);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return <div id="home">
    {loading? (
      <div className="spinner"></div>
    ):(
      <div>
        <div id="homeTitle">Nos photographes</div>
        <div id="userList">
          {photographers.map(user => (
            <UserCard key={user.name} user={user} />
          ))}
        </div>
      </div>
    )}
  </div>
}