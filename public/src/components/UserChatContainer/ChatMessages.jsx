import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const ChatMessages = ({ messages, openRatingModal }) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Messages>
      {messages.map((msg) => (
        <div ref={scrollRef} key={uuidv4()}>
          {msg.message === "RATING_REQUEST" ? (
            <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
              <div className="content">
                <StyledButton onClick={() => openRatingModal()} disabled={msg.fromSelf}>
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
    </Messages>
  );
};

export default ChatMessages;

const Messages = styled.div`
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
`;

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
