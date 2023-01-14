import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React, { FC } from 'react';

interface Props {
  currentValue: number;
  maxValue: number;
  handleChangeQuantity: (quantity: number) => void;
}

const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  handleChangeQuantity,
}) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => handleChangeQuantity(Math.max(currentValue - 1, 1))}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        {currentValue}
      </Typography>
      <IconButton
        onClick={() =>
          handleChangeQuantity(Math.min(currentValue + 1, maxValue))
        }
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};

export default ItemCounter;
