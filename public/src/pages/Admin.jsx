import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation
import { getAllSubUsers, createSubUser, updateSubUser, deleteSubUser } from '../services/apiService';
import SubUserForm from '../components/AdminContainer/SubUserForm';
import SubUserList from '../components/AdminContainer/SubUserList';
import styled from 'styled-components';

export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const [subUsers, setSubUsers] = useState([]);
  const [currentSubUser, setCurrentSubUser] = useState(null);

  const fetchSubUsers = useCallback(async () => {
    const data = await getAllSubUsers(token);
    setSubUsers(data);
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem('register-user');
      if (user && user !== 'undefined') {
        user = JSON.parse(user);
        if (user._id) {
          fetchSubUsers();
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, fetchSubUsers]);

  const handleSaveSubUser = async (subUserData) => {
    if (currentSubUser) {
      await updateSubUser(currentSubUser._id, subUserData, token);
    } else {
      await createSubUser(subUserData, token);
    }
    fetchSubUsers();
    setCurrentSubUser(null); // Reset form after saving
  };

  const handleEditSubUser = (subUser) => {
    setCurrentSubUser(subUser);
  };

  const handleDeleteSubUser = async (userId) => {
    await deleteSubUser(userId, token);
    fetchSubUsers();
  };

  return (
    <Container>
      <AdminContainer>
        <SubUserForm currentSubUser={currentSubUser} onSave={handleSaveSubUser} />
        <SubUserList subUsers={subUsers} onEdit={handleEditSubUser} onDelete={handleDeleteSubUser} />
      </AdminContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #770000;
`;

const AdminContainer = styled.div`
  height: calc(100vh - 5rem);
  width: 80vw;
  background-color: #FFFFFF;
  display: grid;
  gap: 1rem;
  grid-template-columns: 25% 70%;
  padding: 1rem;
  border-radius: 0.5rem;
  justify-content: center;
`;
