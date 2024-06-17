import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import { fetchAllRatings, fetchAllUsers } from "../services/apiService";
import { useSocketContext } from "../context/socket";
import { useNavigate } from 'react-router-dom';
import Filter from "../components/DashboardContainer/Filter";
import ChartSection from "../components/DashboardContainer/Chart";
import Summary from "../components/DashboardContainer/Summary";
import Loading from "../components/Loading";
import { getRatingsData, getOnlineUsersData, getConversationsData } from "../utils/chartOptions";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement);

export default function Dashboard() {
  const token = localStorage.getItem('jwt');
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const { onlineUsers } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [filters, setFilters] = useState({
    star: ['1', '2', '3', '4', '5'], // All stars selected initially
    sender: [], // Sender initialized as an empty array
    start: '',
    end: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem('register-user');
      if (user && user !== 'undefined') {
        user = JSON.parse(user);
        if (user._id) {
          setCurrentUser(user);
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const getUsersAndRatings = async () => {
      try {
        if (!currentUser) return;

        const data = await fetchAllUsers(token, currentUser._id);
        setUsers(data);

        // Initialize the sender filter with all user IDs
        const userIds = data.map(user => user._id);
        setFilters((prevFilters) => ({
          ...prevFilters,
          sender: userIds,
        }));

        // Fetch ratings after setting users
        await getRatings();
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching users and ratings:", error);
        setIsLoaded(true); // Ensure the page loads even if there's an error fetching users or ratings
      }
    };

    getUsersAndRatings();
  }, [token, currentUser]);

  const getRatings = async () => {
    try {
      const data = await fetchAllRatings(filters, token);
      
      // Process the ratings data to count the number of ratings for each star value
      const starCount = data.reduce((acc, rating) => {
        acc[rating.star] = (acc[rating.star] || 0) + 1;
        return acc;
      }, {});

      // Create the ratings data in the format needed for the chart
      const processedRatings = Object.keys(starCount).map(star => ({
        star: parseInt(star),
        count: starCount[star]
      }));

      setRatings(processedRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSearch = async () => {
    await getRatings();
  };

  const handleStarChange = (list) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      star: list.length ? list : ['1', '2', '3', '4', '5'],
    }));
  };

  const handleUserChange = (list) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sender: list.length ? list : users.map(user => user._id),
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="container">
        <Filter
          users={users}
          filters={filters}
          onStarChange={handleStarChange}
          onUserChange={handleUserChange}
          onDateChange={handleDateChange}
          buttonClick={handleSearch}
        />
        <Summary
          totalRatings={ratings.reduce((acc, rating) => acc + rating.count, 0)}
          onlineUsersCount={onlineUsers.length}
          totalUsersCount={users.length}
          conversationsCount={conversations.length}
        />
        <ChartSection
          ratingsData={getRatingsData(ratings)}
          onlineUsersData={getOnlineUsersData(onlineUsers, users.length)}
          conversationsData={getConversationsData(conversations)}
        />
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
