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

    return (<>
      <h1>Welcome to Osopags Dashboard</h1>
      <Link to="/create">Create Game Client</Link>
      <p>Click on a Game Client list below to learn more.</p>
      <div>
        {gameClients.map((gameClient: GameClient) => (
          <div key={gameClient.id}>
            <Link to={`/${gameClient.id}`}>{gameClient.gameName}</Link>
          </div>
        ))}
      </div>
    </>
  );
}
