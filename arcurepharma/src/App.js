import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from './pages/CommingSoon';
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<ComingSoon />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;