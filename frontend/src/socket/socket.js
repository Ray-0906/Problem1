import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  query: {
    userId: localStorage.getItem("userId"),
    role:  localStorage.getItem("role"),
  },
});

export default socket;
