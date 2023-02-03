import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import { UserContext } from '../App'
import { useNavigate } from 'react-router'

const NavBar = () => {

    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()

    const renderList = () => {
        if(state) {
            return (
                <>            
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/create">Create Post</Link></li>
                    <li><Link to="/myfollwingpost">My following Posts</Link></li>
                    <button className="btn waves-effect waves-light auth-btn"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            navigate('/signin')
                        }}       
                    >LogOut</button>
                 </>          
            )        
        }
        else {
            return (
                <>            
                    <li><Link to="/signin">Signin</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                </>    
            )  
        }
    }

    return (     
        <nav>
            <div className="nav-wrapper">
                <Link to={state? '/':'/signin'} className="brand-logo left">Minds</Link>
                <ul id="nav-mobile" className="right ">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}
export default NavBar