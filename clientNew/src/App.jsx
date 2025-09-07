import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout and Landing Page Components
import Layout from "./components/layout/Layout";
import Hero from "./components/landing/Hero";
import About from "./components/landing/About";
import Services from "./components/landing/Services";
import Clients from "./components/landing/Clients";
import Contact from "./components/landing/Contact";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Main Landing Page Component
const LandingPage = () => (
  <Layout>
    <Hero />
    <About />
    <Services />
    <Clients />
    <Contact />
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Fallback to Landing Page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
