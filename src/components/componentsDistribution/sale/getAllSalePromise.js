import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";
import "./sale.css";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Select,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSalePromise } from "../../../redux/reduxDistribution/actions/salePromise/getSalePromiseAction";
import { loadAllStaff } from "../../../redux/reduxRessourceHumaine/rtk/features/user/userSlice";
import PageTitle from "../../page-header/PageHeader";

// Fonction pour ajouter une clé unique aux éléments
const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

// Composant CustomTable pour la table des promesses de vente
function CustomTable({ list, total, startdate, enddate, count, user }) {
  const [columnsToShow, setColumnsToShow] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Nom Client",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (customer_name) => customer_name || "N/A", 
      sorter: (a, b) => a.customer_name?.localeCompare(b.customer_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Téléphone Client",
      dataIndex: "customer_phone",
      key: "customer_phone",
      render: (customer_phone) => customer_phone || "N/A",
      sorter: (a, b) => a.customer_phone?.localeCompare(b.customer_phone),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Adresse Client",
      dataIndex: "customer_address",
      key: "customer_address",
      render: (customer_address) => customer_address || "N/A", // Ajout de l'adresse client si non enregistré
      sorter: (a, b) => a.customer_address?.localeCompare(b.customer_address),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Entreprise",
      dataIndex: "companyName",
      key: "companyName",
      render: (companyName) => companyName || "N/A",
      sorter: (a, b) => a.companyName?.localeCompare(b.companyName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date d'échéance",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => dueDate ? moment(dueDate).format("DD/MM/YY") : "N/A",
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date de rappel",
      dataIndex: "reminderDate",
      key: "reminderDate",
      render: (reminderDate) => reminderDate ? moment(reminderDate).format("DD/MM/YY") : "N/A",
      sorter: (a, b) => moment(a.reminderDate).unix() - moment(b.reminderDate).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Enregistré par",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.userName || "Inconnu",
      sorter: (a, b) => a.user?.userName.localeCompare(b.user?.userName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Produits",
      dataIndex: "salePromiseProduct",
      key: "salePromiseProduct",
      render: (salePromiseProduct) =>
        salePromiseProduct.length > 0 
          ? salePromiseProduct.map((prod) => prod.product.name).join(", ") 
          : "Aucun produit",
    },
  ]; 

  useEffect(() => {
    setColumnsToShow(columns);
  }, []);

  return (
    <Table
      scroll={{ x: true }}
      loading={!list}
      pagination={{
        pageSize: count || 10,
        pageSizeOptions: [10, 20, 50, 100, 200],
        showSizeChanger: true,
        total: total,
        onChange: (page, limit) => {
          dispatch(
            loadAllSalePromise({
              page,
              limit,
              startdate: moment(startdate).format("YYYY-MM-DD"),
              enddate: moment(enddate).format("YYYY-MM-DD"),
              user: user || "",
            })
          );
        },
      }}
      columns={columnsToShow}
      dataSource={list ? addKeys(list) : []}
    />
  );
}

const GetAllSalePromise = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.salePromises.list);
  const total = useSelector((state) => state.salePromises.total);
  const userList = useSelector((state) => state.users.list);
  const [user, setUser] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [startdate, setStartdate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [enddate, setEnddate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );

  useEffect(() => {
    dispatch(loadAllStaff({ status: true }));
  }, [dispatch]);

  const { RangePicker } = DatePicker;
  const totalCount = total?._count?.id;

  useEffect(() => {
    setCount(totalCount);
  }, [totalCount]);

  useEffect(() => {
    dispatch(
      loadAllSalePromise({
        page: 1,
        limit: 10,
        startdate: moment().startOf("month").format("YYYY-MM-DD"),
        enddate: moment().endOf("month").format("YYYY-MM-DD"),
        user: "",
      })
    );
  }, []);

  const onSearchFinish = async (values) => {
    setCount(total?._count?.id);
    setUser(values?.user);
    const resp = await dispatch(
      loadAllSalePromise({
        page: 1,
        limit: "",
        startdate: startdate,
        enddate: enddate,
        user: values.user ? values.user : "",
      })
    );
    if (resp.message === "success") {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  const onCalendarChange = (dates) => {
    const newStartdate = dates[0].format("YYYY-MM-DD");
    const newEnddate = dates[1].format("YYYY-MM-DD");
    setStartdate(newStartdate ? newStartdate : startdate);
    setEnddate(newEnddate ? newEnddate : enddate);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <PageTitle title={"Retour"} subtitle={"LISTE DES PROMESSES DE VENTE"}/>
      <div className="card card-custom mt-1">
        <div className="card-body">
          <h5 className="d-inline-flex">Liste des promesses de vente</h5>
          <div className="card-title d-flex flex-column flex-md-row align-items-center justify-content-md-center mt-1 py-2">
            <div>
              <Form
                onFinish={onSearchFinish}
                form={form}
                layout={"inline"}
                onFinishFailed={() => setLoading(false)}
              >
                <Form.Item name="user">
                  <Select
                    loading={!userList}
                    placeholder="Vendeur"
                    style={{ width: 200 }}
                    allowClear
                  >
                    <Select.Option value="">Tout</Select.Option>
                    {userList &&
                      userList.map((i) => (
                        <Select.Option key={i.id} value={i.id}>{i.username}</Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <div className=" me-2">
                  <RangePicker
                    onCalendarChange={onCalendarChange}
                    defaultValue={[
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ]}
                    className="range-picker"
                  />
                </div>

                <Form.Item>
                  <Button
                    onClick={() => setLoading(true)}
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    size="small"
                  >
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <br />
          <CustomTable
            list={list}
            total={total?._count?.id}
            startdate={startdate}
            enddate={enddate}
            count={count}
            user={user}
          />
        </div>
      </div>
    </>
  );
};

export default GetAllSalePromise;
