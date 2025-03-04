import React from "react";
import { Row, Col, Card, Statistic, Tooltip, Space } from "antd";
import { 
  ShoppingCartOutlined, 
  RiseOutlined, 
  ShoppingOutlined, 
  FileTextOutlined,
  ArrowUpOutlined
} from "@ant-design/icons";
import "./dashboard-card.css";

const NewDashboardCard = ({ information, loading }) => {
  // Valeurs à afficher (avec fallback à 0 si la propriété n'existe pas)
  const purchaseTotal = information?.product_total || 0;
  const saleTotal = information?.sale_total || 0;
  const profit = information?.sale_profit || 0;
  const purchaseCount = information?.product_count || 0;
  const saleCount = information?.sale_count || 0;
  
  // Calcul du pourcentage de profit par rapport aux ventes
  const profitPercentage = saleTotal > 0 
    ? Math.round((profit / saleTotal) * 100) 
    : 0;

  // Configuration des cartes
  const cards = [
    {
      title: "Total Achat",
      value: purchaseTotal,
      icon: <ShoppingCartOutlined />,
      color: "#1890ff",
      prefix: "",
      suffix: " €"
    },
    {
      title: "Total Vente",
      value: saleTotal,
      icon: <ShoppingOutlined />,
      color: "#52c41a",
      prefix: "",
      suffix: " €"
    },
    {
      title: "Bénéfice total",
      value: profit,
      icon: <RiseOutlined />,
      color: "#722ed1",
      percent: profitPercentage,
      prefix: "",
      suffix: " €"
    },
    {
      type: "dual",
      title1: "Facture d'achat",
      value1: purchaseCount,
      title2: "Facture de vente",
      value2: saleCount,
      icon: <FileTextOutlined />,
      color: "#fa8c16"
    }
  ];

  return (
    <div className="dashboard-stats">
      <Row gutter={[24, 24]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            {card.type === "dual" ? (
              // Carte avec deux statistiques
              <Card 
                className="stat-card" 
                bordered={false}
                loading={loading}
                style={{ borderTop: `3px solid ${card.color}` }}
              >
                <div className="stat-card-header">
                  <div className="icon-wrapper" style={{ backgroundColor: `${card.color}15` }}>
                    {card.icon}
                  </div>
                  <div className="stat-card-title">Factures</div>
                </div>
                
                <div className="dual-stat-content">
                  <div className="dual-stat-row">
                    <div className="dual-stat-item">
                      <div className="dual-stat-value">{card.value1.toLocaleString()}</div>
                      <div className="dual-stat-label">{card.title1}</div>
                    </div>
                    <div className="dual-stat-item text-right">
                      <div className="dual-stat-value">{card.value2.toLocaleString()}</div>
                      <div className="dual-stat-label">{card.title2}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              // Carte avec une statistique
              <Card 
                className="stat-card" 
                bordered={false}
                loading={loading}
                style={{ borderTop: `3px solid ${card.color}` }}
              >
                <div className="stat-card-header">
                  <div className="icon-wrapper" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                    {card.icon}
                  </div>
                  <div className="stat-card-title">{card.title}</div>
                </div>
                
                <Statistic 
                  value={card.value} 
                  precision={2}
                  valueStyle={{ color: card.color }} 
                  prefix={card.prefix}
                  suffix={card.suffix}
                  formatter={(value) => value.toLocaleString('fr-FR')}
                />
                
                {card.percent && (
                  <div className="profit-indicator">
                    <Tooltip title={`${card.percent}% de la valeur totale des ventes`}>
                      <Space>
                        <ArrowUpOutlined style={{ color: card.color }} />
                        <span style={{ color: card.color }}>{card.percent}%</span>
                      </Space>
                    </Tooltip>
                  </div>
                )}
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewDashboardCard;