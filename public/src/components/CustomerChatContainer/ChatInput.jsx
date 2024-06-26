import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { FaStar } from "react-icons/fa6";

export default function ChatInput({ handleSendMsg, openRatingModal }) {
  const [msg, setMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker className="picker-container"
            height="300px"
            skinTonesDisabled="true"
            searchDisabled="true"
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emojiObject) => setMsg((prevMsg) => prevMsg + emojiObject.emoji)} />}
        </div>
        <div className="emoji">
          <FaStar onClick={openRatingModal} />
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10% 90%;
  min-height: 100%;    
  margin: 0 0.5rem;
  padding: 0 2rem 2rem;
  
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #770000;
        cursor: pointer;
      }
      .picker-container {
        position: absolute;
        top: -320px;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #FF9AB2;
          width: 5px;
          &-thumb {
            background-color: #770000;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #eeeee4;
    input {
      width: 90%;
      height: 50%;
      background-color: transparent;
      color: black;
      border: none;
      padding-left: 1rem;
      font-size: 0.8rem;

      &::selection {
        background-color: #FF9AB2;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #770000;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
