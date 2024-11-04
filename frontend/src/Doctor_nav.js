import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  
  {
    component: CNavTitle,
    name: "Components",
  },
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/#/dashboard",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Receptionist",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/receptionist_data",
  },
  {
    component: CNavItem,
    name: "Patient",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Patient_data",
  },
  {
    component: CNavItem,
    name: "Today's Appointments",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/doctor_appointment",
  },
  {
    component: CNavItem,
    name: "Medicine",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/medicine_data",
  },
  {
    component: CNavTitle,
    name: "Extras",
  },
  {
    component: CNavGroup,
    name: "Pages",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      
    ],
  },
  {
    component: CNavItem,
    name: "Docs",
    href: "https://coreui.io/react/docs/templates/installation/",
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
];

export default _nav;
