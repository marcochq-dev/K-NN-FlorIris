import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link, useLocation } from "react-router-dom";
import "./layout.scss";
import { Collapse, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import { menuItems } from "./menuItems"; 

interface LayoutProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}
export default function Layout({ toggleDrawer, isDrawerOpen }: LayoutProps ) {
  const [openSubMenus, setOpenSubMenus] = useState<number[]>([]); 

  const location = useLocation();

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  

  const toggleSubMenu = (index: number) => {
    const isOpen = openSubMenus.includes(index);

    if (isOpen) {
      setOpenSubMenus(openSubMenus.filter((i) => i !== index));
    } else {
      setOpenSubMenus([...openSubMenus, index]);
    }
  };

  return (
    <div style={{ position: "relative" }} onClick={handleContainerClick}>
      <AppBar position="fixed" style={{ zIndex: 3 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <div className="cntm-layout-logo"></div>
          <div className="cntm-layout-spacer"></div>
          <div className="mat-h2"></div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          "&.MuiDrawer-root .MuiDrawer-paper": { marginTop: "64px" },
        }}
        anchor="left"
        open={isDrawerOpen}
        variant="persistent"
        className="drawer-with-margin"
        ModalProps={{
          keepMounted: true,
          style: {
            position: "fixed",
            zIndex: 2,
          },
          BackdropProps: {
            invisible: true,
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div onClick={() => toggleSubMenu(index)}>
                  <ListItem button
                    selected={location.pathname === item.link}
                    sx={{
                      width: "300px", // Establece el ancho deseado
                      height: "40px", // Establece la altura deseada
                      "&.Mui-selected": {
                        background: "#f0f0f0", // Establece el fondo seleccionado
                      },
                    }}>
                    <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openSubMenus.includes(index) ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openSubMenus.includes(index)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItem
                          button
                          key={subIndex}
                          component={Link}
                          to={subItem.link}
                        >
                          <ListItemIcon></ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              ) : (
                <Link
                  to={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem  button
                    selected={location.pathname === item.link}
                    sx={{
                      width: "300px", // Establece el ancho deseado
                      height: "40px", // Establece la altura deseada
                      "&.Mui-selected": {
                        background: "#f0f0f0", // Establece el fondo seleccionado
                      },
                    }}>
                    <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              )}
            </div>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
