import React, { FC } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';

interface Props {
  images: string[];
}

const ProductSlideshow: FC<Props> = ({ images }) => {
  return (
    <Slide easing="ease" duration={7000} indicators>
      {images.map(image => (
        <div className={styles['each-slide']} key={image}>
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
            }}
          />
        </div>
      ))}
    </Slide>
  );
};

export default ProductSlideshow;
