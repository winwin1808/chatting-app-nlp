import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { useSocketContext } from "../../context/socket";
import { markConversationAsDone } from '../../services/apiService';

export default function Contacts({ contacts, changeChat, showWelcome }) {
  const { onlineUsers } = useSocketContext();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const token = localStorage.getItem('jwt');

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

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(contact => {
        const participantName = contact.participants[0]?.name || "";
        return participantName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, contacts]);

  useEffect(() => {
    if (filteredContacts.length === 0) {
      showWelcome();
    }
  }, [filteredContacts, showWelcome]);

  const closeSearch = () => {
    setSearchTerm("");
    setIsFocused(false);
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const isOnline = (contact) => {
    return onlineUsers.includes(contact.participants[0]?._id);
  };

  const handleMarkAsDone = async (conversationId) => {
    try {
      await markConversationAsDone(conversationId, token);
      setFilteredContacts(filteredContacts.filter(contact => contact._id !== conversationId));
    } catch (error) {
      console.error('Error marking conversation as done:', error);
    }
  };

  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isFocused ? (
              <IoCloseOutline onClick={closeSearch} />
            ) : (
              <CiSearch />
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
                    src={contact.participants[0]?.avatarImage ? `data:image/svg+xml;base64,${contact.participants[0]?.avatarImage}` : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}
                    alt="Avatar"
                  />
                  {isOnline(contact) && <OnlineIndicator />}
                </div>
                <div className="username">
                  <h3>{contact.participants[0]?.name || "Unknown"}</h3>
                </div>
                <MdOutlineDone className="mark-as-done" onClick={() => handleMarkAsDone(contact._id)} />
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
    padding: 1rem 1rem 1rem 2rem;
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
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          font-size: 0.8rem;
          color: #00176B;
          font-weight: 500 !important;
        }
      }

      .mark-as-done {
        margin-left: auto;
        font-size: 1.5rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        &:hover {
          color: #FFFFFF;
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
