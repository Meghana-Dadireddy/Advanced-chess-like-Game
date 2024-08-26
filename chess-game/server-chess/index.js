const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const {initgame , processMove, checkGameOver } = require('./gamelogic');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = initgame();

wss.on('connection', (ws) => {
console.log('New client connected');
ws.send(JSON.stringify({ type: 'gameState', gameState }));
ws.on('message', (message) => {
const { type, player, characterIndex, move } = JSON.parse(message);
if (type === 'move') {
    gameState = processMove(gameState, player, characterIndex, move);
const winner = checkGameOver(gameState);
if (winner) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
             type: 'game-over',
             winner: `Player ${winner}` 
             }));
        }
    });
        } else {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'gameState',
                            gameState
                        }));
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        console.log('Client got disconnected');
    });
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
