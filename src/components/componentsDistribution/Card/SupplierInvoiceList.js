import { Link } from "react-router-dom";
import { 
  Table, 
  Button, 
  Card, 
  Space, 
  Badge, 
  Tag, 
  Typography, 
  Tooltip 
} from "antd";
import { 
  FileTextOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  CreditCardOutlined,
  WalletOutlined,
  PercentageOutlined
} from "@ant-design/icons";
import moment from "moment";
import "./modern-invoice.css";

const { Text } = Typography;

function SupplierInvoiceTable({ list, linkTo }) {
  const columns = [
    {
      title: (
        <Space>
          <FileTextOutlined />
          Facture
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      render: (id) => (
        <Link to={`${linkTo}/${id}`}>
          <Tag color="green" className="invoice-tag">
            #{id}
          </Tag>
        </Link>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          Date
        </Space>
      ),
      dataIndex: "date",
      key: "date",
      width: 160,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text strong>{moment(date).format("DD/MM/YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{moment(date).format("HH:mm")}</Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          Montant Total
        </Space>
      ),
      dataIndex: "total_amount",
      key: "total_amount",
      width: 130,
      align: "right",
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount) => (
        <Text strong>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: (
        <Space>
          <PercentageOutlined />
          Remise
        </Space>
      ),
      dataIndex: "discount",
      key: "discount",
      width: 110,
      align: "right",
      responsive: ["md"],
      sorter: (a, b) => a.discount - b.discount,
      render: (discount) => (
        discount > 0 ? (
          <Tag color="volcano">{discount.toLocaleString('fr-FR')} €</Tag>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: (
        <Space>
          <WalletOutlined />
          Montant payé
        </Space>
      ),
      dataIndex: "paid_amount",
      key: "paid_amount",
      width: 130,
      align: "right",
      responsive: ["md"],
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      render: (amount) => (
        <Text style={{ color: '#52c41a' }}>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: (
        <Space>
          <CreditCardOutlined />
          Montant à payer
        </Space>
      ),
      dataIndex: "due_amount",
      key: "due_amount",
      width: 140,
      align: "right",
      responsive: ["md"],
      sorter: (a, b) => a.due_amount - b.due_amount,
      render: (amount) => {
        if (amount === 0) {
          return <Badge status="success" text="Payé" />;
        }
        return <Text type="danger" strong>{amount.toLocaleString('fr-FR')} €</Text>;
      }
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "payment",
      width: 120,
      fixed: "right",
      render: (id, record) => (
        <Tooltip title={record.due_amount === 0 ? "Facture payée" : "Effectuer un paiement"}>
          <Link to={`/payment/supplier/${id}`}>
            <Button 
              type={record.due_amount === 0 ? "default" : "primary"}
              className={`payment-button ${record.due_amount === 0 ? 'payment-complete' : 'payment-needed'}`}
              size="small"
              icon={<CreditCardOutlined />}
            >
              Paiement
            </Button>
          </Link>
        </Tooltip>
      ),
    },
  ];

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div className="invoice-list-container">
      <Card
        className="invoice-card"
        title={
          <Space>
            <FileTextOutlined className="card-icon" style={{ color: "#52c41a" }} />
            <span>Informations sur la facture fournisseur</span>
          </Space>
        }
        extra={
          <Space>
            <Badge count={list?.length || 0} showZero={false} />
          </Space>
        }
      >
        <Table
          className="invoice-table"
          scroll={{ x: 'max-content' }}
          loading={!list}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`,
          }}
          columns={columns}
          dataSource={list ? addKeys(list) : []}
          summary={pageData => {
            if (!pageData.length) return null;
            
            // Calculate totals for visible data
            const totalAmount = pageData.reduce((sum, item) => sum + item.total_amount, 0);
            const totalPaid = pageData.reduce((sum, item) => sum + item.paid_amount, 0);
            const totalDue = pageData.reduce((sum, item) => sum + item.due_amount, 0);
            
            return (
              <Table.Summary fixed>
                <Table.Summary.Row className="summary-row">
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong>Total de la page</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <Text strong>{totalAmount.toLocaleString('fr-FR')} €</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} />
                  <Table.Summary.Cell index={4} align="right">
                    <Text style={{ color: '#52c41a' }} strong>{totalPaid.toLocaleString('fr-FR')} €</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <Text type="danger" strong>{totalDue.toLocaleString('fr-FR')} €</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} />
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default SupplierInvoiceTable;