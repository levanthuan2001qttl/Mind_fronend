import styles from './Signin.module.css'
import React from 'react'
import {Link} from 'react-router-dom'
import { useState, useRef, useContext } from 'react'
import M from 'materialize-css'
import { useNavigate } from "react-router-dom";
import {UserContext} from '../../App'
const Signin = () => {

    const {state, dispatch} = useContext(UserContext)
    console.log(state);
    console.log(dispatch);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const inputEmail = useRef();
    const navigate = useNavigate()
    const postData = () => {
        if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            M.toast({html: 'Invalid Email', classes: 'rounded #f50057 pink accent-3'})
            inputEmail.current.value = ""
            return
        }
        fetch('/signin' , {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email,
                password,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                M.toast({html: data.error, classes: 'rounded #f50057 pink accent-3'})
            }
            else {

                // save token and info user at the localStorage
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user',JSON.stringify(data.user))

                // set State user when Login by reducer
                dispatch({type:"USER", payload: data.user})

                M.toast({html: 'Login successfully', classes: 'rounded #2e7d32 green darken-3'})
                navigate('/')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }


    return (
        <div className="my-card">
            <div  className="card auth-card">
                <h2>Minds</h2>
                <input type="text" placeholder="email"
                    ref={inputEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password" placeholder="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light auth-btn"
                    onClick={() => postData()}
                >Login</button>
                <Link to="/signup" >Don't have an Account</Link>
            </div>
        </div>
    )
}

export default Signin