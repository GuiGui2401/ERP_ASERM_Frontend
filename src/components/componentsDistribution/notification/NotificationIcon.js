import { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import { Link } from "react-router-dom";
import axios from "axios"; // Assure-toi d'importer Axios si tu l'utilises
import "./NotificationIcon.css";

function NotificationIcon({ list }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Requête pour récupérer les notifications de rappels de promesses d'achat
    axios.get("/sale-promise/r/reminders")
      .then((response) => {
        setReminders(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des notifications de rappel", error);
      });
  }, []);

  function handleNotificationClick() {
    setShowNotifications(!showNotifications);
  }

  // Notifications pour les produits avec une quantité faible
  const notifyLowStock = list ? list.filter((product) => product.quantity <= 10) : [];

  // Nombre total de notifications (rappels de promesses + produits à faible quantité)
  const totalNotifications = reminders.length + notifyLowStock.length;

  return (
    <div className="notification-icon-container">
      <div>
        {totalNotifications > 0 && (
          <span className="notification-count">{totalNotifications}</span>
        )}
      </div>
      <div className="notification-icon" onClick={handleNotificationClick}>
        <BellOutlined style={{ color: "#fadb14" }} />
      </div>
      {showNotifications && (
        <div className="notification-list-container">
          {/* Notifications de rappels de promesses d'achat */}
          {reminders.map((reminder) => (
            <Alert
              key={reminder.id}
              message="Rappel de promesse d'achat"
              showIcon
              description={
                <span>
                  Rappel pour la promesse d'achat de {reminder.customer_name}, 
                  prévue pour le <strong>{new Date(reminder.dueDate).toLocaleDateString()}</strong>.
                </span>
              }
              type="warning"
              style={{ marginBottom: "16px" }}
              closable
            />
          ))}

          {/* Notifications de produits avec une quantité faible */}
          {notifyLowStock.map((item) => (
            <Alert
              key={item.id}
              message="Quantité faible"
              showIcon
              description={
                <span>
                  Le produit{" "}
                  <Link to={`/product/${item.id}`}>{item.name}</Link> a une
                  quantité inférieure ou égale à 10. Pensez à vous réapprovisionner.
                </span>
              }
              type="warning"
              style={{ marginBottom: "16px" }}
              closable
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationIcon;
