import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from '../components/Logout';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import { sendMessageRoute, receiveMessageRoute } from '../utils/ApiRoutes';
import { v4 as uuidv4 } from 'uuid';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    async function fetchData() {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const response = await axios.post(
            `${receiveMessageRoute}/${currentChat._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const mappedMessages = response.data.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
          }));

          setMessages(mappedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    }
    fetchData();
  }, [currentChat, currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (msg) => {
        setArrivalMessage({
          ...msg,
          fromSelf: false,
        });
      });

      return () => socket.off('newMessage');
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  async function handleSendMsg(msg) {
    try {
      const token = localStorage.getItem('jwt');
      await axios.post(
        `${sendMessageRoute}/${currentChat._id}`,
        { message: msg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (socket) {
        socket.emit('send-msg', {
          receiver: currentChat._id,
          sender: currentUser._id,
          message: msg,
        });
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { fromSelf: true, message: msg },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (currentChat !== undefined) {
    return (
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <Logout />
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
                <div className="content">
                  <p>{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
    );
  }

  return null;
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 0.05rem solid #770000;
    background-color: #ffffff;
    min-height: 3rem;

    .user-details {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      h3 {
        color: #00176b;
        font-size: 0.8rem;
        font-weight: 600 !important;
      }

      .avatar {
        img {
          height: 2.6rem;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 0.8rem;
        border-radius: 3rem;
        color: #000000;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #ff9ab2;
        color: white;
      }
    }

    .received {
      justify-content: flex-start;

      .content {
        background-color: #eeeee4;
        color: black;
      }
    }
  }
`;
