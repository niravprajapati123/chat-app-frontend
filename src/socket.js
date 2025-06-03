// import { io } from "socket.io-client";
// const socket = io("http://localhost:3001");
// export default socket;

import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-tuzo.onrender.com", {
  transports: ["websocket"],
});

export default socket;
