import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAutoReplyChatbot.css"; // Importing CSS

const AIAutoReplyChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/ai-auto-reply", { message: inputMessage });
      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to retrieve AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-auto-reply-container">
      <Sidebar />
      <Container fluid className="ai-auto-reply-content">
        <h2 className="ai-auto-reply-title">🤖 AI Auto-Reply Chatbot</h2>

        <Card className="chat-card">
          <Card.Body className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <Spinner animation="border" className="chat-spinner" />}
          </Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card.Footer>
            <Form className="chat-form">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button variant="primary" onClick={sendMessage}>
                Send
              </Button>
            </Form>
          </Card.Footer>
        </Card>
      </Container>
      <style>
        {`.ai-auto-reply-container {
  display: flex;
  height: 100vh;
}

.ai-auto-reply-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-auto-reply-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.chat-card {
  max-width: 600px;
  margin: auto;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.message.user {
  background-color: #3498db;
  color: white;
  align-self: flex-end;
}

.message.bot {
  background-color: #2ecc71;
  color: white;
  align-self: flex-start;
}

.chat-form {
  display: flex;
  gap: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutoReplyChatbot;
