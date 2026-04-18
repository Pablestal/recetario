import { Paper } from "@mui/material";
import ProfileSection from "../components/account/ProfileSection";
import SecuritySection from "../components/account/SecuritySection";
import DangerZone from "../components/account/DangerZone";
import "./AccountPage.scss";

const AccountPage = () => {
  return (
    <div className="account-page">
      <div className="account-page__sections">
        <Paper elevation={1} className="account-page__card" sx={{ borderRadius: "0 0 12px 12px" }}>
          <ProfileSection />
        </Paper>

        <Paper elevation={1} className="account-page__card">
          <SecuritySection />
        </Paper>

        <Paper elevation={1} className="account-page__card account-page__card--danger">
          <DangerZone />
        </Paper>
      </div>
    </div>
  );
};

export default AccountPage;
