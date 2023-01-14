import React, { FC, PropsWithChildren } from 'react';
import SideMenu from '../ui/SideMenu';
import AdminNavbar from '../admin/AdminNavbar';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Head from 'next/head';

interface Props extends PropsWithChildren {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
}

const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
      </Head>
      <nav>
        <AdminNavbar />
      </nav>
      <SideMenu />

      <main
        style={{
          margin: '80px auto',
          maxWidth: 1440,
          padding: '0 30px',
        }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {subTitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};

export default AdminLayout;
