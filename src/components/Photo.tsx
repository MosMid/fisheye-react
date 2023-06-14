import React, { useEffect, useState } from "react";

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
  

type MediaProp = {
    launchCarousel(event: React.MouseEvent<HTMLDivElement, MouseEvent>): unknown; 
    closeCarousel(): unknown; 
    onFetch(event: React.MouseEvent<HTMLDivElement, MouseEvent>): unknown; 
    media: Media;
    photographerId: string | undefined;
    url: string;
};

type likesType = {
    userId: string;
    mediaId: string;
};

export default function Photo(props: MediaProp) {
    const [likes, setLikes] = useState<number>(props.media.likes);
    const [liked, setLiked] = useState<boolean>(false);
    //const [userLikes, setUserLikes] = useState<likesType[]>([]);

    const handleLike = async () => {
        if (localStorage.getItem('token')) {
            try {
                const updatedLikes = liked ? likes - 1 : likes + 1;
                setLikes(updatedLikes);
                setLiked(!liked);
        
                const response = await fetch(props.url + `photos/${props.media.id}`, {
                method: "PUT",
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ likes: updatedLikes }),
                });
        
                if (!response.ok) {
                throw new Error("Failed to update likes");
                }
        
                //console.log("Likes updated successfully");
        
                if (!liked) {
                const likeResponse = await fetch(props.url + `likes`, {
                    method: "POST",
                    headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ mediaId: props.media.id }),
                });
        
                if (!likeResponse.ok) {
                    throw new Error("Failed to add like");
                }
        
                //console.log("Like added successfully");
                } else {
                const unlikeResponse = await fetch(props.url + `likes`, {
                    method: "DELETE",
                    headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ mediaId: props.media.id }),
                });
        
                if (!unlikeResponse.ok) {
                    throw new Error("Failed to delete like");
                }
        
                //console.log("Like deleted successfully");
                }
            } catch (error) {
                console.error("Error updating likes:", error);
            }
        }
    }; 

    const fetchLikes = async () => {
        if(localStorage.getItem('token')){
            try {
                const response = await fetch(props.url+`likes`, {
                    method: "GET",
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                //setUserLikes(data);
                const isMediaIdPresent = data.some((item: { mediaId: any; }) => item.mediaId === props.media.id);
                if(isMediaIdPresent) setLiked(true);
                else setLiked(false);
                if (!response.ok) {
                    throw new Error("Failed to fetch likes");
                }
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        }
    }

    useEffect(() =>{
        fetchLikes()
        props.closeCarousel()
    },[liked]);

    const diapo = document.querySelector("#carousel");
    const launchCarousel = (event: React.MouseEvent<HTMLDivElement>) => {
        props.launchCarousel(event);
    };

    const onFetch = (event: React.MouseEvent<HTMLDivElement>) => {
        props.onFetch(event);
    };

    const deletePhoto = async(event: React.MouseEvent<HTMLParagraphElement>) => {
        const targetElement = event.target as HTMLParagraphElement;
        try {
            const response = await fetch(
                props.url+'photos/' + targetElement.id,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );
            if (response.ok) {
                //console.log('Deleted!')
                onFetch(event)
            }
            } catch (error: any) {
            console.error('Error:', error.message);
        }
    }

    return (
        <div className="photoContainer">
            <div id={props.media.id.toString()} onClick={launchCarousel}>
                <div className="photo">
                    {props.media.image && <img className="toto" src={props.media.image} />}
                </div>
                <div className="photoInfo">
                    {props.media.title}
                    <span>
                    {likes}{" "}
                    {liked ? (
                        <i className="fa-solid fa-heart" onClick={handleLike}/>
                    ) : (
                        <i className="fa-regular fa-heart" onClick={handleLike}/>
                    )}
                    </span>
                </div>
            </div>
            {props.photographerId === localStorage.getItem('userId') && <i className="fa-solid fa-circle-xmark tozz" onClick={deletePhoto} id={props.media.id.toString()}/>}
        </div>
        
    );
}

//
//