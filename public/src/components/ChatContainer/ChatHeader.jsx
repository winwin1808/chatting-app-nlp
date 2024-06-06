import React from 'react';
import styled from 'styled-components';

const ChatHeader = ({ currentChat }) => (
  <Header>
    <div className="user-details">
      <div className="avatar">
        <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
      </div>
      <div className="username">
        <h3>{currentChat.username}</h3>
      </div>
    </div>
  </Header>
);

export default ChatHeader;

const Header = styled.div`
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
`;
