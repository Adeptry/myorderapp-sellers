import { Box, Typography } from "@mui/material";

export const FooterLayout = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      sx={{
        left: 0,
        bottom: 0,
        width: "100%",
        bgcolor: "background.paper",
        color: "text.primary",
        textAlign: "center",
        py: 2,
      }}
    >
      <Typography variant="body1">MyOrderApp &copy; {year}</Typography>
    </Box>
  );
};
