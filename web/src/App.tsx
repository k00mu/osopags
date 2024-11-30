import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router";
import IndexPage from "./pages/IndexPage.tsx";
import GameClientPage from "./pages/GameClientPage.tsx";
import CreateGameClientPage from "./pages/CreateGameClientPage.tsx";
export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route index element={<IndexPage />} />
        <Route path=":gameClientId" element={<GameClientPage />} />
        <Route path="create" element={<CreateGameClientPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
