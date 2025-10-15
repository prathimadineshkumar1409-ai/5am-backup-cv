/**
 * Multiplayer Manager - Peer-to-Peer Multiplayer using WebRTC
 * No backend server required - uses PeerJS for signaling
 */

class MultiplayerManager {
    constructor() {
        this.peer = null;
        this.connections = new Map();
        this.currentRoom = null;
        this.isHost = false;
        this.gameState = null;
        this.peerId = null;
    }

    /**
     * Initialize PeerJS connection
     */
    async initialize(userId) {
        try {
            // Load PeerJS library dynamically
            if (!window.Peer) {
                await this.loadPeerJS();
            }

            // Create peer with user ID
            this.peerId = `codeverse-${userId}-${Date.now()}`;
            this.peer = new Peer(this.peerId, {
                debug: 2,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ]
                }
            });

            // Set up event listeners
            this.setupPeerEvents();

            return new Promise((resolve, reject) => {
                this.peer.on('open', (id) => {
                    console.log('Peer connection established:', id);
                    resolve(id);
                });

                this.peer.on('error', (error) => {
                    console.error('Peer error:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Failed to initialize multiplayer:', error);
            throw error;
        }
    }

    /**
     * Load PeerJS library
     */
    async loadPeerJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Set up peer event listeners
     */
    setupPeerEvents() {
        // Handle incoming connections
        this.peer.on('connection', (conn) => {
            console.log('Incoming connection from:', conn.peer);
            this.handleConnection(conn);
        });

        // Handle incoming data
        this.peer.on('data', (data) => {
            console.log('Received data:', data);
            this.handleIncomingData(data);
        });
    }

    /**
     * Create a new multiplayer room
     */
    async createRoom(gameType, userData) {
        this.isHost = true;
        this.currentRoom = {
            id: this.peerId,
            gameType: gameType,
            host: userData,
            players: [userData],
            maxPlayers: 2,
            status: 'waiting',
            gameState: null
        };

        console.log('Room created:', this.currentRoom);
        return this.currentRoom;
    }

    /**
     * Join an existing room
     */
    async joinRoom(roomId, userData) {
        try {
            this.isHost = false;
            
            // Connect to host
            const conn = this.peer.connect(roomId, {
                reliable: true
            });

            return new Promise((resolve, reject) => {
                conn.on('open', () => {
                    console.log('Connected to room:', roomId);
                    
                    // Send join request
                    conn.send({
                        type: 'join',
                        player: userData
                    });

                    this.connections.set(roomId, conn);
                    this.handleConnection(conn);
                    
                    resolve(conn);
                });

                conn.on('error', (error) => {
                    console.error('Failed to join room:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Error joining room:', error);
            throw error;
        }
    }

    /**
     * Handle new connection
     */
    handleConnection(conn) {
        conn.on('data', (data) => {
            this.handleIncomingData(data, conn);
        });

        conn.on('close', () => {
            console.log('Connection closed:', conn.peer);
            this.connections.delete(conn.peer);
            
            if (this.onPlayerDisconnect) {
                this.onPlayerDisconnect(conn.peer);
            }
        });

        conn.on('error', (error) => {
            console.error('Connection error:', error);
        });
    }

    /**
     * Handle incoming data from peers
     */
    handleIncomingData(data, conn) {
        console.log('Received:', data);

        switch (data.type) {
            case 'join':
                if (this.isHost) {
                    this.handlePlayerJoin(data.player, conn);
                }
                break;

            case 'gameState':
                this.gameState = data.state;
                if (this.onGameStateUpdate) {
                    this.onGameStateUpdate(data.state);
                }
                break;

            case 'playerAction':
                if (this.onPlayerAction) {
                    this.onPlayerAction(data.action, data.playerId);
                }
                break;

            case 'gameStart':
                if (this.onGameStart) {
                    this.onGameStart(data.gameData);
                }
                break;

            case 'gameEnd':
                if (this.onGameEnd) {
                    this.onGameEnd(data.results);
                }
                break;

            case 'chat':
                if (this.onChatMessage) {
                    this.onChatMessage(data.message, data.playerId);
                }
                break;
        }
    }

    /**
     * Handle player joining (host only)
     */
    handlePlayerJoin(player, conn) {
        if (this.currentRoom.players.length >= this.currentRoom.maxPlayers) {
            conn.send({
                type: 'error',
                message: 'Room is full'
            });
            conn.close();
            return;
        }

        this.currentRoom.players.push(player);
        this.connections.set(conn.peer, conn);

        // Notify player of successful join
        conn.send({
            type: 'joinSuccess',
            room: this.currentRoom
        });

        // Notify all players of new player
        this.broadcast({
            type: 'playerJoined',
            player: player
        });

        if (this.onPlayerJoin) {
            this.onPlayerJoin(player);
        }
    }

    /**
     * Start the multiplayer game (host only)
     */
    startGame(gameData) {
        if (!this.isHost) {
            console.error('Only host can start the game');
            return;
        }

        this.currentRoom.status = 'playing';
        
        this.broadcast({
            type: 'gameStart',
            gameData: gameData
        });

        if (this.onGameStart) {
            this.onGameStart(gameData);
        }
    }

    /**
     * Send player action to all peers
     */
    sendAction(action) {
        this.broadcast({
            type: 'playerAction',
            action: action,
            playerId: this.peerId
        });
    }

    /**
     * Update game state (host only)
     */
    updateGameState(state) {
        if (!this.isHost) return;

        this.gameState = state;
        this.broadcast({
            type: 'gameState',
            state: state
        });
    }

    /**
     * Send chat message
     */
    sendChatMessage(message) {
        this.broadcast({
            type: 'chat',
            message: message,
            playerId: this.peerId
        });
    }

    /**
     * End the game and send results
     */
    endGame(results) {
        this.broadcast({
            type: 'gameEnd',
            results: results
        });

        if (this.onGameEnd) {
            this.onGameEnd(results);
        }
    }

    /**
     * Broadcast message to all connected peers
     */
    broadcast(data) {
        this.connections.forEach((conn) => {
            if (conn.open) {
                conn.send(data);
            }
        });
    }

    /**
     * Leave current room
     */
    leaveRoom() {
        this.connections.forEach((conn) => {
            conn.close();
        });
        this.connections.clear();
        this.currentRoom = null;
        this.isHost = false;
    }

    /**
     * Destroy peer connection
     */
    destroy() {
        this.leaveRoom();
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }

    /**
     * Get room code for sharing
     */
    getRoomCode() {
        return this.isHost ? this.peerId : null;
    }

    /**
     * Create matchmaking lobby
     */
    async findMatch(gameType, skillLevel) {
        // In a real implementation, this would use a matchmaking server
        // For P2P, we'll use a simple room code system
        
        return {
            message: 'Share your room code with a friend to play together!',
            roomCode: this.peerId
        };
    }
}

/**
 * Multiplayer Game Scene Base Class
 */
class MultiplayerGameScene extends BaseGameScene {
    constructor(key) {
        super(key);
        this.multiplayer = null;
        this.isMultiplayer = false;
        this.opponentData = null;
    }

    init(data) {
        super.init(data);
        
        if (data.multiplayer) {
            this.isMultiplayer = true;
            this.multiplayer = data.multiplayerManager;
            this.setupMultiplayerEvents();
        }
    }

    setupMultiplayerEvents() {
        // Set up multiplayer event handlers
        this.multiplayer.onPlayerAction = (action, playerId) => {
            this.handleOpponentAction(action, playerId);
        };

        this.multiplayer.onGameStateUpdate = (state) => {
            this.updateFromGameState(state);
        };

        this.multiplayer.onPlayerDisconnect = (playerId) => {
            this.handlePlayerDisconnect(playerId);
        };
    }

    handleOpponentAction(action, playerId) {
        // Override in child classes
        console.log('Opponent action:', action);
    }

    updateFromGameState(state) {
        // Override in child classes
        console.log('Game state updated:', state);
    }

    handlePlayerDisconnect(playerId) {
        this.showErrorMessage('Opponent disconnected!');
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }

    sendAction(action) {
        if (this.isMultiplayer && this.multiplayer) {
            this.multiplayer.sendAction(action);
        }
    }
}

// Initialize global multiplayer manager
window.multiplayerManager = new MultiplayerManager();
window.MultiplayerGameScene = MultiplayerGameScene;
