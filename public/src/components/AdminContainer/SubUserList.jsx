import React, { useState } from 'react';
import styled from 'styled-components';

const SubUserList = ({ subUsers, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSubUsers = subUsers.filter((subUser) =>
    subUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ListContainer>
      <h2>Sub-User List</h2>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubUsers.map((subUser) => (
            <tr key={subUser._id}>
              <td>{subUser.username}</td>
              <td>{subUser.email}</td>
              <td>
                <ActionButton onClick={() => onEdit(subUser)}>Edit</ActionButton>
                <ActionButton onClick={() => onDelete(subUser._id)}>Delete</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ListContainer>
  );
};

export default SubUserList;

const ListContainer = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;

  h2 {
    font-size: 1.5rem;
    color: #333;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  th {
    background-color: #f8f8f8;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #770000;
  color: #fff;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff7290;
  }
`;
