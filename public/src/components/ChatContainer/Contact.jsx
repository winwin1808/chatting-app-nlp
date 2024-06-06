import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useSocketContext } from "../../context/socket";

export default function Contacts({ contacts, changeChat }) {
  console.log(111,contacts)
  const { onlineUsers } = useSocketContext();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

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

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOnline = (contact) => {
    return onlineUsers.includes(contact._id);
  };
  console.log("onlineUsers",onlineUsers)
  console.log("contacts",contacts)
  console.log("isOnline",isOnline)
  return (  
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="search-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isFocused ? (
              <IoCloseOutline 
                onClick={() => {
                  setSearchTerm("");
                  setIsFocused(false);
                  inputRef.current.blur();
                }} 
              />
            ) : (
              <CiSearch 
                onClick={() => inputRef.current.focus()} 
              />
            )}
          </div>
          <div className="contacts">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                  {isOnline(contact) && <OnlineIndicator />}
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

const OnlineIndicator = styled.div`
  width: 0.7rem;
  height: 0.7rem;
  background-color: green;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;

  .search-bar {
    display: flex;
    padding: 0.5rem;
    input {
      width: 80%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid #ccc;
    }
    svg {
      align-self: center;
      font-size: 2rem;
      padding-left: 0.5rem;
      cursor: pointer;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.7rem;
      padding: 0.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      position: relative;

      .avatar {
        position: relative;
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          font-size: 1rem;
          color: #00176B;
          font-weight: 500 !important;
        }
      }
    }

    .selected {
      background-color: #B63E3E;
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
`;
