
import styles from '../Home/Home.module.css'
import React, {useState, useEffect, useContext, useRef}from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
const SubscribesUserPosts = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    // data array post
    const inputComment = useRef();
    console.log(data)
    useEffect(() => {
        
        fetch('/getsubpost', {
            method: "GET",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("data: ", data)
            setData(data.posts)
        })
        .catch(err => {
            console.log(err)
        })

    },[])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            // result: include array get like update likes:[...likes, user._id]
            // Set new DataPosts get like for State DataPosts
            const newData = data.map(post => {
                if(post._id === result._id) { 
                    return result
                } else {
                    return post
                }
            })
            setData(newData)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
             // Set new DataPosts get unlike for State DataPosts
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => {
            console.log(err);
        })

    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
            
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleSubmitComment = (e, id) => {
        e.preventDefault()
        const comment = e.target[0].value
        makeComment(comment, id)
    }


    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers: {
                Authorization: "Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.filter(post => {
                return post._id !== result._id
            })
            setData(newData)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method:"delete",
            headers: {
                Authorization: "Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log("daoxoa:",result)
        })
        .catch(err => {
            console.log(err)
        })
    }   

    return (
        <div className="home">
            
                {
                    data.map(post => {
                    return (
                        <div className={`card ${styles.homeCard}`} key={post._id}>
                            <h5 className={styles.namePost}>
                                <Link to={ post.postedBy._id === state._id  ? "/profile" : `/profile/${post.postedBy._id}`}>{post.postedBy.name}</Link>
                                
                                {post.postedBy._id === state._id &&
                                    <i className="material-icons" style={{float:"right"}}
                                        onClick={() => {
                                            console.log(post._id)
                                            deletePost(post._id)
                                        }}
                                    >delete_sweep</i>
                                }
                                
                            </h5>
                            <div className="card-image">
                               
                                    <Link to={ post.postedBy._id === state._id  ? "/profile" : `/profile/${post.postedBy._id}`}> <img src={post.photo} alt=""/></Link>
                                
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {   post.likes.includes(state._id) ?
                                    (
                                        <i className="material-icons icon-thumb" style={{color:"#424242"}}
                                            onClick={() => 
                                                // send post id to set likes array 
                                                unlikePost(post._id)}
                                        >thumb_down</i>
                                    )
                                    :   
                                    (
                                        <i className="material-icons icon-thumb" style={{color:"#00796b"}}
                                            onClick={() => likePost(post._id)}
                                        >thumb_up</i>
                                    )
                                
                                }    
                                <h6>{post.likes.length} like</h6>
                                <h6  className={styles.titlePost}>{post.title}</h6>
                                <p>{post.body}</p>
                                
                                {post.comments.map((record, index) => {
                                     return (
                                        <div style={{display:"flex", alignItems: "center"}}  key={record._id}>
                                            <div className={styles.showComment} >
                                                <span className={styles.nameComment}>{record.postedBy.name}</span>
                                                <div className={styles.textComment}> 
                                                    <span >{record.text}</span>
                                                </div>
                                            </div>
                                        </div>    
                                     )
                                 })}   

                                <form onSubmit={e => {
                                    handleSubmitComment(e, post._id)
                                }} >
                                    <input type="text" placeholder="Add a comment"
                                        ref={inputComment}
                                    />       
                                </form>
                            </div>
                        </div>
                    )
                })}
                
           
        </div>
    )
}

export default SubscribesUserPosts