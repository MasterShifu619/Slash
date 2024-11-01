import React from "react";
import Home from "../components/Home";
import HomeIcon from "@mui/icons-material/Home";
import Menu from "../components/Menu";
import Graphs from "../components/Graphs";
import Logout from "../components/Logout";
import Results from "../components/Results";
import { CartProvider } from '../components/Home';
import SummarizeIcon from "@mui/icons-material/Summarize";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import InsightsIcon from "@mui/icons-material/Insights";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const routes = [
  {
    path: "/",
    name: "Menu",
    element: <Menu />,
    icon: <SummarizeIcon />
  },
  {
    path: "/graphs",
    name: "Graphs",
    element: <Graphs />,
    icon: <InsightsIcon />
  },
  {
    path: "/wishlist",
    name: "My Wishlist",
    element: <Home />,
    icon: <FormatListBulletedIcon />
  },
  {
    path: "/logout",
    name: "Logout",
    element: <Logout /> 
  }
];
