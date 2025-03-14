import React, { useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const beforeUpload = (file) => {
  const isExcel =
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";

  if (!isExcel) {
    alert("Seuls les fichiers Excel sont autorisés !");
  }

  return isExcel;
};

const handleUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (beforeUpload(file)) {
    console.log("Fichier uploadé :", file.name);
    alert(`${file.name} a été téléchargé avec succès.`);
  } else {
    alert(`${file.name} a échoué.`);
  }
};

const UploadButton = () => (
  <OverlayTrigger
    overlay={<Tooltip id="tooltip">Uploader un fichier Excel</Tooltip>}
  >
    <label className="btn btn-success">
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      📤 Uploader Excel
    </label>
  </OverlayTrigger>
);

export default UploadButton;
