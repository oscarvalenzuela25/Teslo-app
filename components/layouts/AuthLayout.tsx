import React, { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';

interface Props extends PropsWithChildren {
  title: string;
}

const AuthLayout: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 200px)"
        >
          {children}
        </Box>
      </main>
    </>
  );
};

export default AuthLayout;
