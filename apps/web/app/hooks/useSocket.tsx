import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export default function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3N2Q5ZDc0Mi1lNTBmLTQ5OTItYTA4ZC1iODE2MjNmYjVkMzIiLCJpYXQiOjE3NjM5NjIzNzV9.x3hmtwcfi4dSSTkAzn957KxvuvN-0vqbDo3eRG5jPko`);

    // connection build
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
