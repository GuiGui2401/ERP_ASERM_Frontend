import { Button, Dropdown, Menu, Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loadAllReports } from "../../../redux/reduxDistribution/actions/reporting/getReportAction";
import PageTitle from "../../page-header/PageHeader";

function ReportingTable({ list, total }) {
  const dispatch = useDispatch();
  const [columnsToShow, setColumnsToShow] = useState([]);

  // Définition des colonnes pour la table des rapports
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Nom du Prospect",
      dataIndex: "prospectName",
      key: "prospectName",
      render: (name, { id }) => <Link to={`/reportings/${id}`}>{name}</Link>,
      sorter: (a, b) => a.prospectName.localeCompare(b.prospectName),
    },
    {
      title: "Date du RDV",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Objet du RDV",
      dataIndex: "rdvObject",
      key: "rdvObject",
    },
    {
      title: "Date Prochain RDV",
      dataIndex: "nextRdv",
      key: "nextRdv",
      render: (nextRdv) => moment(nextRdv).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      sorter: (a, b) => a.contact.localeCompare(b.contact),
    },
    {
      title: "Pharmacovigilance",
      dataIndex: "pharmacoVigilance",
      key: "pharmacoVigilance",
    },
    {
      title: "Ajouté le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  useEffect(() => {
    setColumnsToShow(columns);
  }, []);

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div>
      <div>
        <PageTitle title=" Retour " subtitle={`RAPPORT DE PROSPECTION `} />
      </div>
      
      <div>
        <Table
        scroll={{ x: true }}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          total: total,
          onChange: (page, limit) => {
            dispatch(loadAllReports({ page, limit }));
          },
        }}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
      />
      </div>
      
    </div>
    
  );
}

export default ReportingTable;
