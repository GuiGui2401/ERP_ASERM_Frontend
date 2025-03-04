import React from "react";
import { Card, Statistic, Divider, Progress, Space, Typography, Row, Col } from "antd";
import "./dashboard-stat-card.css"; // Fichier CSS pour les styles de carte

const { Text } = Typography;

const DashboardStatCard = ({ 
  title, 
  value, 
  secondValue, 
  secondTitle,
  icon, 
  color, 
  prefix, 
  suffix, 
  progress,
  loading 
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('fr-FR') : value;
  const formattedSecondValue = typeof secondValue === 'number' ? secondValue.toLocaleString('fr-FR') : secondValue;

  return (
    <Card 
      className="stat-card" 
      style={{ borderTop: `3px solid ${color}` }}
      loading={loading}
      bordered={false}
    >
      <div className="stat-card-title">
        <div className="icon-box" style={{ backgroundColor: `${color}15` }}>
          <span className="stat-icon" style={{ color: color }}>{icon}</span>
        </div>
        <Text strong>{title}</Text>
      </div>

      {secondValue !== undefined ? (
        // Carte avec deux valeurs (montant payé / à payer)
        <div className="dual-stat-content">
          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Statistic 
                value={formattedValue} 
                valueStyle={{ color: color, fontSize: '20px' }}
                prefix={prefix}
                suffix={suffix}
              />
              <Text type="secondary" className="stat-label">{title}</Text>
            </Col>
            <Col span={12} className="second-stat">
              <Statistic 
                value={formattedSecondValue} 
                valueStyle={{ fontSize: '20px' }}
                prefix={prefix}
                suffix={suffix}
              />
              <Text type="secondary" className="stat-label">{secondTitle}</Text>
            </Col>
          </Row>
          {progress !== undefined && (
            <Progress 
              percent={progress} 
              strokeColor={color}
              showInfo={false} 
              size="small" 
              className="stat-progress"
            />
          )}
        </div>
      ) : (
        // Carte avec une valeur unique
        <div className="single-stat-content">
          <Statistic 
            value={formattedValue} 
            valueStyle={{ color: color, fontSize: '28px' }}
            prefix={prefix}
            suffix={suffix}
          />
        </div>
      )}
    </Card>
  );
};

export default DashboardStatCard;