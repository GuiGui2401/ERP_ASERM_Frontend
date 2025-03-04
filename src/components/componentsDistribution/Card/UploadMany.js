import { 
	Button, 
	Card, 
	Upload, 
	Space, 
	Typography, 
	Progress, 
	Alert, 
	Divider 
  } from "antd";
  import { 
	InboxOutlined, 
	FileExcelOutlined, 
	CloudUploadOutlined, 
	CheckCircleOutlined, 
	WarningOutlined 
  } from "@ant-design/icons";
  import axios from "axios";
  import React, { useState } from "react";
  import { toast } from "react-toastify";
  import "./modern-upload.css";
  
  const { Text, Title } = Typography;
  const { Dragger } = Upload;
  
  const UploadMany = ({ urlPath }) => {
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
	const [uploadMessage, setUploadMessage] = useState("");
  
	const fileReader = new FileReader();
  
	const handleOnChange = (info) => {
	  if (info.file.status === 'removed') {
		setFile(null);
		setUploadStatus(null);
		return;
	  }
  
	  // Only accept CSV files
	  const isCSV = info.file.type === 'text/csv' || info.file.name.endsWith('.csv');
	  if (!isCSV) {
		toast.error("Veuillez télécharger un fichier CSV uniquement");
		return;
	  }
  
	  setFile(info.file.originFileObj);
	  setUploadStatus(null);
	};
  
	const simulateProgress = () => {
	  let progress = 0;
	  const timer = setInterval(() => {
		if (progress >= 90) {
		  clearInterval(timer);
		} else {
		  progress += 10;
		  setUploadProgress(progress);
		}
	  }, 300);
	};
  
	const csvFileToArray = (string) => {
	  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
	  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  
	  const array = csvRows.map((i) => {
		const values = i.split(",");
		const obj = csvHeader.reduce((object, header, index) => {
		  object[header] = values[index];
		  return object;
		}, {});
		return obj;
	  });
  
	  // Filter out empty objects (empty rows)
	  const filteredArray = array.filter(obj => Object.values(obj).some(value => value));
  
	  // post request to backend using axios
	  simulateProgress();
	  
	  axios.post(`${urlPath}?query=createmany`, filteredArray)
		.then((response) => {
		  if (response.statusText === "OK") {
			setLoading(false);
			setUploadProgress(100);
			setUploadStatus('success');
			setUploadMessage(`${filteredArray.length} enregistrements importés avec succès`);
			toast.success("Téléchargé avec Succès");
		  }
		})
		.catch((err) => {
		  console.log(err, "err");
		  setLoading(false);
		  setUploadProgress(100);
		  setUploadStatus('error');
		  setUploadMessage("Erreur lors de l'importation des données. Vérifiez votre fichier CSV.");
		  toast.error("Erreur dans le téléchargement");
		});
	};
  
	const handleOnSubmit = () => {
	  setLoading(true);
	  setUploadProgress(0);
	  setUploadStatus(null);
  
	  if (file) {
		fileReader.onload = function (event) {
		  const text = event.target.result;
		  csvFileToArray(text);
		};
  
		fileReader.readAsText(file);
	  } else {
		toast.warning("Veuillez sélectionner un fichier CSV");
		setLoading(false);
	  }
	};
  
	// Properties for the Upload component
	const uploadProps = {
	  name: 'file',
	  multiple: false,
	  maxCount: 1,
	  accept: '.csv',
	  beforeUpload: (file) => {
		// Return false to prevent default upload behavior
		return false;
	  },
	  onChange: handleOnChange,
	  onRemove: () => {
		setFile(null);
		setUploadStatus(null);
	  }
	};
  
	return (
	  <Card className="upload-card">
		<Title level={4} className="upload-title">
		  <Space>
			<FileExcelOutlined />
			Importer des données CSV
		  </Space>
		</Title>
		<Divider />
		
		<Dragger {...uploadProps} className="upload-dragger">
		  <p className="ant-upload-drag-icon">
			<InboxOutlined />
		  </p>
		  <p className="ant-upload-text">Cliquez ou glissez-déposez un fichier CSV dans cette zone</p>
		  <p className="ant-upload-hint">
			Votre fichier CSV doit contenir les en-têtes de colonnes appropriés.
			Support uniquement pour les fichiers CSV.
		  </p>
		</Dragger>
  
		{file && (
		  <div className="file-info">
			<Space>
			  <FileExcelOutlined />
			  <Text strong>{file.name}</Text>
			  <Text type="secondary">({(file.size / 1024).toFixed(2)} KB)</Text>
			</Space>
		  </div>
		)}
  
		{uploadProgress > 0 && (
		  <div className="upload-progress">
			<Progress 
			  percent={uploadProgress} 
			  status={uploadStatus === 'error' ? 'exception' : undefined} 
			  strokeColor={uploadStatus === 'success' ? '#52c41a' : '#1890ff'}
			/>
		  </div>
		)}
  
		{uploadStatus && (
		  <Alert
			message={uploadStatus === 'success' ? "Importation réussie" : "Échec de l'importation"}
			description={uploadMessage}
			type={uploadStatus === 'success' ? "success" : "error"}
			showIcon
			icon={uploadStatus === 'success' ? <CheckCircleOutlined /> : <WarningOutlined />}
			className="upload-alert"
		  />
		)}
  
		<div className="upload-actions">
		  <Button 
			type="primary" 
			size="large"
			icon={<CloudUploadOutlined />}
			loading={loading}
			onClick={handleOnSubmit}
			disabled={!file || loading}
			block
		  >
			Importer le fichier CSV
		  </Button>
		</div>
	  </Card>
	);
  };
  
  export default UploadMany;