import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import RatingModal from './Rating';
import ChatMessages from './ChatMessages';
import ChatHeader from './ChatHeader';
import moment from 'moment';
import { 
  fetchMessages,
  fetchRatings, 
  sendMessage, 
  sendRating } 
from '../../services/apiService';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    const fetchMessagesAndRatings = async () => {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const [messageResponse, ratingResponse] = await Promise.all([
            fetchMessages(currentChat._id, token),
            fetchRatings(currentChat._id, token),
          ]);

          const mappedMessages = messageResponse.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
            time: moment(message.createdAt).format('LT'),
          }));

          const mappedRatings = ratingResponse.map((rating) => ({
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
      await sendMessage(currentChat._id, msg, token);

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
      await sendRating(currentChat._id, rating, content, token);

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

  return currentChat ? (
    <Container>
      <ChatHeader currentChat={currentChat} />
      <ChatMessages messages={messages} openRatingModal={() => setIsRatingModalOpen(true)} />
      <ChatInput handleSendMsg={handleSendMsg} openRatingModal={handleSendRatingRequest} />
      <RatingModal isOpen={isRatingModalOpen} onRequestClose={() => setIsRatingModalOpen(false)} handleSubmit={handleRatingSubmit} />
    </Container>
  ) : null;
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
`;
