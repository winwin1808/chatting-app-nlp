import React, { useState, useEffect } from "react";
import styled from "styled-components";
import welcomeImage from "../../assets/welcome.png";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("register-user"));
        if (data) {
          setUserName(data.username);
        }
      } catch (error) {
        // Handle error
        console.error('Error fetching username:', error);
      }
    };
  
    fetchUserName();
  }, []);
  
  return (
    <Container>
      <img src={welcomeImage} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eeeee4;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #00176B;
  }
`;