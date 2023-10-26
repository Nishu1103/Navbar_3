import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { GoogleLogin } from 'react-google-login';
import {gapi} from 'gapi-script';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './googlebtn.css'

const id="71502030561-46lketd7462acrmen2kdl3dhhkjqke35.apps.googleusercontent.com";

const CollapseMenu = (props) => {
  const { open } = useSpring({
    open: props.navbarState ? 1 : 0,
    config: { duration: 900 },
  });

  const toggleShape = () => {
    if (props.navbarState) {
      return '100%';
    } else {
      return '0% 0% 0% 0%';
    }
  };
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
  };

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
    
  };

  return (
    <CollapseWrapper
      style={{
        borderRadius: open.interpolate({
          range: [0, 1],
          output: [toggleShape(), '0% 0% 100% 50%'],
        }),
        transform: open.interpolate({
          range: [0, 1],
          output: ['translateX(100%)', 'translateX(0%)'],
        }),
        width: open.interpolate({
          range: [0, 1],
          output: ['33%', '55%'],
        }),
      }}
    >
      <NavLinks>
        <li>
          <a href="/" onClick={props.handleNavbar}>
            Event
          </a>
        </li>
        <li>
          <a href="/" onClick={props.handleNavbar}>
          Gallery
          </a>
        </li>
        <li>
          <a href="/" onClick={props.handleNavbar}>
            About US 
          </a>
        </li>
        <li>
          <a href="/" onClick={props.handleNavbar}>
            Contact US
          </a>
        </li>
        {/* <GoogleLogin
            clientId={id}
            buttonText={loggedIn ? "Logout" : "Login with Google"}
            onSuccess={loggedIn ? handleLogout : handleLogin}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={false}
            style={{ transform: 'translateY(-3px)' }}
            className="custom-google-login-button"
          /> */}
    </NavLinks>
    <>
      {/* <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar /> */}
    </>
  </CollapseWrapper>
  );
};

export default CollapseMenu;

const CollapseWrapper = styled(animated.div)`
  background: rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  right: 0;
  width: 55%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateX(100%);
`;

const NavLinks = styled(animated.ul)`
  list-style-type: none;
  padding: 1rem;
  text-align: center;

  li {
    margin-bottom: 0.5em;
    transition: all 300ms linear 1s;

    a {
      font-size: 2rem;
      line-height: 2;
      color: #222;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      font-weight: bold;
      font-family: 'Montserrat', sans-serif;

      &:hover {
        color: rgb(217,221,223);
        border-bottom: 1px solid rgb(217,221,223);
      }
      @media (max-width: 600px) {
        font-size: 2rem
      }
    }
  }
`;