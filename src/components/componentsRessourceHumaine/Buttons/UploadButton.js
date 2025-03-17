import { UploadOutlined } from '@ant-design/icons';
import { Tooltip, Upload, Button, message } from 'antd';
import { useState } from 'react';

const UploadButton = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);

  const props = {
    name: 'file',
    action: `${process.env.REACT_APP_API}upload-excel`, 
    headers: {
        // Ici on va ajouter un token d'auth
    },
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Vous ne pouvez télécharger que des fichiers Excel!');
      }
      return isExcel || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }

      if (info.file.status === 'done') {
        setLoading(false);
        message.success(`${info.file.name} a été uploadé avec succès`);
        // Passer les données reçues au parent
        if (onUploadSuccess && info.file.response) {
          onUploadSuccess(info.file.response.data);
        }
      } else if (info.file.status === 'error') {
        setLoading(false);
        message.error(`${info.file.name} n'a pas pu être uploadé.`);
      }
    },
    showUploadList: false,
  };

  return (
    <Tooltip title="Uploader un fichier Excel">
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
