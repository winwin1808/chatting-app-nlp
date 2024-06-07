import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement);

export default function Dashboard() {
  const [ratings, setRatings] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Generate random ratings data
    const generateRatings = () => {
      const ratingsData = [];
      for (let i = 1; i <= 5; i++) {
        ratingsData.push({
          star: i,
          count: Math.floor(Math.random() * 100) + 1,
        });
      }
      setRatings(ratingsData);
    };

    // Generate random online users data
    const generateOnlineUsers = () => {
      const totalUsers = 100;
      const onlineCount = Math.floor(Math.random() * totalUsers);
      const onlineUsersData = Array.from({ length: onlineCount }, (_, i) => `User${i + 1}`);
      setOnlineUsers(onlineUsersData);
    };

    // Generate random conversations data
    const generateConversations = () => {
      const conversationsData = [];
      const conversationCount = Math.floor(Math.random() * 50) + 1;
      for (let i = 0; i < conversationCount; i++) {
        conversationsData.push(`Conversation${i + 1}`);
      }
      setConversations(conversationsData);
    };

    generateRatings();
    generateOnlineUsers();
    generateConversations();
  }, []);

  const ratingsData = {
    labels: ratings.map((rating) => `Rating ${rating.star} stars`),
    datasets: [
      {
        label: "Number of Ratings",
        data: ratings.map((rating) => rating.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const onlineUsersData = {
    labels: ["Online Users", "Offline Users"],
    datasets: [
      {
        data: [onlineUsers.length, 100 - onlineUsers.length], // Assuming 100 total users for illustration
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const conversationsData = {
    labels: ["Conversations"],
    datasets: [
      {
        label: "Number of Conversations",
        data: [conversations.length],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <div className="container">
        <SummaryContainer>
          <SummaryBox>
            <h3>Total Ratings</h3>
            <p>{ratings.reduce((acc, rating) => acc + rating.count, 0)}</p>
          </SummaryBox>
          <SummaryBox>
            <h3>Online Users</h3>
            <p>{onlineUsers.length}</p>
          </SummaryBox>
          <SummaryBox>
            <h3>Conversations</h3>
            <p>{conversations.length}</p>
          </SummaryBox>
        </SummaryContainer>
        <ChartContainer>
          <div className="chart">
            <h3>Number of Ratings</h3>
            <Bar data={ratingsData} />
          </div>
          <div className="chart">
            <h3>Number of Ratings</h3>
            <Bar data={ratingsData} />
          </div>
          <div className="chart">
            <h3>Number of Ratings</h3>
            <Bar data={ratingsData} />
          </div>
          <div className="chart">
            <h3>Online Users</h3>
            <Pie data={onlineUsersData} />
          </div>
          <div className="chart">
            <h3>Conversations</h3>
            <Bar data={conversationsData} />
          </div>
          <div className="chart">
            <h3>Conversations</h3>
            <Bar data={conversationsData} />
          </div>
        </ChartContainer>
        
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #770000;


  .container {
    height: calc(100vh - 5rem);
    width: 80vw;
    background-color: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    padding: 1rem;
    border-radius: 0.7rem;
    gap: 1rem;
    @media screen and (max-width: 1080px) {
      width: 100%;
    }
    @media screen and (max-width: 720px) {
      width: calc(100vw - 2rem);
    }
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  @media screen and (max-width: 720px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
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