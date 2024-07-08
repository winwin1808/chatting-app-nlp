import React from 'react';
import styled from 'styled-components';

export default function TableView({ ratings, currentPage, totalPages, onPageChange }) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <TableContainer>
      <table>
        <thead>
          <tr>
            <th>Created At</th>
            <th>Content</th>
            <th>Star</th>
            <th>Is Done</th>
            <th>Receiver Username</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating) => (
            <tr key={rating._id}>
              <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
              <td>{rating.content}</td>
              <td>{rating.star}</td>
              <td>{rating.isDone ? 'Yes' : 'No'}</td>
              <td>{rating.receiver?.username}</td>
              <td>{rating.sentiment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </Pagination>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  height: 100%;
  table {
    width: 100%;
    height: 95%;
    border-collapse: collapse;
    font-size: 9px;
    border-radius: 0.25rem;
    th, td {
      border: 1px solid #ddd;
      padding: 4px;
    }

    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #f2f2f2;
      color: black;
    }

    tr:hover {
      background-color: #ddd;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #ff7290;
    color: white;
    cursor: pointer;
    border-radius: 0.25rem;
    &:hover {
      background-color: #770000;
    }
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
`;
