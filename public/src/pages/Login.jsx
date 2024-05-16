import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/ApiRoutes";

function Login() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  useEffect(() => {
    if (localStorage.getItem('register-user')) {
      navigate("/");
    }
  }, []);

  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      console.log("111",data);
      if (data.status === 400) {
        toast.error(data.message, toastOptions);
      }
      if (data.status === 200) {
        localStorage.setItem('register-user',JSON.stringify(data.user));
      }
      navigate('/');
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (password  === "") {
      toast.error(
        "Email and password should not be empty.",
        toastOptions
      );
      return false;
    } else if (username.length === "") {
      toast.error(
        "Email and password should not be empty.",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt='Logo' />
            <h1>Chatting App</h1>
          </div>
          <input
            type="text"
            placeholder='Username'
            name='username'
            onChange={e => handleChange(e)}
            min="3" />
          <input
            type="password"
            placeholder='Password'
            name='password'
            onChange={e => handleChange(e)} />

          <button type='submit'>Login</button>

          <span>Already have account? <Link to="/register">Register</Link>

          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #ffffff;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #00176B;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 2rem;
    flex-wrap: wrap;
    background-color: #FFFFFF;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.05rem solid #770000;
    border-radius: 0.3rem;
    color: #00176B;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #FF9AB2;
      outline: none;
    }
  }

  button {
    background-color: #770000;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    
    cursor: pointer;
    border-radius: 0.3rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #B63E3E;
    }
  }

  span {
    color: #A5A5A5;
    text-transform: uppercase;
    a {
      color: #770000;
      text-decoration: none;
    }
  }
  
`;
export default Login