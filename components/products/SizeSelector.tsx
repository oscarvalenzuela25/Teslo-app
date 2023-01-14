import { Box, Button } from '@mui/material';
import React, { FC } from 'react';
import { ISize } from '../../interfaces/products';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  handleSelectSize: (size: ISize) => void;
}

const SizeSelector: FC<Props> = ({ selectedSize, sizes, handleSelectSize }) => {
  return (
    <Box>
      {sizes.map(size => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? 'primary' : 'info'}
          onClick={() => handleSelectSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};

export default SizeSelector;
