import React from "react";
import DropdownCheckbox from "../lib/DropdownCheckbox";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  @media screen and (max-width: 720px) {
    flex-direction: column;
    align-items: center;
  }
  max-height: 4rem;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.7rem;
  input {
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 200px;
  }
`;

const Filter = ({ users, filters, onStarChange, onUserChange, onDateChange, buttonClick }) => {
  const userOptions = users.map((user) => ({ label: user.username, value: user._id }));
  const starOptions = [
    { label: '1 Star', value: '1' },
    { label: '2 Stars', value: '2' },
    { label: '3 Stars', value: '3' },
    { label: '4 Stars', value: '4' },
    { label: '5 Stars', value: '5' }
  ];

  return (
    <FilterContainer>
      <DropdownCheckbox
        options={starOptions}
        title="Star Ratings"
        onChange={onStarChange}
      />
      <DropdownCheckbox
        options={userOptions}
        title="Senders"
        onChange={onUserChange}
      />
      <input
        type="date"
        name="start"
        value={filters.start}
        onChange={onDateChange}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="end"
        value={filters.end}
        onChange={onDateChange}
        placeholder="End Date"
      />
      <SearchButton onClick={buttonClick}>Search</SearchButton>
    </FilterContainer>
  );
};

export default Filter;

const SearchButton = styled.button`
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
