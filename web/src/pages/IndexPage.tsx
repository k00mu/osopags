import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { GameClient, SuccessResponse } from "@/types.ts";

export default function IndexPage(): React.ReactElement {
  const [gameClients, setGameClients] = useState<GameClient[]>([]);

  useEffect(() => {
    fetch("http://localhost/v1/iam/clients")
      .then(async (res: Response) => await res.json())
      .then((json: SuccessResponse<GameClient[]>) => {
        console.log(json);
        setGameClients(json.data);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to Osopags Dashboard</h1>

      <Link
        to="/create"
        className="inline-block mb-4 text-blue-600 hover:text-blue-800"
      >
        Create Game Client
      </Link>

      <p>Click on a Game Client list below to learn more.</p>

      <div className="space-y-2">
        {gameClients.map((gameClient: GameClient) => (
          <div key={gameClient.id}>
            <Link
              to={`/${gameClient.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {gameClient.gameName}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
