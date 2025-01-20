import React, { useEffect, useState } from "react";
import { Card, Form, Select, Input } from "antd";
import { Loader } from "@googlemaps/js-api-loader";
import PageTitle from "../../page-header/PageHeader";

// Remplacer par votre clé Google Maps API
const API_KEY = "AIzaSyD0kO0ws5BJIYgvWhT3Q0PDhl_La6Vw_S8";

const clientsData = [
  {
    id: 1,
    name: "Pharmacie Centrale",
    lat: 3.8480,
    long: 11.5021,
    city: "Yaoundé",
    quarter: "Biyem-Assi",
    type: "Pharmacy",
  },
  {
    id: 2,
    name: "Distributeur Sanou",
    lat: 4.0435,
    long: 9.7043,
    city: "Douala",
    quarter: "Bonapriso",
    type: "Distributor",
  },
  {
    id: 3,
    name: "Pharmacie du Rail",
    lat: 3.8570,
    long: 11.5175,
    city: "Yaoundé",
    quarter: "Mokolo",
    type: "Pharmacy",
  },
  {
    id: 4,
    name: "Distributeur Ndogbong",
    lat: 4.0651,
    long: 9.7165,
    city: "Douala",
    quarter: "Ndogbong",
    type: "Distributor",
  },
  {
    id: 5,
    name: "Pharmacie Ekounou",
    lat: 3.8280,
    long: 11.5100,
    city: "Yaoundé",
    quarter: "Ekounou",
    type: "Pharmacy",
  },
  {
    id: 6,
    name: "Distributeur Makepe",
    lat: 4.0828,
    long: 9.7306,
    city: "Douala",
    quarter: "Makepe",
    type: "Distributor",
  },
  {
    id: 7,
    name: "Pharmacie Bastos",
    lat: 3.8810,
    long: 11.5102,
    city: "Yaoundé",
    quarter: "Bastos",
    type: "Pharmacy",
  },
  {
    id: 8,
    name: "Distributeur Deido",
    lat: 4.0487,
    long: 9.7072,
    city: "Douala",
    quarter: "Deido",
    type: "Distributor",
  },
  {
    id: 9,
    name: "Pharmacie Nkolbisson",
    lat: 3.8796,
    long: 11.4321,
    city: "Yaoundé",
    quarter: "Nkolbisson",
    type: "Pharmacy",
  },
  {
    id: 10,
    name: "Distributeur Akwa",
    lat: 4.0570,
    long: 9.7315,
    city: "Douala",
    quarter: "Akwa",
    type: "Distributor",
  },
];

function MapPage() {
  const [clients, setClients] = useState(clientsData);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Erreur lors de la récupération de la position:", error);
      }
    );
  }, []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: userLocation
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : { lat: 3.8480, lng: 11.5021 },
        zoom: 6,
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
      });

      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          title: "Votre position",
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `<div><h4>Vous êtes ici</h4></div>`,
        });

        userMarker.addListener("click", () => {
          userInfoWindow.open(map, userMarker);
        });
      }

      clients.forEach((client) => {
        const marker = new window.google.maps.Marker({
          position: { lat: client.lat, lng: client.long },
          map: map,
          title: client.name,
          icon:
            client.type === "Pharmacy"
              ? "https://maps.google.com/mapfiles/kml/pal4/icon63.png"
              : "https://maps.google.com/mapfiles/kml/shapes/library_maps.png",
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h4>${client.name}</h4>
              <p>Type: ${client.type}</p>
              <p>Ville: ${client.city}</p>
              <p>Quartier: ${client.quarter}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          if (userLocation) {
            directionsService.route(
              {
                origin: { lat: userLocation.lat, lng: userLocation.lng },
                destination: { lat: client.lat, lng: client.long },
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(result);
                } else {
                  console.error(`Erreur lors du calcul de l'itinéraire : ${status}`);
                }
              }
            );
          }
        });
      });
    });
  }, [clients, userLocation]);

  const filteredClients = clientsData.filter(
    (client) =>
      (selectedCity === "" || client.city === selectedCity) &&
      (selectedQuarter === "" || client.quarter === selectedQuarter) &&
      (selectedType === "" || client.type === selectedType) &&
      (selectedName === "" || client.name.toLowerCase().includes(selectedName.toLowerCase()))
  );

  useEffect(() => {
    setClients(filteredClients);
  }, [selectedCity, selectedQuarter, selectedType, selectedName]);

  return (
    <>
      <PageTitle title={"Retour"} subtitle={"Carte des Entreprises (Pharmacies & Distributeurs)"} />
      <br />
      <Card>
        <div className="card-title d-flex flex-column flex-md-row align-items-center justify-content-md-center mt-1 py-2">
          <Form layout={"inline"}>
            <Form.Item name="city">
              <Select
                placeholder="Sélectionnez une ville"
                style={{ width: 200 }}
                allowClear
                onChange={(value) => setSelectedCity(value)}
                value={selectedCity}
              >
                <Select.Option value="">Tous</Select.Option>
                <Select.Option value="Yaoundé">Yaoundé</Select.Option>
                <Select.Option value="Douala">Douala</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="quarter">
              <Select
                placeholder="Sélectionnez un quartier"
                style={{ width: 200 }}
                allowClear
                onChange={(value) => setSelectedQuarter(value)}
                value={selectedQuarter}
              >
                <Select.Option value="">Tous</Select.Option>
                <Select.Option value="Biyem-Assi">Biyem-Assi</Select.Option>
                <Select.Option value="Bonapriso">Bonapriso</Select.Option>
                <Select.Option value="Mokolo">Mokolo</Select.Option>
                <Select.Option value="Ndogbong">Ndogbong</Select.Option>
                <Select.Option value="Ekounou">Ekounou</Select.Option>
                <Select.Option value="Makepe">Makepe</Select.Option>
                <Select.Option value="Bastos">Bastos</Select.Option>
                <Select.Option value="Deido">Deido</Select.Option>
                <Select.Option value="Nkolbisson">Nkolbisson</Select.Option>
                <Select.Option value="Akwa">Akwa</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="type">
              <Select
                placeholder="Sélectionnez un type d'entreprise"
                style={{ width: 200 }}
                allowClear
                onChange={(value) => setSelectedType(value)}
                value={selectedType}
              >
                <Select.Option value="">Tous</Select.Option>
                <Select.Option value="Pharmacy">Pharmacie</Select.Option>
                <Select.Option value="Distributor">Distributeur</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="name">
              <Input
                type="text"
                placeholder="Rechercher par nom"
                onChange={(e) => setSelectedName(e.target.value)}
                value={selectedName}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </div>

        <div id="map" style={{ width: "100%", height: "600px" }}></div>
      </Card>
    </>
  );
}

export default MapPage;
