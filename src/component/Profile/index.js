import styles from './Profile.module.css'
import React, {useEffect, useState, useContext, useRef} from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'

const Profile = () => {
    const [myPic, setPic] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const titleImage = useRef()

    useEffect(() => {
        fetch('/mypost', {
            method:"GET",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(data => {
            setPic(data.mypost)
        })
        .catch(err => {
            console.log(err)
        })
    },[])
    useEffect(() => {
        if(image) {
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
                   
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer "+localStorage.getItem('jwt')
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                    .then(res => res.json())
                    .then(result => {
                       
                        localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
                        dispatch({type:"UPLOADAVATART", payload:result.pic})
                        titleImage.current.value = ""
                        // window.location.reload()
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err)
                })  
        }
       
    },[image])

    const updateAvatar = (file) => {
        setImage(file)
    }

    return (    

        <div style={{maxWidth: "750px", margin: "0 auto"}}>
            <div className="user-info">
                <div>
                    <img src={state? state.pic:"Loading..."} style={{width:"180px",height: "180px",borderRadius: "100%", objectFit:"cover"}} alt="" />
                </div>
                <div>
                    <h2 className={styles.profileName}>{state? state.name: "Loading..."}</h2>
                    <span >{state? state.email: "Loading..."} </span>
                    <div  className="mt-4 d-flex justify-content-between" style={{width: "110%"}}>
                        <h5 >{myPic?myPic.length: "Loading..."} 
                            <span className={styles.quantityFollow}> posts</span> 
                        </h5>
                        <h5>{state? state.followers.length: "Loading..."} <span className={styles.quantityFollow}>Người theo dõi</span> </h5>
                        <h5>{state? state.following.length: "Loading..."} <span className={styles.quantityFollow}>Đang theo dõi</span> </h5>   
                    </div>
                    <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Avatar</span>
                        <input type="file"
                            onChange={(e) => 
                                {
                                    updateAvatar(e.target.files[0])
                                }}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" ref={titleImage}/>
                    </div>
                </div>
                </div>
               
            </div>
            
                <div className="row mt-4">
                    {myPic.map(pic => {
                        return(
                            <div key={pic._id} className="col-lg-4 col-md-6 mb-4">
                                <img className={`card-img-top `} src={pic.photo} alt={pic.title} style={{height: "100%", objectFit:"cover"}}/>
                            </div>
                        )
                    })}
                </div>
        </div>
    )
}

export default Profile