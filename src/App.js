
import React,{useEffect, createContext, useReducer, useContext} from 'react'
import './App.css'
import NavBar from './component/Navbar';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Home from './component/Home'
import Signin from './component/Signin'
import Profile from './component/Profile'
import Signup from './component/Signup'
import CreatePost from './component/CreatePost'
import UserProfile from './component/UserProfile'
import SubscribesUserPosts from './component/SubscribesUserPosts'
import {reducer, initialState} from './reducers/userReducer'


export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()

  const {state, dispatch} = useContext(UserContext)
  
  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type: "USER", payload: user})
    }
    else {
      navigate('/signin')
    }
  },[])


  return (
    
    <Routes>  
        <Route path="/" element={ <Home /> } />            
        <Route path="/signin" element={ <Signin /> } />                  
        <Route path="/signup" element={ <Signup /> } />              
        <Route exact path="/profile" element={ <Profile /> } />                
        <Route path="/create" element={ <CreatePost /> } />       
        <Route path="/profile/:userid" element={ <UserProfile /> } />       
        <Route path="/myfollwingpost" element={ <SubscribesUserPosts /> } />       
    </Routes>
   
  )
}


function App() {

  // initial State {User} 
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter> 
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
