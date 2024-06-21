import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import ChatHeader from './ChatHeader';
import moment from 'moment';
import { 
  fetchCustomerMessages, 
  sendCustomerMessage, 
} from '../../services/apiService';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchCustomerMessagesAndRatings = async () => {
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
          const messageResponse = await fetchCustomerMessages(currentChat._id, token);

          const mappedMessages = messageResponse.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender,
            time: moment(message.createdAt).format('LT'),
          }));
          setMessages(mappedMessages);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchCustomerMessagesAndRatings();
  }, [currentChat, currentUser]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => setArrivalMessage({ 
        ...msg, 
        fromSelf: msg.sender === currentUser._id, 
        time: moment(msg.createdAt).format('LT') 
      });

      socket.on('newCustomerMessage', handleNewMessage);
      socket.on('newAgentMessage', handleNewMessage);

      return () => {
        socket.off('newCustomerMessage', handleNewMessage);
        socket.off('newAgentMessage', handleNewMessage);
      };
    }
  }, [socket, currentUser._id]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const handleSendMsg = async (msg) => {
    try {
      const token = localStorage.getItem('jwt');
      const adminId = currentUser.admin ? currentUser.admin : currentUser._id;

      const newMessage = { 
        message: msg, 
        sender: currentUser._id, 
        receiver: currentChat._id, 
        createdAt: new Date() 
      };
      
      await sendCustomerMessage(currentChat._id, msg, adminId, token);

      if (socket) {
        socket.emit('sendMessage', newMessage);
      }

      setMessages((prevMessages) => [...prevMessages, { ...newMessage, fromSelf: true, time: moment().format('LT') }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendRatingRequest = () => handleSendMsg("RATING_REQUEST");

  return currentChat ? (
    <Container>
      <ChatHeader currentChat={currentChat} />
      <ChatMessages messages={messages} />
      <ChatInput handleSendMsg={handleSendMsg} openRatingModal={handleSendRatingRequest} />
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
