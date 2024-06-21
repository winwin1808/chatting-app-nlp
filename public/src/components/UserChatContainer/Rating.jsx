import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FaStar } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

export default function RatingModal({ isOpen, onRequestClose, handleSubmit }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
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
        <CloseButton onClick={onRequestClose}><IoIosCloseCircleOutline size={24} /></CloseButton>
        <form onSubmit={onSubmit}>
          <Title style={{ fontSize: '1.2rem' }}>Rate Your Experience</Title>
          <Description style={{ fontSize: '0.6rem' }}>Please provide a rating and a brief review of your experience.</Description>
          <div className="rate">
            {[...Array(5)].map((_, index) => {
              const starValue = 5 - index;
              return (
                <React.Fragment key={starValue}>
                  <input 
                    type="radio" 
                    id={`star${starValue}`} 
                    name="rate" 
                    value={starValue} 
                    checked={rating === starValue} 
                    onChange={handleRatingChange} 
                  />
                  <label htmlFor={`star${starValue}`} title={`${starValue} stars`}>
                    <FaStar />
                  </label>
                </React.Fragment>
              );
            })}
          </div>
          <StyledTextarea
            placeholder="Write your review..."
            value={content}
            onChange={handleContentChange}
            required
          />
          <ButtonContainer>
            <StyledButton type="submit">Submit</StyledButton>
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
  padding: 4rem 2rem 2rem 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: "Be Vietnam Pro", sans-serif;
  
  .rate {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
    flex-direction: row-reverse; /* Display stars in reverse order */
  }
  
  input[type="radio"] {
    display: none;
  }

  label {
    cursor: pointer;
    font-size: 30px;
    color: #ccc;
    direction: ltr; /* Ensure the direction is left-to-right */
  }

  input:checked ~ label {
    color: #ffc700;
  }

  label:hover,
  label:hover ~ label,
  input:checked ~ label,
  input:checked ~ label ~ label {
    color: #ffc700;
  }
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: 1rem;
  font-family: "Be Vietnam Pro", sans-serif;
  text-align: center;
`;

const Description = styled.p`
  margin: 0;
  margin-bottom: 1.5rem;
  font-family: "Be Vietnam Pro", sans-serif;
  text-align: center;
  color: #666;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #770000;
  resize: none;
  font-family: "Be Vietnam Pro", sans-serif;
  outline: none;

  &:focus {
    border: 1px solid #770000;
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* Center the button */
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #770000;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: "Be Vietnam Pro", sans-serif;

  &:hover {
    background-color: #B63E3E;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
