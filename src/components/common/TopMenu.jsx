import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import LumeaLogo from "../../assets/Lumea-nobg.png";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useAuthStore } from "../../stores/useAuthStore";
import LoginDialog from "../auth/LoginDialog";
import RegisterDialog from "../auth/RegisterDialog";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ConstructionIcon from "@mui/icons-material/Construction";
import "./TopMenu.scss";

const staticPages = [
  { name: "recipes", link: routes.recipes, activeBase: routes.recipes },
  {
    name: "shoppingList",
    link: routes.shoppingList,
    activeBase: routes.shoppingList,
    disabled: true,
  },
  {
    name: "weeklyMenu",
    link: routes.weeklyMenu,
    activeBase: routes.weeklyMenu,
    disabled: true,
  },
];
const settings = [
  { name: "profile" },
  { name: "account", disabled: true },
  { name: "logout" },
];

const TopMenu = () => {
  const { t } = useTranslation("navigation");
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const pages = [
    ...(user && profile?.username
      ? [{ name: "profile", link: routes.profile(profile.username), activeBase: "/profile" }]
      : []),
    ...staticPages,
  ];
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
    navigate(routes.recipes);
  };

  const handleSettingClick = async (setting) => {
    if (setting.disabled) return;
    handleCloseUserMenu();

    if (setting.name === "logout") {
      await signOut();
      navigate(routes.recipes);
    } else if (setting.name === "profile") {
      if (profile?.username) navigate(routes.profile(profile.username));
    } else if (setting.name === "account") {
      navigate(routes.account);
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
      <AppBar position="fixed" sx={{ bgcolor: "white" }}>
        <Box className="nav-inner">
          <Toolbar disableGutters sx={{ minHeight: "64px", height: "64px" }}>
            <Box
              onClick={goToHome}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                cursor: "pointer",
                mr: 2,
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <img
                src={LumeaLogo}
                alt="Lumea"
                style={{ height: "60px", width: "auto" }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: "secondary.main" }}
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
                  <MenuItem
                    key={index}
                    onClick={() => !page.disabled && goTo(page)}
                    disabled={page.disabled}
                    className={`mobile-menu-item${location.pathname.startsWith(page.activeBase) ? " mobile-menu-item--active" : ""}`}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      {t(`navigation.${page.name}`)}
                      {page.disabled && (
                        <ConstructionIcon sx={{ fontSize: 16 }} />
                      )}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              onClick={goToHome}
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <img
                src={LumeaLogo}
                alt="Lumea"
                style={{ height: "50px", width: "auto" }}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                height: "64px",
                alignItems: "stretch",
                justifyContent: "center",
              }}
            >
              {pages.map((page, index) => (
                <Button
                  key={index}
                  disabled={page.disabled}
                  className={`menu-button${location.pathname.startsWith(page.activeBase) ? " menu-button--active" : ""}`}
                  sx={{
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    height: "100%",
                    px: 2,
                  }}
                  onClick={() => goTo(page)}
                >
                  {t(`navigation.${page.name}`)}
                  {page.disabled && <ConstructionIcon sx={{ fontSize: 16 }} />}
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
                    variant="outlined"
                    onClick={handleOpenLogin}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "rgba(35, 61, 77, 0.05)",
                      },
                    }}
                  >
                    {t("navigation.login")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleOpenRegister}
                    sx={{
                      bgcolor: "secondary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "secondary.dark",
                      },
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
                    onClick={handleOpenLogin}
                    sx={{
                      color: "primary.main",
                      padding: "8px",
                      "&:hover": { bgcolor: "rgba(35, 61, 77, 0.1)" },
                    }}
                  >
                    <LoginIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenRegister}
                    sx={{
                      color: "secondary.main",
                      padding: "8px",
                      "&:hover": { bgcolor: "rgba(254, 127, 45, 0.1)" },
                    }}
                  >
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            ) : (
              /* If user LOOGED, show user menu */
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                  <Avatar alt={user.email}>
                    {user.email?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
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
                  disableScrollLock
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      disabled={setting.disabled}
                      onClick={() => handleSettingClick(setting)}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        {t(`navigation.${setting.name}`)}
                        {setting.disabled && (
                          <ConstructionIcon sx={{ fontSize: 16 }} />
                        )}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Box>
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
