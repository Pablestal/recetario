import "./UserProfile.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { routes } from "../../routes";
import { RECIPE_VIEWS } from "../recipeList/recipeList.constants";
import Loading from "../common/Loading";
import ProfileHeader from "./ProfileHeader";
import ProfileRecipesTab from "./ProfileRecipesTab";
import ProfileCollectionsTab from "./ProfileCollectionsTab";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PROFILE_TABS = { RECIPES: 0, COLLECTIONS: 1 };

const UserProfile = () => {
  const { username } = useParams();
  const { t } = useTranslation("userProfile");
  const navigate = useNavigate();

  const loggedUser = useAuthStore((state) => state.user);
  const getToken = useAuthStore((state) => state.getToken);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    recipe_count: 0,
    followers_count: 0,
    following_count: 0,
  });
  const [previewRecipes, setPreviewRecipes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [activeTab, setActiveTab] = useState(
    () => Number(localStorage.getItem("profile_active_tab")) || PROFILE_TABS.RECIPES,
  );

  const storeRecipes = useRecipeStore((state) => state.recipes);

  const isOwner = !!(loggedUser?.id && profile?.id && loggedUser.id === profile.id);
  const showFollowButton = !!(loggedUser && profile && !isOwner);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);

      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const profileRes = await fetch(`${API_URL}/users/username/${username}`, { headers });

      if (!profileRes.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: profileData } = await profileRes.json();
      setProfile(profileData);
      setStats({
        recipe_count: profileData.recipe_count,
        followers_count: profileData.followers_count,
        following_count: profileData.following_count,
      });

      const requests = [
        fetch(`${API_URL}/users/${profileData.id}/recipes?limit=8`, { headers }),
        fetch(`${API_URL}/users/${profileData.id}/collections`, { headers }),
      ];

      if (token && loggedUser?.id !== profileData.id) {
        requests.push(
          fetch(`${API_URL}/users/${profileData.id}/is-following`, { headers }),
        );
      }

      const [recipesRes, collectionsRes, followingRes] = await Promise.all(requests);

      if (recipesRes.ok) {
        const { data } = await recipesRes.json();
        setPreviewRecipes(
          data.map((r) => ({ ...r, user_id: r.user_id ?? profileData.id })),
        );
      }

      if (collectionsRes.ok) {
        const { data } = await collectionsRes.json();
        setCollections(data);
      }

      if (followingRes?.ok) {
        const { data } = await followingRes.json();
        setIsFollowing(data.isFollowing);
      }

      setLoading(false);
    };

    fetchData();
  }, [username, getToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFollow = async () => {
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setStats((prev) => ({
      ...prev,
      followers_count: prev.followers_count + (wasFollowing ? -1 : 1),
    }));

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      if (wasFollowing) {
        await fetch(`${API_URL}/users/${profile.id}/follow`, { method: "DELETE", headers });
      } else {
        await fetch(`${API_URL}/users/${profile.id}/follow`, { method: "POST", headers });
      }
    } catch {
      setIsFollowing(wasFollowing);
      setStats((prev) => ({
        ...prev,
        followers_count: prev.followers_count + (wasFollowing ? 1 : -1),
      }));
    } finally {
      setFollowLoading(false);
    }
  };

  const recipesWithBookmarks = useMemo(
    () =>
      previewRecipes.map((recipe) => {
        const updated = storeRecipes.find((r) => r.id === recipe.id);
        return updated !== undefined
          ? { ...recipe, is_bookmarked: updated.is_bookmarked }
          : recipe;
      }),
    [previewRecipes, storeRecipes],
  );

  const handleViewAll = () =>
    navigate(`${routes.recipes}?view=${RECIPE_VIEWS.MINE}`);

  if (loading) return <Loading />;

  if (notFound) {
    return (
      <div className="user-profile">
        <Typography color="text.secondary" sx={{ py: 10, textAlign: "center" }}>
          {t("userNotFound")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="user-profile__banner" />

      <ProfileHeader
        profile={profile}
        stats={stats}
        isOwner={isOwner}
        followButton={
          showFollowButton ? (
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              size="small"
              disabled={followLoading}
              onClick={handleFollow}
              color="secondary"
            >
              {isFollowing ? t("unfollow") : t("follow")}
            </Button>
          ) : null
        }
        tabs={
          <Tabs
            value={activeTab}
            onChange={(_, v) => {
              setActiveTab(v);
              if (isOwner) localStorage.setItem("profile_active_tab", v);
            }}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label={t("tabRecipes")} />
            <Tab label={t("tabCollections")} />
          </Tabs>
        }
      />

      <div className="user-profile__tab-content">
        {activeTab === PROFILE_TABS.RECIPES && (
          <ProfileRecipesTab
            recipes={recipesWithBookmarks}
            onViewAll={isOwner ? handleViewAll : null}
          />
        )}
        {activeTab === PROFILE_TABS.COLLECTIONS && (
          <ProfileCollectionsTab userId={profile.id} isOwner={isOwner} initialCollections={collections} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
