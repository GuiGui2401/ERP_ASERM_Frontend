import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UploadButton from "../../componentsRessourceHumaine/Buttons/UploadButton";

const ProductCategoryTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleUploadSuccess = (uploadedData) => {
    if (!uploadedData || uploadedData.length === 0) {
      message.error("Le fichier est vide ou mal formaté.");
      return;
    }

    setData(uploadedData);

    // Générer dynamiquement les colonnes à partir des clés du fichier
    const generatedColumns = Object.keys(uploadedData[0]).map((key) => ({
      title: key.toUpperCase(),
      dataIndex: key,
      key: key,
    }));

    // Ajouter la colonne Actions
    generatedColumns.push({
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Modifier">
            <Link to={`/product-category/${record.id}/update`} state={{ data: record }}>
              <Button type="text" icon={<EditOutlined />} className="action-button" />
            </Link>
          </Tooltip>

          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette ligne ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="text" danger icon={<DeleteOutlined />} className="action-button" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    });

    setColumns(generatedColumns);
  };

  // Supprimer un élément
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    message.success("Ligne supprimée avec succès !");
  };

  // Gestion du changement de page
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="product-category-container">
      <div className="controls">
        <UploadButton onUploadSuccess={handleUploadSuccess} /> {/* Bouton Upload intégré */}
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} Catégories`,
          onChange: handlePageChange,
          onShowSizeChange: (current, size) => setPageSize(size),
        }}
      />
    </div>
  );
};

export default ProductCategoryTable;
