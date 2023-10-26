import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from "styled-components";
import { GoogleLogin } from 'react-google-login';
import {gapi} from 'gapi-script'
import './googlebtn.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const id="926277424753-h8kvjb39evb72q0hmivrbg4dtdrrd3bq.apps.googleusercontent.com";
const Burgermenu = (props) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  
  const handleLogin = (res)=>{
    console.log("Sucess",res);
    console.log("Sucess",res.profileObj.imageUrl);
    setLoggedIn(true); 
    const googleLoginToken = res.tokenId; 

    const requestBody = {
      token: googleLoginToken,
    };
    axios.post('https://promapi.springfest.in/api/user/google_login', requestBody)
    .then(response => {
      let userData = response.data.data;
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log('User data from the API:', userData);
      setUser(userData);
      toast.success("Login successful", {
        className: 'success-toast', 
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  };

  const handleFailure=(res)=>{
    console.log("Fail",res);
  }

  useEffect(()=>{
    function start(){
      gapi.client.init({
        clientId:id,
        scope:""
      })
    };
    gapi.load('client:auth2',start);
  },[]);

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
    toast.success("Logout successful", {
      className: 'success-toast',
    });
  };

  return (
    <div style={{display:'flex'}}>
      {user ? (
      <li style={{display:"flex"}}>
        <div>
          <img
            src={user.imageUrl}
            alt={user.name}
            style={{ width: '20px', height: '20px' }}
          />
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </li>
    ) : (
    <GoogleLogin
            clientId={id}
            buttonText="Login with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            className="custom-google-login-button"
          />)}
    <Wrapper onClick={props.handleNavbar}>
      <div className={ props.navbarState ? "open" : "" }>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
      </div>
    </Wrapper>
    </div>
  );
}

export default Burgermenu;

const Wrapper = styled.div`
  position: relative;
  padding-top: .7rem;
  cursor: pointer;
  display: block;

  & span {
    background: #fdcb6e;
    display: block;
    position: relative;
    width: 3.5rem;
    height: .4rem;
    margin-bottom: .7rem;
    transition: all ease-in-out 0.2s;
  }

  .open span:nth-child(2) {
      opacity: 0;
    }

  .open span:nth-child(3) {
    transform: rotate(45deg);
    top: -11px;
  }

  .open span:nth-child(1) {
    transform: rotate(-45deg);
    top: 11px;
  }

`;