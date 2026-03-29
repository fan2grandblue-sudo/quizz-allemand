let availablePlayers = [...initialPlayerList]; // Initialize available players from the original list

function spinWheel() {
    if (availablePlayers.length === 0) {
        console.log('No more players available for selection!');
        return;
    }
    const selectedIndex = Math.floor(Math.random() * availablePlayers.length);
    const selectedPlayer = availablePlayers[selectedIndex];
    console.log(`Selected player: ${selectedPlayer}`);
    // Remove the selected player from available players
    availablePlayers.splice(selectedIndex, 1);
}

function restartGame() {
    availablePlayers = [...initialPlayerList]; // Reset the available players list
    console.log('Game restarted. Available players reset.');
}