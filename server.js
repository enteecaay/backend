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
      state: 'waiting',
      targetScore: targetScore || 100,
      timeLimit: timeLimit || 600,
      maxPlayers: maxPlayers || 10,
      speedIncrement: speedIncrement || 0.3,
      speedDecrement: speedDecrement || 0.2,
      questionTimeLimit: questionTimeLimit || 30,
      startTime: null,
      timeline: gameLogic.initializeTimeline(),
      currentObstacle: 0,
      winner: null,
      playerSeenQuestions: new Map(),
      playersWithLockedShop: new Set()
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
      const seenQuestions = room.playerSeenQuestions.get(player.id);
      const randomQuestion = gameLogic.generateRandomQuestionWithoutRepeat(questions, seenQuestions);
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
    room.leaderboardInterval = setInterval(() => {
      const room = gameRooms.get(roomId);
      if (!room || room.state !== 'racing') {
        clearInterval(room.leaderboardInterval);
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
          speed: p.speed,
          morale: p.morale,
          shieldActive: p.shieldActive
        }))
        .sort((a, b) => b.score - a.score);

      io.to(roomId).emit('race_leaderboard_update', {
        roomId,
        leaderboard,
        timeRemaining,
        totalTime: room.timeLimit
      });

      // Race kết thúc khi hết giờ - người có điểm cao nhất thắng
      if (timeRemaining <= 0 && !room.winner) {
        room.winner = leaderboard[0]; // Người có điểm cao nhất
        room.state = 'finished';
        room.finalStandings = leaderboard;
        clearInterval(room.leaderboardInterval);
        
        io.to(roomId).emit('race_finished', {
          winner: room.winner,
          finalStandings: leaderboard
        });
      }
    }, 1000);

    // Open shop every 30 seconds (10s open + 20s closed)
    room.shopInterval = setInterval(() => {
      const room = gameRooms.get(roomId);
      if (!room || room.state !== 'racing') {
        clearInterval(room.shopInterval);
        return;
      }

      io.to(roomId).emit('shop_opened', {
        shopItems: gameLogic.getShopItems(),
        timeLimit: 10
      });

      console.log(`Shop opened in room ${roomId}`);
    }, 30000);

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
      speed: 0.1,
      score: 0,
      health: 100,
      joined: new Date(),
      inventory: [],
      shopLocked: false,
      shieldActive: false
    };

    room.players.push(player);
    // Khởi tạo tập hợp câu hỏi đã hỏi cho người chơi mới
    room.playerSeenQuestions.set(socket.id, new Set());
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

    // Kiểm tra nếu morale về 0 thì game over chỉ người chơi đó
    if (playerInfo.playerData.morale === 0) {
      // Loại bỏ người chơi khỏi cuộc đua
      room.players = room.players.filter(p => p.id !== socket.id);
      room.playerSeenQuestions.delete(socket.id);
      
      // Thông báo cho tất cả người chơi rằng ai đó đã bị loại
      io.to(roomId).emit('player_eliminated', {
        playerId: socket.id,
        playerName: playerInfo.playerData.name,
        reason: 'Morale về 0 - Đã hoàn toàn nản lòng',
        remainingPlayers: room.players.length,
        remainingPlayersList: room.players.map(p => ({ id: p.id, name: p.name }))
      });
      
      // Gửi game over chỉ cho người chơi bị loại
      io.to(socket.id).emit('game_over', {
        reason: 'Đạo đức của bạn đã về 0 - Bạn đã hoàn toàn nản lòng!',
        finalScore: Math.round(playerInfo.playerData.score || 0),
        finalMorale: 0
      });
      
      // Nếu không còn người chơi nào, kết thúc toàn bộ cuộc đua
      if (room.players.length === 0) {
        room.state = 'finished';
        
        // Tạo leaderboard rỗng hoặc từ dữ liệu đã lưu
        const finalStandings = [];
        
        // Gửi thông báo kết thúc race cho tất cả (nếu còn ai đang theo dõi)
        io.to(roomId).emit('race_finished', {
          winner: null,
          finalStandings: finalStandings,
          reason: 'Tất cả người chơi đều đã bị loại - Cuộc đua kết thúc'
        });
        
        // Dừng leaderboard interval nếu có
        if (room.leaderboardInterval) {
          clearInterval(room.leaderboardInterval);
        }
      }
      
      return;
    }

    // Generate random next question without repetition for this player
    const seenQuestions = room.playerSeenQuestions.get(socket.id);
    const nextQuestion = gameLogic.generateRandomQuestionWithoutRepeat(questions, seenQuestions);
    // Chỉ gửi câu hỏi mới cho người chơi đã trả lời, không gửi cho toàn bộ phòng
    io.to(socket.id).emit('next_obstacle', { obstacle: nextQuestion });
  });

  socket.on('buy_item', (data) => {
    const { roomId, itemId, targetPlayerId } = data;
    const playerInfo = players.get(socket.id);
    
    if (!playerInfo) return;

    const room = gameRooms.get(roomId);
    if (!room || room.state !== 'racing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.playersWithLockedShop.has(socket.id)) {
      socket.emit('error', { message: 'Shop của bạn đã bị khóa' });
      return;
    }

    const item = gameLogic.SHOP_ITEMS[itemId];
    if (!item) {
      socket.emit('error', { message: 'Item không tồn tại' });
      return;
    }

    if (player.score < item.cost) {
      socket.emit('error', { message: 'Điểm không đủ' });
      return;
    }

    // Với tên lửa, cần có target
    if (item.id === 'rocket' && !targetPlayerId) {
      socket.emit('error', { message: 'Vui lòng chọn mục tiêu cho tên lửa' });
      return;
    }

    player.score -= item.cost;

    // Đóng shop cho người mua ngay lập tức
    socket.emit('close_shop');

    if (item.type === 'mystery') {
      const treasureContent = gameLogic.generateTreasureContent();
      socket.emit('treasure_opened', { treasure: treasureContent });
      
      setTimeout(() => {
        applyTreasureEffect(room, socket.id, treasureContent, io, roomId);
      }, 2000);
    } else {
      // Sử dụng item ngay lập tức
      applyItemEffect(room, socket.id, item, targetPlayerId, io, roomId);
    }

    io.to(roomId).emit('player_bought_item', {
      playerId: socket.id,
      playerName: player.name,
      itemName: item.name,
      itemIcon: item.icon,
      newScore: player.score
    });
  });

  socket.on('use_item', (data) => {
    const { roomId, inventoryIndex, targetPlayerId } = data;
    const playerInfo = players.get(socket.id);
    
    if (!playerInfo) return;

    const room = gameRooms.get(roomId);
    if (!room || room.state !== 'racing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || !player.inventory[inventoryIndex]) return;

    const item = player.inventory[inventoryIndex];
    
    player.inventory.splice(inventoryIndex, 1);

    applyItemEffect(room, socket.id, item, targetPlayerId, io, roomId);

    io.to(roomId).emit('item_used', {
      playerId: socket.id,
      playerName: player.name,
      itemName: item.name,
      targetPlayerId
    });
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
        room.playerSeenQuestions.delete(socket.id);
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

        if (room.players.length === 0 && room.state === 'waiting') {
          gameRooms.delete(playerInfo.roomId);
          io.emit('room_deleted', { roomId: playerInfo.roomId });
        }

        // Cleanup intervals
        if (room.shopInterval) clearInterval(room.shopInterval);
      }
      players.delete(socket.id);
    }
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

function applyItemEffect(room, playerId, item, targetPlayerId, io, roomId) {
  const player = room.players.find(p => p.id === playerId);
  
  switch(item.id) {
    case 'rocket': {
      const target = room.players.find(p => p.id === targetPlayerId);
      if (target) {
        if (!target.shieldActive) {
          target.speed = Math.max(0.1, target.speed * 0.5);
          io.to(targetPlayerId).emit('global_notification', {
            message: `${player.name} bắn tên lửa 🚀 vào bạn! Tốc độ giảm 50%`,
            type: 'danger'
          });
        } else {
          target.shieldActive = false;
          io.to(targetPlayerId).emit('global_notification', {
            message: `Lá chắn 🛡️ của bạn đã chặn tên lửa từ ${player.name}!`,
            type: 'success'
          });
        }
        
        io.to(playerId).emit('global_notification', {
          message: `Bạn đã phóng tên lửa 🚀 vào ${target.name}`,
          type: 'success'
        });
      }
      break;
    }
    
    case 'freeze': {
      room.players.forEach(p => {
        if (p.id !== playerId && !p.shieldActive) {
          p.speed = Math.max(0.1, p.speed * 0.5);
          io.to(p.id).emit('global_notification', {
            message: `${player.name} đóng băng ❄️ bạn! Tốc độ giảm 50%`,
            type: 'danger'
          });
        } else if (p.id !== playerId && p.shieldActive) {
          p.shieldActive = false;
          io.to(p.id).emit('global_notification', {
            message: `Lá chắn 🛡️ của bạn đã chặn băng giá`,
            type: 'success'
          });
        }
      });
      
      io.to(playerId).emit('global_notification', {
        message: `Bạn đã đóng băng ❄️ tất cả đối thủ`,
        type: 'success'
      });
      break;
    }
    
    case 'shield': {
      player.shieldActive = true;
      setTimeout(() => {
        player.shieldActive = false;
      }, 10000);
      io.to(playerId).emit('global_notification', {
        message: `Bạn đang được bảo vệ bởi lá chắn 🛡️ trong 10 giây`,
        type: 'success'
      });
      break;
    }
    
    case 'storm': {
      room.players.forEach(p => {
        if (p.id !== playerId && !p.shieldActive) {
          p.score = Math.max(0, p.score - 10);
          io.to(p.id).emit('global_notification', {
            message: `${player.name} triệu hồi bão táp ⛈️! Bạn mất 10 điểm`,
            type: 'danger'
          });
        } else if (p.id !== playerId && p.shieldActive) {
          p.shieldActive = false;
          io.to(p.id).emit('global_notification', {
            message: `Lá chắn 🛡️ của bạn đã chặn bão táp`,
            type: 'success'
          });
        }
      });
      
      io.to(playerId).emit('global_notification', {
        message: `Bạn đã triệu hồi bão táp ⛈️ cho tất cả đối thủ`,
        type: 'success'
      });
      break;
    }
    
    case 'fog': {
      room.players.forEach(p => {
        if (p.id !== playerId && !p.shieldActive) {
          room.playersWithLockedShop.add(p.id);
          
          setTimeout(() => {
            room.playersWithLockedShop.delete(p.id);
            io.to(p.id).emit('shop_unlocked');
            io.to(p.id).emit('global_notification', {
              message: `Shop đã được mở khóa`,
              type: 'info'
            });
          }, 30000);
          
          io.to(p.id).emit('global_notification', {
            message: `${player.name} tung sương mù 🌫️! Shop của bạn bị khóa 30 giây`,
            type: 'danger'
          });
        } else if (p.id !== playerId && p.shieldActive) {
          p.shieldActive = false;
          io.to(p.id).emit('global_notification', {
            message: `Lá chắn 🛡️ của bạn đã chặn sương mù`,
            type: 'success'
          });
        }
      });
      
      io.to(playerId).emit('global_notification', {
        message: `Bạn đã tung sương mù 🌫️ khóa shop tất cả đối thủ`,
        type: 'success'
      });
      break;
    }
  }
}

function applyTreasureEffect(room, playerId, treasureContent, io, roomId) {
  const player = room.players.find(p => p.id === playerId);
  
  if (treasureContent.type === 'positive') {
    const itemId = treasureContent.content.item;
    const item = gameLogic.SHOP_ITEMS[itemId];
    
    // Đối với tên lửa, chọn mục tiêu là đối thủ mạnh nhất trong tầm nhìn
    let targetPlayerId = null;
    if (itemId === 'rocket') {
      const myScore = player.score;
      const visiblePlayers = room.players.filter(p => 
        p.id !== playerId && Math.abs(p.score - myScore) <= 50
      );
      
      if (visiblePlayers.length > 0) {
        // Chọn đối thủ có điểm cao nhất trong tầm nhìn
        const topPlayer = visiblePlayers.reduce((max, p) => 
          p.score > max.score ? p : max
        );
        targetPlayerId = topPlayer.id;
      }
    }
    
    // Dùng item ngay lập tức
    applyItemEffect(room, playerId, item, targetPlayerId, io, roomId);
    
    io.to(playerId).emit('global_notification', {
      message: `🎁 Rương báu: Bạn nhận được ${item.icon} ${item.name} và dùng ngay!`,
      type: 'success'
    });
  } else {
    const content = treasureContent.content;
    
    if (content.effect.resetSpeed) {
      room.players.forEach(p => {
        p.speed = 0.1; // Reset về initial speed
      });
      
      io.to(roomId).emit('global_notification', {
        message: `⚡ Cơn sốc tức thời! Tất cả tốc độ reset về 0.1`,
        type: 'danger'
      });
    }
    
    if (content.effect.scorePenalty) {
      player.score = Math.max(0, player.score - content.effect.scorePenalty);
    }
    
    if (content.effect.lockShop) {
      room.playersWithLockedShop.add(playerId);
      setTimeout(() => {
        room.playersWithLockedShop.delete(playerId);
        io.to(playerId).emit('shop_unlocked');
      }, content.duration);
    }
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
