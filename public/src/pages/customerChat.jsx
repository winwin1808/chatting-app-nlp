import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { fetchCustomerConversations } from "../services/apiService";
import Contacts from "../components/CustomerChatContainer/Contact";
import Welcome from "../components/CustomerChatContainer/Welcome";
import ChatContainer from "../components/CustomerChatContainer/ChatContainer";
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
        user = JSON.parse(user);
        if (user._id) {
          setCurrentUser(user);
          setIsLoaded(true);
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, onlineUsers]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && currentUser._id) {
        if (currentUser.isAvatarImageSet) {
          try {
            const token = localStorage.getItem('jwt');
            const data = await fetchCustomerConversations(token, currentUser._id);
            // Exclude the current user from the contacts
            const filteredContacts = data.filter(user => user._id !== currentUser._id);
            setContacts(filteredContacts);
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
      {currentUser && currentUser._id ? (
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
      ) : null}
    </>
  );
}

const Container = styled.div`
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
      width: calc(100vw);
    }
  }
`;
