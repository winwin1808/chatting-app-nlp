import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './components/Footer';
import Loading from './components/Loading'; // Đường dẫn đến component Loading

export default function AuthLayout() {
  return (
    <>
      <AuthContainer>
        <main>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </AuthContainer>
      <Footer />
    </>
  );
}

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 5rem); 
  min-height: 320px;

  main {
    flex-grow: 1;
    padding: 1rem;
    height: 100%;
  }
`;
