import { Button, Card, Col, Form, Input, Row, Typography, Space, Divider, Tooltip } from "antd";
import { UserAddOutlined, SaveOutlined, UploadOutlined, PhoneOutlined, HomeOutlined, GlobalOutlined } from "@ant-design/icons";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { addSupplier } from "../../../redux/reduxDistribution/actions/supplier/addSupplierAction";
import UploadMany from "../Card/UploadMany";
import styles from "./AddSup.module.css";

const AddSup = () => {
	const dispatch = useDispatch();
	const { Title, Text } = Typography;

	// État pour le chargement du bouton
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		try {
			setLoading(true);
			const resp = await dispatch(addSupplier(values));
			if (resp.message === "success") {
				setLoading(false);
				form.resetFields();
			} else {
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log(error.message);
		}
	};

	const onFinishFailed = (errorInfo) => {
		setLoading(false);
		console.log("Failed:", errorInfo);
	};

	return (
		<Fragment>
			<Row className='mr-top' justify='space-between' gutter={[24, 30]}>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={11}
					xl={11}
					className='rounded column-design'>
					<Card 
						bordered={false}
						className="card-shadow"
						title={
							<Space align="center">
								<UserAddOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
								<Title level={4} style={{ marginBottom: 0 }}>Ajouter un fournisseur</Title>
							</Space>
						}
					>
						<Divider style={{ marginTop: 0 }} />
						
						<Form
							form={form}
							name='basic'
							layout="vertical"
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							
							<Form.Item
								label={
									<Space>
										<GlobalOutlined />
										<span>Nom du fournisseur</span>
									</Space>
								}
								name='name'
								rules={[
									{
										required: true,
										message: "Veuillez saisir le nom du fournisseur!",
									},
								]}>
								<Input placeholder="Entrez le nom de l'entreprise" />
							</Form.Item>

							<Form.Item
								label={
									<Space>
										<PhoneOutlined />
										<span>Numéro de téléphone</span>
									</Space>
								}
								name='phone'
								rules={[
									{
										required: true,
										message: "Veuillez saisir le numéro de téléphone",
									},
								]}>
								<Input maxLength={14} minLength={9} placeholder="+33 XXXXXXXXX" />
							</Form.Item>

							<Form.Item
								label={
									<Space>
										<HomeOutlined />
										<span>Adresse</span>
									</Space>
								}
								name='address'
								rules={[
									{
										required: true,
										message: "Veuillez saisir l'adresse",
									},
								]}>
								<Input.TextArea rows={3} placeholder="Entrez l'adresse complète" />
							</Form.Item>

							<Form.Item className={styles.addSupplierBtnContainer}>
								<Button
									loading={loading}
									type='primary'
									htmlType='submit'
									icon={<SaveOutlined />}
									size="large"
									block>
									Ajouter le fournisseur
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={12}
					xl={12}
					className='rounded column-design'>
					<Card 
						bordered={false} 
						className={`${styles.importCsvCard} card-shadow`}
						title={
							<Space align="center">
								<UploadOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
								<Title level={4} style={{ marginBottom: 0 }}>Import par CSV</Title>
							</Space>
						}
					>
						<Divider style={{ marginTop: 0 }} />
						
						<div style={{ marginBottom: "16px" }}>
							<Text type="secondary">
								Importez plusieurs fournisseurs à la fois en utilisant un fichier CSV. Assurez-vous que votre fichier 
								contient les colonnes suivantes: <Text strong>name</Text>, <Text strong>phone</Text>, <Text strong>address</Text>.
							</Text>
						</div>
						
						<UploadMany urlPath={"supplier"} />
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default AddSup;