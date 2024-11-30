import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { GameClient, SuccessResponse } from "@/types.ts";

export default function GameClientPage(): React.ReactElement {
  const { gameClientId } = useParams();
  const navigate = useNavigate();
  const [gameClient, setGameClient] = useState<GameClient | null>(null);

  useEffect(() => {
    fetch(`http://localhost/v1/iam/clients/${gameClientId}`)
      .then(async (res: Response) => await res.json())
      .then((json: SuccessResponse<GameClient>) => setGameClient(json.data));
  }, []);

  const handleDelete = async () => {
    if (!globalThis.confirm("Are you sure you want to delete this game client?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost/v1/iam/clients/${gameClientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Failed to delete game client');
      }
    } catch (error) {
      console.error('Error deleting game client:', error);
      alert('Failed to delete game client');
    }
  };

  return (
    <>
      <h1>{gameClient?.gameName}</h1>
      <p>ID: {gameClient?.id}</p>
      <p>Namespace: {gameClient?.gameNamespace}</p>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Client
      </button>

      <Link to="/">Back to Index</Link>
    </>
  );
}
