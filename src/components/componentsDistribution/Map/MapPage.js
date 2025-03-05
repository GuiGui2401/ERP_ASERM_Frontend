import React, { useEffect, useState, useRef } from "react";
import { 
  Card, 
  Form, 
  Select, 
  Input, 
  Button, 
  Divider, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Tag, 
  Spin, 
  Tooltip, 
  Alert, 
  List,
  Avatar,
  Badge, Empty
} from "antd";
import { 
  EnvironmentOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ShopOutlined, 
  HomeOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  AimOutlined,
  CarOutlined
} from "@ant-design/icons";
import { Loader } from "@googlemaps/js-api-loader";
import PageTitle from "../../page-header/PageHeader";
import "./MapPage.css";

// Remplacer par votre clé Google Maps API
const API_KEY = "AIzaSyD0kO0ws5BJIYgvWhT3Q0PDhl_La6Vw_S8";

// Données des clients pour la démo
const clientsData = [
  {
    id: 1,
    name: "Pharmacie Centrale",
    lat: 3.8480,
    long: 11.5021,
    city: "Yaoundé",
    quarter: "Biyem-Assi",
    type: "Pharmacy",
    phone: "+237 123 456 789",
    lastVisit: "2023-08-15"
  },
  {
    id: 2,
    name: "Distributeur Sanou",
    lat: 4.0435,
    long: 9.7043,
    city: "Douala",
    quarter: "Bonapriso",
    type: "Distributor",
    phone: "+237 234 567 890",
    lastVisit: "2023-09-22"
  },
  {
    id: 3,
    name: "Pharmacie du Rail",
    lat: 3.8570,
    long: 11.5175,
    city: "Yaoundé",
    quarter: "Mokolo",
    type: "Pharmacy",
    phone: "+237 345 678 901",
    lastVisit: "2023-10-05"
  },
  {
    id: 4,
    name: "Distributeur Ndogbong",
    lat: 4.0651,
    long: 9.7165,
    city: "Douala",
    quarter: "Ndogbong",
    type: "Distributor",
    phone: "+237 456 789 012",
    lastVisit: "2023-07-30"
  },
  {
    id: 5,
    name: "Pharmacie Ekounou",
    lat: 3.8280,
    long: 11.5100,
    city: "Yaoundé",
    quarter: "Ekounou",
    type: "Pharmacy",
    phone: "+237 567 890 123",
    lastVisit: "2023-11-12"
  },
  {
    id: 6,
    name: "Distributeur Makepe",
    lat: 4.0828,
    long: 9.7306,
    city: "Douala",
    quarter: "Makepe",
    type: "Distributor",
    phone: "+237 678 901 234",
    lastVisit: "2023-10-18"
  },
  {
    id: 7,
    name: "Pharmacie Bastos",
    lat: 3.8810,
    long: 11.5102,
    city: "Yaoundé",
    quarter: "Bastos",
    type: "Pharmacy",
    phone: "+237 789 012 345",
    lastVisit: "2023-09-03"
  },
  {
    id: 8,
    name: "Distributeur Deido",
    lat: 4.0487,
    long: 9.7072,
    city: "Douala",
    quarter: "Deido",
    type: "Distributor",
    phone: "+237 890 123 456",
    lastVisit: "2023-08-27"
  },
  {
    id: 9,
    name: "Pharmacie Nkolbisson",
    lat: 3.8796,
    long: 11.4321,
    city: "Yaoundé",
    quarter: "Nkolbisson",
    type: "Pharmacy",
    phone: "+237 901 234 567",
    lastVisit: "2023-11-01"
  },
  {
    id: 10,
    name: "Distributeur Akwa",
    lat: 4.0570,
    long: 9.7315,
    city: "Douala",
    quarter: "Akwa",
    type: "Distributor",
    phone: "+237 012 345 678",
    lastVisit: "2023-09-15"
  },
];

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function MapPage() {
  const [clients, setClients] = useState(clientsData);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const mapRef = useRef(null);

  // Récupérer la position de l'utilisateur
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        console.error("Erreur lors de la récupération de la position:", error);
        setLoading(false);
      }
    );
  }, []);

  // Initialiser et charger la carte Google Maps
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
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: window.google.maps.ControlPosition.TOP_RIGHT
        },
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        },
      });
      
      setMapInstance(map);
      
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      // Ajouter le marqueur de position utilisateur s'il est disponible
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          title: "Votre position",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          },
          animation: window.google.maps.Animation.DROP,
          zIndex: 1000
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; text-align: center;">
              <h4 style="margin: 0; color: #4285F4; font-weight: bold;">Vous êtes ici</h4>
              <p style="margin: 5px 0 0 0;">Votre position actuelle</p>
            </div>
          `,
        });

        userMarker.addListener("click", () => {
          userInfoWindow.open(map, userMarker);
        });
        
        // Centrer la carte sur la position de l'utilisateur
        map.setCenter(userLocation);
        map.setZoom(12);
      }

      // Ajouter les marqueurs pour chaque client
      clients.forEach((client) => {
        const isPharmacy = client.type === "Pharmacy";
        const marker = new window.google.maps.Marker({
          position: { lat: client.lat, lng: client.long },
          map: map,
          title: client.name,
          icon: {
            url: isPharmacy
              ? "https://maps.google.com/mapfiles/kml/pal4/icon63.png"
              : "https://maps.google.com/mapfiles/kml/shapes/library_maps.png",
            scaledSize: new window.google.maps.Size(32, 32)
          },
          animation: window.google.maps.Animation.DROP
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 300px;">
              <h4 style="margin: 0 0 8px 0; color: ${isPharmacy ? '#26A69A' : '#5C6BC0'}; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                ${client.name}
              </h4>
              <p style="margin: 4px 0;"><strong>Type:</strong> ${client.type === "Pharmacy" ? "Pharmacie" : "Distributeur"}</p>
              <p style="margin: 4px 0;"><strong>Ville:</strong> ${client.city}</p>
              <p style="margin: 4px 0;"><strong>Quartier:</strong> ${client.quarter}</p>
              <p style="margin: 4px 0;"><strong>Téléphone:</strong> ${client.phone}</p>
              <p style="margin: 4px 0;"><strong>Dernière visite:</strong> ${client.lastVisit}</p>
              <div style="margin-top: 10px; text-align: center;">
                <button style="background-color: #4285F4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;" 
                  onclick="document.dispatchEvent(new CustomEvent('routeToClient', {detail: ${client.id}}))">
                  Calculer l'itinéraire
                </button>
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          // Fermer toutes les fenêtres d'info ouvertes
          infoWindow.open(map, marker);
          setSelectedClient(client);
        });
        
        // Ajouter un écouteur d'événement personnalisé pour le bouton d'itinéraire
        document.addEventListener('routeToClient', (e) => {
          if (e.detail === client.id && userLocation) {
            calculateRoute(directionsService, directionsRenderer, userLocation, client);
          }
        });
      });
      
      setLoading(false);
    }).catch(error => {
      console.error("Erreur lors du chargement de la carte Google Maps:", error);
      setLoading(false);
    });
  }, [clients, userLocation]);

  // Fonction pour calculer l'itinéraire
  const calculateRoute = (directionsService, directionsRenderer, userLocation, client) => {
    if (!userLocation) return;
    
    directionsService.route(
      {
        origin: { lat: userLocation.lat, lng: userLocation.lng },
        destination: { lat: client.lat, lng: client.long },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          // Afficher les informations sur l'itinéraire
          const route = result.routes[0];
          if (route && route.legs.length > 0) {
            const leg = route.legs[0];
            setSelectedClient({
              ...client,
              distance: leg.distance.text,
              duration: leg.duration.text
            });
          }
        } else {
          console.error(`Erreur lors du calcul de l'itinéraire : ${status}`);
        }
      }
    );
  };

  // Filtrer les clients en fonction des critères
  useEffect(() => {
    const filteredClients = clientsData.filter(
      (client) =>
        (selectedCity === "" || client.city === selectedCity) &&
        (selectedQuarter === "" || client.quarter === selectedQuarter) &&
        (selectedType === "" || client.type === selectedType) &&
        (selectedName === "" || client.name.toLowerCase().includes(selectedName.toLowerCase()))
    );
    setClients(filteredClients);
  }, [selectedCity, selectedQuarter, selectedType, selectedName]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCity("");
    setSelectedQuarter("");
    setSelectedType("");
    setSelectedName("");
  };

  return (
    <>
      <PageTitle title="Retour" subtitle="Carte des Entreprises (Pharmacies & Distributeurs)" />
      
      <Row gutter={[16, 16]} className="map-container">
        <Col xs={24} md={18}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined style={{ color: "#1890ff" }} />
                <span>Carte des entreprises</span>
                {loading && <Spin size="small" />}
              </Space>
            }
            bordered={true}
            className="map-card"
          >
            {/* Filtres */}
            <div className="filters-container">
              <Form layout="inline">
                <Form.Item>
                  <Select
                    placeholder="Ville"
                    style={{ width: 150 }}
                    value={selectedCity}
                    onChange={(value) => setSelectedCity(value)}
                    allowClear
                    suffixIcon={<HomeOutlined />}
                  >
                    <Option value="">Toutes les villes</Option>
                    <Option value="Yaoundé">Yaoundé</Option>
                    <Option value="Douala">Douala</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item>
                  <Select
                    placeholder="Quartier"
                    style={{ width: 150 }}
                    value={selectedQuarter}
                    onChange={(value) => setSelectedQuarter(value)}
                    allowClear
                    suffixIcon={<AimOutlined />}
                  >
                    <Option value="">Tous les quartiers</Option>
                    <Option value="Biyem-Assi">Biyem-Assi</Option>
                    <Option value="Bonapriso">Bonapriso</Option>
                    <Option value="Mokolo">Mokolo</Option>
                    <Option value="Ndogbong">Ndogbong</Option>
                    <Option value="Ekounou">Ekounou</Option>
                    <Option value="Makepe">Makepe</Option>
                    <Option value="Bastos">Bastos</Option>
                    <Option value="Deido">Deido</Option>
                    <Option value="Nkolbisson">Nkolbisson</Option>
                    <Option value="Akwa">Akwa</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item>
                  <Select
                    placeholder="Type d'entreprise"
                    style={{ width: 180 }}
                    value={selectedType}
                    onChange={(value) => setSelectedType(value)}
                    allowClear
                    suffixIcon={<ShopOutlined />}
                  >
                    <Option value="">Tous les types</Option>
                    <Option value="Pharmacy">Pharmacie</Option>
                    <Option value="Distributor">Distributeur</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item>
                  <Input
                    placeholder="Rechercher par nom"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    style={{ width: 180 }}
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
                
                <Form.Item>
                  <Tooltip title="Réinitialiser les filtres">
                    <Button 
                      icon={<FilterOutlined />} 
                      onClick={resetFilters} 
                      type="primary"
                      ghost
                    >
                      Réinitialiser
                    </Button>
                  </Tooltip>
                </Form.Item>
              </Form>
            </div>

            {/* Statistiques des résultats */}
            <div className="stats-container">
              <Space split={<Divider type="vertical" />}>
                <Badge count={clients.length} overflowCount={999} showZero color="#1890ff">
                  <Tag color="blue">Total</Tag>
                </Badge>
                <Badge 
                  count={clients.filter(c => c.type === "Pharmacy").length} 
                  overflowCount={999} 
                  showZero 
                  color="#52c41a"
                >
                  <Tag color="green">Pharmacies</Tag>
                </Badge>
                <Badge 
                  count={clients.filter(c => c.type === "Distributor").length} 
                  overflowCount={999} 
                  showZero 
                  color="#722ed1"
                >
                  <Tag color="purple">Distributeurs</Tag>
                </Badge>
              </Space>
            </div>

            {/* Conteneur de la carte */}
            <div 
              id="map" 
              className="google-map"
              ref={mapRef}
            >
              {loading && (
                <div className="map-loading">
                  <Spin size="large" tip="Chargement de la carte..." />
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        {/* Panneau d'informations */}
        <Col xs={24} md={6}>
          <Card 
            title={
              <Space>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                <span>Informations</span>
              </Space>
            }
            bordered={true}
            className="info-card"
          >
            {selectedClient ? (
              <div className="client-info">
                <Title level={4}>{selectedClient.name}</Title>
                <Tag color={selectedClient.type === "Pharmacy" ? "green" : "purple"}>
                  {selectedClient.type === "Pharmacy" ? "Pharmacie" : "Distributeur"}
                </Tag>
                
                <Divider />
                
                <List size="small">
                  <List.Item>
                    <Space>
                      <HomeOutlined />
                      <Text strong>Ville:</Text> 
                      <Text>{selectedClient.city}</Text>
                    </Space>
                  </List.Item>
                  <List.Item>
                    <Space>
                      <EnvironmentOutlined />
                      <Text strong>Quartier:</Text> 
                      <Text>{selectedClient.quarter}</Text>
                    </Space>
                  </List.Item>
                  <List.Item>
                    <Space>
                      <PhoneOutlined />
                      <Text strong>Téléphone:</Text> 
                      <Text>{selectedClient.phone}</Text>
                    </Space>
                  </List.Item>
                  <List.Item>
                    <Space>
                      <InfoCircleOutlined />
                      <Text strong>Dernière visite:</Text> 
                      <Text>{selectedClient.lastVisit}</Text>
                    </Space>
                  </List.Item>
                </List>
                
                {selectedClient.distance && (
                  <>
                    <Divider />
                    <Alert
                      message="Informations sur l'itinéraire"
                      description={
                        <>
                          <Paragraph>
                            <Space>
                              <CarOutlined />
                              <Text strong>Distance:</Text> 
                              <Text>{selectedClient.distance}</Text>
                            </Space>
                          </Paragraph>
                          <Paragraph>
                            <Space>
                              <InfoCircleOutlined />
                              <Text strong>Durée estimée:</Text> 
                              <Text>{selectedClient.duration}</Text>
                            </Space>
                          </Paragraph>
                        </>
                      }
                      type="info"
                      showIcon
                    />
                  </>
                )}
                
                <Divider />
                
                {userLocation && (
                  <Button 
                    type="primary" 
                    block
                    icon={<CarOutlined />}
                    onClick={() => {
                      if (mapInstance) {
                        const directionsService = new window.google.maps.DirectionsService();
                        const directionsRenderer = new window.google.maps.DirectionsRenderer({
                          map: mapInstance,
                          suppressMarkers: false,
                          polylineOptions: {
                            strokeColor: "#4285F4",
                            strokeWeight: 5,
                            strokeOpacity: 0.8
                          }
                        });
                        calculateRoute(directionsService, directionsRenderer, userLocation, selectedClient);
                      }
                    }}
                  >
                    Calculer l'itinéraire
                  </Button>
                )}
              </div>
            ) : (
              <div className="no-selection">
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text type="secondary">
                      Sélectionnez une entreprise sur la carte pour voir ses détails
                    </Text>
                  }
                />
              </div>
            )}
          </Card>
          
          {/* Liste des entreprises */}
          <Card 
            title={
              <Space>
                <ShopOutlined style={{ color: "#1890ff" }} />
                <span>Liste des entreprises</span>
              </Space>
            }
            bordered={true}
            className="list-card"
            style={{ marginTop: 16 }}
          >
            <List
              size="small"
              dataSource={clients.slice(0, 5)}
              renderItem={client => (
                <List.Item
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={selectedClient?.id === client.id ? "selected-item" : ""}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={client.type === "Pharmacy" ? <ShopOutlined /> : <HomeOutlined />}
                        style={{ 
                          backgroundColor: client.type === "Pharmacy" ? "#52c41a" : "#722ed1" 
                        }}
                      />
                    }
                    title={client.name}
                    description={`${client.quarter}, ${client.city}`}
                  />
                </List.Item>
              )}
              footer={
                clients.length > 5 ? (
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">
                      {clients.length - 5} entreprises supplémentaires
                    </Text>
                  </div>
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default MapPage;