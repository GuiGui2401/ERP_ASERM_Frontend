import { 
	UserOutlined, 
	PhoneOutlined, 
	HomeOutlined, 
	CreditCardOutlined,
	MailOutlined,
	ShopOutlined
  } from "@ant-design/icons";
  import { 
	Avatar, 
	Tag, 
	Card, 
	Typography, 
	Space, 
	Descriptions, 
	Button, 
	Tooltip, 
	Divider 
  } from "antd";
  import "./supplier.css"
  
  const { Text, Title } = Typography;
  
  export const SupplierDetail = ({ supplier }) => {
	// Extraire les deux premières lettres pour l'avatar
	const initials = supplier?.name ? supplier.name.substring(0, 2).toUpperCase() : "SU";
  
	// Formatter le montant à payer
	const formatAmount = (amount) => {
	  return amount ? amount.toLocaleString('fr-FR') + ' €' : '0 €';
	};
  
	// Générer une couleur aléatoire cohérente basée sur le nom du fournisseur
	const getAvatarColor = (name) => {
	  if (!name) return '#87d068';
	  
	  // Simple hash function for consistent color
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
  
	const avatarColor = getAvatarColor(supplier?.name);
  
	return (
	  <Card className="supplier-card">
		<div className="supplier-header">
		  <Space align="center" size="large">
			<Avatar
			  className="supplier-avatar"
			  shape="square"
			  size={64}
			  style={{
				backgroundColor: avatarColor,
				fontSize: '24px',
				fontWeight: 'bold'
			  }}
			>
			  {initials}
			</Avatar>
			
			<div className="supplier-info">
			  <Title level={4} className="supplier-name">
				{supplier.name}
				{supplier.status && (
				  <Tag color="green" className="supplier-status-tag">
					Actif
				  </Tag>
				)}
			  </Title>
			  
			  <Space wrap size="middle">
				{supplier.phone && (
				  <Space>
					<PhoneOutlined />
					<Text copyable>{supplier.phone}</Text>
				  </Space>
				)}
				
				{supplier.email && (
				  <Space>
					<MailOutlined />
					<Text copyable>{supplier.email}</Text>
				  </Space>
				)}
			  </Space>
			</div>
		  </Space>
		</div>
		
		<Divider className="supplier-divider" />
		
		<Descriptions className="supplier-details" column={{ xs: 1, sm: 2 }}>
		  <Descriptions.Item label={<Space><HomeOutlined /> Adresse</Space>}>
			{supplier.address || "Non spécifiée"}
		  </Descriptions.Item>
		  
		  <Descriptions.Item label={<Space><ShopOutlined /> Type</Space>}>
			{supplier.type || "Fournisseur standard"}
		  </Descriptions.Item>
		  
		  <Descriptions.Item label={<Space><CreditCardOutlined /> Montant à payer</Space>}>
			<Text 
			  strong 
			  type={supplier.due_amount > 0 ? "danger" : "secondary"}
			  className="supplier-due-amount"
			>
			  {formatAmount(supplier.due_amount)}
			</Text>
		  </Descriptions.Item>
		</Descriptions>
		
		{supplier.due_amount > 0 && (
		  <div className="supplier-actions">
			<Tooltip title="Effectuer un paiement pour ce fournisseur">
			  <Button type="primary">
				Régler le paiement
			  </Button>
			</Tooltip>
		  </div>
		)}
	  </Card>
	);
  };