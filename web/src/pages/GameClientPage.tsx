import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { GameClient, SuccessResponse, Track } from "@/types.ts";

export default function GameClientPage(): React.ReactElement {
  const { gameClientId } = useParams();
  const navigate = useNavigate();
  const [gameClient, setGameClient] = useState<GameClient | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      // Fetch game client details
      fetch(`http://localhost/v1/iam/clients/${gameClientId}`)
        .then(async (res: Response) => await res.json())
        .then((json: SuccessResponse<GameClient>) => setGameClient(json.data)),

      // Fetch tracked events
      fetch(`http://localhost/v1/analytic/tracks?gameClientId=${gameClientId}`)
        .then(async (res: Response) => await res.json())
        .then((json: SuccessResponse<Track[]>) => setTracks(json.data))
    ])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    // SSE connection
    console.log('Establishing SSE connection...');
    const eventSource = new EventSource(`http://localhost/v1/analytic/tracks/stream?gameClientId=${gameClientId}`);

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      console.log('Received new track:', event.data);
      const newTrack: Track = JSON.parse(event.data);
      setTracks((prevTracks: Track[]) => [newTrack, ...prevTracks]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
    };

    // Cleanup SSE connection
    return () => {
      console.log('Closing SSE connection...');
      eventSource.close();
    };
  }, [gameClientId]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{gameClient?.gameName}</h1>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Index
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="font-medium text-gray-700">ID: {gameClient?.id}</label>
          </div>

          <div>
            <label className="font-medium text-gray-700">Namespace: {gameClient?.gameNamespace}</label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Client
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tracked Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tracks.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
                    No tracked events available
                  </td>
                </tr>
              ) : (
                tracks.map((track: Track) => (
                  <tr key={track.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{track.eventType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{JSON.stringify(track.eventData)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
