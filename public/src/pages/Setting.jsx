import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSocketContext } from '../context/socket';

export default function Setting() {

  return (
    <Container>
        </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #770000;

  .container {
    height: calc(100vh - 5rem);
    width: 80vw;
    background-color: #FFFFFF;
    display: grid;
    grid-template-columns: 25% 75%;
    padding: 1rem;
    border-radius: 0.7rem;
    @media screen and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
      width: 100%;
    }
    @media screen and (max-width: 720px) {
      margin-left: 0;
      width: calc(100vw);
    }
  }
`;
