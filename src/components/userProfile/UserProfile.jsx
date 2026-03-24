import "./UserProfile.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Tab, Tabs, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConstructionIcon from "@mui/icons-material/Construction";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import { useAuthStore } from "../../stores/useAuthStore";
import { routes } from "../../routes";
import { RECIPE_VIEWS } from "../recipeList/recipeList.constants";
import RecipeCard from "../recipeList/RecipeCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PROFILE_TABS = { RECIPES: 0, COLLECTIONS: 1, FAVORITES: 2 };

const UnderConstruction = ({ t }) => (
  <div className="user-profile__under-construction">
    <ConstructionIcon sx={{ fontSize: 52, color: "text.disabled" }} />
    <Typography variant="h6" color="text.secondary">
      {t("underConstruction")}
    </Typography>
    <Typography variant="body2" color="text.disabled">
      {t("underConstructionSubtitle")}
    </Typography>
  </div>
);

const UserProfile = () => {
  const { t } = useTranslation("userProfile");
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const getToken = useAuthStore((state) => state.getToken);

  const [activeTab, setActiveTab] = useState(PROFILE_TABS.RECIPES);
  const [stats, setStats] = useState({
    recipe_count: 0,
    followers_count: 0,
    following_count: 0,
  });
  const [previewRecipes, setPreviewRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [profileRes, recipesRes] = await Promise.all([
        fetch(`${API_URL}/users/${user.id}`, { headers }),
        fetch(`${API_URL}/users/${user.id}/recipes?limit=8`, { headers }),
      ]);

      if (profileRes.ok) {
        const { data } = await profileRes.json();
        setStats({
          recipe_count: data.recipe_count,
          followers_count: data.followers_count,
          following_count: data.following_count,
        });
      }

      if (recipesRes.ok) {
        const { data } = await recipesRes.json();
        setPreviewRecipes(data);
      }

      setLoadingRecipes(false);
    };

    fetchData();
  }, [user?.id, getToken]);

  const handleViewAll = () => {
    navigate(`${routes.recipes}?view=${RECIPE_VIEWS.MINE}`);
  };

  if (loadingRecipes) return <Loading />;

  return (
    <div className="user-profile">
      <div className="user-profile__banner" />

      <div className="user-profile__header">
        <Avatar
          src={profile?.avatar_url}
          className="user-profile__avatar"
          sx={{ width: 96, height: 96 }}
        >
          {profile?.name?.[0]?.toUpperCase()}
        </Avatar>

        <div className="user-profile__header-body">
          <div className="user-profile__header-top">
            <div>
              <Typography variant="h5" fontWeight={600}>
                {profile?.name}
              </Typography>
              {profile?.location && (
                <div className="user-profile__location">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {profile.location}
                  </Typography>
                </div>
              )}
            </div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(routes.account)}
            >
              {t("editProfile")}
            </Button>
          </div>

          {profile?.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {profile.bio}
            </Typography>
          )}

          <div className="user-profile__stats">
            <span>
              <strong>{stats.recipe_count}</strong> {t("recipes")}
            </span>
            <span className="user-profile__stats-dot">·</span>
            <span>
              <strong>{stats.followers_count}</strong> {t("followers")}
            </span>
            <span className="user-profile__stats-dot">·</span>
            <span>
              <strong>{stats.following_count}</strong> {t("following")}
            </span>
          </div>
        </div>
      </div>

      <div className="user-profile__tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label={t("tabRecipes")} />
          <Tab label={t("tabCollections")} />
          <Tab label={t("tabFavorites")} />
        </Tabs>
      </div>

      <div className="user-profile__tab-content">
        {activeTab === PROFILE_TABS.RECIPES && (
          <>
            {previewRecipes.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ py: 6, textAlign: "center" }}
              >
                {t("noRecipes")}
              </Typography>
            )}
            {previewRecipes.length > 0 && (
              <>
                <div className="user-profile__recipe-grid">
                  {previewRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={routes.recipeDetails(recipe.id)}
                      className="no-link-style"
                    >
                      <RecipeCard recipe={recipe} />
                    </Link>
                  ))}
                </div>
                <div className="user-profile__view-all">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleViewAll}
                  >
                    {t("viewAll")}
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === PROFILE_TABS.COLLECTIONS && <UnderConstruction t={t} />}
        {activeTab === PROFILE_TABS.FAVORITES && <UnderConstruction t={t} />}
      </div>
    </div>
  );
};

export default UserProfile;
