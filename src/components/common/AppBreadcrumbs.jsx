import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import "./AppBreadcrumbs.scss";

const BREADCRUMB_CONFIG = [
  {
    pattern: /^\/recipes\/recipe-details\/.+/,
    crumbs: [
      { labelKey: "recipes", href: "/recipes" },
      { labelKey: "recipeDetails" },
    ],
  },
  {
    pattern: /^\/recipes\/recipe-creation\/[^/]+$/,
    crumbs: [
      { labelKey: "recipes", href: "/recipes" },
      { labelKey: "editRecipe" },
    ],
  },
  {
    pattern: /^\/recipes\/recipe-creation$/,
    crumbs: [
      { labelKey: "recipes", href: "/recipes" },
      { labelKey: "newRecipe" },
    ],
  },
];

const AppBreadcrumbs = () => {
  const { t } = useTranslation("navigation");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const match = BREADCRUMB_CONFIG.find(({ pattern }) => pattern.test(pathname));

  if (!match) return null;

  return (
    <div className="breadcrumbs-spacer">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {match.crumbs.map((crumb, index) => {
            const isLast = index === match.crumbs.length - 1;
            return isLast ? (
              <Typography key={index} className="breadcrumbs__current">
                {t(`navigation.${crumb.labelKey}`)}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                className="breadcrumbs__link"
                onClick={() => navigate(crumb.href)}
              >
                {t(`navigation.${crumb.labelKey}`)}
              </Link>
            );
          })}
        </Breadcrumbs>
    </div>
  );
};

export default AppBreadcrumbs;
