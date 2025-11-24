import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3N2Q5ZDc0Mi1lNTBmLTQ5OTItYTA4ZC1iODE2MjNmYjVkMzIiLCJpYXQiOjE3NjM5Njc0NDJ9.UbP7PSDng8w6v9fsVzEXP9YmLlWsh8QRte5fNkNpp58`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}