import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Box,
  IconButton,
  Badge,
  Button,
  Input,
  InputAdornment,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { ClearOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';
import { CartContext } from '../../context/cart/cartContext';

const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center" underline="none">
            <Typography variant="h6">Teslo |</Typography>
            <Typography
              sx={{
                ml: 0.5,
              }}
            >
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box
          sx={{
            display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <Button
              color={asPath.includes('/category/men') ? 'primary' : 'info'}
            >
              Hombres
            </Button>
          </NextLink>
          <NextLink href="/category/woman" passHref legacyBehavior>
            <Button
              color={asPath.includes('/category/woman') ? 'primary' : 'info'}
            >
              Mujeres
            </Button>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Button
              color={asPath.includes('/category/kid') ? 'primary' : 'info'}
            >
              Niños
            </Button>
          </NextLink>
        </Box>

        <Box flex={1} />

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
          }}
          className="fadeIn"
        >
          {isSearchVisible ? (
            <Input
              className="fadeIn"
              autoFocus
              type="text"
              onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                  >
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton onClick={() => setIsSearchVisible(!isSearchVisible)}>
              <SearchOutlinedIcon />
            </IconButton>
          )}
        </Box>

        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlinedIcon />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? `9+` : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
