import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Space, Popconfirm, message, Tooltip } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ProductCategoryTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const fileInputRef = useRef(null); // Référence pour l'input caché

  // Fonction pour gérer l'importation du fichier Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      if (!parsedData.length) {
        message.error("Le fichier est vide ou mal formaté.");
        return;
      }

      setData(parsedData);

      // Générer dynamiquement les colonnes
      const generatedColumns = Object.keys(parsedData[0]).map((key) => ({
        title: key.toUpperCase(),
        dataIndex: key,
        key: key,
      }));

      // Ajouter une colonne Actions
      generatedColumns.push({
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Modifier">
              <Link to={`/product-category/${record.id}/update`} state={{ data: record }}>
                <Button type="text" icon={<EditOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip title="Supprimer">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer cette ligne ?"
                onConfirm={() => handleDelete(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      });

      setColumns(generatedColumns);
    };
  };

  // Supprimer une ligne
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    message.success("Ligne supprimée avec succès !");
  };

  return (
    <div className="product-category-container">
      <div className="controls">
        {/* Input caché avec ref */}
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        {/* Bouton pour déclencher l'input */}
        <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current.click()}>
          Importer un fichier Excel
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ProductCategoryTable;
