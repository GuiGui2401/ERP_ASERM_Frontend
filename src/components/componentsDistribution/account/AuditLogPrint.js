// AuditLogPrint.js
import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { 
  Button, 
  Spin, 
  Typography, 
  Divider, 
  Space, 
  Tooltip, 
  Badge 
} from "antd";
import { 
  PrinterOutlined, 
  DownloadOutlined, 
  FileTextOutlined, 
  ClockCircleOutlined, 
  UserOutlined 
} from "@ant-design/icons";
import moment from "moment";
import getSetting from "../../../api/getSettings";
import "./style.css";

const { Title, Text } = Typography;

const AuditLogPrintContent = forwardRef(({ data }, ref) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSetting()
      .then((data) => {
        setInvoiceData(data.result);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des paramètres:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Chargement des données..." />
      </div>
    );
  }

  return (
    <Fragment>
      <div ref={ref} className="print-wrapper">
        <div className="company-header">
          <div className="logo-container">
            {invoiceData?.logo && (
              <img src={invoiceData.logo} alt="Logo de l'entreprise" className="company-logo" />
            )}
          </div>
          <div className="company-info">
            <Title level={2}>{invoiceData?.company_name}</Title>
            <Title level={4} type="secondary">{invoiceData?.tagline}</Title>
            <Text>{invoiceData?.address}</Text>
            <div className="contact-info">
              <Text>Tél: {invoiceData?.phone}</Text>
              <Text>Email: {invoiceData?.email}</Text>
              <Text>Site web: {invoiceData?.website}</Text>
            </div>
          </div>
        </div>

        <Divider className="divider-large" />
        
        <div className="document-title">
          <Title level={3}>Journal des Logs d'Audit</Title>
          <Text type="secondary">Généré le {moment().format("DD/MM/YYYY à HH:mm")}</Text>
        </div>
        
        <Divider className="divider-large" />

        <div className="table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Date</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user?.userName || "Utilisateur Inconnu"}</td>
                    <td>
                      <Badge 
                        status={getActionStatus(log.action)} 
                        text={log.action} 
                      />
                    </td>
                    <td>{moment(log.timestamp).format("DD/MM/YY HH:mm")}</td>
                    <td>{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">Aucune donnée disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-section">
          <div className="signature-section">
            <Divider />
            <Text>Signature</Text>
            <div className="signature-line"></div>
          </div>

          <div className="document-footer">
            <Divider />
            <Text>{invoiceData?.company_name} | Contact: {invoiceData?.phone}</Text>
            <Text type="secondary">Page 1 sur 1</Text>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

// Helper function to determine badge status based on action
const getActionStatus = (action) => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('create') || actionLower.includes('ajout')) return 'success';
  if (actionLower.includes('update') || actionLower.includes('modif')) return 'warning';
  if (actionLower.includes('delete') || actionLower.includes('suppression')) return 'error';
  return 'processing';
};

const AuditLogPrint = ({ data }) => {
  const componentRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise(resolve => {
        setTimeout(resolve, 500);
      });
    },
    onAfterPrint: () => setIsPrinting(false),
  });

  return (
    <div className="print-container">
      <div className="hidden-print">
        <AuditLogPrintContent ref={componentRef} data={data} />
      </div>
      
      <Space>
        <Tooltip title="Imprimer le journal d'audit">
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
            loading={isPrinting}
          >
            Imprimer
          </Button>
        </Tooltip>
        
        <Tooltip title="Exporter en PDF">
          <Button 
            type="default" 
            icon={<DownloadOutlined />} 
            onClick={handlePrint}
          >
            Exporter PDF
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};

export default AuditLogPrint;