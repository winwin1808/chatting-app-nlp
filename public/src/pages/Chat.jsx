import React, { useEffect, useState, useRef } from "react"; import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/ApiRoutes";
import Contacts from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
export default function Chat() {
  const navigate = useNavigate(); // Define the navigate function
  const [contacts, setContacts] = useState([]);
  const socket = useRef();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem('register-user');
      if (user) {
        setCurrentUser(JSON.parse(user));
        setIsLoaded(true);
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data);
          } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #770000;

  .container {
    height: 85vh; 
    width: 85vw;
    background-color: #FFFFFF;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      border-radius: 0.6rem;
      grid-template-columns: 35% 65%;
    }
  }
`;
