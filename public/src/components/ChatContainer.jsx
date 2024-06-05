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
    // Defines an asynchronous function that fetches data related to chat messages and ratings.
    async function fetchData() {
      // Checks if both currentUser and currentChat are defined to proceed with data fetching.
      if (currentUser && currentChat) {
        try {
          const token = localStorage.getItem('jwt');
  
          // Sends a POST request to the server to fetch messages related to the current chat session.
          const messageResponse = await axios.post(
            `${receiveMessageRoute}/${currentChat._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Maps the array of messages received from the server, adding a 'fromSelf' property to determine if the message was sent by the current user.
          const mappedMessages = messageResponse.data.map((message) => ({
            ...message,
            fromSelf: currentUser._id === message.sender, // Checks if the sender ID matches the current user's ID.
          }));
  
          // Sends another POST request to fetch ratings associated with the current chat session.
          const ratingResponse = await axios.post(
            `${getRatingRoute}/${currentChat._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          // Maps the array of ratings received, enhancing each rating with 'fromSelf' and a formatted 'message' property.
          const mappedRatings = ratingResponse.data.map((rating) => ({
            ...rating,
            fromSelf: currentUser._id === rating.sender, // Determines if the rating was submitted by the current user.
            message: `Rating: ${rating.star} stars, Review: ${rating.content}`, // Formats the rating and review into a readable string.
          }));
  
          // Sets the component state 'messages' with a combined array of mapped messages and ratings.
          setMessages([...mappedMessages, ...mappedRatings])
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    fetchData();
  }, [currentChat, currentUser]);
  

  useEffect(() => {
    // This block checks if the socket object is initialized and available.
    if (socket) {
      // Listening for 'newMessage' events on the socket.
      // This event is triggered when a new message is received from the server via socket.
      socket.on('newMessage', (msg) => {
        // Sets the arrival message state, indicating that a new message has arrived.
        // The 'fromSelf' property is set to false to denote that this message is from another user.
        setArrivalMessage({
          ...msg,
          fromSelf: false,
        });
      });
  
      // Listening for 'newRating' events on the socket.
      // This event is triggered when a new rating is received from the server via socket.
      socket.on('newRating', (rating) => {
        // Sets the arrival message state with the rating information formatted.
        // Includes details of the rating and the content of the review.
        // Similarly, 'fromSelf' is set to false indicating the rating is from another user.
        setArrivalMessage({
          ...rating,
          fromSelf: false,
          message: `Rating: ${rating.star} stars, Review: ${rating.content}`,
        });
      });
  
      // This return function is a cleanup mechanism for the useEffect hook.
      // It's called when the component unmounts or before the useEffect runs again.
      // It turns off the socket listeners for 'newMessage' and 'newRating' to prevent memory leaks and unnecessary updates.
      return () => {
        socket.off('newMessage');
        socket.off('newRating');
      };
    }
  }, [socket]);
  

  useEffect(() => {
    // This block checks if arrivalMessage is defined (i.e., not null or undefined).
    if (arrivalMessage) {
      // Updates the messages state with the new arrivalMessage.
      // The setMessages function takes the previous state (prevMessages) and appends the new arrivalMessage to it.
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);
  

  async function handleSendMsg(msg) {
    try {
      const token = localStorage.getItem('jwt');
      
      // Sends a POST request to the server to send the message.
      await axios.post(
        `${sendMessageRoute}/${currentChat._id}`,
        { message: msg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Checks if the socket object is initialized and available.
      if (socket) {
        // Emits a 'send-msg' event to the server via socket.
        // The event includes the receiver's chat ID, the sender's user ID, and the message content.
        socket.emit('send-msg', {
          receiver: currentChat._id,
          sender: currentUser._id,
          message: msg,
        });
      }
  
      // Updates the messages state by adding the new message to the existing array of messages.
      // The new message is marked as 'fromSelf' to indicate it was sent by the current user.
      setMessages((prevMessages) => [
        ...prevMessages,
        { fromSelf: true, message: msg },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  

  async function handleSendRatingRequest() {
    // Calls the handleSendMsg function with the message "RATING_REQUEST".
    // This sends a message to the current chat indicating that a rating request has been made.
    await handleSendMsg("RATING_REQUEST");
  }
  

  const handleRatingSubmit = async (rating, content) => {
    try {
      const token = localStorage.getItem('jwt');
  
      // Sends a POST request to the server to submit the rating.
      const response = await axios.post(
        `${sendRatingRoute}/${currentChat._id}`, 
        { star: rating, content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Constructs a message object containing the rating details.
      // This object includes the message string with the rating and review content, 
      // the sender's user ID, the receiver's chat ID, and a fromSelf property indicating it was sent by the current user.
      const ratingMessage = {
        message: `Rating: ${rating} stars, Review: ${content}`,
        sender: currentUser._id,
        receiver: currentChat._id,
        fromSelf: true,
      };
  
      // Updates the messages state by adding the new rating message to the existing array of messages.
      setMessages((prevMessages) => [...prevMessages, ratingMessage]);
  
      // Checks if the socket object is initialized and available.
      if (socket) {
        // Emits a 'send-rating' event to the server via socket.
        // The event includes the ratingMessage object with the rating details.
        socket.emit('send-rating', ratingMessage);
      }
      console.log('Rating submitted: ', response.data);
    } catch (error) {
      console.error('Error submitting rating: ', error);
    }
      // Closes the rating modal after the rating submission process is complete.
      setIsRatingModalOpen(false);
  };
  

  // This useEffect hook is responsible for scrolling to the bottom of the chat messages whenever a new message is received.
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
  transition: background-color 0.3s, color 0.3s;
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 0.8rem;

  &:hover {
    background-color: #ff7290;
  }

  &:disabled {
    background-color: #770000; /* Keep the same background color when disabled */
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

