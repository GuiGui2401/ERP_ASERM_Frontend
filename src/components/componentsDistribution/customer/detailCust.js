import { 
  DeleteOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  GlobalOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ShopOutlined,
  MoneyCollectOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Card, 
  Popover, 
  Typography, 
  Row, 
  Col, 
  Tabs, 
  Descriptions, 
  Tag, 
  Empty, 
  Spin, 
  Space, 
  Divider, 
  Modal
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCustomer } from "../../../redux/reduxDistribution/actions/customer/deleteCustomerAction";
import { loadSingleCustomer } from "../../../redux/reduxDistribution/actions/customer/detailCustomerAction";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";

import CustomerInvoiceList from "../Card/CustomerInvoiceList";
import CustomerReturnInvoiceList from "./ListCard/CustomerReturnInvoiceList";
import CustomerTransactionList from "./ListCard/CustomerTransactionList";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DetailCust = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customers.customer);
  const loading = useSelector((state) => state.customers.loading);

  //Delete Customer Modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  //Delete Customer
  const onDelete = () => {
    setDeleteLoading(true);
    try {
      dispatch(deleteCustomer(id))
        .then(() => {
          setIsDeleteModalVisible(false);
          toast.warning(`Client ${customer.name} supprimé avec succès`);
          navigate("/customer");
        })
        .catch((error) => {
          toast.error("Erreur lors de la suppression: " + error.message);
        })
        .finally(() => {
          setDeleteLoading(false);
        });
    } catch (error) {
      setDeleteLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    dispatch(loadSingleCustomer(id));
  }, [dispatch, id]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  const getCustomerStatusColor = (status) => {
    if (!status) return "error";
    return "success";
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle={`Client ${customer?.name || ''}`} />

      <Spin spinning={loading && !customer}>
        <div className="mt-4">
          {customer ? (
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card 
                  className="shadow-sm h-100" 
                  bordered={false}
                  title={
                    <div className="d-flex justify-content-between align-items-center">
                      <Title level={5} className="mb-0">
                        <ShopOutlined className="mr-2" /> Informations du client
                      </Title>
                      <Tag color={getCustomerStatusColor(customer.status)}>
                        {customer.status ? "Actif" : "Inactif"}
                      </Tag>
                    </div>
                  }
                  extra={
                    <Space>
                      <Link to={`/customer/${customer.id}/update`} state={{ data: customer }}>
                        <Button 
                          type="primary" 
                          icon={<EditOutlined />}
                          size="small"
                        >
                          Éditer
                        </Button>
                      </Link>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={showDeleteModal}
                      >
                        Supprimer
                      </Button>
                    </Space>
                  }
                >
                  <Descriptions column={1} size="small" bordered className="mb-3">
                    <Descriptions.Item label="ID Client">{customer.id}</Descriptions.Item>
                    <Descriptions.Item label="Nom de l'entreprise">{customer.name}</Descriptions.Item>
                    <Descriptions.Item label={<><UserOutlined /> Responsable</>}>
                      {customer.nameresponsable || "Non spécifié"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> Téléphone</>}>
                      {customer.phone || "Non spécifié"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                      {customer.email || "Non spécifié"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><GlobalOutlined /> Site Web</>}>
                      {customer.website ? (
                        <a href={customer.website} target="_blank" rel="noopener noreferrer">
                          {customer.website}
                        </a>
                      ) : (
                        "Non spécifié"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><EnvironmentOutlined /> Adresse</>}>
                      {customer.rue ? `${customer.rue}, ` : ""} 
                      {customer.quartier || ""} 
                      {customer.ville ? `, ${customer.ville}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Type de client">
                      <Tag color="blue">{customer.type_customer || "Non spécifié"}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MoneyCollectOutlined /> Montant à payer</>}>
                      <Text 
                        type={customer.due_amount > 0 ? "danger" : "success"}
                        strong
                      >
                        {customer.due_amount?.toLocaleString() || 0} FCFA
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                  
                  <Divider orientation="left">Date d'inscription</Divider>
                  <p className="text-muted">
                    Créé le: {new Date(customer.createdAt).toLocaleDateString("fr-FR", { 
                      day: "2-digit", 
                      month: "2-digit", 
                      year: "numeric", 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                  <p className="text-muted">
                    Dernière mise à jour: {new Date(customer.updatedAt).toLocaleDateString("fr-FR", { 
                      day: "2-digit", 
                      month: "2-digit", 
                      year: "numeric", 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                </Card>
              </Col>
              
              <Col xs={24} md={16}>
                <Card 
                  className="shadow-sm" 
                  bordered={false}
                  title={<Title level={5} className="mb-0">Activités du client</Title>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Factures" key="1">
                      {customer?.saleInvoice && customer.saleInvoice.length > 0 ? (
                        <CustomerInvoiceList
                          list={customer.saleInvoice}
                          linkTo="/sale"
                        />
                      ) : (
                        <Empty description="Aucune facture disponible" />
                      )}
                    </TabPane>
                    <TabPane tab="Retours" key="2">
                      {customer?.allReturnSaleInvoice && customer.allReturnSaleInvoice.length > 0 ? (
                        <CustomerReturnInvoiceList list={customer.allReturnSaleInvoice} />
                      ) : (
                        <Empty description="Aucun retour disponible" />
                      )}
                    </TabPane>
                    <TabPane tab="Transactions" key="3">
                      {customer?.allTransaction && customer.allTransaction.length > 0 ? (
                        <CustomerTransactionList list={customer.allTransaction} />
                      ) : (
                        <Empty description="Aucune transaction disponible" />
                      )}
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          ) : (
            <Loader />
          )}
        </div>
      </Spin>

      {/* Modal de confirmation de suppression */}
      <Modal
        title="Confirmation de suppression"
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger 
            loading={deleteLoading} 
            onClick={onDelete}
          >
            Supprimer
          </Button>,
        ]}
      >
        <p>Êtes-vous sûr de vouloir supprimer le client <strong>{customer?.name}</strong> ?</p>
        <p>Cette action est irréversible et supprimera toutes les informations associées à ce client.</p>
      </Modal>
    </div>
  );
};

export default DetailCust;