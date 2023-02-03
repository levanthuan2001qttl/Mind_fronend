import styles from './UserProfile.module.css'
import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'


const Profile = () => {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [showFollow, setShowFollow] = useState(true)

    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()

    console.log("post:",posts);
    console.log("user:",user);
    useEffect(() => {
        fetch(`/user/${userid}`, {
            method:"GET",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            
            setUser(result.user)
            setPosts(result.posts)
        })
        .catch(err => {
            console.log(err)
        })
    },[userid])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log("My:",result)
            dispatch({type:"UPDATE", payload:{following:result.following, followers:result.followers }})
            localStorage.setItem("user", JSON.stringify(result))
            setUser(prev => {
                return {
                    ...prev,
                    followers:[...prev.followers, result._id]
                }
            })
           
        })
    }

    const unFollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log("My:",result)
            dispatch({type:"UPDATE", payload:{following:result.following, followers:result.followers }})
            localStorage.setItem("user", JSON.stringify(result))
            setUser(prev => {
                const newFollowers = prev.followers.filter(item => item !== result._id)
                return {
                    ...prev,
                    followers:newFollowers
                }
            })
            
        })
    }

    return (    

        <>  
            {user && posts? 
                <div style={{maxWidth: "750px", margin: "0 auto"}}>
                    <div className="user-info">
                        <div>
                            <img src={user.pic} style={{width:"180px",height: "180px",borderRadius: "100%"}}  alt="" />
                        </div>
                        <div>
                            <h2 className={styles.profileName}>{user.name}</h2>
                            <span>{user.email}</span>
                            <div className="mt-4" style={{display: "flex",justifyContent: "space-between", width: "110%"}}>
                                <h5 >{posts.length} <span className={styles.quantityFollow}>post</span></h5>
                                <h5 >{user.followers? user.followers.length:"loading..."}  <span className={styles.quantityFollow}>Người theo dõi</span></h5>
                                <h5 >{user.following? user.following.length:"loading..."}   <span className={styles.quantityFollow}>Đang theo dõi</span></h5>
                            </div>
                            {
                                user && user.followers.includes(state._id) === true && 
                                <button className="btn waves-effect waves-light auth-btn mt-4"
                                    onClick={() => {
                                        unFollowUser()
                                }}       
                               >UnFollow</button> 
                            }
                            
                            {
                                 user && user.followers.includes(state._id) === false && 
                                <button className="btn waves-effect waves-light auth-btn mt-4"
                                        onClick={() => {
                                            followUser()
                                    }}       
                                >Follow</button>
                            }
                        </div>
                    </div>

                        <div className="row mt-4">
                            {posts.map(item => {
                                return(
                                    <div key={item._id} className="col-lg-4 col-md-6" style={{height: "345px"}}>
                                        <img className={`card-img-top`} src={item.photo} alt={item.title} style={{height: "100%", objectFit:"cover"}}/>
                                    </div>
                                )
                            })}
                        </div>
                </div>
             : <span>Loading ...</span>
            }
        </>
    )
}

export default Profile