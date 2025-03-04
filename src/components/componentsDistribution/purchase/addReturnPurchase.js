import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Typography,
  Space,
  Row,
  Col,
  Divider,
  Steps,
  Badge,
  Statistic,
  Alert,
  Result
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  RollbackOutlined,
  DollarOutlined,
  FileDoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { loadSinglePurchase } from "../../../redux/reduxDistribution/actions/purchase/detailPurchaseAction";
import PurchaseProductListCard from "../Card/purchaseInvoice/PurchaseProductListCard";
import Loader from "../../loader/loader";
import { addReturnPurchase } from "./returnPurchase.api";
import "./add-return-purchase.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

const AddReturnPurchase = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  const [date, setDate] = useState(moment());

  // Dispatch et sélecteur
  const dispatch = useDispatch();
  const purchase = useSelector((state) => state.purchases.purchase);
  const { singlePurchaseInvoice } = purchase ? purchase : {};
  const [list, setList] = useState([]);

  const [form] = Form.useForm();

  // Chargement de la facture
  useEffect(() => {
    setLoading(true);
    dispatch(loadSinglePurchase(id)).finally(() => {
      setLoading(false);
    });
  }, [id]);

  // Initialisation de la liste des produits
  useEffect(() => {
    if (singlePurchaseInvoice) {
      setList(
        singlePurchaseInvoice.purchaseInvoiceProduct.map((item) => {
          return {
            ...item,
            return_quantity: 0,
            remain_quantity: item.product_quantity,
          };
        })
      );
    }
  }, [singlePurchaseInvoice]);

  // Gestion de la soumission du formulaire
  const submitHandler = useCallback(
    ({ note }) => {
      setSubmitting(true);
      
      const payload = {
        purchaseInvoice_id: id,
        note,
        date: date._d,
        returnPurchaseInvoiceProduct: Object.entries(formData).map(
          ([id, { value, price }]) => {
            return {
              product_id: id,
              product_quantity: value,
              product_purchase_price: price,
            };
          }
        ),
      };
      
      addReturnPurchase(payload)
        .then((res) => {
          if (res === "success") {
            setSubmitting(false);
            setSuccess(true);
            setCurrentStep(2);
          } else {
            setSubmitting(false);
          }
        })
        .catch(() => {
          setSubmitting(false);
        });
    },
    [formData, date, id]
  );

  // Mise à jour des quantités retournées
  const updateHandler = useCallback(
    ({ id, value, price }) => {
      const item = list.find((item) => item.product_id === id);
      if (item) {
        formData[id] = { value, price };
        item.return_quantity = value;
        item.remain_quantity = item.product_quantity - value;
        setList([...list]);
        setFormData({ ...formData });
      }
    },
    [list]
  );

  // Calcul du montant total retourné
  const totalReturnQuantity = () => {
    return list.reduce((acc, item) => {
      return acc + item.return_quantity * item.product_purchase_price;
    }, 0);
  };

  // Mise à jour du montant total retourné
  useEffect(() => {
    setTotalReturnAmount(totalReturnQuantity());
  }, [list]);

  // Vérification de la connexion
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Vérifier si des produits sont sélectionnés pour le retour
  const hasSelectedProducts = () => {
    return Object.values(formData).some(({ value }) => value > 0);
  };

  // Avancer à l'étape suivante
  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="return-purchase-container">
      {/* En-tête avec navigation */}
      <div className="page-header">
        <Space>
          <Link to={`/purchase/${id}`}>
            <Button icon={<ArrowLeftOutlined />} type="default">
              Retour
            </Button>
          </Link>
          <Title level={4} style={{ margin: 0 }}>
            <Space>
              <RollbackOutlined />
              Retour d'achat
            </Space>
          </Title>
        </Space>
        
        {singlePurchaseInvoice && (
          <Text type="secondary">
            Facture #{singlePurchaseInvoice.id} | 
            Fournisseur: {singlePurchaseInvoice.supplier.name}
          </Text>
        )}
      </div>

      {/* Étapes du processus */}
      <Card className="steps-card">
        <Steps
          current={currentStep}
          items={[
            {
              title: 'Sélection des produits',
              description: 'Choisir les produits à retourner',
              icon: <ShoppingCartOutlined />
            },
            {
              title: 'Informations',
              description: 'Date et motif du retour',
              icon: <FileDoneOutlined />
            },
            {
              title: 'Confirmation',
              description: 'Retour traité',
              icon: <CheckCircleOutlined />
            },
          ]}
        />
      </Card>

      {/* Contenu principal */}
      <div className="return-content">
        {loading ? (
          <Card className="loading-card">
            <Loader />
          </Card>
        ) : success ? (
          <Card className="success-card">
            <Result
              status="success"
              title="Retour traité avec succès!"
              subTitle={`Montant du retour: ${totalReturnAmount.toLocaleString('fr-FR')} €`}
              extra={[
                <Button 
                  type="primary" 
                  key="view" 
                  onClick={() => navigate(`/purchase/${id}`)}
                >
                  Voir la facture
                </Button>,
                <Button 
                  key="back" 
                  onClick={() => navigate('/purchaselist')}
                >
                  Liste des achats
                </Button>,
              ]}
            />
          </Card>
        ) : singlePurchaseInvoice ? (
          <>
            {/* Étape 1: Sélection des produits */}
            {currentStep === 0 && (
              <Card 
                className="products-card"
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    Sélectionner les produits à retourner
                  </Space>
                }
              >
                <Alert
                  message="Instructions"
                  description="Sélectionnez les quantités à retourner pour chaque produit. La quantité ne peut pas dépasser la quantité achetée."
                  type="info"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />

                <PurchaseProductListCard
                  formData={formData}
                  updateReturn={true}
                  returnOnChange={updateHandler}
                  list={list}
                />

                <Divider />

                <Row gutter={[16, 16]} justify="space-between" align="middle">
                  <Col xs={24} sm={12}>
                    <Alert
                      message={
                        <Space>
                          <DollarOutlined />
                          <Text strong>Montant total du retour:</Text>
                          <Text strong style={{ fontSize: '16px' }}>
                            {totalReturnAmount.toLocaleString('fr-FR')} €
                          </Text>
                        </Space>
                      }
                      type="success"
                      showIcon={false}
                    />
                  </Col>
                  <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                    <Button 
                      type="primary" 
                      onClick={nextStep}
                      disabled={!hasSelectedProducts()}
                    >
                      Continuer
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Étape 2: Informations supplémentaires */}
            {currentStep === 1 && (
              <Card 
                className="info-card"
                title={
                  <Space>
                    <FileDoneOutlined />
                    Informations sur le retour
                  </Space>
                }
              >
                <Form
                  form={form}
                  onFinish={submitHandler}
                  layout="vertical"
                  requiredMark="optional"
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        name="date" 
                        label={
                          <Space>
                            <CalendarOutlined />
                            Date du retour
                          </Space>
                        }
                        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
                        initialValue={moment(new Date())}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          onChange={(date) => setDate(date)}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={12}>
                      <Statistic
                        title="Montant total du retour"
                        value={totalReturnAmount}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<DollarOutlined />}
                        suffix="€"
                        formatter={(value) => value.toLocaleString('fr-FR')}
                      />
                    </Col>

                    <Col span={24}>
                      <Form.Item 
                        name="note" 
                        label={
                          <Space>
                            <MessageOutlined />
                            Motif du retour
                          </Space>
                        }
                        rules={[{ required: true, message: 'Veuillez indiquer le motif du retour' }]}
                      >
                        <TextArea 
                          rows={4} 
                          placeholder="Précisez le motif du retour (ex: produits endommagés, erreur de commande, etc.)" 
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />

                  <Form.Item>
                    <Row gutter={16} justify="space-between">
                      <Col>
                        <Button onClick={prevStep}>
                          Retour
                        </Button>
                      </Col>
                      <Col>
                        <Button 
                          type="primary" 
                          htmlType="submit"
                          loading={submitting}
                          icon={<RollbackOutlined />}
                        >
                          Soumettre le retour
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </>
        ) : (
          <Card className="error-card">
            <Result
              status="warning"
              title="Facture non trouvée"
              subTitle="Impossible de charger les détails de la facture"
              extra={
                <Button type="primary" onClick={() => navigate('/purchaselist')}>
                  Retour à la liste
                </Button>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddReturnPurchase;