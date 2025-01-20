import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Image, Popover, Row, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct } from "../../../redux/reduxDistribution/actions/product/deleteProductAction";
import { loadSingleProduct } from "../../../redux/reduxDistribution/actions/product/detailProductAction";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";

const DetailsProd = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);

  //Delete Supplier
  const onDelete = () => {
    try {
      dispatch(deleteProduct(id));

      setVisible(false);
      toast.warning(`le Produit : ${product.name} est supprimé `);
      return navigate("/product");
    } catch (error) {
      console.log(error.message);
    }
  };
  // Delete Supplier PopUp
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadSingleProduct(id));
  }, [dispatch, id]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  return (
    <div>
      <PageTitle title=" Retour"  subtitle={`${product?.name}`} />

      <div className="mr-top">
        {product ? (
          <Fragment key={product.id}>
            <Card bordered={false} className="card-custom">
              <div className="card-header d-flex justify-content-between m-3">
                <h5>
                  <i className="bi bi-person-lines-fill"></i>
                  <span className="mr-left">
                    Gencode EAN : {product.gencode} | Code Produit : {product.sku}
                  </span>
                </h5>
                <div className="text-end">
                  <Link
                    className="m-2"
                    to={`/product/${product.id}/update`}
                    state={{ data: product }}>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<EditOutlined />}>Modifier</Button>
                  </Link>
                  <Popover
                    className="m-2"
                    content={
                      <a onClick={onDelete}>
                        <Button type="primary" danger>
                          Oui !
                        </Button>
                      </a>
                    }
                    title="Voulez-vous vraiment supprimer ?"
                    trigger="click"
                   open={visible}
                    onOpenChange={handleVisibleChange}>
                    <Button
                      type="danger"
                      shape="round"
                      icon={<DeleteOutlined />}>Supprimer</Button>
                  </Popover>
                </div>
              </div>
              <Row className="d-flex justify-content-between">
                <Col xs={24} xl={8}>
                  <div className="card-body ms-3">
                    <h5> Informations sur le produit :</h5>
                    <p>
                      <Typography.Text strong>Marque :</Typography.Text>{" "}
                      {product.marque}
                    </p>
                    <p>
                      <Typography.Text strong>Fournisseur ID :</Typography.Text>{" "}
                      {product.idSupplier}
                    </p>
                    <p>
                      <Typography.Text strong>Catégorie ID :</Typography.Text>{" "}
                      {product.product_category_id}
                    </p>
                    <p>
                      <Typography.Text strong>Collisage :</Typography.Text>{" "}
                      {product.collisage}
                    </p>
                    <p>
                      <Typography.Text strong>Unité :</Typography.Text>{" "}
                      {product.unit_measurement}
                    </p>
                    <p>
                      <Typography.Text strong>Quantité :</Typography.Text>{" "}
                      {product.quantity}
                    </p>

                    <p>
                      <Typography.Text strong>Prix d’achat :</Typography.Text>{" "}
                      {product.purchase_price}
                    </p>
                    <p>
                      <Typography.Text strong>Dépenses :</Typography.Text>{" "}
                      {product.depense}
                    </p>
                    <p>
                      <Typography.Text strong>Marge :</Typography.Text>{" "}
                      {product.marge}
                    </p>
                    <p>
                      <Typography.Text strong>Prix de vente :</Typography.Text>{" "}
                      {product.sale_price}
                    </p>
                    <p>
                      <Typography.Text strong>Catégorie :</Typography.Text>{" "}
                      {product.unit_type}
                    </p>
                  </div>
                </Col>

                <Col xs={24} xl={8}>
                  <div className="card-body ms-3">
                    <Image
                      width={300}
                      className="fluid"
                      src={product.imageUrl}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailsProd;
