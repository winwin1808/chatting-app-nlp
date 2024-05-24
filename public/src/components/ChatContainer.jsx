import React from 'react'
import styled from 'styled-components'
import Logout from '../components/Logout'
export default function ChatContainer({ currentChat }) {
  console.log(111, currentChat);

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
          <div className="user">
            <h3>{currentChat.username}</h3>
          </div>
          <Logout></Logout> 
        </div>
        <div className="chat-messages"> </div>
        <div className="chat-input"> </div>
      </div>
    </Container>
  }
}
const Container = styled.div`
  padding-top: 0.5rem;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 0.05rem solid #770000;
    background-color: #FFFFFF;
  .user-details {
    display: flex;
    gap: 1rem;
    align-items: center;
    h3 {
      color: #00176B;
      font-size: 1.2rem;
    }
    .avatar {
      img {
        height: 3rem;
      }
    }
  }
  
  }
`;