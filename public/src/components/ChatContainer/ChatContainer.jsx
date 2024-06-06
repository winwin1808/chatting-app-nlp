import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import RatingModal from './Rating';
import axios from 'axios';
import { sendMessageRoute, receiveMessageRoute, sendRatingRoute, getRatingRoute } from '../../utils/ApiRoutes';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessagesAndRatings = async () => {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const [messageResponse, ratingResponse] = await Promise.all([
            axios.post(`${receiveMessageRoute}/${currentChat._id}`, null, { headers: { Authorization: `Bearer ${token}` } }),
            axios.post(`${getRatingRoute}/${currentChat._id}`, null, { headers: { Authorization: `Bearer ${token}` } })
          ]);


          const mappedMessages = messageResponse.data.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
            time: moment(message.createdAt).format('LT'),
          }));

          const mappedRatings = ratingResponse.data.map((rating) => ({
            ...rating,
            fromSelf: currentUser._id === rating.sender,
            message: `Rating: ${rating.star} stars, Review: ${rating.content}`,
            time: moment(rating.createdAt).format('LT'),
          }));

          const combinedData = [...mappedMessages, ...mappedRatings];

          combinedData.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));

          setMessages(combinedData);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchMessagesAndRatings();
  }, [currentChat, currentUser]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => setArrivalMessage({ ...msg, fromSelf: false, time: moment(msg.createdAt).format('LT') });
      const handleNewRating = (rating) => setArrivalMessage({
        ...rating,
        fromSelf: false,
        message: `Rating: ${rating.star} stars, Review: ${rating.content}`,
        time: moment(rating.createdAt).format('LT'),
      });

      socket.on('newMessage', handleNewMessage);
      socket.on('newRating', handleNewRating);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('newRating', handleNewRating);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const handleSendMsg = async (msg) => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.post(`${sendMessageRoute}/${currentChat._id}`, { message: msg }, { headers: { Authorization: `Bearer ${token}` } });

      if (socket) {
        socket.emit('send-msg', { receiver: currentChat._id, sender: currentUser._id, message: msg });
      }

      setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg, time: moment().format('LT') }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendRatingRequest = () => handleSendMsg("RATING_REQUEST");

  const handleRatingSubmit = async (rating, content) => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.post(`${sendRatingRoute}/${currentChat._id}`, { star: rating, content: content }, { headers: { Authorization: `Bearer ${token}` } });

      const ratingMessage = {
        message: `Rating: ${rating} stars, Review: ${content}`,
        sender: currentUser._id,
        receiver: currentChat._id,
        fromSelf: true,
        time: moment().format('LT'),
      };

      setMessages((prevMessages) => [...prevMessages, ratingMessage]);

      if (socket) {
        socket.emit('send-rating', ratingMessage);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
    setIsRatingModalOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return currentChat ? (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
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
                  <StyledButton onClick={() => setIsRatingModalOpen(true)} disabled={msg.fromSelf}>
                    {msg.fromSelf ? 'Rating sent' : 'Rating here!'}
                  </StyledButton>
                  <div className="time">{msg.time}</div>
                </div>
              </div>
            ) : (
              <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
                
                <div className="content">
                  <p>{msg.message}</p>
                  <div className="time">{msg.time}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} openRatingModal={handleSendRatingRequest} />
      <RatingModal isOpen={isRatingModalOpen} onRequestClose={() => setIsRatingModalOpen(false)} handleSubmit={handleRatingSubmit} />
    </Container>
  ) : null;
}

const StyledButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #770000;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 0.8rem;

  &:hover {
    background-color: #ff7290;
  }

  &:disabled {
    background-color: #770000;
    color: #e0e0e0;
    cursor: not-allowed;
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
      .time {
          font-size: 0.6rem;
          color: #888;
          padding-top: 0.3rem;
        }
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 0.8rem;
        border-radius: 0.25rem;
        color: #000000;
        position: relative;

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
        .time {
          justify-content: flex-end;
        }
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
