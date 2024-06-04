import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { BsChatDots, BsBarChart, BsGear, BsPower } from "react-icons/bs";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/ApiRoutes";
import Logo from "../assets/logo.png"; 


const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('register-user');
        if (storedData) {
          const data = JSON.parse(storedData);
          setCurrentUserName(data.username);
          setCurrentUserImage(data.avatarImage);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("register-user"));
      const id = user._id;
      await axios.post(`${logoutRoute}/${id}`, { withCredentials: true });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <StyledSidebar collapsed={collapsed}>
      <div className={`brand ${collapsed ? 'collapsed' : ''}`}>
        <img src={Logo} alt="logo" />
        {!collapsed && <h3>Chatting</h3>}
        <div className="divider"></div>
      </div>
      {currentUserName && currentUserImage && (
        <div className={`current-user ${collapsed ? 'collapsed' : ''}`}>
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
          </div>
          {!collapsed && (
            <div className="username">
              <h3>{currentUserName}</h3>
            </div>
          )}
        </div>
      )}
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0)
              return {
                color: active ? '#FFFFFF' : '#770000',
                backgroundColor: active ? '#B63E3E' : undefined,
              };
          },
        }}
      >
        <MenuItem component={<Link to="/dashboard" />}
          active={window.location.pathname === '/dashboard'} icon={<BsBarChart />}>
          Dashboard
        </MenuItem>
        <MenuItem component={<Link to="/" />}
          active={window.location.pathname === '/'} icon={<BsChatDots />}>
          Messages
        </MenuItem>
        <MenuItem component={<Link to="/setting" />}
          active={window.location.pathname === '/setting'} icon={<BsGear />}>
          Setting
        </MenuItem>
        <MenuItem onClick={handleLogout}
          icon={<BsPower />}>
          Logout
        </MenuItem>
      </Menu>
      <div className="expand-button" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MdKeyboardDoubleArrowRight /> : <><MdKeyboardDoubleArrowLeft /> <span>Hide</span></>}
      </div>
    </StyledSidebar>
  );
};

const StyledSidebar = styled(Sidebar)`
  height: calc(100vh - 5rem);
  background-color: white !important;
  border-radius: 0.7rem;
  overflow: hidden;
  position: relative;
  margin: 1rem 0 0 0.3rem;

  .brand {
    display: flex;
    align-items: center;
    gap: 0rem;
    justify-content: center;
    padding: 0.5rem;
    position: relative;
    height: 4rem;

    img {
      height: 2rem;
    }

    .divider {
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 2.3px;
      background-color: #770000;
    }

    &.collapsed {
      justify-content: center;
      padding: 1rem;

      img {
        height: 1.2rem;
      }

      h3 {
        display: none;
      }
    }

    h3 {
      color: #770000;
      text-transform: uppercase;
      font-size: 1.2rem;
      font-weight: 400 !important;
    }
  }

  .current-user {
    display: flex;
    padding: 1.3rem;
    align-items: center;
    gap: 0.5rem;

    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h3 {
        font-size: 1.2rem;
        color: #770000;
        font-weight: 300 !important;
      }
    }

    &.collapsed {
      justify-content: center;
      padding: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        display: none;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;

      .username {
        h3 {
          font-size: 1rem;
        }
      }
    }
  }

  .expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    cursor: pointer;
    color: #770000;
    background-color: #f0f0f0;
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }

    span {
      margin-left: 0.5rem;
    }
  }
`;

export default SidebarComponent;
