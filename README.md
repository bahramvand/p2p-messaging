  # Peer-to-Peer Messaging System

This project is a simple peer-to-peer (P2P) messaging system built with Node.js. It includes both server and client components, allowing users to register, connect to peers, and exchange messages.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/your-repo.git
    ```

2. **Install dependencies:**
    ```bash
    cd your-repo
    npm install
    ```

## Server Setup

1. **Run the server:**
    ```bash
    node server.js
    ```
    The server will start on port `3000` by default.

## Client Setup

1. **Run the client:**
    ```bash
    node peer.js <username> <ip> <port>
    ```
    - `<username>`: Unique username for identification
    - `<ip>`: Local IP address
    - `<port>`: Port where the client listens for connections

## Usage

- **Client Commands:**
  - `connect <ip> <port>`: Connect to a specified peer
  - `list`: Show available peers
  - `unregister`: Unregister and exit the application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
