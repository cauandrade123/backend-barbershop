import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { RotaProtegida, RotaAdmin } from "./components/ProtectedRoute.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Cadastro } from "./pages/Cadastro.jsx";
import { Agendar } from "./pages/Agendar.jsx";
import { PagamentoConfirmado } from "./pages/PagamentoConfirmado.jsx";
import { MeusAgendamentos } from "./pages/MeusAgendamentos.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="pagina">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route
              path="/agendar"
              element={
                <RotaProtegida>
                  <Agendar />
                </RotaProtegida>
              }
            />
            <Route
              path="/pagamento-confirmado"
              element={
                <RotaProtegida>
                  <PagamentoConfirmado />
                </RotaProtegida>
              }
            />
            <Route
              path="/meus-agendamentos"
              element={
                <RotaProtegida>
                  <MeusAgendamentos />
                </RotaProtegida>
              }
            />
            <Route
              path="/admin"
              element={
                <RotaAdmin>
                  <AdminDashboard />
                </RotaAdmin>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
