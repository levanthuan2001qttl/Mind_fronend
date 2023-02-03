import styles from './Signup.module.css'
import React from 'react'
import { useState,useRef , useEffect} from 'react'
import {Link } from 'react-router-dom'
import M from 'materialize-css'
import { useNavigate } from "react-router-dom";
const Signup = () => {


    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState('')
    const [url, setUrl] = useState(undefined)
    const inputEmail = useRef()

    useEffect(() => {
        if(url) {
            uploadFields()
        }
    },[url])

    const uploadAvatar = () => {
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
                if(data.error) {
                    M.toast({html: data.error.message, classes: 'rounded #f50057 pink accent-3'})
                }
                else {
                    setUrl(data.url)
                }
            })
            .catch(err => {
                console.log(err)
            })  
    }

    const uploadFields = () => {
        if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            M.toast({html: 'Invalid Email', classes: 'rounded #f50057 pink accent-3'})
            inputEmail.current.value = ""
            return
        }

        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    M.toast({html: data.error, classes: 'rounded #f50057 pink accent-3'})
                }
                else {
                    M.toast({html: data.message, classes: 'rounded #2e7d32 green darken-3'})
                    navigate("/signin");
                }
            })
            .catch(err =>{
                console.log(err)
            })
    }
    const postData = () => {

        if(image) {
            uploadAvatar()
        }else {
            uploadFields( )
        }
       
    }

    return ( 
        <div className="my-card">
            <div className="card auth-card">
                <h2>Minds</h2>
                <input type="text" placeholder="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input type="text" placeholder="email"
                    ref={inputEmail}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input type="password" placeholder="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Avatar</span>
                        <input type="file"
                            onChange={(e) => 
                                {
                                    setImage(e.target.files[0])
                                }}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light auth-btn"
                    onClick={() => postData()}
                >Register
                </button>
                <Link to="/signin" >Already have an Account</Link>
            </div>
        </div>
    )
}

export default Signup