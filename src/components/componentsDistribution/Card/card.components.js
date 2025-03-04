import React from "react";
import { Card, Typography, Space, Divider } from "antd";
import "./card-component.css";

const { Title, Text } = Typography;

/**
 * Composant de carte réutilisable avec un style moderne
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la carte
 * @param {React.ReactNode} props.icon - Icône à afficher à côté du titre (optionnel)
 * @param {React.ReactNode} props.extra - Contenu supplémentaire à afficher dans l'en-tête (optionnel)
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS supplémentaires pour la carte (optionnel)
 * @param {boolean} props.bordered - Si la carte doit avoir une bordure (optionnel)
 * @param {string} props.size - Taille de la carte: 'small', 'default' ou 'large' (optionnel)
 * @param {string} props.type - Type de carte: 'primary', 'success', 'warning', 'danger', 'info' (optionnel)
 * @param {Object} props.style - Styles supplémentaires pour la carte (optionnel)
 */
const CardComponent = ({ 
  title, 
  icon, 
  extra, 
  children, 
  className = "", 
  bordered = true, 
  size = "default", 
  type,
  style = {}
}) => {
  // Déterminer la classe de couleur basée sur le type
  const getTypeClass = () => {
    if (!type) return "";
    
    switch(type) {
      case "primary":
        return "card-primary";
      case "success":
        return "card-success";
      case "warning":
        return "card-warning";
      case "danger":
        return "card-danger";
      case "info":
        return "card-info";
      default:
        return "";
    }
  };

  // Classes CSS combinées
  const combinedClassName = `custom-card ${getTypeClass()} ${className} card-${size}`;
  
  return (
    <Card
      title={
        title && (
          <Space align="center">
            {icon && <span className="card-icon">{icon}</span>}
            <span className="card-title">{title}</span>
          </Space>
        )
      }
      extra={extra}
      bordered={bordered}
      className={combinedClassName}
      style={{
        minWidth: 300,
        ...style
      }}
    >
      <div className="card-content">
        {children}
      </div>
    </Card>
  );
};

/**
 * Composant de section pour diviser le contenu à l'intérieur des cartes
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la section
 * @param {React.ReactNode} props.children - Contenu de la section
 */
CardComponent.Section = ({ title, children }) => (
  <div className="card-section">
    {title && (
      <>
        <Text strong className="section-title">{title}</Text>
        <Divider className="section-divider" />
      </>
    )}
    <div className="section-content">
      {children}
    </div>
  </div>
);

/**
 * Composant de ligne pour afficher une paire clé-valeur dans une carte
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.label - Étiquette de la ligne
 * @param {React.ReactNode} props.value - Valeur à afficher
 * @param {React.ReactNode} props.icon - Icône à afficher à côté du label (optionnel)
 */
CardComponent.Row = ({ label, value, icon }) => (
  <div className="card-row">
    <div className="row-label">
      {icon && <span className="row-icon">{icon}</span>}
      <Text type="secondary">{label}</Text>
    </div>
    <div className="row-value">
      {value}
    </div>
  </div>
);

export default CardComponent;