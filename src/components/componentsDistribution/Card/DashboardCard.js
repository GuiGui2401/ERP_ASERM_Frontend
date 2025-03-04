import React from "react";
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Statistic, 
  Space,
  Tooltip,
  Progress
} from "antd";
import { 
  FileTextOutlined, 
  DollarOutlined, 
  TrophyOutlined, 
  CreditCardOutlined,
  WalletOutlined
} from "@ant-design/icons";
import "./dashboard-card.css";

const { Text, Title } = Typography;

const DashboardCard = ({ information, count, isCustomer, title }) => {
  // Formatage des montants pour l'affichage
  const formatAmount = (amount) => {
    return amount ? amount.toLocaleString('fr-FR') : 0;
  };

  // Calcul du pourcentage payé
  const calculatePaymentPercentage = () => {
    if (!information) return 0;
    const total = information.total_amount || 0;
    if (total === 0) return 0;
    
    const paid = information.paid_amount || 0;
    return Math.round((paid / total) * 100);
  };

  const paymentPercentage = calculatePaymentPercentage();

  return (
    <div className="dashboard-stats-container">
      <Row gutter={[24, 24]}>
        {/* Carte 1: Nombre de factures */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div className="stat-card-header">
              <div className="icon-box invoice-icon">
                <FileTextOutlined />
              </div>
              <Text className="stat-title">Factures</Text>
            </div>
            <Statistic 
              value={count?.id || 0} 
              valueStyle={{ color: '#1890ff' }} 
              formatter={(value) => value.toLocaleString('fr-FR')}
            />
            <div className="stat-footer">
              <Text type="secondary">Nombre total de factures</Text>
            </div>
          </Card>
        </Col>

        {/* Carte 2: Montant total */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div className="stat-card-header">
              <div className="icon-box amount-icon">
                <DollarOutlined />
              </div>
              <Text className="stat-title">Montant total</Text>
            </div>
            <Statistic 
              value={information?.total_amount || 0} 
              valueStyle={{ color: '#52c41a' }} 
              suffix="€"
              precision={2}
              formatter={(value) => formatAmount(value)}
            />
            <div className="stat-footer">
              <Text type="secondary">Valeur totale des transactions</Text>
            </div>
          </Card>
        </Col>

        {/* Carte 3: Bénéfice ou Montant payé (selon isCustomer) */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div className="stat-card-header">
              <div className="icon-box profit-icon">
                {isCustomer ? <TrophyOutlined /> : <WalletOutlined />}
              </div>
              <Text className="stat-title">
                {isCustomer ? "Bénéfice total" : "Montant payé"}
              </Text>
            </div>
            <Statistic 
              value={isCustomer ? information?.profit : information?.paid_amount || 0} 
              valueStyle={{ color: isCustomer ? '#722ed1' : '#52c41a' }} 
              suffix="€"
              precision={2}
              formatter={(value) => formatAmount(value)}
            />
            <div className="stat-footer">
              <Text type="secondary">
                {isCustomer ? "Profit net généré" : "Somme déjà payée"}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Carte 4: Montants payés/dus */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div className="stat-card-header">
              <div className="icon-box payment-icon">
                <CreditCardOutlined />
              </div>
              <Text className="stat-title">État des paiements</Text>
            </div>
            
            <div className="payment-status">
              <div className="dual-stat">
                <div className="paid-amount">
                  <Tooltip title="Montant payé">
                    <Text strong className="amount-label">Payé:</Text>
                    <Text className="amount-value">{formatAmount(information?.paid_amount || 0)} €</Text>
                  </Tooltip>
                </div>
                <div className="due-amount">
                  <Tooltip title="Montant à payer">
                    <Text strong className="amount-label">À payer:</Text>
                    <Text className="amount-value">{formatAmount(information?.due_amount || 0)} €</Text>
                  </Tooltip>
                </div>
              </div>
              
              <Progress 
                percent={paymentPercentage} 
                status={paymentPercentage === 100 ? "success" : "active"}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#52c41a',
                }}
                format={(percent) => `${percent}%`}
                className="payment-progress"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardCard;