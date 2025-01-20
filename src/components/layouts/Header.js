import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  RotateLeftOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState, useContext } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { Button, Col, Row, Typography, Divider } from "antd";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import 
{ BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill  }
 from 'react-icons/bs'
 
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

import { ModuleContext } from './ModuleContext';

import { useSelector } from "react-redux";


import NotificationIcon from "../componentsDistribution/notification/NotificationIcon";
import DueClientNotification from "../componentsDistribution//notification/DueClientNotification";

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}>
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({ onPress, collapsed, handleCollapsed }) {
  const { setSelectedModule, handleModuleClick } = useContext(ModuleContext);
  useEffect(() => window.scrollTo(0, 0));

  const [list, setList] = useState([]);
  const [dueClientList, setDueClientList] = useState([]);

  const isLogged = localStorage.getItem("isLogged");
  const user = localStorage.getItem("user");

  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  const productsList = useSelector((state) => state.products.list);
  const Clientlist = useSelector((state) => state.sales.list);

  useEffect(() => {
    if (isDarkMode) document.body.className = "dark-theme";
    if (!isDarkMode) document.body.className = "light-theme";
    setList(productsList);
    setDueClientList(Clientlist);
  }, [isDarkMode, productsList, Clientlist]);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={1}>
          <div className={styles.sidebarTogglerPC}>
            {isLogged &&
              React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: `${styles.trigger}`,
                  onClick: () => handleCollapsed(!collapsed),
                },
              )}
          </div>
        </Col>
        <Col span={24} md={5}>
           {isLogged && (
          <a href="/dashboard"><div className='topButton' onClick={() => handleModuleClick('MSC')}>
                  <BsGrid1X2Fill className='card_icon'/>
                  <h3 style={{fontSize : "120%"}}>MODULE SUPPLY CHAIN</h3>
            </div></a>
           )}
        </Col>
          {isLogged && (
        <Col span={24} md={5}>
          <a href="/dashboardvente" ><div className='topButton2' onClick={() => handleModuleClick('MV')}>
                  <BsFillArchiveFill className='card_icon'/>
                  <h3 style={{fontSize : "120%"}}>MODULE DES VENTES</h3>
            </div></a>
        </Col>
          )}
         {isLogged && (
        <Col span={24} md={5}>
          <a href="/admin/dashboard"><div className='topButton3' onClick={() => handleModuleClick('MR')}>
                  <BsFillGrid3X3GapFill className='card_icon'/>
                  <h3 style={{fontSize : "120%"}}>RESSOURCES HUMAINES</h3>
            </div></a>
        </Col>
         )}
        <Col span={24} md={8} className={styles.headerControl}>
          <DarkModeSwitch
            style={{ margin: "1rem" }}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={20}
          />
          {isLogged && (
          <NotificationIcon list={list} />
          )}
          {isLogged && (
          <DueClientNotification list={dueClientList} />
          )}
          {isLogged && (
            <Typography.Title level={5} style={{ margin: 0 }} className="me-3">
              <UserOutlined style={{ fontSize: "16px" }} /> {user}
            </Typography.Title>
          )}
          {isLogged ? (
            <Link to="/admin/auth/logout" className={styles.logoutLink}>
              <LogoutOutlined className="text-danger" />
              <span className="logout-text font-weight-bold">Se déconnecter</span>
            </Link>
          ) : (
            <Link to="/admin/auth/login" className="btn-sign-in text-dark">
              <span></span>
            </Link>
          )}
          {isLogged && (
            <>
            <Button
              type="link"
              className={styles.sidebarTogglerMobile}
              onClick={() => onPress()}
              style={{ boxShadow: "none" }}>
              <MenuOutlined
                className={`${styles.hamburgerMenuIcon} hamburger-menu-icon`}
              />
            </Button> 
        </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Header;
