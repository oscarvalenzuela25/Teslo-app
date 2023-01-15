import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import {
  NextPage,
  // , GetServerSideProps
} from 'next';
import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { isEmail } from '../../utils/validations';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
// import { unstable_getServerSession } from 'next-auth';
// import { authOptions } from '../api/auth/[...nextauth]';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const destination = router.query.p?.toString();

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    setShowError(false);
    setErrorMessage('');
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setErrorMessage(message || '');
      setShowError(true);
      setTimeout(() => setShowError(false), 10000);
      return;
    }
    // router.replace(destination || '/');

    // Login next-auth
    await signIn('credentials', {
      email,
      password,
    });
  };

  return (
    <AuthLayout title="Registro">
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip
                color="error"
                label={errorMessage}
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Nombre completo"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: true,
                  minLength: { value: 3, message: 'Minimo 3 caracteres' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: true,
                  validate: isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                type="password"
                {...register('password', {
                  required: true,
                  minLength: { value: 6, message: 'Minimo 6 caracteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <NextLink
                href={`/auth/login${destination && '?p=' + destination}`}
                passHref
                legacyBehavior
              >
                <Link variant="body2">ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// Vamos a verificar si estamos logeados
// Esta es la forma en como podemos verificar si ya estamos logeados con SSR
// Ahora verificamos esto con un middleware
// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   res,
//   query,
// }) => {
//   const session = await unstable_getServerSession(req, res, authOptions);
//   const { p = '/' } = query;

//   if (session) {
//     return {
//       redirect: {
//         destination: p.toString(),
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default RegisterPage;
