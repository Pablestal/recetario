import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useAuthStore } from "../../stores/useAuthStore";
import LoginDialog from "../auth/LoginDialog";
import RegisterDialog from "../auth/RegisterDialog";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const pages = [
  { name: "profile", link: "/" },
  { name: "recipes", link: "/recipes" },
  { name: "shoppingList", link: "/shopping-list" },
  { name: "weeklyMenu", link: "/weeekly-menu" },
];
const settings = ["profile", "account", "logout"];

const TopMenu = () => {
  const { t } = useTranslation("navigation");
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const showLoginModal = useAuthStore((state) => state.showLoginModal);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const goTo = (page) => {
    navigate(page.link);
    handleCloseNavMenu();
  };

  const goToHome = () => {
    navigate("/");
  };

  const handleSettingClick = async (setting) => {
    handleCloseUserMenu();

    if (setting === "logout") {
      await signOut();
      navigate("/");
    } else if (setting === "profile") {
      navigate("/profile");
    } else if (setting === "account") {
      navigate("/account");
    }
  };

  const handleOpenLogin = () => {
    setRegisterOpen(false);
    openLoginModal();
  };

  const handleOpenRegister = () => {
    closeLoginModal();
    setRegisterOpen(true);
  };

  const handleCloseDialogs = () => {
    closeLoginModal();
    setRegisterOpen(false);
  };

  const handleSwitchToRegister = () => {
    closeLoginModal();
    setRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    openLoginModal();
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <BakeryDiningIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              onClick={goToHome}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              RECETARIO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={index} onClick={() => goTo(page)}>
                    <Typography sx={{ textAlign: "center" }}>
                      {t(`navigation.${page.name}`)}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              onClick={goToHome}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              RECETARIO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={index}
                  sx={{ my: 2, color: "white", display: "block" }}
                  onClick={() => goTo(page)}
                >
                  {t(`navigation.${page.name}`)}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <LanguageSelector />
            </Box>
            {/* If NO user, show Login/Register buttons */}
            {!user ? (
              <>
                {/* Desktop - Full buttons with text */}
                <Box
                  sx={{
                    flexGrow: 0,
                    display: { xs: "none", md: "flex" },
                    gap: 1,
                    ml: 2,
                  }}
                >
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleOpenLogin}
                    sx={{
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {t("navigation.login")}
                  </Button>
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={handleOpenRegister}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                  >
                    {t("navigation.register")}
                  </Button>
                </Box>

                {/* Mobile - Only icons */}
                <Box
                  sx={{
                    flexGrow: 0,
                    display: { xs: "flex", md: "none" },
                    gap: 1,
                    ml: 1,
                  }}
                >
                  <IconButton
                    color="inherit"
                    onClick={handleOpenLogin}
                    sx={{
                      padding: "8px",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    <LoginIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={handleOpenRegister}
                    sx={{
                      color: "white",
                      padding: "8px",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                  >
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            ) : (
              /* If user LOOGED, show user menu */
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                    <Avatar alt={user.email}>
                      {user.email?.[0]?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleSettingClick(setting)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {t(`navigation.${setting}`)}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login and Register Dialogs */}
      <LoginDialog
        open={showLoginModal}
        onClose={handleCloseDialogs}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterDialog
        open={registerOpen}
        onClose={handleCloseDialogs}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default TopMenu;
