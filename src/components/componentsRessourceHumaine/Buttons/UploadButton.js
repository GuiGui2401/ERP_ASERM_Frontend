import { Upload, Button, Tooltip, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const beforeUpload = (file) => {
  const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel";
  
  if (!isExcel) {
    message.error("Seuls les fichiers Excel sont autorisés !");
  }
  
  return isExcel || Upload.LIST_IGNORE;
};

const handleUpload = (info) => {
  if (info.file.status !== "uploading") {
    console.log("Fichier uploadé :", info.file);
  }
  if (info.file.status === "done") {
    message.success(`${info.file.name} a été téléchargé avec succès.`);
  } else if (info.file.status === "error") {
    message.error(`${info.file.name} a échoué.`);
  }
};

const UploadButton = () => (
  <Tooltip title="Uploader un fichier Excel">
    <Upload 
      beforeUpload={beforeUpload}
      onChange={handleUpload}
      showUploadList={false}
    >
      <Button 
        type="primary" 
        icon={<UploadOutlined />}
        style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
        className="upload-button"
      >
        Uploader Excel
      </Button>
    </Upload>
  </Tooltip>
);

export default UploadButton;
