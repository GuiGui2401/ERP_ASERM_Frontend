import { useState, useEffect, useContext } from "react";
import {
  CheckOutlined,
  FileSyncOutlined,
  FundOutlined,
  HomeOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  SettingOutlined,
  FolderAddOutlined,
  FileAddOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  UsergroupDeleteOutlined,
  SnippetsOutlined,
  RocketOutlined,
  NotificationFilled,
  TrophyFilled,
  SubnodeOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  PieChartFilled,
  FileOutlined,
  FlagFilled,
  WalletOutlined,
  FlagOutlined,
  UnderlineOutlined,
  FileAddFilled,
  HeatMapOutlined
} from "@ant-design/icons";
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill }
  from 'react-icons/bs'
import { Divider, Menu } from "antd";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/images/logoaserm.png";
import NotificationIcon from "../componentsDistribution/notification/NotificationIcon";
import { loadProduct } from "../../redux/reduxDistribution/actions/product/getAllProductAction";
import { loadAllSale } from "../../redux/reduxDistribution/actions/sale/getSaleAction";
import DueClientNotification from "../componentsDistribution//notification/DueClientNotification";
import getUserFromToken from "../../utils/GetUserFromToken";
import getPermissions from "../../utils/getPermissions";
import moment from "moment";
// import styles from "./Sidenav.module.css";
import { ModuleContext } from "../layouts/ModuleContext";
const pdfFile = require("./help.pdf");

const Test = (props) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [dueClientList, setDueClientList] = useState([]);
  const user = getUserFromToken();
  const permissions = getPermissions();
  const location = useLocation();
  const currentpath = location.pathname;
  // const [selectedModule, setSelectedModule] = useState("Global");
  const { selectedModule, handleModuleClick } = useContext(ModuleContext);

  const hasPermission = (item) => {
    return permissions?.includes(item ? item : "");
  };
  useEffect(() => {
    dispatch(loadProduct({ status: "true", page: 1, limit: 10 }));
  }, []);
  useEffect(() => {
    dispatch(
      loadAllSale({
        status: "true",
        page: 1,
        limit: 100,
        startdate: moment().startOf("month"),
        enddate: moment().endOf("month"),
        user: "",
      })
    );
  }, []);

  const productsList = useSelector((state) => state.products.list);
  const Clientlist = useSelector((state) => state.sales.list);

  useEffect(() => {
    setList(productsList);
    setDueClientList(Clientlist);
  }, [productsList, Clientlist]);

  const getMenuItems = () => {
    switch (selectedModule) {
      case "MSC": // Module Supply Chain
        return menu.slice(3, 8).concat(menu.slice(10, 11)); // Afficher les 4 premiers éléments
      case "MV": // Module Vente
        return menu.slice(8, 10).concat(menu.slice(11, 12)); // Afficher du tableau de bord à aide
      case "MR": // Module RH
        return menu.slice(12, 24); // Afficher de Dashboard à Projet
      case "Global": // Module Supply Chain
        return menu.slice(0, 3);
      default:
        return menu.slice(3);
    }
  };

  const menu = [
    {
      label: (
        <NavLink to="/dashboard">
          <span>SUPPLY CHAIN</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <BsGrid1X2Fill />,
    },
    {
      label: (
        <NavLink to="/dashboardvente">
          <span>VENTES</span>
        </NavLink>
      ),
      key: "MV",
      icon: <BsFillArchiveFill />,
    },
    {
      label: (
        <NavLink to="/admin/dashboard">
          <span>RESSOURCES HUMAINES</span>
        </NavLink>
      ),
      key: "MR",
      icon: <BsFillGrid3X3GapFill />,
    },
    {
      label: (
        <NavLink to="/dashboard">
          <span>TABLEAU DE BORD</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <HomeOutlined />,
    },

    {
      label: (
        <NavLink to="/customer">
          <span>CLIENT</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <UserOutlined />,
    },

    {
      label: "AJOUT",
      key: "purchaseSection",
      icon: <PlusSquareOutlined />,
      children: [
        {
          label: (
            <NavLink to="/supplier">
              <span>Fournisseurs</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <UserOutlined />,
        },
        {
          label: (
            <NavLink to="/product-category">
              <span>Catégorie de produit</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <FolderAddOutlined />,
        },
        {
          label: (
            <NavLink to="/product">
              <span>Ajout produit</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <FileAddOutlined />,
        },
        {
          label: (
            <NavLink to="/purchase">
              <span>Facture</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <SnippetsOutlined />,
        },
        {
          label: (
            <NavLink to="/productlist">
              <span>Stock des produits</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <UnorderedListOutlined />,
        },
      ],
    },

    {
      label: (
        <NavLink to="/mappage">
          <span>CARTE</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <HeatMapOutlined />,
    },

    {
      label: (
        <NavLink to="/reportings">
          <span>RAPPORTS</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <HeatMapOutlined />,
    },

    {
      label: (
        <NavLink to="/dashboardVente">
          <span>TABLEAU DE BORD</span>
        </NavLink>
      ),
      key: "MV",
      icon: <HomeOutlined />,
    },

    {
      label: "VENTE",
      key: "saleSection",
      icon: <MinusSquareOutlined />,
      children: [
        {
          label: (
            <NavLink to="/sale">
              <span>Pharmacies</span>
            </NavLink>
          ),
          key: "MV",
          icon: <CheckOutlined />,
        },


        {
          label: (
            <NavLink to="/salepromise">
              <span>Ajouter promesse d'achat</span>
            </NavLink>
          ),
          key: "MV",
          icon: <FileAddFilled />,
        },

        {
          label: (
            <NavLink to="/salelist">
              <span>Liste de vente</span>
            </NavLink>
          ),
          key: "MV",
          icon: <UnorderedListOutlined />,
        },

        {
          label: (
            <NavLink to="/salepromiselist">
              <span>Liste des promesses d'achats</span>
            </NavLink>
          ),
          key: "MV",
          icon: <UnderlineOutlined />,
        },
      ],
    },

    {
      label: "MOUCHARD",
      key: "reportSection",
      icon: <FundOutlined />,
      children: [
        {
          label: (
            <NavLink to="/account/income">
              <span>État des résultats</span>
            </NavLink>
          ),
          key: "MSC",
          icon: <FileSyncOutlined />,
        },
      ],
    },
    {
      label: (
        <NavLink to={pdfFile} target="_blank">
          AIDE
        </NavLink>
      ),
      key: "MV",
      icon: <QuestionCircleOutlined />,
    },
    hasPermission("ReadDashboardHR") && {
      label: (
        <NavLink to="/admin/dashboard">
          <span>Dashboard</span>
        </NavLink>
      ),
      key: "MR",
      icon: <HomeOutlined />,
    },

    (hasPermission("createUser") ||
      hasPermission("viewUser") ||
      hasPermission("readAll-role") ||
      hasPermission("readAll-designation") ||
      hasPermission("readAll-department")) && {
      label: "HR",
      key: "hr",
      icon: <UserOutlined />,
      children: [
        hasPermission("createUser") && {
          label: (
            <NavLink to="/admin/hr/staffs/new">
              <span>Nouvel employé</span>
            </NavLink>
          ),

          key: "MR",
          icon: <UsergroupAddOutlined />,
        },
        hasPermission("viewUser") && {
          label: (
            <NavLink to="/admin/hr/staffs">
              <span>Liste des employés</span>
            </NavLink>
          ),
          key: "MR",
          icon: <UsergroupAddOutlined />,
        },
        hasPermission("readAll-role") && {
          label: (
            <NavLink to="/admin/role">
              <span>Role & Permissions</span>
            </NavLink>
          ),
          key: "MR",
          icon: <UserSwitchOutlined />,
        },
        hasPermission("readAll-designation") && {
          label: (
            <NavLink to="/admin/designation/">
              <span>Designation</span>
            </NavLink>
          ),
          key: "MR",
          icon: <UserSwitchOutlined />,
        },
        hasPermission("readAll-department") && {
          label: (
            <NavLink to="/admin/department">
              <span>Department</span>
            </NavLink>
          ),
          key: "MR",
          icon: <UserSwitchOutlined />,
        },
      ],
    },

    (hasPermission("CreateAttendance") || hasPermission("ViewAttendance")) && {
      label: "PRÉSENCE",
      key: "attendance",
      icon: <ClockCircleOutlined />,
      children: [
        hasPermission("CreateAttendance") && {
          label: (
            <NavLink to="/admin/attendance">
              <span>Présence</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
        hasPermission("readSingle-attendance") && {
          label: (
            <NavLink to={`/admin/attendance/user/${user}`}>
              <span>Ma présence</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
      ],
    },

    (hasPermission("create-payroll") || hasPermission("readAll-payroll")) && {
      label: "PAIEMENT",
      key: "payroll",
      icon: <WalletOutlined />,
      children: [
        hasPermission("create-payroll") && {
          label: (
            <NavLink to="/admin/payroll/new">
              <span>Calculer la paie</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
        hasPermission("readAll-payroll") && {
          label: (
            <NavLink to="/admin/payroll/list">
              <span>Liste des fiches de paie</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileOutlined />,
        },
      ],
    },

    hasPermission("readAll-shift") && {
      label: "PÉRIODE DE TRAVAIL",
      key: "shift",
      icon: <ClockCircleOutlined />,
      children: [
        hasPermission("readAll-shift") && {
          label: (
            <NavLink to="/admin/shift">
              <span>Changement</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
      ],
    },

    hasPermission("readAll-employmentStatus") && {
      label: "Statut de l'employé",
      key: "employementStatus",
      icon: <RocketOutlined />,
      children: [
        hasPermission("readAll-employmentStatus") && {
          label: (
            <NavLink to="/admin/employment-status">
              <span>Status</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
      ],
    },

    (hasPermission("create-leaveApplication") ||
      hasPermission("readAll-leaveApplication") ||
      hasPermission("readSingle-leaveApplication")) && {
      label: "CONGÉ",
      key: "leave",
      icon: <UsergroupDeleteOutlined />,
      children: [
        hasPermission("create-leaveApplication") && {
          label: (
            <NavLink to="/admin/leave/new">
              <span> Nouveau congé </span>
            </NavLink>
          ),
          key: "MR",
          icon: <SubnodeOutlined />,
        },
        hasPermission("readAll-leaveApplication") && {
          label: (
            <NavLink to="/admin/leave">
              <span>Statut de congé</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
        hasPermission("readSingle-leaveApplication") && {
          label: (
            <NavLink to={`/admin/leave/user/${user}`}>
              <span>Mon congé</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
      ],
    },

    (hasPermission("readAll-weeklyHoliday") ||
      hasPermission("readAll-publicHoliday")) && {
      label: "HOLIDAY",
      key: "holiday",
      icon: <CalendarOutlined />,
      children: [
        hasPermission("readAll-weeklyHoliday") && {
          label: (
            <NavLink to="/admin/holiday/week">
              <span>Vacances hebdomadaires</span>
            </NavLink>
          ),
          key: "MR",
          icon: <PieChartFilled />,
        },
        hasPermission("readAll-publicHoliday") && {
          label: (
            <NavLink to="/admin/holiday/public">
              <span>Jour férié</span>
            </NavLink>
          ),
          key: "MR",
          icon: <PieChartFilled />,
        },
      ],
    },

    hasPermission("readAll-announcement") && {
      label: "ANNONCE",
      key: "announcement",
      icon: <NotificationFilled />,
      children: [
        hasPermission("readAll-announcement") && {
          label: (
            <NavLink to="/admin/announcement">
              <span>Annonce</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FlagFilled />,
        },
      ],
    },

    hasPermission("readAll-account") && {
      label: "FINANCE",
      key: "report",
      icon: <FlagOutlined />,
      children: [
        hasPermission("readAll-account") && {
          label: (
            <NavLink to="/admin/account/trial-balance">
              <span>Balance de vérification</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileDoneOutlined />,
        },
        hasPermission("readAll-account") && {
          label: (
            <NavLink to="/admin/account/balance-sheet">
              <span>Bilan</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileOutlined />,
        },
        hasPermission("readAll-account") && {
          label: (
            <NavLink to="/admin/account/income">
              <span>releve de revenue</span>
            </NavLink>
          ),
          key: "MR",
          icon: <FileSyncOutlined />,
        },
      ],
    },

    (hasPermission("crate-award") || hasPermission("readAll-award")) && {
      label: "PRIX",
      key: "award",
      icon: <TrophyFilled />,
      children: [
        hasPermission("create-award") && {
          label: (
            <NavLink to="/admin/award/new">
              <span>Nouveau prix</span>
            </NavLink>
          ),
          key: "MR",
          icon: <TrophyFilled />,
        },

        hasPermission("readAll-award") && {
          label: (
            <NavLink to="/admin/award">
              <span>Prix</span>
            </NavLink>
          ),
          key: "MR",
          icon: <TrophyFilled />,
        },
      ],
    },

    (hasPermission("create-project") ||
      hasPermission("readAll-project") ||
      hasPermission("create-projectTeam") ||
      hasPermission("create-milestone") ||
      hasPermission("readAll-priority") ||
      hasPermission("create-task-Status")) && {
      label: "PROJET",
      key: "MR",
      icon: <SettingOutlined />,
      children: [
        hasPermission("create-project") && {
          label: (
            <NavLink to="/admin/project/new">
              <span>Ajouter un projet</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
        hasPermission("readAll-project") && {
          label: (
            <NavLink to="/admin/project">
              <span>Ajouter un projet</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
        hasPermission("create-projectTeam") && {
          label: (
            <NavLink to="/admin/team">
              <span>Équipe</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
        (hasPermission("create-priority") ||
          hasPermission("readAll-priority")) && {
          label: (
            <NavLink to="/admin/task-priority">
              <span>Priorité des tâches</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
        hasPermission("create-milestone") && {
          label: (
            <NavLink to="/admin/milestone">
              <span>Ajouter un jalon</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },

        hasPermission("create-taskStatus") && {
          label: (
            <NavLink to="/admin/task-status">
              <span>Ajouter le statut d'une tâche</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
      ],
    },

    hasPermission("readAll-setting") && {
      label: "PARAMÈTRES",
      key: "settings",
      icon: <SettingOutlined />,
      children: [
        hasPermission("readAll-setting") && {
          label: (
            <NavLink to="/admin/company-setting">
              <span>Paramètres de l'entreprise</span>
            </NavLink>
          ),
          key: "MR",
          icon: <SettingOutlined />,
        },
      ],
    },
  ];

  return (
    <div>
      <center>
        <a href="/dashboardglobal" onClick={() => handleModuleClick('Global')}><img
          src={logo}
          alt="logo"
          style={{
            width: "50%",
            height: "50%",
            objectFit: "cover",
          }}
        /></a>

        <Menu
          theme="dark"
          mode="vertical"
          items={getMenuItems()}
          className="sidenav-menu"
          onClick={({ key }) => handleModuleClick(key)}
        // style={{ backgroundColor: "transparent" }}
        />

      </center>
    </div>
  );
};

export default Test;
