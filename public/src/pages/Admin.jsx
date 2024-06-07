import React, { useState, useEffect } from 'react';
import { getAllSubUsers, createSubUser, updateSubUser, deleteSubUser } from '../services/apiService';
import SubUserForm from '../components/AdminContainer/SubUserForm';
import SubUserList from '../components/AdminContainer/SubUserList';
import styled from 'styled-components';

export default function Admin() {
  const token = localStorage.getItem('jwt');
  const [subUsers, setSubUsers] = useState([]);
  const [currentSubUser, setCurrentSubUser] = useState(null);

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    const data = await getAllSubUsers(token);
    setSubUsers(data);
  };

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
