import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ExcelUploadButton from './path/to/ExcelUploadButton';

const ProductCategoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Gestion du succès d'upload
  const handleUploadSuccess = (uploadedData) => {
    setData(uploadedData);
  };

  // Supprimer un élément
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    message.success('Ligne supprimée avec succès !');
  };

  // Gestion du changement de page
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Colonnes du tableau
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
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
    },
  ];

  return (
    <div className="product-category-container">
      <div className="controls">
        <ExcelUploadButton onUploadSuccess={handleUploadSuccess} />
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
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} Marques`,
          onChange: handlePageChange,
          onShowSizeChange: (current, size) => setPageSize(size),
        }}
      />
    </div>
  );
};

export default ProductCategoryTable;
