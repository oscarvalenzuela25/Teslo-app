import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
  Divider,
} from '@mui/material';
import {
  NextPage,
  // ,GetServerSideProps
} from 'next';
import React, { useEffect, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { isEmail } from '../../utils/validations';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { signIn, getProviders } from 'next-auth/react';
// import { unstable_getServerSession } from 'next-auth/next';
// import { authOptions } from '../api/auth/[...nextauth]';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

type FormData = {
  email: string;
  password: string;
};

type ProviderType = 'github' | 'google';

const LoginPage: NextPage = () => {
  const router = useRouter();
  // Login personalizado
  //  const { loginUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const destination = router.query.p?.toString();

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    // Login next-auth
    await signIn('credentials', {
      email,
      password,
    });

    // Login personalizado
    // const isValidLogin = await loginUser(email, password);
    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 3000);
    //   return;
    // }
    // router.replace(destination || '/');
  };

  const getIconByProvider = (provider: ProviderType) => {
    switch (provider) {
      case 'github':
        return <GitHubIcon />;
      case 'google':
        return <GoogleIcon />;
      default:
        return null;
    }
  };

  useEffect(() => {
    getProviders().then(prov => {
      setProviders(prov);
    });
  }, []);

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesion
              </Typography>
              <Chip
                label="No reconocemos ese usuario / password"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="password"
                label="Password"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
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
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <NextLink
                href={`/auth/register${destination && `?p=${destination}`}`}
                passHref
                legacyBehavior
              >
                <Link variant="body2">no tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display="flex" flexDirection="column">
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials')
                  return <div key="credentials"></div>;
                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    startIcon={getIconByProvider(provider.id)}
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
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

export default LoginPage;
