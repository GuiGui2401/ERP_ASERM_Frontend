import React, { useEffect, useState, useContext } from "react";
import { 
  Button, 
  Col, 
  Row, 
  Typography, 
  Badge,
  Avatar,
  Space,
  Dropdown,
  Menu,
  Tooltip
} from "antd";

import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined
} from "@ant-design/icons";

import { 
  BsGrid1X2Fill, 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill 
} from 'react-icons/bs';

import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

import { ModuleContext } from './ModuleContext';
import { useSelector } from "react-redux";

import NotificationIcon from "../componentsDistribution/notification/NotificationIcon";
import DueClientNotification from "../componentsDistribution//notification/DueClientNotification";

const { Title, Text } = Typography;

function Header({ onPress, collapsed, handleCollapsed }) {
  const { setSelectedModule, handleModuleClick } = useContext(ModuleContext);
  
  useEffect(() => window.scrollTo(0, 0), []);

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

  // Menu utilisateur
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Mon profil</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        <Link to="/admin/auth/logout">Se déconnecter</Link>
      </Menu.Item>
    </Menu>
  );

  // Personnalisation des modules
  const modules = [
    {
      key: "MSC",
      title: "Supply Chain",
      icon: <BsGrid1X2Fill className={styles.moduleIcon} />,
      link: "/dashboard",
      color: "#1890ff"
    },
    {
      key: "MV",
      title: "Ventes",
      icon: <BsFillArchiveFill className={styles.moduleIcon} />,
      link: "/dashboardvente",
      color: "#52c41a"
    },
    {
      key: "MR",
      title: "Ressources Humaines",
      icon: <BsFillGrid3X3GapFill className={styles.moduleIcon} />,
      link: "/admin/dashboard",
      color: "#fa8c16"
    }
  ];

  return (
    <div className={styles.headerContainer}>
      <Row gutter={[16, 16]} align="middle" className={styles.headerRow}>
        {/* Bouton de repli du menu latéral */}
        <Col flex="none">
          {isLogged && (
            <Button 
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => handleCollapsed(!collapsed)}
              className={styles.collapseButton}
            />
          )}
        </Col>
        
        {/* Modules */}
        <Col flex="auto">
          <Space size="middle" className={styles.moduleContainer}>
            {isLogged && modules.map(module => (
              <Link to={module.link} key={module.key}>
                <Button
                  type="text"
                  size="large"
                  className={styles.moduleButton}
                  style={{ 
                    backgroundColor: `${module.color}15`,
                    color: module.color
                  }}
                  icon={module.icon}
                  onClick={() => handleModuleClick(module.key)}
                >
                  {module.title}
                </Button>
              </Link>
            ))}
          </Space>
        </Col>
        
        {/* Contrôles utilisateur */}
        <Col>
          <Space size="middle" align="center" className={styles.headerControls}>
            {/* Switch mode sombre/clair */}
            <Tooltip title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}>
              <div className={styles.darkModeToggle}>
                <DarkModeSwitch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size={20}
                />
              </div>
            </Tooltip>
            
            {/* Notifications */}
            {isLogged && (
              <>
                <Badge count={list?.length || 0} size="small" className={styles.notificationBadge}>
                  <NotificationIcon list={list} />
                </Badge>
                
                <Badge count={dueClientList?.length || 0} size="small" className={styles.notificationBadge}>
                  <DueClientNotification list={dueClientList} />
                </Badge>
              </>
            )}
            
            {/* Profil utilisateur */}
            {isLogged && (
              <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                <div className={styles.userInfo}>
                  <Space>
                    <Avatar icon={<UserOutlined />} className={styles.userAvatar} />
                    <Text strong className={styles.userName}>{user}</Text>
                  </Space>
                </div>
              </Dropdown>
            )}
            
            {/* Menu mobile */}
            {isLogged && (
              <Button
                type="text"
                icon={<DashboardOutlined />}
                onClick={onPress}
                className={styles.mobileMenuButton}
              />
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Header;