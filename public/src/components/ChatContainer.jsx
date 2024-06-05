import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from '../components/ChatInput';
import RatingModal from '../components/Rating';
import axios from 'axios';
import { sendMessageRoute, receiveMessageRoute, sendRatingRoute, getRatingRoute } from '../utils/ApiRoutes';
import { v4 as uuidv4 } from 'uuid';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    async function fetchData() {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const messageResponse = await axios.post(
            `${receiveMessageRoute}/${currentChat._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const mappedMessages = messageResponse.data.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
          }));
          

          const ratingResponse = await axios.post(
            `${getRatingRoute}/${currentChat._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const mappedRatings = ratingResponse.data.map((rating) => ({
            ...rating,
            fromSelf: currentUser._id === rating.sender,
            message: `Rating: ${rating.star} stars, Review: ${rating.content}`,
          }));
          
          setMessages([...mappedMessages, ...mappedRatings])
        } catch (error) {
          console.error('Error fetching data:', error);
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
      socket.on('newRating', (rating) => {
        setArrivalMessage({
          ...rating,
          fromSelf: false,
          message: `Rating: ${rating.star} stars, Review: ${rating.content}`,
        });
      });

      return () => {
        socket.off('newMessage');
        socket.off('newRating');
      };
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

  async function handleSendRatingRequest() {
    await handleSendMsg("RATING_REQUEST");
  }

  const handleRatingSubmit = async (rating, content) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        `${sendRatingRoute}/${currentChat._id}`,
        { star: rating, content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ratingMessage = {
        message: `Rating: ${rating} stars, Review: ${content}`,
        sender: currentUser._id,
        receiver: currentChat._id,
        fromSelf: true,
      };

      setMessages((prevMessages) => [...prevMessages, ratingMessage]);

      if (socket) {
        socket.emit('send-rating', ratingMessage);
      }

      console.log('Rating submitted: ', response.data);
    } catch (error) {
      console.error('Error submitting rating: ', error);
    }

    setIsRatingModalOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return currentChat !== undefined ? (
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
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div ref={scrollRef} key={uuidv4()}>
            {msg.message === "RATING_REQUEST" ? (
              <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
                <div className="content">
                  <StyledButton
                    onClick={() => setIsRatingModalOpen(true)}
                    disabled={msg.fromSelf}
                  >
                    {msg.fromSelf ? 'Rating sent' : 'Rating here!'}
                  </StyledButton>
                </div>
              </div>
            ) : (
              <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
                <div className="content">
                  <p>{msg.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} openRatingModal={handleSendRatingRequest} />
      <RatingModal
        isOpen={isRatingModalOpen}
        onRequestClose={() => setIsRatingModalOpen(false)}
        handleSubmit={handleRatingSubmit}
      />
    </Container>
  ) : null;
}

const StyledButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem; /* Match the normal message border radius */
  background-color: #770000; /* Match the normal message background color for sent messages */
  color: white; /* Match the normal message text color */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s; /* Smooth transition for hover effects */
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 0.8rem;

  &:hover {
    background-color: #ff7290; /* Slightly darker shade for hover effect */
  }

  &:disabled {
    background-color: #770000; /* Keep the same background color when disabled */
    color: #e0e0e0; /* Change text color to indicate disabled state */
    cursor: not-allowed; /* Change cursor to not-allowed when disabled */
  }
`;

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
        border-radius: 0.5rem;
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
        border-radius: 0.25rem;
        color: #000000;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #770000;
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

