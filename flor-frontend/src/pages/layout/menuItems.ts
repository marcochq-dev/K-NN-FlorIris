import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from '@mui/icons-material/Add';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ListIcon from '@mui/icons-material/List';
import VerifiedIcon from '@mui/icons-material/Verified';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DataArrayIcon from '@mui/icons-material/DataArray';

export const menuItems = [
  {
    text: "Datos de Entrenamiento",
    link: "/home",
    icon: DataArrayIcon, 
  },  
  {
    text: "Clasificar",
    link: "/clasificar",
    icon: VerifiedIcon, 
  },
  {
    text: "Plano Kd-tree",
    link: "/planokd",
    icon: GraphicEqIcon, 
  },
  {
    text: "Score-f1",
    link: "/score",
    icon: GraphicEqIcon, 
  },
 
  {
    text: "Otros",
    icon: GraphicEqIcon,
    subItems: [
      {
        text: "frafico1",
        link: "/dashboard/qty-request",
       
      },
      {
        text: "grafico2",
        link: "/dashboard/status-request",
       
      },
      {
        text: "grafico3",
        link: "/dashboard/sla-request",
       
      },
    ],
  }
];
