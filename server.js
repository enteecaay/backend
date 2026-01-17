const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Middleware to handle ngrok headers
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// Game data store
const gameRooms = new Map();
const players = new Map();
const adminSessions = new Map();

// Default admin account
const ADMIN_ACCOUNT = {
  username: 'admin',
  password: 'admin123',
  id: 'admin-001'
};

// Import game logic
const gameLogic = require('./gameLogic');
const questions = require('./data/questions');

// API Routes
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running' });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
    res.json({ 
      success: true, 
      adminId: ADMIN_ACCOUNT.id,
      username: ADMIN_ACCOUNT.username
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get available rooms
app.get('/api/rooms', (req, res) => {
  const rooms = Array.from(gameRooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    state: room.state,
    players: room.players.length,
    maxPlayers: room.maxPlayers,
    raceDistance: room.raceDistance,
    timeLimit: room.timeLimit,
    createdBy: room.createdBy
  }));
  res.json(rooms);
});

// Get room details
app.get('/api/rooms/:roomId', (req, res) => {
  const room = gameRooms.get(req.params.roomId);
  if (room) {
    res.json({
      id: room.id,
      name: room.name,
      state: room.state,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        morale: p.morale,
        speed: p.speed,
        position: p.position
      })),
      raceDistance: room.raceDistance,
      timeLimit: room.timeLimit,
      timeline: room.timeline
    });
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // ========== ADMIN EVENTS ==========
  socket.on('admin_login', (data) => {
    const { username, password } = data;
    
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      adminSessions.set(socket.id, {
        adminId: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username,
        socketId: socket.id
      });
      
      socket.emit('admin_login_success', {
        adminId: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username
      });
      
      io.emit('admin_connected', { adminId: ADMIN_ACCOUNT.id });
      console.log(`Admin ${username} logged in`);
    } else {
      socket.emit('admin_login_failed', { message: 'Invalid credentials' });
    }
  });

  socket.on('create_race_room', (data) => {
    const admin = adminSessions.get(socket.id);
    if (!admin) {
      socket.emit('error', { message: 'Only admin can create rooms' });
      return;
    }

    const { roomName, targetScore, timeLimit, maxPlayers, speedIncrement, speedDecrement, questionTimeLimit } = data;
    const roomId = 'room_' + Date.now();

    const room = {
      id: roomId,
      name: roomName,
      createdBy: admin.adminId,
      createdAt: new Date(),
      players: [],
      state: 'waiting', // waiting, racing, finished
      targetScore: targetScore || 100, // Điểm cần đạt để thắng
      timeLimit: timeLimit || 600, // seconds
      maxPlayers: maxPlayers || 10,
      speedIncrement: speedIncrement || 0.3, // Tốc độ tăng khi đúng
      speedDecrement: speedDecrement || 0.2, // Tốc độ giảm khi sai
      questionTimeLimit: questionTimeLimit || 30, // Thời gian trả lời câu hỏi (giây)
      startTime: null,
      timeline: gameLogic.initializeTimeline(),
      currentObstacle: 0,
      winner: null
    };

    gameRooms.set(roomId, room);
    socket.join(roomId);
    
    io.emit('room_created', {
      id: roomId,
      name: roomName,
      targetScore,
      timeLimit,
      maxPlayers,
      speedIncrement,
      speedDecrement,
      questionTimeLimit,
      createdBy: admin.username
    });

    socket.emit('room_created_success', { roomId });
    console.log(`Admin created room: ${roomId}`);
  });

  socket.on('get_admin_dashboard', (data) => {
    const admin = adminSessions.get(socket.id);
    if (!admin) {
      socket.emit('error', { message: 'Not authenticated as admin' });
      return;
    }

    const adminRooms = Array.from(gameRooms.entries())
      .filter(([_, room]) => room.createdBy === admin.adminId)
      .map(([id, room]) => ({
        id: room.id,
        name: room.name,
        state: room.state,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          morale: p.morale,
          speed: p.speed,
          position: p.position,
          score: p.score || 0
        })),
        raceDistance: room.raceDistance,
        timeLimit: room.timeLimit,
        startTime: room.startTime,
        winner: room.winner
      }));

    socket.emit('admin_dashboard_data', { rooms: adminRooms });
  });

  // Delete a race room (admin-only, only when not racing)
  socket.on('delete_race_room', (data) => {
    const { roomId } = data || {};
    const admin = adminSessions.get(socket.id);
    if (!admin) {
      socket.emit('error', { message: 'Only admin can delete rooms' });
      return;
    }

    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.createdBy !== admin.adminId) {
      socket.emit('error', { message: 'You are not the admin of this room' });
      return;
    }

    if (room.state === 'racing') {
      socket.emit('error', { message: 'Cannot delete a room while racing' });
      return;
    }

    // Notify players in the room (if any) and remove
    io.to(roomId).emit('room_deleted', { roomId });
    gameRooms.delete(roomId);

    // Update dashboards / lists
    io.emit('room_deleted', { roomId });
    socket.emit('room_deleted_success', { roomId });
  });

  socket.on('start_race', (data) => {
    const admin = adminSessions.get(socket.id);
    const { roomId } = data;
    
    if (!admin) {
      socket.emit('error', { message: 'Only admin can start races' });
      return;
    }

    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.createdBy !== admin.adminId) {
      socket.emit('error', { message: 'You are not the admin of this room' });
      return;
    }

    room.state = 'racing';
    room.startTime = Date.now();
    
    // Only emit to players, not admin
    room.players.forEach(player => {
      const randomQuestion = gameLogic.generateRandomQuestion(questions);
      io.to(player.id).emit('race_started', {
        targetScore: room.targetScore,
        timeLimit: room.timeLimit,
        speedIncrement: room.speedIncrement,
        speedDecrement: room.speedDecrement,
        questionTimeLimit: room.questionTimeLimit,
        currentObstacle: {
          question: randomQuestion,
          name: 'Câu hỏi',
          icon: '📚'
        }
      });
    });

    // Notify admin that race started
    io.to(socket.id).emit('admin_race_started', { roomId });

    // Broadcast leaderboard and time remaining every second
    const leaderboardInterval = setInterval(() => {
      const room = gameRooms.get(roomId);
      if (!room || room.state !== 'racing') {
        clearInterval(leaderboardInterval);
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - room.startTime) / 1000);
      const timeRemaining = Math.max(0, room.timeLimit - elapsedSeconds);
      
      // Calculate score increment for all players based on their speed
      room.players.forEach(player => {
        player.score += player.speed; // Mỗi giây cộng thêm điểm = tốc độ
      });
      
      // Sort players by score
      const leaderboard = room.players
        .map(p => ({
          id: p.id,
          name: p.name,
          score: Math.round(p.score),
          speed: p.speed
        }))
        .sort((a, b) => b.score - a.score);

      io.to(roomId).emit('race_leaderboard_update', {
        roomId,
        leaderboard,
        timeRemaining,
        totalTime: room.timeLimit
      });

      // Check if someone reached target score or time is up
      const winner = room.players.find(p => p.score >= room.targetScore);
      if ((winner || timeRemaining <= 0) && !room.winner) {
        room.winner = winner || leaderboard[0];
        room.state = 'finished';
        room.finalStandings = leaderboard;
        clearInterval(leaderboardInterval);
        
        io.to(roomId).emit('race_finished', {
          winner: room.winner,
          finalStandings: leaderboard
        });
      }
    }, 1000);

    console.log(`Race started in room ${roomId}`);
  });

  // ========== PLAYER EVENTS ==========
  socket.on('join_game', (data) => {
    const { playerName, roomId } = data;
    
    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.state !== 'waiting') {
      socket.emit('error', { message: 'Race has already started' });
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      morale: 100,
      speed: 0.1, // Tốc độ ban đầu
      score: 0, // Điểm số thay vì position
      health: 100,
      joined: new Date()
    };

    room.players.push(player);
    players.set(socket.id, { roomId, playerData: player });

    socket.join(roomId);
    io.to(roomId).emit('player_joined', {
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        morale: p.morale,
        speed: p.speed,
        position: p.position
      })),
      message: `${playerName} đã tham gia cuộc đua!`
    });

    console.log(`Player ${playerName} joined room ${roomId}`);
  });

  socket.on('answer_question', (data) => {
    const { roomId, questionId, answer, isTimeout } = data;
    const playerInfo = players.get(socket.id);
    
    if (!playerInfo) return;

    const room = gameRooms.get(roomId);
    if (!room || room.state !== 'racing') return;

    const question = questions.find(q => q.id === questionId);
    // Nếu timeout, tính là trả lời sai
    const isCorrect = isTimeout ? false : gameLogic.checkAnswer(questionId, answer);

    
    const moraleDelta = isCorrect ? 20 : -15;
    
    playerInfo.playerData.morale = Math.max(0, Math.min(100, playerInfo.playerData.morale + moraleDelta));
    playerInfo.playerData.speed = gameLogic.updatePlayerSpeed(
      playerInfo.playerData.speed,
      isCorrect,
      room.speedIncrement,
      room.speedDecrement
    );

    io.to(roomId).emit('answer_result', {
      playerId: socket.id,
      playerName: playerInfo.playerData.name,
      isCorrect,
      morale: playerInfo.playerData.morale,
      speed: playerInfo.playerData.speed,
      score: Math.round(playerInfo.playerData.score || 0),
      question: question,
      isTimeout
    });

    // Generate random next question
    const nextQuestion = gameLogic.generateRandomQuestion(questions);
    io.to(roomId).emit('next_obstacle', { obstacle: nextQuestion });
  });

  socket.on('player_move', (data) => {
    const { roomId, position } = data;
    const playerInfo = players.get(socket.id);

    if (!playerInfo) return;

    const room = gameRooms.get(roomId);
    if (!room || room.state !== 'racing') return;

    playerInfo.playerData.position = position;

    // Check if player finished
    if (position >= room.raceDistance && !room.winner) {
      room.winner = {
        id: playerInfo.playerData.id,
        name: playerInfo.playerData.name,
        score: playerInfo.playerData.score,
        time: Date.now() - room.startTime
      };
      
      room.state = 'finished';

      io.to(roomId).emit('race_finished', {
        winner: room.winner,
        finalStandings: room.players
          .map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            score: p.score,
            morale: p.morale,
            speed: p.speed
          }))
          .sort((a, b) => b.position - a.position)
      });

      console.log(`Race finished in room ${roomId}. Winner: ${room.winner.name}`);
    }

    io.to(roomId).emit('player_position_update', {
      playerId: socket.id,
      position: playerInfo.playerData.position,
      speed: playerInfo.playerData.speed,
      morale: playerInfo.playerData.morale
    });
  });

  socket.on('disconnect', () => {
    // Remove from admin sessions
    adminSessions.delete(socket.id);

    // Remove from player
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = gameRooms.get(playerInfo.roomId);
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        io.to(playerInfo.roomId).emit('player_left', {
          playerId: socket.id,
          players: room.players.map(p => ({
            id: p.id,
            name: p.name,
            morale: p.morale,
            speed: p.speed,
            position: p.position
          }))
        });

        // Delete room if empty and not racing
        if (room.players.length === 0 && room.state === 'waiting') {
          gameRooms.delete(playerInfo.roomId);
          io.emit('room_deleted', { roomId: playerInfo.roomId });
        }
      }
      players.delete(socket.id);
    }
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
