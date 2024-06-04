import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../utils/ApiRoutes";
import Contacts from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { useSocketContext } from '../context/socket';

export default function Chat() {
  const navigate = useNavigate(); 
  const [contacts, setContacts] = useState([]);
  const { socket, onlineUsers } = useSocketContext();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem('register-user');
      if (user && user !== 'undefined') {
        setCurrentUser(JSON.parse(user));
        setIsLoaded(true);
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, onlineUsers]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const token = localStorage.getItem('jwt');
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setContacts(response.data);
          } catch (error) {
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
  ${'' /* height: 100vh;
  width: 100vw; */}
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #770000;

  .container {
    height: calc(100vh - 5rem);
    width: 80vw;
    background-color: #FFFFFF;
    display: grid;
    grid-template-columns: 25% 75%;
    padding: 1rem;
    border-radius: 0.7rem;
    @media screen and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
      width: 100%;
    }
    @media screen and (max-width: 720px) {
      margin-left: 0;
      width: calc(100vw); // Full width on small screens
    }
  }
`;
