import CreateGroup from "components/group/CreateGroup";
import { Box, Toolbar } from "@mui/material";
import NavBar from "components/navBar/NavBar";
import { PageName } from "types";

function DashboardPage() {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar selectedName={PageName.CREATEGROUP} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Toolbar />
        <CreateGroup />
      </Box>
    </Box>
  );
}
export default DashboardPage;
