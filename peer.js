const axios = require('axios');
const net = require('net');
const readline = require('readline');

const COLORS = {
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
  YELLOW: '\x1b[33m',
  GREEN: '\x1b[32m',
};

const username = process.argv[2];
const ip = process.argv[3];
const port = process.argv[4];
const serverUrl = 'http://localhost:3000';

let currentPeer = null;
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ثبت نام کاربر
axios
  .post(`${serverUrl}/register`, { username, ip, port })
  .then((response) => {
    console.log(response.data.message);
    listenForConnections();
    rl.prompt();
  })
  .catch((err) => {
    console.error('Error registering:', err.message);
  });

function listenForConnections() {
  const server = net.createServer((socket) => {
    console.log('New connection established.');

    rl.question(
      `Incoming connection from ${socket.remoteAddress}:${socket.remotePort}. Do you want to accept? (yes/no) `,
      (answer) => {
        if (answer.toLowerCase() === 'yes') {
          currentPeer = socket;
          handleSocket(socket);
        } else {
          socket.end();
        }
        rl.prompt();
      }
    );
  });

  server.listen(port, ip, () => {
    console.log(`Listening for connections on ${ip}:${port}`);
  });
}

function connectToPeer(peerIp, peerPort) {
  const client = net.createConnection({ host: peerIp, port: peerPort }, () => {
    console.log(`Connected to ${peerIp}:${peerPort}`);
    currentPeer = client;
    handleSocket(client);
  });

  client.on('error', (err) => {
    console.error('Connection error:', err.message);
  });
}

function handleSocket(socket) {
  socket.on('data', (data) => {
    const message = data.toString().trim();
    if (message === 'exit') {
      console.log('Chat closed by the peer.');
      socket.end();
      currentPeer = null;
    } else {
      console.log(
        COLORS.YELLOW + 'Received message: ' + message + COLORS.RESET
      );
    }
    rl.prompt();
  });

  socket.on('close', () => {
    console.log(COLORS.RED + 'Connection closed' + COLORS.RESET);
    currentPeer = null;
    rl.prompt();
  });

  socket.on('error', (err) => {
    console.error('Connection error:', err.message);
    currentPeer = null;
    rl.prompt();
  });
}

function sendMessage(message) {
  if (currentPeer) {
    if (message === 'exit') {
      currentPeer.end('exit');
      currentPeer = null;
    } else {
      currentPeer.write(message);
    }
  }
}

function listAndConnect() {
  axios
    .get(`${serverUrl}/peers`)
    .then((response) => {
      const peers = response.data.peers.filter(
        (peer) => peer.username !== username
      );
      if (peers.length === 0) {
        console.log(
          COLORS.RED + 'No peers available to connect' + COLORS.RESET
        );
        rl.prompt();
        return;
      }

      const peerToConnect = peers[Math.floor(Math.random() * peers.length)];
      rl.question(
        `Do you want to connect to ${peerToConnect.username} at ${peerToConnect.ip}:${peerToConnect.port}? (yes/no) `,
        (answer) => {
          if (answer.toLowerCase() === 'yes') {
            connectToPeer(peerToConnect.ip, peerToConnect.port);
          }
          rl.prompt();
        }
      );
    })
    .catch((err) => {
      console.error('Error connecting to peer:', err.message);
      rl.prompt();
    });
}

function unregister() {
  axios
    .post(`${serverUrl}/unregister`, { username })
    .then((response) => {
      console.log(COLORS.YELLOW + response.data.message + COLORS.RESET);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error unregistering:', err.message);
    });
}

function showPeers() {
  axios
    .get(`${serverUrl}/peers`)
    .then((response) => {
      const peers = response.data.peers.filter(
        (peer) => peer.username !== username
      );
      if (peers.length === 0) {
        console.log(COLORS.RED + 'No peers available' + COLORS.RESET);
      } else {
        peers.forEach((peer) => {
          console.log(
            COLORS.GREEN +
              `${peer.username} - ${peer.ip}:${peer.port}` +
              COLORS.RESET
          );
        });
      }
      rl.prompt();
    })
    .catch((err) => {
      console.error('Error fetching peers:', err.message);
      rl.prompt();
    });
}

function handleCommands(line) {
  const command = line.trim().split(' ');
  if (currentPeer) {
    sendMessage(line.trim());
  } else {
    if (command[0] === 'connect') {
      if (command.length === 3) {
        const peerIp = command[1];
        const peerPort = command[2];
        connectToPeer(peerIp, peerPort);
      } else {
        listAndConnect();
      }
    } else if (command[0] === 'list') {
      showPeers();
    } else if (command[0] === 'unregister') {
      unregister();
    } else {
      console.log(COLORS.RED + 'Invalid command.' + COLORS.RESET);
    }
  }
  rl.prompt();
}

rl.on('line', handleCommands);
rl.prompt();
