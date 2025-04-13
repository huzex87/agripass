import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import navlogo from "../../assets/navlogo.jpg"; // Import the logo image
import Button1 from "../components/Button1"; // Import the Button1 component
import logo2 from "../../assets/logo2.png";
const NavbarMUI = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Triggers at < 900px

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#001f3d" }}>
        <Toolbar>
          {/* Logo or Brand Name */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <img src={logo2} alt="" style={{ width: "13%" }} />
            <h4>Disbursify</h4>
          </Box>

          {/* Desktop Links (Hidden on Mobile) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
              marginReft: 3,
            }}
          >
            {/* Search Bar */}
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
              About
            </Link>
            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
              Services
            </Link>
            <Button
              variant="outlined"
              component={Link}
              to={"/create_deployment"}
              sx={{
                borderColor: "#ff9900",
                color: "white",
                "&:hover": { backgroundColor: "#ff9900" },
              }}
            >
              Create Deployment
            </Button>
            <Button1
              label={"Deployment"}
              sx={{
                backgroundColor: "#FD8A2E",
                color: "black",
              }}
            />
          </Box>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#001f3d",
                color: "white",
                width: "300px",
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
            <MenuItem onClick={handleMenuClose} component={Link} to="#">
              Home
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="#">
              About
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="#">
              Services
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Button
                variant="outlined"
                component={Link}
                to={"/signup"}
                sx={{
                  borderColor: "#ff9900",
                  color: "white",
                  "&:hover": { backgroundColor: "#ff9900" },
                }}
              >
                Create Deployment
              </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Button1
                label={"Deployment"}
                sx={{
                  backgroundColor: "#FD8A2E",
                  color: "black",
                }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavbarMUI;
