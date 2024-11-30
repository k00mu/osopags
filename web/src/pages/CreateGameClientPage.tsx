import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function CreateGameClientPage(): React.ReactElement {
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const gameNamespace = gameName.toLowerCase().replace(/ /g, "-");

      const response = await fetch("http://localhost/v1/iam/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, gameNamespace }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      // Handle successful response here
      console.log("Client created:", data);
      setGameName("");
      // redirect to the Index page
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Game Client</h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="clientName" className="block mb-2">
            Client Name:
          </label>
          <input
            type="text"
            id="clientName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Client"}
        </button>
          </form>
      <Link to="/">Back to Index</Link>
    </div>
  );
}
