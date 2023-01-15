import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
} from '@mui/material';
import React, { useContext } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
// import { GetServerSideProps } from 'next';
import countries from '../../utils/countries';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/cartContext';
// import { getToken } from 'next-auth/jwt';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const handleSubmitForm = (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout
      title="Dirección"
      pageDescription="Confirmar dirección del destino"
    >
      <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
        <Typography variant="h1" component="h1">
          Dirección
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register('firstName', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register('lastName', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register('address', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (opcional)"
              variant="filled"
              fullWidth
              {...register('address2', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.address2}
              helperText={errors.address2?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              {...register('zip', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register('city', {
                required: { value: true, message: 'Campo requerido' },
                minLength: { value: 3, message: 'Minimo 3 caracteres' },
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              fullWidth
              select
              label="Pais"
              {...register('country', {
                required: { value: true, message: 'Campo requerido' },
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            >
              {countries.map(({ name, code }) => (
                <MenuItem value={code} key={code}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register('phone', {
                required: { value: true, message: 'Campo requerido' },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            color="secondary"
            className="circular-btn"
            size="large"
            type="submit"
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// Vamos a verificar si estamos logeados
// Esta es la forma en como podemos verificar si ya estamos logeados con SSR
// Ahora verificamos esto con un middleware
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   // Autenticacion personalizada
//   // const { token = '' } = req.cookies;
//   // let tokenIsValid = false;

//   // try {
//   //   await isValidToken(token);
//   //   tokenIsValid = true;
//   // } catch (error) {
//   //   tokenIsValid = false;
//   // }

//   // if (!token || !tokenIsValid) {
//   //   return {
//   //     redirect: {
//   //       destination: '/auth/login?p=/checkout/address',
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   const session = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET || '',
//   });

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default AddressPage;
