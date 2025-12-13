// Install dependencies first:
// npm install ws express

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients with user info
const clients = new Map(); // clientId -> { ws, userId, userName }
const userConnections = new Map(); // userId -> clientId

// Group chat management
const groups = new Map(); // groupId -> Set of userIds
const groupConnections = new Map(); // groupId -> Set of clientIds

wss.on('connection', (ws, req) => {
  const clientId = Date.now().toString();
  clients.set(clientId, { ws, userId: null, userName: null });

  console.log(`Client ${clientId} connected from ${req.socket.remoteAddress}:${req.socket.remotePort}. Total clients: ${clients.size}`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connect',
    message: 'Connected to Bery Chat Server',
    clientId: clientId
  }));

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);

      switch (data.type) {
        case 'register':
          // Register user with their ID and name
          handleUserRegistration(clientId, data);
          break;

        case 'message':
          // Handle incoming chat message
          handleChatMessage(ws, data, clientId);
          break;

        case 'connect':
          console.log(`Client ${clientId} initialized connection`);
          break;

        case 'typing':
          // Broadcast typing status to other clients
          broadcastToOthers(clientId, data);
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    const clientData = clients.get(clientId);
    if (clientData && clientData.userId) {
      userConnections.delete(clientData.userId);
    }
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected. Total clients: ${clients.size}`);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`Error with client ${clientId}:`, error);
  });
});

// Handle user registration
function handleUserRegistration(clientId, data) {
  const { userId, userName } = data;

  if (userId && userName) {
    // Update client data
    clients.set(clientId, { ...clients.get(clientId), userId, userName });

    // Register user connection
    userConnections.set(userId, clientId);

    console.log(`User ${userName} (${userId}) registered with client ${clientId}`);

    // Send confirmation
    const clientData = clients.get(clientId);
    if (clientData) {
      clientData.ws.send(JSON.stringify({
        type: 'registered',
        userId: userId,
        userName: userName
      }));
    }
  }
}

// Handle chat messages
function handleChatMessage(ws, data, clientId) {
  const { contactId, messageId, text, timestamp, type = 'text', mediaUrl, mediaType } = data;
  const senderData = clients.get(clientId);

  // Send delivery confirmation to sender
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'status',
      contactId: contactId,
      messageId: messageId,
      status: 'delivered'
    }));
  }, 300);

  // Send read confirmation to sender
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'status',
      contactId: contactId,
      messageId: messageId,
      status: 'read'
    }));
  }, 1000);

  // Handle different contact types
  if (contactId === 'bery-ai') {
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAiResponse(text);
      ws.send(JSON.stringify({
        type: 'message',
        contactId: contactId,
        messageId: Date.now(),
        text: aiResponse,
        timestamp: new Date().toISOString()
      }));
    }, 1500);
  } else if (contactId.startsWith('group-')) {
    // Group chat messaging
    handleGroupMessage(ws, data, clientId);
  } else {
    // P2P messaging - route to specific user
    const recipientClientId = userConnections.get(contactId);

    if (recipientClientId) {
      const recipientData = clients.get(recipientClientId);

      if (recipientData && recipientData.ws.readyState === WebSocket.OPEN) {
        // Send message to recipient
        recipientData.ws.send(JSON.stringify({
          type: 'message',
          contactId: senderData.userId, // Send sender's ID as contactId
          messageId: messageId,
          text: text,
          timestamp: timestamp
        }));

        console.log(`Message routed from ${senderData.userName} (${senderData.userId}) to ${contactId}`);
      } else {
        // Recipient not online
        ws.send(JSON.stringify({
          type: 'status',
          contactId: contactId,
          messageId: messageId,
          status: 'failed',
          error: 'User not online'
        }));
      }
    } else {
      // User not found
      ws.send(JSON.stringify({
        type: 'status',
        contactId: contactId,
        messageId: messageId,
        status: 'failed',
        error: 'User not found'
      }));
    }
  }
}

// AI Response Logic
function getAiResponse(input) {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('balance') || lowerInput.includes('money') || lowerInput.includes('wallet')) {
    return 'Your current balance is:\n\n💵 Total: $13,400\n₿ Bery: 119,260 (1 USD = 8.9 ₿)\n\nWould you like to see your transaction history or investment portfolio?';
  } else if (lowerInput.includes('invest')) {
    return 'Great question! We have several investment options:\n\n📊 Fixed Deposit: 6% APY (Low risk)\n💰 Lending Pool: 10% APY (Medium risk)\n📈 Equity Pool: 15% APY (High risk)\n🚀 Venture Capital: 30% APY (High risk/reward)\n🏢 Real Estate: 12% APY (Medium risk)\n\nWhich interests you most?';
  } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return 'Hi there! 👋 I\'m Bery AI, your financial assistant.\n\nI can help you with:\n• Account & balance info\n• Investment recommendations\n• Transaction support\n• Marketplace guidance\n• Currency conversions\n\nWhat would you like to know?';
  } else {
    return 'I\'m here to help with your Bery account! You can ask me about:\n\n• Your balance & wallet\n• Investment opportunities\n• Sending money\n• The marketplace\n• Bery currency\n\nWhat would you like to know?';
  }
}

// Broadcast message to all clients except sender
function broadcastToOthers(senderId, data) {
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: clients.size,
    uptime: process.uptime()
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});