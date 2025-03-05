import { 
  DeleteOutlined, 
  EditOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  TagOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Card, 
  Popover, 
  Typography, 
  Row, 
  Col, 
  Descriptions, 
  Divider, 
  Tag, 
  Space, 
  Breadcrumb, 
  Avatar, 
  Badge, 
  Alert,
  Timeline
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteReport } from "../../../redux/reduxDistribution/actions/reporting/deleteReportAction.js";
import { loadSingleReport } from "../../../redux/reduxDistribution/actions/reporting/detailReportAction.js";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const DetailReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dispatch
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reports.report);

  // État pour la popover de suppression
  const [visible, setVisible] = useState(false);

  // Supprimer le rapport
  const onDelete = () => {
    try {
      dispatch(deleteReport(id));
      setVisible(false);
      toast.warning(`Rapport "${report.title}" supprimé avec succès`);
      navigate("/reportings");
    } catch (error) {
      console.log(error.message);
      toast.error("Erreur lors de la suppression du rapport");
    }
  };

  // Gérer la visibilité de la popover
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadSingleReport(id));
  }, [id, dispatch]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    const statusMap = {
      "Complété": "success",
      "En cours": "processing",
      "En attente": "warning",
      "Annulé": "error"
    };
    return statusMap[status] || "default";
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle={`Détails du rapport ${report?.id}`} />

      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <Space>
              <FileTextOutlined />
              <span>Dashboard</span>
            </Space>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/reportings">
            <Space>
              <FileTextOutlined />
              <span>Rapports</span>
            </Space>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Détails du rapport</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mr-top">
        {report ? (
          <Fragment key={report?.id}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card 
                  bordered={false} 
                  className="card-shadow"
                  title={
                    <Space align="center">
                      <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                      <Title level={4} style={{ marginBottom: 0 }}>{report.title}</Title>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Link to="/reportings">
                        <Button icon={<ArrowLeftOutlined />}>Retour</Button>
                      </Link>
                      <Link to={`/reporting/${report.id}/update`} state={{ data: report }}>
                        <Button 
                          type="primary" 
                          icon={<EditOutlined />}
                        >
                          Modifier
                        </Button>
                      </Link>
                      <Popover
                        content={
                          <div style={{ width: '250px' }}>
                            <Paragraph>
                              Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.
                            </Paragraph>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <Button onClick={() => setVisible(false)}>Annuler</Button>
                              <Button type="primary" danger onClick={onDelete}>
                                Confirmer
                              </Button>
                            </div>
                          </div>
                        }
                        title={<Text strong>Confirmation de suppression</Text>}
                        trigger="click"
                        open={visible}
                        onOpenChange={handleVisibleChange}
                      >
                        <Button
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          Supprimer
                        </Button>
                      </Popover>
                    </Space>
                  }
                >
                  <Divider style={{ marginTop: 0 }} />
                  
                  <Descriptions 
                    bordered 
                    column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                    labelStyle={{ fontWeight: 'bold' }}
                  >
                    <Descriptions.Item 
                      label={<Space><TagOutlined /> Nom du rapport</Space>}
                    >
                      {report.title}
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={<Space><UserOutlined /> Créé par</Space>}
                    >
                      <Space>
                        <Avatar 
                          size="small" 
                          icon={<UserOutlined />} 
                          style={{ backgroundColor: '#1890ff' }}
                        />
                        {report.authorName || "Non spécifié"}
                      </Space>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={<Space><CalendarOutlined /> Date de création</Space>}
                    >
                      {report.creationDate ? moment(report.creationDate).format('DD/MM/YYYY HH:mm') : "Non spécifiée"}
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={<Space><TagOutlined /> Statut</Space>}
                    >
                      <Badge 
                        status={getStatusColor(report.status)} 
                        text={report.status || "Non spécifié"} 
                      />
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider orientation="left">Contenu du rapport</Divider>
                  
                  <div className="report-content">
                    {report.content ? (
                      <Paragraph style={{ whiteSpace: 'pre-line' }}>
                        {report.content}
                      </Paragraph>
                    ) : (
                      <Alert
                        message="Aucun contenu"
                        description="Ce rapport ne contient pas de contenu détaillé."
                        type="info"
                        showIcon
                      />
                    )}
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card 
                  bordered={false}
                  title={<Space><CalendarOutlined /> Historique du rapport</Space>}
                  className="card-shadow"
                >
                  <Timeline mode="left" style={{ marginTop: '24px' }}>
                    <Timeline.Item 
                      color="green"
                      label={report.creationDate ? moment(report.creationDate).format('DD/MM/YYYY') : "Date inconnue"}
                    >
                      Création du rapport <Tag color="blue">{report.authorName}</Tag>
                    </Timeline.Item>
                    
                    {report.lastUpdate && (
                      <Timeline.Item 
                        color="blue"
                        label={moment(report.lastUpdate).format('DD/MM/YYYY')}
                      >
                        Dernière mise à jour <Tag color="blue">{report.updatedBy || report.authorName}</Tag>
                      </Timeline.Item>
                    )}
                    
                    {/* D'autres événements pourraient être ajoutés ici */}
                  </Timeline>
                  
                  <Divider />
                  
                  <div style={{ textAlign: 'center' }}>
                    <Button 
                      type="default" 
                      icon={<DownloadOutlined />}
                      disabled={!report.downloadUrl}
                    >
                      Télécharger le rapport
                    </Button>
                  </div>
                </Card>
                
                {report.comments && report.comments.length > 0 && (
                  <Card 
                    bordered={false}
                    title={<Space><MessageOutlined /> Commentaires</Space>}
                    className="card-shadow"
                    style={{ marginTop: '24px' }}
                  >
                    {/* Contenu des commentaires */}
                  </Card>
                )}
              </Col>
            </Row>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailReport;