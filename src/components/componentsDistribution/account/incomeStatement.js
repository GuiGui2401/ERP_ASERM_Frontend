import React, { useEffect, useState } from "react";
import {
  Card,
  DatePicker,
  Form,
  Button,
  Select,
  Table,
  Segmented,
  Typography,
  Space,
  Tag,
  Badge,
  Input,
  Divider,
  Row,
  Col,
  Tooltip,
  Alert,
  Statistic,
  Empty,
  Descriptions,
  Modal
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  FileTextOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PageTitle from "../../page-header/PageHeader";
import AuditLogPrint from "./AuditLogPrint";
import Loader from "../../loader/loader";
import loadAllLogs from "../../../redux/reduxDistribution/actions/logs/getLogsAction";
import "./incomeStatement.css"; // Assurez-vous de créer ce fichier CSS

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const IncomeStatement = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.list) || [];
  const total = useSelector((state) => state.logs.total) || 0;
  
  // États locaux
  const [user, setUser] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(moment().startOf("month").toISOString());
  const [endDate, setEndDate] = useState(moment().endOf("month").toISOString());
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([moment().startOf("month"), moment().endOf("month")]);

  // Charger les logs au montage du composant
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        await dispatch(loadAllLogs({ 
          page: 1, 
          limit: count, 
          startdate: startDate, 
          enddate: endDate 
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [dispatch, count, startDate, endDate]);

  // Définir les colonnes pour la table
  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 80
    },
    { 
      title: "Utilisateur", 
      dataIndex: ["user", "userName"], 
      key: "user",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          {text || 'Système'}
        </Space>
      ),
      sorter: (a, b) => {
        const userA = a.user?.userName || 'Système';
        const userB = b.user?.userName || 'Système';
        return userA.localeCompare(userB);
      },
      filterable: true
    },
    { 
      title: "Action", 
      dataIndex: "action", 
      key: "action",
      render: (text) => {
        let color = 'default';
        
        if (text.toLowerCase().includes('create') || text.toLowerCase().includes('ajout')) {
          color = 'success';
        } else if (text.toLowerCase().includes('update') || text.toLowerCase().includes('modif')) {
          color = 'warning';
        } else if (text.toLowerCase().includes('delete') || text.toLowerCase().includes('suppression')) {
          color = 'error';
        } else if (text.toLowerCase().includes('login') || text.toLowerCase().includes('connexion')) {
          color = 'processing';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Création', value: 'create' },
        { text: 'Modification', value: 'update' },
        { text: 'Suppression', value: 'delete' },
        { text: 'Connexion', value: 'login' }
      ],
      onFilter: (value, record) => record.action.toLowerCase().includes(value),
    },
    { 
      title: "Date", 
      dataIndex: "timestamp", 
      key: "timestamp", 
      render: (text) => {
        const date = moment(text);
        return (
          <Space direction="vertical" size={0}>
            <Text>{date.format("DD/MM/YYYY")}</Text>
            <Text type="secondary">{date.format("HH:mm:ss")}</Text>
          </Space>
        );
      },
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
      defaultSortOrder: 'descend'
    },
    { 
      title: "Détails", 
      dataIndex: "details", 
      key: "details",
      render: (text) => (
        <Tooltip title={text}>
          <div className="details-cell">
            {text || 'Aucun détail'}
          </div>
        </Tooltip>
      ),
      ellipsis: true
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir les détails">
            <Button type="text" icon={<EyeOutlined />} size="small" 
              onClick={() => showLogDetails(record)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Gérer la recherche
  const onSearchFinish = async (values) => {
    setLoading(true);
    setUser(values?.user || "");
    
    if (startDate && endDate) {
      try {
        await dispatch(
          loadAllLogs({
            page: 1,
            limit: count,
            startdate: startDate,
            enddate: endDate,
            user: values?.user,
            search: searchTerm
          })
        );
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Les dates de début et de fin ne sont pas définies.');
      setLoading(false);
    }
  };

  // Gérer le changement de pagination
  const onSwitchChange = (value) => {
    setCount(value);
    setLoading(true);
    dispatch(
      loadAllLogs({
        page: 1,
        limit: value,
        startdate: startDate,
        enddate: endDate,
        user,
        search: searchTerm
      })
    ).finally(() => setLoading(false));
  };

  // Gérer le changement de dates
  const onCalendarChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
      const newStartDate = dates[0].format("YYYY-MM-DDTHH:mm:ss");
      const newEndDate = dates[1].format("YYYY-MM-DDTHH:mm:ss");
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setUser("");
    setSearchTerm("");
    setDateRange([moment().startOf("month"), moment().endOf("month")]);
    setStartDate(moment().startOf("month").toISOString());
    setEndDate(moment().endOf("month").toISOString());
    setLoading(true);
    dispatch(
      loadAllLogs({
        page: 1,
        limit: count,
        startdate: moment().startOf("month").toISOString(),
        enddate: moment().endOf("month").toISOString()
      })
    ).finally(() => setLoading(false));
  };
  
  // Afficher les détails d'un log
  const showLogDetails = (record) => {
    Modal.info({
      title: `Détails du log #${record.id}`,
      content: (
        <div className="log-details-modal">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Utilisateur">
              {record.user?.userName || 'Système'}
            </Descriptions.Item>
            <Descriptions.Item label="Action">
              {record.action}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {moment(record.timestamp).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Détails">
              {record.details || 'Aucun détail'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
      width: 600,
    });
  };

  return (
    <div className="audit-log-container">
      <PageTitle 
        title="Retour" 
        subtitle="JOURNAL DE L'ACTIVITÉ" 
      />
      
      <div className="content-section">
        <Card className="audit-card">
          <div className="card-header">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={18}>
                  <Title level={4} className="section-title">
                    <HistoryOutlined /> Journal d'audit
                  </Title>
                </Col>
                <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                  <AuditLogPrint data={logs} />
                </Col>
              </Row>
              
              <Alert
                message="Suivez toutes les actions effectuées dans le système"
                description="Ce journal enregistre automatiquement toutes les opérations importantes pour assurer la traçabilité et la sécurité."
                type="info"
                showIcon
                className="info-alert"
              />
            </Space>
          </div>
          
          <Divider />
          
          <div className="filters-section">
            <Form 
              onFinish={onSearchFinish}
              layout="vertical"
              className="filter-form"
            >
              <Row gutter={[16, 16]} align="bottom">
                <Col xs={24} md={6}>
                  <Form.Item name="user" label="Utilisateur">
                    <Select 
                      placeholder="Sélectionner un utilisateur" 
                      allowClear
                      suffixIcon={<UserOutlined />}
                    >
                      <Select.Option value="">Tous les utilisateurs</Select.Option>
                      {/* Ajouter les options des utilisateurs ici */}
                      <Select.Option value="admin">Administrateur</Select.Option>
                      <Select.Option value="user1">Utilisateur 1</Select.Option>
                      <Select.Option value="user2">Utilisateur 2</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item label="Période">
                    <RangePicker
                      value={dateRange}
                      onCalendarChange={onCalendarChange}
                      allowClear={false}
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                      ranges={{
                        'Aujourd\'hui': [moment(), moment()],
                        'Cette semaine': [moment().startOf('week'), moment().endOf('week')],
                        'Ce mois': [moment().startOf('month'), moment().endOf('month')],
                        'Ce trimestre': [moment().startOf('quarter'), moment().endOf('quarter')],
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                  <Form.Item label="Recherche">
                    <Input
                      placeholder="Rechercher dans les logs"
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={4} style={{ textAlign: 'right' }}>
                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        loading={loading}
                      >
                        Rechercher
                      </Button>
                      <Button 
                        icon={<ReloadOutlined />}
                        onClick={resetFilters}
                      >
                        Réinitialiser
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space>
                  <Text>Afficher :</Text>
                  <Segmented
                    options={[
                      { label: <span>10 par page</span>, value: 10 },
                      { label: <span>50 par page</span>, value: 50 },
                      { label: <span>Tout ({total})</span>, value: total },
                    ]}
                    value={count}
                    onChange={onSwitchChange}
                  />
                </Space>
              </Col>
              
              <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                <Text type="secondary">
                  Total: <Badge count={total} overflowCount={9999} style={{ backgroundColor: '#1890ff' }} />
                </Text>
              </Col>
            </Row>
          </div>
          
          <div className="table-section">
            {loading ? (
              <div className="loading-container">
                <Loader />
              </div>
            ) : logs.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucun log trouvé pour cette période"
              />
            ) : (
              <Table
                columns={columns}
                dataSource={logs.map(log => ({ ...log, key: log.id }))}
                pagination={{
                  pageSize: count === total ? total : count,
                  pageSizeOptions: [10, 20, 50, 100, 200],
                  showSizeChanger: true,
                  total: total,
                  showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} logs`,
                  onChange: (page, limit) => {
                    setLoading(true);
                    dispatch(
                      loadAllLogs({ 
                        page, 
                        limit, 
                        startdate: startDate, 
                        enddate: endDate, 
                        user,
                        search: searchTerm
                      })
                    ).finally(() => setLoading(false));
                  },
                }}
                scroll={{ x: 1000 }}
                bordered
                size="middle"
                className="audit-table"
              />
            )}
          </div>
          
          <Divider />
          
          <div className="stats-section">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="Total des logs" 
                  value={total} 
                  prefix={<HistoryOutlined />} 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="Période" 
                  value={`${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`} 
                  prefix={<CalendarOutlined />} 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="Actions" 
                  value={logs.filter(log => log.action.toLowerCase().includes('create')).length} 
                  suffix={`/${logs.length}`}
                  prefix={<FileTextOutlined />} 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="Utilisateurs uniques" 
                  value={new Set(logs.map(log => log.user?.userName)).size} 
                  prefix={<UserOutlined />} 
                />
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IncomeStatement;