import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Photo from '../components/Photo';
import AddPhoto from '../components/AddPhoto';
import Carousel from '../components/Carousel';

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

type contactForm = {
    name: string;
    email: string;
    message: string;
}

const initialContactData: contactForm = {
    name: "",
    email: "",
    message: ""
};

type Media = {
    id: number;
    photographerId: number;
    title: string;
    image: string;
    likes: number;
    date: string;
    price: number;
    video?: string;
};

export default function Photographer(props:{url: string}) {

    const navigate = useNavigate();

    const location = useLocation();

    const [addPhoto, setAddPhoto] = useState<boolean>(false);

    const [imgSrc, setImgSrc] = useState<any>();

    const [profil, setProfil] = useState<object | any>(undefined);

    const [photographerId, setPhotographerId] = useState<string>();

    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = async () => {
        try {
        const response = await fetch(
            props.url+'profil/' + location.state,
            {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            }
        );
        const data = await response.json();
        if(data === null) navigate('/profil', {state: localStorage.getItem('userId')});
        if (response.ok) {
            setProfil(data);
            setPhotographerId(data.photographer)
            const imageBuffer = data.file.data.data; 
            const bytes = new Uint8Array(imageBuffer);

            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
            }
            const imageSrc = `data:${data.file.contentType};base64,${btoa(binary)}`;

            setImgSrc(imageSrc);
        }
        } catch (error: any) {
        console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const [media, setMedia] = useState<any[] | undefined>();

    const fetchMedia = async () => {
        try {
        const response = await fetch(
            props.url+'photos/' + location.state,
            {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            }
        );
        const data = await response.json();
        
        if (response.ok) {
            const array: any = [];
            data.forEach((media: any) => {
            const object: any = {};
            object.title = media.title;
            object.likes = media.likes;
            object.date = media.date;
            object.id = media._id;

            const imageBuffer = media.file.data.data;
            const bytes = new Uint8Array(imageBuffer);

            let binary = "";
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const imageSrc = `data:${media.file.contentType};base64,${btoa(binary)}`;
            object.image = imageSrc;
            array.push(object);
            });

            setMedia(array);
            setLoading(false);
            //console.log(array)
        }
        } catch (error: any) {
        console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        fetchMedia()
    },[]);

    const handleAddPhoto = () => {
        setAddPhoto(true);
        setDataFromChild(false);
    };

    const [dataFromChild, setDataFromChild] = useState<any>('');

    const handleChildData = (data: any) => {
        setDataFromChild(data);
    };

    useEffect(() => {
        if(dataFromChild) fetchMedia()
        //console.log(dataFromChild)
    }, [dataFromChild]);

    const [editUser, setEditUser] = useState<boolean>(false);

    const [formData, setFormData] = useState<SigninForm>(initialFormData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
        const formDataWithFile: any = new FormData();
        if(formData.file) formDataWithFile.append('file', formData.file as File);
        if(formData.fullName) formDataWithFile.append('fullName', formData.fullName);
        if(formData.country) formDataWithFile.append('country', formData.country);
        if(formData.city) formDataWithFile.append('city', formData.city);
        if(formData.tagLine) formDataWithFile.append('tagLine', formData.tagLine);
        if(formData.dailyRate) formDataWithFile.append('dailyRate', String(formData.dailyRate));

        const response = await fetch(props.url+'profil', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: formDataWithFile,
        });

        if (response.ok) {
            setEditUser(false);
        } else {
            throw new Error('Profile error');
        }
        } catch (error: any) {
        console.error('Error:', error.message);
        }

        //setFormData(initialFormData);
    };

    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
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
        setContactData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const [contactData, setContactData] = useState<contactForm>(initialContactData);

    const handleContactSubmit = () => {

    }
    const body = document.body;
    const [style, setStyle] = useState<any>();
    const handleContact = () => {
        setStyle({
            display: "block"
        })
        body.style.pointerEvents = "none";
        setContactData(initialContactData);
        setMessage('');
    }
    const closeContact = () => {
        setStyle({
            display: "none"
        })
        body.style.pointerEvents = "auto";
        setContactData(initialContactData);
        setMessage('');
    }
    const [message, setMessage] = useState<string>();
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    //sorting

    const [sortOption, setSortOption] = useState<string>('name');

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        if (value === 'name' || value === 'likes' || value === 'date') {
        setSortOption(value);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [sortOption]);

    const sortMedia = (media: Media[]) => {
        const sortedMedia = [...media];

        sortedMedia.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';
        
            if (sortOption === 'name') {
                aValue = a.title.toLowerCase() || '';
                bValue = b.title.toLowerCase() || '';
            } else if (sortOption === 'likes') {
                aValue = a.likes || 0;
                bValue = b.likes || 0;
            } else if (sortOption === 'date') {
                aValue = new Date(a.date).getTime() || 0;
                bValue = new Date(b.date).getTime() || 0;
            }
        
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            });
        
            return sortedMedia;
        };

    const sortedMedia = media ? sortMedia(media) : null;

    const [filteredArray, setFilteredArray] = useState<any[] | null> ();
    const [target, setTraget] = useState<any>()
    const [diapOn, setDiapOn] = useState<boolean>(false);
    const handleLaunchCarousel = (event: React.MouseEvent<HTMLDivElement>) => {
        setTraget(event.target);
        setDiapOn(true);
    };
    const handleCloseCarousel = () => {
        setDiapOn(false);
    };

    const handleFetchMedia = (event: React.MouseEvent<HTMLDivElement>) => {
        fetchMedia();
    };

    useEffect(() => {
        if(target) {
            setFilteredArray(sortedMedia?.filter((obj: { id: number; }) => obj.id === target.id));
        }
    },[target])

    useEffect(() => {
        //if(filteredArray) console.log("Launch Carousel event:", sortedMedia?.indexOf(filteredArray[0]));
    },[filteredArray])

    return <div>
        {loading? (
            <div className="spinner"></div>
        ):(
            <div>
                <div id='contactModale' style={style}>
                    <form onSubmit={handleContactSubmit}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={contactData.name}
                            onChange={handleChange}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={contactData.email}
                            onChange={handleChange}
                        />

                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={handleMessageChange}
                        />
                    </form>
                    <div id='contactButtons'>
                        <button type='submit' onClick={closeContact}>Send</button>
                        <button onClick={closeContact}>Cancel</button>
                    </div>
                </div>

                <div id='userPage'>
                    {editUser && <div id='editUser'>
                        <form id="updateForm" onSubmit={handleSubmit}>
                            <label htmlFor="fullName">Full name</label>
                            <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={profil.fullName}
                            />

                            <label htmlFor="country">Country</label>
                            <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder={profil.country}
                            />

                            <label htmlFor="city">City</label>
                            <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder={profil.city}
                            />

                            <label htmlFor="tagLine">Tag line</label>
                            <input
                            type="text"
                            id="tagLine"
                            name="tagLine"
                            value={formData.tagLine}
                            onChange={handleChange}
                            placeholder={profil.tagLine}
                            />

                            <label htmlFor="dailyRate">Daily rate</label>
                            <input
                            type="number"
                            id="dailyRate"
                            name="dailyRate"
                            value={formData.dailyRate}
                            onChange={handleChange}
                            placeholder={profil.dailyRate}
                            />

                            <label htmlFor="file" className='fileLabel'>
                                <input
                                className="file"
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleFileChange}
                                accept=".jpg, .jpeg, .png"
                                />
                                <i className="fa-solid fa-square-plus"/>
                                Profile Picture
                                {selectedFile && <p>{selectedFile.name}</p>}
                            </label>

                            {photographerId === localStorage.getItem('userId') && editUser && <div className='editButtons'>
                                <button type='submit'>Save</button>
                                <button onClick={() => setEditUser(false)}>Cancel</button>
                            </div>}
                        </form>
                    </div>}
                    {!editUser && <div id="userInfo">
                        <div id="info">
                            <div className="userName">{profil?.fullName}</div>
                            <div className="userLocation">{profil?.city}, {profil?.country}</div>
                            <div className="tagLine">{profil?.tagLine}</div>
                        </div>
                        <button id="contactButton" onClick={handleContact}>Contactez moi</button>
                        <div className="userPagePhoto userPhoto">
                            <img src={imgSrc}/>
                        </div>
                        {photographerId === localStorage.getItem('userId') && !editUser && <i className="fa-solid fa-pen-to-square" onClick={() => setEditUser(true)}/>}
                    </div>}
                    {photographerId === localStorage.getItem('userId') && <i className="fa-solid fa-square-plus" onClick={handleAddPhoto}/>}
                </div>
                {addPhoto && !dataFromChild && <AddPhoto onChildData={handleChildData}/>}

                <div id="sortOptions">
                    <label htmlFor="sortOption">Sort by:</label>
                    <select id="sortOption" value={sortOption} onChange={handleSortChange}>
                    <option value="name">Name</option>
                    <option value="likes">Likes</option>
                    <option value="date">Date</option>
                    </select>
                </div>

                <div className="gallery">
                    {sortedMedia &&
                    sortedMedia.map((media: any) => {
                        return <Photo key={media.id} media={media} photographerId={photographerId} launchCarousel={handleLaunchCarousel} onFetch={handleFetchMedia} url={props.url} closeCarousel={handleCloseCarousel}/>
                    })}
                </div>
                {diapOn && filteredArray &&  <div>
                    <p id='colseDiapo' onClick={()=>{
                        document.body.style.pointerEvents = "auto";
                        document.body.style.filter= "none";
                        setDiapOn(false)}}>x</p>
                    {sortedMedia && <Carousel media={sortedMedia} index={sortedMedia?.indexOf(filteredArray[0])}/>}
                </div>}
            </div>
        )}
    </div>

}