import { 
  Button, 
  Dropdown, 
  Menu, 
  Table, 
  Card, 
  Space, 
  Typography, 
  Tag, 
  Input, 
  DatePicker, 
  Row, 
  Col, 
  Avatar, 
  Tooltip, 
  Badge, 
  Select
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  BarsOutlined,
  ClockCircleOutlined,
  TagOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loadAllReports } from "../../../redux/reduxDistribution/actions/reporting/getReportAction";
import PageTitle from "../../page-header/PageHeader";
import { CSVLink } from "react-csv";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Fonction pour ajouter des clés uniques aux éléments
const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

function ReportingTable({ list, total }) {
  const dispatch = useDispatch();
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    if (!status) return "default";
    
    const statusColors = {
      "en attente": "warning",
      "en cours": "processing",
      "terminé": "success",
      "annulé": "error"
    };
    
    return statusColors[status.toLowerCase()] || "default";
  };

  // Définition des colonnes pour la table des rapports
  const columns = [
    {
      title: "Rapport",
      dataIndex: "title",
      key: "title",
      fixed: 'left',
      width: 250,
      render: (title, record) => (
        <Link to={`/reportings/${record.id}`} className="report-link">
          <Space>
            <Avatar
              icon={<FileTextOutlined />}
              style={{ backgroundColor: '#1890ff' }}
              size="small"
            />
            <span className="report-title">{title || "Rapport sans titre"}</span>
          </Space>
        </Link>
      ),
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        const titleMatch = record.title?.toLowerCase().includes(value.toLowerCase());
        const authorMatch = record.authorName?.toLowerCase().includes(value.toLowerCase());
        return titleMatch || authorMatch;
      }
    },
    {
      title: "Nom du Prospect",
      dataIndex: "prospectName",
      key: "prospectName",
      width: 180,
      render: (name) => name || "Non spécifié",
      sorter: (a, b) => (a.prospectName || "").localeCompare(b.prospectName || ""),
    },
    {
      title: "Date du RDV",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (date) => date ? (
        <Space>
          <CalendarOutlined />
          {moment(date).format("DD/MM/YYYY")}
        </Space>
      ) : "Non spécifiée",
      sorter: (a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return -1;
        if (!b.date) return 1;
        return moment(a.date).unix() - moment(b.date).unix();
      },
      filteredValue: dateRange ? ['dateRange'] : null,
      onFilter: (value, record) => {
        if (!dateRange || !record.date) return false;
        const recordDate = moment(record.date);
        return recordDate.isAfter(dateRange[0]) && recordDate.isBefore(dateRange[1]);
      }
    },
    {
      title: "Objet du RDV",
      dataIndex: "rdvObject",
      key: "rdvObject",
      width: 200,
      render: (obj) => obj || "Non spécifié",
      ellipsis: true,
    },
    {
      title: "Prochain RDV",
      dataIndex: "nextRdv",
      key: "nextRdv",
      width: 150,
      render: (date) => date ? (
        <Space>
          <ClockCircleOutlined />
          {moment(date).format("DD/MM/YYYY")}
        </Space>
      ) : "Non planifié",
      sorter: (a, b) => {
        if (!a.nextRdv && !b.nextRdv) return 0;
        if (!a.nextRdv) return -1;
        if (!b.nextRdv) return 1;
        return moment(a.nextRdv).unix() - moment(b.nextRdv).unix();
      }
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: 150,
      render: (contact) => contact ? (
        <Space>
          <UserOutlined />
          {contact}
        </Space>
      ) : "Non spécifié",
      sorter: (a, b) => (a.contact || "").localeCompare(b.contact || ""),
    },
    {
      title: "Pharmacovigilance",
      dataIndex: "pharmacoVigilance",
      key: "pharmacoVigilance",
      width: 180,
      render: (text) => text ? (
        <Tag color="green">{text}</Tag>
      ) : (
        <Tag color="default">Non spécifié</Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Badge 
          status={getStatusColor(status)} 
          text={status || "Non défini"} 
        />
      ),
      filteredValue: selectedStatus ? [selectedStatus] : null,
      onFilter: (value, record) => {
        return record.status?.toLowerCase() === value.toLowerCase();
      }
    },
    {
      title: "Ajouté le",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt) => createdAt ? moment(createdAt).format("DD/MM/YY HH:mm") : "Date inconnue",
      sorter: (a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return -1;
        if (!b.createdAt) return 1;
        return moment(a.createdAt).unix() - moment(b.createdAt).unix();
      }
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir les détails">
            <Link to={`/reportings/${record.id}`}>
              <Button type="primary" size="small">
                Détails
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link to={`/reporting/${record.id}/update`} state={{ data: record }}>
              <Button type="default" size="small" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  useEffect(() => {
    setColumnsToShow(columns);
  }, []);

  // Construction des éléments du menu de filtrage de colonnes
  const menuItems = columns.map(item => ({
    key: item.key,
    label: (
      <Space>
        <span>{item.title}</span>
        {columnsToShow.find(col => col.key === item.key) && (
          <Tag color="green" size="small">Visible</Tag>
        )}
      </Space>
    )
  }));

  // Gestion de la visibilité des colonnes
  const colVisibilityClickHandler = (col) => {
    const ifColFound = columnsToShow.find((item) => item.key === col.key);
    if (ifColFound) {
      const filteredColumnsToShow = columnsToShow.filter(
        (item) => item.key !== col.key
      );
      setColumnsToShow(filteredColumnsToShow);
    } else {
      const foundIndex = columns.findIndex((item) => item.key === col.key);
      const foundCol = columns.find((item) => item.key === col.key);
      let updatedColumnsToShow = [...columnsToShow];
      updatedColumnsToShow.splice(foundIndex, 0, foundCol);
      setColumnsToShow(updatedColumnsToShow);
    }
  };

  // Options du statut de filtrage
  const statusOptions = [
    { value: "en attente", label: "En attente" },
    { value: "en cours", label: "En cours" },
    { value: "terminé", label: "Terminé" },
    { value: "annulé", label: "Annulé" }
  ];

  return (
    <div>
      <div className="table-header" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8} lg={7} xl={6}>
            <Search
              placeholder="Rechercher un rapport..."
              allowClear
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => {
                if (!e.target.value) {
                  setSearchText("");
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col xs={24} md={10} lg={10} xl={10}>
            <Space>
              <RangePicker 
                placeholder={["Date début", "Date fin"]}
                onChange={(dates) => setDateRange(dates)}
                allowClear
              />
              
              <Select
                placeholder="Statut"
                style={{ width: 140 }}
                allowClear
                onChange={(value) => setSelectedStatus(value)}
              >
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <Badge status={getStatusColor(option.value)} text={option.label} />
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} md={6} lg={7} xl={8} style={{ textAlign: 'right' }}>
            <Space>
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: ({ key }) => {
                    const col = columns.find(col => col.key === key);
                    if (col) colVisibilityClickHandler(col);
                  }
                }}
                trigger={["click"]}
              >
                <Button icon={<FilterOutlined />}>
                  Colonnes
                </Button>
              </Dropdown>
              
              {list && (
                <CSVLink
                  data={list}
                  filename="rapports-prospection.csv"
                >
                  <Button icon={<DownloadOutlined />}>
                    Export CSV
                  </Button>
                </CSVLink>
              )}
              
              <Link to="/reporting/add">
                <Button type="primary" icon={<PlusOutlined />}>
                  Nouveau
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>

      <Table
        scroll={{ x: 1500 }}
        loading={!list}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} rapports`,
          onChange: (page, limit) => {
            dispatch(loadAllReports({ page, limit }));
          },
        }}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
        rowClassName="report-row"
      />
    </div>
  );
}

const GetAllReport = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.reports?.list);
  const total = useSelector((state) => state.reports?.total);

  // Charger les données au chargement du composant
  useEffect(() => {
    dispatch(loadAllReports({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div>
      <PageTitle title="Retour" subtitle="RAPPORTS DE PROSPECTION" />
      
      <Card
        className="reports-card"
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: '18px' }} />
            <Title level={4} style={{ marginBottom: 0 }}>Gestion des rapports de prospection</Title>
          </Space>
        }
        extra={
          <Link to="/reporting/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Nouveau rapport
            </Button>
          </Link>
        }
      >
        <div className="reports-intro" style={{ marginBottom: 24 }}>
          <Text type="secondary">
            Consultez et gérez vos rapports de prospection. Utilisez les filtres pour trouver rapidement
            les informations dont vous avez besoin.
          </Text>
        </div>
        
        <ReportingTable list={list} total={total} />
      </Card>
    </div>
  );
};

export default GetAllReport;