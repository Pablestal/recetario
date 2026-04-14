import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConstructionIcon from "@mui/icons-material/Construction";

const ProfileHeader = ({ profile, stats, tabs, isOwner, followButton }) => {
  const { t } = useTranslation("userProfile");

  return (
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
          {isOwner && (
            <Button
              variant="outlined"
              size="small"
              disabled
              endIcon={<ConstructionIcon sx={{ fontSize: 16 }} />}
            >
              {t("editProfile")}
            </Button>
          )}
          {followButton}
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

      {tabs && <div className="user-profile__header-tabs">{tabs}</div>}
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    location: PropTypes.string,
    bio: PropTypes.string,
  }),
  stats: PropTypes.shape({
    recipe_count: PropTypes.number.isRequired,
    followers_count: PropTypes.number.isRequired,
    following_count: PropTypes.number.isRequired,
  }).isRequired,
  tabs: PropTypes.node,
  isOwner: PropTypes.bool,
  followButton: PropTypes.node,
};

export default ProfileHeader;
