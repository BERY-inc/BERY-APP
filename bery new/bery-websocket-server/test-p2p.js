// Test script for P2P messaging functionality
// Run this after starting the WebSocket server: node server.js

const WebSocket = require('ws');

// Test users
const users = [
    { id: 'user-1', name: 'Alice' },
    { id: 'user-2', name: 'Bob' },
    { id: 'user-3', name: 'Charlie' }
];

const connections = new Map();
let connectedCount = 0;

// Connect all users
users.forEach(user => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
        console.log(`✅ ${user.name} connected`);

        // Register user
        ws.send(JSON.stringify({
            type: 'register',
            userId: user.id,
            userName: user.name
        }));

        connections.set(user.id, ws);
        connectedCount++;

        // Start messaging when all users are connected
        if (connectedCount === users.length) {
            setTimeout(() => {
                startP2PMessaging();
            }, 1000);
        }
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log(`📨 ${user.name} received:`, message);
        } catch (error) {
            console.error(`❌ ${user.name} error parsing message:`, error);
        }
    });

    ws.on('close', () => {
        console.log(`❌ ${user.name} disconnected`);
    });

    ws.on('error', (error) => {
        console.error(`❌ ${user.name} error:`, error);
    });
});

// Start P2P messaging simulation
function startP2PMessaging() {
    console.log('\n🚀 Starting P2P messaging test...\n');

    // Alice sends message to Bob
    setTimeout(() => {
        const aliceWs = connections.get('user-1');
        aliceWs.send(JSON.stringify({
            type: 'message',
            contactId: 'user-2',
            messageId: Date.now(),
            text: 'Hey Bob! How are you?',
            timestamp: new Date().toISOString()
        }));
        console.log('📤 Alice sent message to Bob');
    }, 1000);

    // Bob replies to Alice
    setTimeout(() => {
        const bobWs = connections.get('user-2');
        bobWs.send(JSON.stringify({
            type: 'message',
            contactId: 'user-1',
            messageId: Date.now(),
            text: 'Hi Alice! I\'m doing great, thanks!',
            timestamp: new Date().toISOString()
        }));
        console.log('📤 Bob replied to Alice');
    }, 2000);

    // Charlie sends message to Alice
    setTimeout(() => {
        const charlieWs = connections.get('user-3');
        charlieWs.send(JSON.stringify({
            type: 'message',
            contactId: 'user-1',
            messageId: Date.now(),
            text: 'Hello Alice! Long time no see!',
            timestamp: new Date().toISOString()
        }));
        console.log('📤 Charlie sent message to Alice');
    }, 3000);

    // Alice replies to Charlie
    setTimeout(() => {
        const aliceWs = connections.get('user-1');
        aliceWs.send(JSON.stringify({
            type: 'message',
            contactId: 'user-3',
            messageId: Date.now(),
            text: 'Hey Charlie! Good to hear from you!',
            timestamp: new Date().toISOString()
        }));
        console.log('📤 Alice replied to Charlie');
    }, 4000);

    // Close connections after test
    setTimeout(() => {
        console.log('\n✅ P2P messaging test completed!');
        connections.forEach((ws, userId) => {
            ws.close();
        });
        process.exit(0);
    }, 5000);
}

console.log('🔄 Connecting test users to WebSocket server...');
