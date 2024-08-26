const initgame = () => {
const grid = Array(5).fill(null).map(() => Array(5).fill(null));
const players = {
        A: {
            characters: [
                { type: 'P1', position: [0, 0] },
                { type: 'P2', position: [0, 1] },
                { type: 'H1', position: [0, 2] },
                { type: 'H2', position: [0, 3] },
                { type: 'P3', position: [0, 4] },]},
        B: {
            characters: [
                { type: 'P1', position: [4, 0] },
                { type: 'P2', position: [4, 1] },
                { type: 'H1', position: [4, 2] },
                { type: 'H2', position: [4, 3] },
                { type: 'P3', position: [4, 4] },]}
    };
    players.A.characters.forEach((char) => {
        const [row, col] = char.position;
        grid[row][col] = { name: `A-${char.type}`, player: 'A', type: char.type };
    });
    players.B.characters.forEach((char) => {
        const [row, col] = char.position;
        grid[row][col] = { name: `B-${char.type}`, player: 'B', type: char.type };
    });

    return {
        grid,
        players,
        currentPlayer: 'A',
        selectedCharacter: null,
        moveHistory: [],
    };
};

const validmove = (gameState, player, character, move) => {
    const { grid } = gameState;
    const [currentRow, currentCol] = character.position;
    let [newRow, newCol] = [currentRow, currentCol];
    switch (move) {
        case 'L': newCol -= character.type === 'H1' ? 2 : 1; break;
        case 'R': newCol += character.type === 'H1' ? 2 : 1; break;
        case 'F': newRow += (player === 'A' ? 1 : -1) * (character.type === 'H1' ? 2 : 1); break;
        case 'B': newRow += (player === 'A' ? -1 : 1) * (character.type === 'H1' ? 2 : 1); break;
        case 'FL': 
            if (character.type === 'H2') {
                newRow += (player === 'A' ? 2 : -2); 
                newCol -= 2; 
            } else {
                return false;
            }
            break;
        case 'FR': 
            if (character.type === 'H2') {
                newRow += (player === 'A' ? 2 : -2); 
                newCol += 2; 
            } else {
                return false;
            }
            break;
        case 'BL': 
            if (character.type === 'H2') {
                newRow += (player === 'A' ? -2 : 2); 
                newCol -= 2; 
            } else {
                return false;
            }
            break;
        case 'BR': 
            if (character.type === 'H2') {
                newRow += (player === 'A' ? -2 : 2); 
                newCol += 2; 
            } else {
                return false;
            }
            break;
        default: return false;
    }
    if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) {
        return false;
    }
    if (grid[newRow][newCol] && grid[newRow][newCol].player === player) {
        return false;
    }
    return true;
};
const processMove = (gameState, player, characterIndex, move) => {
    const character = gameState.players[player].characters[characterIndex];
    if (validmove(gameState, player, character, move)) {
        const [currentRow, currentCol] = character.position;
        let [newRow, newCol] = [currentRow, currentCol];
        switch (move) {
            case 'L': newCol -= character.type === 'H1' ? 2 : 1; break;
            case 'R': newCol += character.type === 'H1' ? 2 : 1; break;
            case 'F': newRow += (player === 'A' ? 1 : -1) * (character.type === 'H1' ? 2 : 1); break;
            case 'B': newRow += (player === 'A' ? -1 : 1) * (character.type === 'H1' ? 2 : 1); break;
            case 'FL': 
                if (character.type === 'H2') {
                    newRow += (player === 'A' ? 2 : -2); 
                    newCol -= 2; 
                } 
                break;
            case 'FR': 
                if (character.type === 'H2') {
                    newRow += (player === 'A' ? 2 : -2); 
                    newCol += 2; 
                } 
                break;
            case 'BL': 
                if (character.type === 'H2') {
                    newRow += (player === 'A' ? -2 : 2); 
                    newCol -= 2; 
                } 
                break;
            case 'BR': 
                if (character.type === 'H2') {
                    newRow += (player === 'A' ? -2 : 2); 
                    newCol += 2; 
                } 
                break;
        }
        if (gameState.grid[newRow][newCol] && gameState.grid[newRow][newCol].player !== player) {
            const opponent = gameState.grid[newRow][newCol].player;
            gameState.players[opponent].characters = gameState.players[opponent].characters.filter(char => char.position[0] !== newRow || char.position[1] !== newCol);
        }
        gameState.grid[currentRow][currentCol] = null;
        gameState.grid[newRow][newCol] = { name: `${player}-${character.type}`, player, type: character.type };
        character.position = [newRow, newCol];
        gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
    }
    return gameState;
};
const checkGameOver = (gameState) => {
    const playerAAlive = gameState.players.A.characters.length > 0;
    const playerBAlive = gameState.players.B.characters.length > 0;

    if (!playerAAlive) return 'B';
    if (!playerBAlive) return 'A';
    return null;
};

module.exports = {
    initgame,
    validmove,
    processMove,
    checkGameOver
};
