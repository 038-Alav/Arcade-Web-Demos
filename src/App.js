import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Snake from "./pages/games/Snake/Snake";

function App() {
  return (
    <BrowserRouter basename="/Arcade-Web-Demos">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Games will go here */}
        <Route path="/snake" element={<Snake />} />
        {/* <Route path="/tetris" element={<Tetris />} /> */}
        {/* <Route path="/frogger" element={<Frogger />} /> */}
        {/* <Route path="/breakout" element={<Breakout />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;