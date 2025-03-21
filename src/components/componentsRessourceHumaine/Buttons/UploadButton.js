import { UploadOutlined } from "@ant-design/icons";
import { Tooltip, Upload, Button, message } from "antd";
import { useState } from "react";

const UploadButton = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);

  const props = {
    name: "file",
    action: `${process.env.REACT_APP_API}upload-excel`,
    headers: {},
    beforeUpload: (file) => {
      const isAcceptedFormat =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        file.type === "application/vnd.ms-excel" || 
        file.type === "text/csv";

      if (!isAcceptedFormat) {
        message.error("Seuls les fichiers Excel (.xls, .xlsx) ou CSV (.csv) sont autorisés !");
      }

      return isAcceptedFormat || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }

      if (info.file.status === "done") {
        setLoading(false);
        message.success(`${info.file.name} a été uploadé avec succès`);
        
        if (onUploadSuccess && info.file.response) {
          onUploadSuccess(info.file.response.data);
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} n'a pas pu être uploadé.`);
      }
    },
    showUploadList: false,
  };

  return (
    <Tooltip title="Uploader un fichier Excel ou CSV">
      <Upload {...props}>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
          className="upload-button"
          loading={loading}
        >
          Uploader
        </Button>
      </Upload>
    </Tooltip>
  );
};

export default UploadButton;
