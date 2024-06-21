// main-layout.jsx
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import SidebarComponent from './components/Sidebar';
import Footer from './components/Footer';
import Loading from './components/Loading';

const GlobalStyle = createGlobalStyle`
  :root {
    background-color: #770000; /* replace with your desired color */
  }
`;

export default function MainLayout({ collapsed, handleCollapsedChange }) {
  return (
    <>
      <GlobalStyle />
      <Container>
        <SidebarComponent
          collapsed={collapsed}
          handleCollapsedChange={handleCollapsedChange}
        />
        <MainContainer $collapsed={collapsed}>
          <main>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </main>
        </MainContainer>
      </Container>
      <Footer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  height: calc(100vh - 5rem); 
  min-height: 320px;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  transition: width 0.3s ease;
  width: ${({ $collapsed }) => ($collapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)')};

  main {
    padding: 1rem;
    height: 100%;
  }
`;
