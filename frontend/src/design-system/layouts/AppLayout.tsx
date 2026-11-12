import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink } from '../components/SkipLink';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AppLayout: React.FC = () => {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} style={mainStyles}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const mainStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  outline: 'none',
};
