import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Logout from '../components/Logout'
import ChatInput from '../components/ChatInput'
import Messages from '../components/Messages'
import axios from 'axios'
import { sendMessageRoute, recieveMessageRoute } from "../utils/ApiRoutes";
export default function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (currentUser && currentChat) {
        const response = await axios.post(recieveMessageRoute,{
          from: currentUser._id,
          to: currentChat._id
        });
        setMessages(response.data);
      }
      
    }
    fetchData();
  }, [currentChat, currentUser]);

  async function handleSendMsg(msg) {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    })
  }
  
  if (currentChat !== undefined) {
    return <Container>
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
        {
          messages.map((msg, index) => {
            return (
              <div key={index}>
                <div className={`message ${msg.fromSelf ? "sended" : "recieved"}`}>
                  <div className="content">
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  }
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
    background-color: #FFFFFF;
    min-height: 3rem;
    .user-details {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      h3 {
        color: #00176B;
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
        background-color: #FF9AB2;
        color: white;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #eeeee4;
        color: black;
      }
    }
  }
`;