import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAutomatedProductRecommendations.css"; // Importing CSS

const AIAutomatedProductRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("/api/ai-product-recommendations");
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load product recommendations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-product-recommendations-container">
      <Sidebar />
      <Container fluid className="ai-product-recommendations-content">
        <h2 className="ai-product-recommendations-title">🛍️ AI Product Recommendations</h2>

        {/* Recommendations List */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            {recommendations.map((product, index) => (
              <Col md={3} key={index}>
                <Card className="product-card">
                  <Card.Img variant="top" src={product.image} alt={product.name} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Button variant="primary">Buy Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <style>
        {`
        .ai-product-recommendations-container {
  display: flex;
  height: 100vh;
}

.ai-product-recommendations-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-product-recommendations-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.product-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.05);
}
`}
      </style>
    </div>
  );
};

export default AIAutomatedProductRecommendations;
