import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';
import { GoogleLogin } from 'react-google-login';
import {gapi} from 'gapi-script'
import axios from 'axios';
import Brand from './Brand';
import BurgerMenu from './BurgerMenu';
import CollapseMenu from './CollapseMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './googlebtn.css'


const id="71502030561-46lketd7462acrmen2kdl3dhhkjqke35.apps.googleusercontent.com";

const Navbar = (props) => {
  const barAnimation = useSpring({
    from: { transform: 'translate3d(100%, 0, 0)' },
    transform: 'translate3d(0, 0, 0)',
  });

  const linkAnimation = useSpring({
    from: { transform: 'translate3d(0, 30px, 0)', opacity: 0 },
    to: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    delay: 800,
    config: config.wobbly,
  });

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
    <>
    <NavBar style={barAnimation}>
      <FlexContainer>
        <Brand />
        <NavLinks style={linkAnimation}>
          <a href="/">Event</a>
          <a href="/">Gallery</a>
          <a href="/">About US</a>
          <a href="/">Contact US</a>
          <GoogleLogin
            clientId={id}
            buttonText={loggedIn ? "Logout" : "Login with Google"}
            onSuccess={loggedIn ? handleLogout : handleLogin}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={false}
            style={{ transform: 'translateY(-3px)' }}
            className="custom-google-login-button"
          />
          </NavLinks>
          <BurgerWrapper>
            <BurgerMenu
              navbarState={props.navbarState}
              handleNavbar={props.handleNavbar}
            />
          </BurgerWrapper>
        </FlexContainer>
      </NavBar>
      <CollapseMenu
        navbarState={props.navbarState}
        handleNavbar={props.handleNavbar}
      />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Navbar;

const NavBar = styled(animated.nav)`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: rgb(64,113,141);
  z-index: 1;
  font-size: 1.4rem;
  color: #000080;
  height: 6.4rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  margin: auto;
  padding: 0 2rem;
  justify-content: space-between;
  height: 5rem;
`;

const NavLinks = styled(animated.ul)`
  justify-self: start;
  list-style-type: none;
  margin: auto 0;
  @media (max-width: 768px) {
    display: none;
  }
  & a {
    color: rgb(217,221,223);
    text-transform: uppercase;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    margin: 0 1.5rem;
    transition: all 300ms linear 0s;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: #fdcb6e;
      border-bottom: 1px solid #fdcb6e;
    }

  }
`;

const BurgerWrapper = styled.div`
  margin: auto 0;
  @media (min-width: 769px) {
    display: none;
  }
`;
