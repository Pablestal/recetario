import { LinearProgress, Box } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 64, // Height of the AppBar
        left: 0,
        right: 0,
        zIndex: 1200, // Below AppBar (1300) but above content
      }}
    >
      <LinearProgress color="primary" />
    </Box>
  );
};

export default Loading;
