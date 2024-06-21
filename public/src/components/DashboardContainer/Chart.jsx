// components/ChartSection.js
import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";

const ChartSection = ({ ratingsData, conversationsData }) => {
  return (
    <ChartContainer>
      <div className="chart">
        <h3>Number of Ratings</h3>
        <Bar data={ratingsData} />
      </div>
      <div className="chart">
        <h3>Conversations</h3>
        <Bar data={conversationsData} />
      </div>
    </ChartContainer>
  );
};

export default ChartSection;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;
