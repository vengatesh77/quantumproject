import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => (
  <div className="app-wrapper">
    <Sidebar />
    <div className="main-content">
      <TopNav />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;
