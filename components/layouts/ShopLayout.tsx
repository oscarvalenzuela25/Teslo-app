import Head from 'next/head';
import { FC, PropsWithChildren } from 'react';
import SideMenu from '../ui/SideMenu';
import Navbar from './../ui/Navbar';

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

const ShopLayout: FC<Props> = ({
  title,
  pageDescription,
  imageFullUrl,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />

        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <nav>
        <Navbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: '80px auto',
          maxWidth: 1440,
          padding: '0 30px',
        }}
      >
        {children}
      </main>

      <footer>{/** Footer */}</footer>
    </>
  );
};

export default ShopLayout;
