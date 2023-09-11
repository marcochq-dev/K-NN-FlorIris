import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Layout from "./pages/layout/Layout";

import { Container } from "@mui/material";
import routePath from "./route-config";
import React from "react";

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };
    const containerStyle = {
      marginLeft: isDrawerOpen ? "350px" : "0", 
      transition: "margin 0.3s ease", 
    };
  return (
    <>
      <BrowserRouter>
        <Layout toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
        <Container className="home-container" style={containerStyle}>
          <main className="content">
            <Routes>
            {routePath.map(route => <Route key={route.path} path={route.path} element={<route.component/>}></Route>)}

            </Routes>
            <Routes />
          </main>
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
