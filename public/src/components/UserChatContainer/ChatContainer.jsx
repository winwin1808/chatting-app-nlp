import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import ChatHeader from './ChatHeader';
import moment from 'moment';
import { 
  fetchMessages, 
  sendMessage, 
 } 
from '../../services/apiService';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessagesAndRatings = async () => {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const [messageResponse] = await Promise.all([
            fetchMessages(currentChat._id, token),
          ]);

          const mappedMessages = messageResponse.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
            time: moment(message.createdAt).format('LT'),
          }));
          mappedMessages.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
          setMessages(mappedMessages);

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


  return currentChat ? (
    <Container>
      <ChatHeader currentChat={currentChat} />
      <ChatMessages messages={messages} />
      <ChatInput handleSendMsg={handleSendMsg}/>
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
