import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from 'react-icons/fa';
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/ApiRoutes";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem("register-user")
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <FaPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #770000;
  border: none;
  cursor: pointer;
  position: left;   
  svg {
    font-size: 1.3rem;
    color: #FFFFFF;
  }
  &:hover {
    background-color: #FF9AB2;
  }
  svg {
    font-size: 1.3rem;
    color: #FFFFFF;
  }
`;