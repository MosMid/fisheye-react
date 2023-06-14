import React, { useState } from "react";

type PhotoForm = {
  title: string;
  date: string;
  likes: number;
  file: File | null;
};

type AddPhotoProps = {
    onChildData: (data: boolean) => void;
};

export default function AddPhoto({onChildData}: AddPhotoProps) {
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const [posted, setPosted] = useState<boolean>(false);

    const [formData, setFormData] = useState<PhotoForm>({
        title: "",
        date: getCurrentDate(),
        likes: 0,
        file: null,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
        const formDataWithFile = new FormData();
        if (formData.file) {
            formDataWithFile.append("file", formData.file);
        }
        formDataWithFile.append("title", formData.title);
        formDataWithFile.append("date", formData.date);
        formDataWithFile.append("likes", String(formData.likes));

        const response = await fetch(
            `http://localhost:3000/api/photos`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formDataWithFile,
            }
        );

        if (response.ok) {
            setPosted(true);
        } else {
            throw new Error("Profile error");
        }
        } catch (error: any) {
        console.error("Error:", error.message);
        }
    };

    const [selectedFile, setSelectedFile] = useState<File>();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFormData((prevData) => ({
            ...prevData,
            file,
        }));
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    function handleClose(){
        onChildData(true)
    }
    return (
    <div id="photoForm">
        {posted? (<div id="posted">
            <p>Photo posted successfuly !</p>
            <button onClick={handleClose}>close</button>
            </div>):(
            <div>
            <form id="addPhotoForm" onSubmit={handleSubmit}>
                <label htmlFor="title">Title </label>
                <input
                    type="text"
                    id="photoTitle"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <p></p>
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
                    Select a photo
                    {selectedFile && <p>{selectedFile.name}</p>}
                </label>

                <div className="editButtons">
                    <button type="submit">Post</button>
                    <button onClick={handleClose}>cancel</button>
                </div>
            </form>
        </div>
        )}
    </div>
  );
}
