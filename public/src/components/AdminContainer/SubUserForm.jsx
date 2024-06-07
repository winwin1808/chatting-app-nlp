import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SubUserForm = ({ currentSubUser, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (currentSubUser) {
      setFormData({ username: currentSubUser.username, email: currentSubUser.email, password: '' });
    } else {
      setFormData({ username: '', email: '', password: '' });
    }
  }, [currentSubUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>{currentSubUser ? 'Edit Sub-User' : 'Add Sub-User'}</h2>
      <FormField>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FormField>
      <FormField>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormField>
      {!currentSubUser && (
        <FormField>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormField>
      )}
      <SubmitButton type="submit">Save</SubmitButton>
    </FormContainer>
  );
};

export default SubUserForm;

const FormContainer = styled.form`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;

  h2 {
    font-size: 1.5rem;
    color: #333;
    text-align: center;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #770000;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff7290;
  }
`;
