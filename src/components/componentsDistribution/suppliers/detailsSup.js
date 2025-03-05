import { DeleteOutlined, EditOutlined, PhoneOutlined, HomeOutlined, DollarOutlined, UserOutlined, DownloadOutlined, FileTextOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card, Popover, Typography, Descriptions, Space, Divider, Statistic, Row, Col, Tag, Alert, Tabs, Badge } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSupplier } from "../../../redux/reduxDistribution/actions/supplier/deleteSupplierAction";
import { loadSupplier } from "../../../redux/reduxDistribution/actions/supplier/detailSupplierAction";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";
import "./suppliers.css";

import { CSVLink } from "react-csv";
import SupplierInvoiceTable from "../Card/SupplierInvoiceList";
// import SupplierReturnInvoiceList from "./ListCard/SupplierReturnInvoiceList";
// import SupplierTransactionList from "./ListCard/SupplierTransactionList";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DetailsSup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dispatch et sélecteur
  const dispatch = useDispatch();
  const supplier = useSelector((state) => state.suppliers.supplier);
  
  // État pour la popover de suppression
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Supprimer un fournisseur
  const onDelete = () => {
    try {
      dispatch(deleteSupplier(id));
      setVisible(false);
      toast.warning(`Le fournisseur "${supplier.name}" a été supprimé`);
      navigate("/supplier");
    } catch (error) {
      console.log(error.message);
      toast.error("Erreur lors de la suppression du fournisseur");
    }
  };

  // Gérer la visibilité de la popover
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  // Charger les données du fournisseur
  useEffect(() => {
    dispatch(loadSupplier(id));
  }, [dispatch, id]);

  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Obtenir une couleur basée sur le nom du fournisseur
  const getSupplierColor = (name) => {
    if (!name) return "#1890ff";
    
    // Simple fonction de hachage pour une couleur cohérente
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#1890ff', // blue
      '#52c41a', // green
      '#722ed1', // purple
      '#eb2f96', // pink
      '#fa8c16', // orange
      '#13c2c2', // cyan
      '#fa541c'  // volcano
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle={supplier ? `Information sur le Fournisseur "${supplier.name}"` : "Détails du Fournisseur"} />

      <div className="mr-top">
        {supplier ? (
          <Fragment key={supplier.id}>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card
                  bordered={false}
                  className="card-shadow supplier-info-card"
                >
                  <div className="supplier-avatar" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: getSupplierColor(supplier.name), 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '10px'
                      }}
                    >
                      <UserOutlined style={{ fontSize: '40px', color: 'white' }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>{supplier.name}</Title>
                    <Tag color="blue" style={{ marginTop: '8px' }}>Fournisseur</Tag>
                  </div>
                  
                  <Divider />
                  
                  <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
                    <Descriptions.Item 
                      label={<Space><PhoneOutlined /> Téléphone</Space>} 
                      labelStyle={{ fontWeight: 'bold' }}
                    >
                      <Text copyable>{supplier.phone}</Text>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={<Space><HomeOutlined /> Adresse</Space>}
                      labelStyle={{ fontWeight: 'bold' }} 
                    >
                      {supplier.address || "Non spécifiée"}
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={<Space><DollarOutlined /> Montant dû</Space>}
                      labelStyle={{ fontWeight: 'bold' }}
                    >
                      <Text strong type={supplier.due_amount > 0 ? "danger" : "success"}>
                        {supplier.due_amount} €
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                  
                  <Divider />
                  
                  <div className="supplier-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link
                      to={`/supplier/${supplier.id}/update`}
                      state={{ data: supplier }}
                    >
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                      >
                        Modifier
                      </Button>
                    </Link>
                    
                    <Popover
                      content={
                        <div style={{ width: '200px' }}>
                          <p>Êtes-vous sûr de vouloir supprimer ce fournisseur ?</p>
                          <div style={{ textAlign: 'right' }}>
                            <Button 
                              onClick={() => setVisible(false)} 
                              style={{ marginRight: '8px' }}
                            >
                              Annuler
                            </Button>
                            <Button 
                              type="primary" 
                              danger 
                              onClick={onDelete}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      }
                      title={<Space><WarningOutlined style={{ color: '#ff4d4f' }} /> Confirmation</Space>}
                      trigger="click"
                      open={visible}
                      onOpenChange={handleVisibleChange}
                    >
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                      >
                        Supprimer
                      </Button>
                    </Popover>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={16}>
                <Card 
                  bordered={false} 
                  className="card-shadow"
                  title={
                    <Space>
                      <FileTextOutlined />
                      <span>Factures et transactions</span>
                    </Space>
                  }
                  extra={
                    supplier.purchaseInvoice && supplier.purchaseInvoice.length > 0 ? (
                      <CSVLink
                        data={supplier.purchaseInvoice}
                        filename={`supplier_${supplier.name}_invoices.csv`}
                      >
                        <Button 
                          type="default" 
                          icon={<DownloadOutlined />}
                          size="small"
                        >
                          Export CSV
                        </Button>
                      </CSVLink>
                    ) : null
                  }
                >
                  <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    type="card"
                  >
                    <TabPane 
                      tab={
                        <span>
                          <FileTextOutlined />
                          Factures
                          {supplier.purchaseInvoice && supplier.purchaseInvoice.length > 0 && (
                            <Badge 
                              count={supplier.purchaseInvoice.length} 
                              style={{ marginLeft: '8px' }} 
                              size="small"
                            />
                          )}
                        </span>
                      } 
                      key="1"
                    >
                      {supplier.purchaseInvoice && supplier.purchaseInvoice.length > 0 ? (
                        <SupplierInvoiceTable
                          list={supplier.purchaseInvoice}
                          linkTo="/purchase"
                        />
                      ) : (
                        <Alert
                          message="Aucune facture"
                          description="Ce fournisseur n'a pas encore de factures enregistrées."
                          type="info"
                          showIcon
                        />
                      )}
                    </TabPane>
                    
                    {/* Onglets supplémentaires pour les retours et transactions si nécessaire */}
                    {/* <TabPane tab={<span><RollbackOutlined /> Retours</span>} key="2">
                      <SupplierReturnInvoiceList
                        list={supplier?.allReturnPurchaseInvoice}
                      />
                    </TabPane>
                    
                    <TabPane tab={<span><TransactionOutlined /> Transactions</span>} key="3">
                      <SupplierTransactionList list={supplier?.allTransaction} />
                    </TabPane> */}
                  </Tabs>
                </Card>
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

export default DetailsSup;