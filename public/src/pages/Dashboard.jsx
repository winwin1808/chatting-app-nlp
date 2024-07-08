import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import { getAllRatings, getDashboardRatings, fetchAllUsers, downloadAllRatings } from "../services/apiService";
import { useSocketContext } from "../context/socket";
import { useNavigate } from 'react-router-dom';
import Filter from "../components/DashboardContainer/Filter";
import ChartSection from "../components/DashboardContainer/Chart";
import Summary from "../components/DashboardContainer/Summary";
import Loading from "../components/Loading";
import TableView from "../components/DashboardContainer/TableView"; // New table view component
import { getRatingsData, getSentimentsData } from "../utils/chartOptions";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement);

export default function Dashboard() {
  const token = localStorage.getItem('jwt');
  const [ratings, setRatings] = useState([]);
  const [totalRatings, setTotalRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const { onlineUsers } = useSocketContext();
  const [filters, setFilters] = useState({
    star: ['1', '2', '3', '4', '5'],
    sender: [],
    start: '',
    end: ''
  });
  const [activeTab, setActiveTab] = useState('chart'); // New state for active tab
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
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
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers(token, currentUser._id);
        setUsers(data);
        const userIds = data.map(user => user._id);
        setFilters((prevFilters) => ({
          ...prevFilters,
          sender: userIds,
        }));
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoaded(true);
      }
    };

    if (currentUser) {
      getUsers();
    }
  }, [token, currentUser]);

  const getRatings = useCallback(async (page = 1) => {
    try {
      const data = await getAllRatings({ ...filters, page }, token);
      const starCount = data.ratings.reduce((acc, rating) => {
        acc[rating.star] = (acc[rating.star] || 0) + 1;
        return acc;
      }, {});
      const processedRatings = data.ratings.map(rating => ({
        ...rating,
        count: starCount[rating.star]
      }));
      console.log(processedRatings);
      setRatings(processedRatings);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  }, [filters, token]);

  const getDashboardRating = useCallback(async () => {
    try {
      const data = await getDashboardRatings(filters, token);
      setTotalRatings(data.ratings);
    }
    catch (error) {
      console.error("Error fetching ratings:", error);
    }
  }, [filters, token]);

  useEffect(() => {
    if (isLoaded && currentUser) {
      getRatings();
      getDashboardRating();
    }
  }, [isLoaded, currentUser, getRatings, getDashboardRating]);

  const handleSearch = async () => {
    await getRatings();
    await getDashboardRating();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getRatings(page);
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

  const handleDownloadCSV = async () => {
    try {
      const blob = await downloadAllRatings(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ratings.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <Container activeTab={activeTab}>
      <div className="container">
        <TabsWrapper>
          <Tabs>
            <button onClick={() => setActiveTab('chart')}>Overview</button>
            <button onClick={() => setActiveTab('table')}>Sentiment</button>
          </Tabs>
          {activeTab === 'table' && (
            <DownloadButton>
              <button onClick={handleDownloadCSV}>Download CSV</button>
            </DownloadButton>
          )}
        </TabsWrapper>
        <ContentWrapper>
          {activeTab === 'chart' && (
            <ChartContent>
              <Summary
                totalRatings={totalRatings.length}
                onlineUsersCount={onlineUsers.length - 1}
              />
              <ChartSection
                ratingsData={getRatingsData(totalRatings)}
                conversationsData={getSentimentsData(totalRatings)}
              />
            </ChartContent>
          )}
          {activeTab === 'table' && (
            <TableContent>
              <Filter
                users={users}
                filters={filters}
                onStarChange={handleStarChange}
                onUserChange={handleUserChange}
                onDateChange={handleDateChange}
                buttonClick={handleSearch}
              />
              <TableView
                ratings={ratings}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TableContent>
          )}
        </ContentWrapper>
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
    grid-template-rows: ${({ activeTab }) => (activeTab === 'chart' ? '5% 20% 60%' : '5% 80%')};
    padding: 1rem;
    border-radius: 0.7rem;
    gap: 1rem;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  z-index: 1;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    background-color: #ff7290;
    color: #fff;
    cursor: pointer;
    height: 2rem;
    margin-right: 0.5rem;
    transition: background-color 0.3s;
    &:hover {
      background-color: #770000;
    }
  }
`;

const DownloadButton = styled.div`
  button {
    padding: 0.25rem 0.25rem;
    left: 10rem;
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
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ChartContent = styled.div`
  height: 100%;
`;

const TableContent = styled.div`
  height: 100%;
`;

