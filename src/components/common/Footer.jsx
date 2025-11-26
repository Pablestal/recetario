import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import { GitHub, Twitter, Instagram, Email } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "./Footer.scss";

const Footer = () => {
  const { t } = useTranslation("navigation");
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Box className="footer__content">
          {/* Columna izquierda - Info de la app */}
          <Box className="footer__section">
            <Typography variant="h6" className="footer__title">
              LUMEA
            </Typography>
            <Typography variant="body2" className="footer__description">
              {t("navigation.footer.description")}
            </Typography>
          </Box>

          {/* Columna central - Enlaces rápidos */}
          <Box className="footer__section">
            <Typography variant="h6" className="footer__subtitle">
              {t("navigation.footer.quickLinks")}
            </Typography>
            <Box className="footer__links">
              <Link href="/recipes" className="footer__link">
                {t("navigation.recipes")}
              </Link>
              <Link href="/shopping-list" className="footer__link">
                {t("navigation.shoppingList")}
              </Link>
              <Link href="/weekly-menu" className="footer__link">
                {t("navigation.weeklyMenu")}
              </Link>
            </Box>
          </Box>

          {/* Columna derecha - Redes sociales */}
          <Box className="footer__section">
            <Typography variant="h6" className="footer__subtitle">
              {t("navigation.footer.followUs")}
            </Typography>
            <Box className="footer__social">
              <IconButton
                aria-label="GitHub"
                className="footer__social-icon"
                size="small"
              >
                <GitHub />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                className="footer__social-icon"
                size="small"
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                className="footer__social-icon"
                size="small"
              >
                <Instagram />
              </IconButton>
              <IconButton
                aria-label="Email"
                className="footer__social-icon"
                size="small"
              >
                <Email />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box className="footer__bottom">
          <Typography variant="body2" className="footer__copyright">
            © {currentYear} Lumea. {t("navigation.footer.rights")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
