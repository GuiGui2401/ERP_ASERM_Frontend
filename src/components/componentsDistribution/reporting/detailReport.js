import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Popover, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteReport } from "../../../redux/reduxDistribution/actions/reporting/deleteReportAction.js";
import { loadSingleReport } from "../../../redux/reduxDistribution/actions/reporting/detailReportAction.js";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";

// Composants supplémentaires pour le rapport, si nécessaire
// import ReportInvoiceList from "../Card/ReportInvoiceList";

const DetailReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dispatch
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reports.report);

  // Supprimer le rapport
  const onDelete = () => {
    try {
      dispatch(deleteReport(id));
      setVisible(false);
      toast.warning(`Rapport : ${report.title} est supprimé `);
      navigate("/reportings");
    } catch (error) {
      console.log(error.message);
    }
  };

  // PopUp de confirmation pour la suppression
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadSingleReport(id));
  }, [id, dispatch]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div>
      <PageTitle title=" Retour " subtitle={`RAPPORT ${report?.id} `} />

      <div className="mr-top">
        {report ? (
          <Fragment key={report?.id}>
            <Card bordered={false}>
              <div className="card-header d-flex justify-content-between m-3">
                <h5>
                  <i className="bi bi-file-earmark-text"></i>
                  <span className="mr-left">
                    ID : {report.id} | {report.title}
                  </span>
                </h5>
                <div className="text-end">
                  <Link
                    className="m-2"
                    to={`/reporting/${report.id}/update`}
                    state={{ data: report }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      icon={<EditOutlined />}
                    >
                      Modifier
                    </Button>
                  </Link>
                  <Popover
                    content={
                      <Link to={`/reportings`} onClick={onDelete}>
                        <Button type="primary" danger>
                          Oui !
                        </Button>
                      </Link>
                    }
                    title="Voulez-vous vraiment supprimer ?"
                    trigger="click"
                    open={visible}
                    onOpenChange={handleVisibleChange}
                  >
                    <Button
                      type="danger"
                      shape="round"
                      icon={<DeleteOutlined />}
                    >
                      Supprimer
                    </Button>
                  </Popover>
                </div>
              </div>
              <div className="card-body m-2">
                <p>
                  <Typography.Text strong>Nom du rapport :</Typography.Text>{" "}
                  {report.title}
                </p>

                <p>
                  <Typography.Text strong>Créé par :</Typography.Text>{" "}
                  {report.authorName}
                </p>

                <p>
                  <Typography.Text strong>Date de création :</Typography.Text>{" "}
                  {report.creationDate}
                </p>

                <p>
                  <Typography.Text strong>Statut :</Typography.Text>{" "}
                  {report.status}
                </p>
              </div>

              {/* Composants pour lister les éléments associés au rapport, si nécessaire */}
              {/* <ReportInvoiceList list={report?.relatedInvoices} /> */}
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailReport;
