import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Row,
  Typography,
} from "antd";

import { Navigate, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadSingleSale } from "../../../redux/reduxDistribution/actions/sale/detailSaleAction";
import moment from "moment";
import { addCustomerPayment } from "../../../redux/reduxDistribution/actions/customerPayment/addCustomerPaymentAction";
import PageTitle from "../../page-header/PageHeader";
import { toast } from "react-toastify";

const AddCustPaymentByInvoice = () => {
  const navigate = useNavigate();

  const { pid } = useParams();

  const dispatch = useDispatch();
  const [dueAmount, setDueAmount] = useState(0);
  const { sale } = useSelector((state) => state?.sales);
  const { Title } = Typography;

  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(loadSingleSale(pid));
  }, [dispatch, pid]);

  useEffect(() => {
    if (sale) {
      setDueAmount(sale.dueAmount);
      form.setFieldsValue({ due_amount: sale.dueAmount });
    }
  }, [sale, form]);

  let [date, setDate] = useState(moment());
  const [loader, setLoader] = useState(false);

  const onFinish = async (values) => {
    try {
      const data = {
        date: date,
        ...values,
      };

      const resp = await dispatch(addCustomerPayment(data));

      if (resp == "success") {
        navigate(-1);
        setLoader(false);
        toast.success("Paiement éffectué avec succès");
      }

      form.resetFields();
    } catch (error) {
      console.log(error.message);
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoader(false);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <PageTitle title={"Retour"} subtitle={"PAIEMENT FACTURE CLIENT"}/>
      <Row className="mr-top">
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={14}
          className="border rounded column-design"
        >
          <Card bordered={false} className="criclebox h-full">
            <Title level={3} className="m-3 text-center">
              Paiement de la facture de vente
            </Title>
            <Form
              form={form}
              className="m-4"
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                hasFeedback
                validateStatus="success"
                initialValue={pid}
                style={{ marginBottom: "10px" }}
                label="N° Facture de vente"
                name="sale_invoice_no"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le N° de la facture!",
                  },
                ]}
              >
                <Input type="number" disabled col="true" />
              </Form.Item>

              <Form.Item
                label="Date"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la date!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(value) => setDate(value?._d)}
                  defaultValue={moment()}
                  style={{ marginBottom: "10px" }}
                  label="date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir la date",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Montant à Payer"
                name="due_amount"
                style={{ marginBottom: "10px" }}
              >
                <InputNumber disabled value={dueAmount}   />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Remise"
                name="discount"
                rules={[
                  {
                    required: false,
                    message:
                      "S’il vous plaît entrer le montant de la Réduction!",
                  },
                ]}
              >
                <InputNumber
                 type='number'
                 defaultValue={0}
                 value={0}
                 min={0}
                 max={dueAmount}
                  placeholder="Entre le montant de la remise"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Montant"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le montant!",
                  },
                ]}
              >
                <Input
                  type="number"
                  value={0}
                  min={0}
                  placeholder="Entre le montant "
                  max={dueAmount}
                />
              </Form.Item>

              {/* <Form.Item
								style={{ marginBottom: "10px" }}
								label='Particulars'
								name='particulars'
								rules={[
									{
										required: true,
										message: "Please input particulars!",
									},
								]}>
								<Input />
							</Form.Item> */}

              <Form.Item
                style={{ marginBottom: "10px" }}
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  onClick={() => setLoader(true)}
                  block
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  loading={loader}
                >
                  Payer maintenant
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddCustPaymentByInvoice;
