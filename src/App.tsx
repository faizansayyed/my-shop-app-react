import { Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/products" element={<ProductsPage />}></Route>
      </Routes>
    </AppShell>
  );
}

export default App;
