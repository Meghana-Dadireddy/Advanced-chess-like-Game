const socket = new WebSocket('ws://localhost:8080');
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'gameState') {
        updateGameBoard(message.gameState);
    } 
    else if (message.type === 'invalidMove') {
        alert('Invalid move: ' + message.reason);
    } else if (message.type === 'game-over') {
        alert('Game Over! Winner: ' + message.winner);
    }
};
socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
};
socket.onclose = (event) => {
    if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
        console.error('Connection died');
    }
};
const exampleGameState = {
    grid: [
        [{ name: 'A-P1', player: 'A' }, null, null, null, { name: 'B-P1', player: 'B' }],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ],
    currentPlayer: 'B',
};

updateGameBoard(exampleGameState);
function updateGameBoard(gameState) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; 
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const character = gameState.grid[row][col];
            if (character) {
                cell.textContent = character.name; 
                cell.classList.add(character.player === 'A' ? 'playerA' : 'playerB');
            }

            gameBoard.appendChild(cell);
        }
    }
    const currentPlayerDiv = document.getElementById('currentPlayer');
    currentPlayerDiv.textContent = `Current Player: ${gameState.currentPlayer}`;
}

function sendMove(characterIndex, move) {
    const message = {
        type: 'move',
        player: window.gameState.currentPlayer, 
        characterIndex,
        move
    };
    socket.send(JSON.stringify(message));
}
