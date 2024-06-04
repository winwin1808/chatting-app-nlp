import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FaStar } from "react-icons/fa6";

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

export default function RatingModal({ isOpen, onRequestClose, handleSubmit }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(rating, content);
    onRequestClose(); // Close the modal after submission
  };

  return (
    <div>
      <StyledModal isOpen={isOpen} onRequestClose={onRequestClose}>
        <form onSubmit={onSubmit}>
          <div className="rate" onChange={handleRatingChange}>
            <input type="radio" id="star1" name="rate" value="1" />
            <label htmlFor="star1" title="1 star"><FaStar /></label>
            <input type="radio" id="star2" name="rate" value="2" />
            <label htmlFor="star2" title="2 stars"><FaStar /></label>
            <input type="radio" id="star3" name="rate" value="3" />
            <label htmlFor="star3" title="3 stars"><FaStar /></label>
            <input type="radio" id="star4" name="rate" value="4" />
            <label htmlFor="star4" title="4 stars"><FaStar /></label>
            <input type="radio" id="star5" name="rate" value="5" />
            <label htmlFor="star5" title="5 stars"><FaStar /></label>
          </div>
          <textarea
            placeholder="Write your review..."
            value={content}
            onChange={handleContentChange}
            required
          />
          <ButtonContainer>
            <StyledButton type="submit">Submit</StyledButton>
            <StyledButton type="button" onClick={onRequestClose}>Close</StyledButton>
          </ButtonContainer>
        </form>
      </StyledModal>
    </div>
  );
}

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 500px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  .rate {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  input[type="radio"] {
    display: none;
  }

  label {
    cursor: pointer;
    font-size: 30px;
    color: #ccc;
  }

  input:checked ~ label {
    color: #ffc700;
    top:-9999px;
  }

  input:hover ~ label {
    color: #deb217;
  }

  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    resize: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
