import React, {useState, useEffect} from 'react'
import M from 'materialize-css'
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const navigate = useNavigate()

    // when url change -> post info title,body,image to server
    useEffect(() => {
        if(url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+localStorage.getItem('jwt') // take token of user in localStorage 
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.error) {
                    M.toast({html: data.error, classes: 'rounded #f50057 pink accent-3'})
                }
                else {
                    M.toast({html: 'Create Post successfully', classes: 'rounded #2e7d32 green darken-3'})
                    navigate('/')
                }
            })
            .catch(err =>{
                console.log(err)
            })    
        }
    },[url])

    // post image to cloudinary
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dhzbsq7fj")
        fetch("https://api.cloudinary.com/v1_1/dhzbsq7fj/image/upload",{
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                // if(data.error) {
                //     M.toast({html: data.error.message, classes: 'rounded #f50057 pink accent-3'})
                // }
                // else {
                //     console.log(data)
                //     setUrl(data.url)
                // }
                console.log("data post ", data);
            })
            .catch(err => {
                console.log(err)
            })  
    }
    console.log('image upload: ', image);
    return (
        <div className="card input-filed" style={{margin: "26px auto", maxWidth: "600px", padding: "16px"}}>
            <input type={"text"} placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input type={"text"} placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1 btn-submit-post"
                onClick={() =>postDetails() }
            >Submit Post</button>
        </div>
    )
}

export default CreatePost
