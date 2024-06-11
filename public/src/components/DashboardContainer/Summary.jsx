// components/Summary.js
import React from "react";
import styled from "styled-components";

const Summary = ({ totalRatings, onlineUsersCount, conversationsCount,totalUsersCount }) => {
  return (
    <SummaryContainer>
      <SummaryBox>
        <h3>Total Ratings</h3>
        <p>{totalRatings}</p>
      </SummaryBox>
      <SummaryBox>
        <h3>Online Users</h3>
        <p>{onlineUsersCount}/{totalUsersCount}</p>
      </SummaryBox>
      <SummaryBox>
        <h3>Conversations</h3>
        <p>{conversationsCount}</p>
      </SummaryBox>
    </SummaryContainer>
  );
};

export default Summary;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  @media screen and (max-width: 720px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SummaryBox = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
  max-height: 8rem;
  h3 {
    margin-bottom: 1rem;
  }

  p {
    font-size: 2rem;
    font-weight: bold;
  }
`;