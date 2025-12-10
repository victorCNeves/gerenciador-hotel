import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Container from 'react-bootstrap/Container';
import Menu from "./layout/Menu";
import Rodape from "./layout/Rodape";
import Home from "./pages/Home";
import Login from "./pages/Login";

import ListClientes from "./pages/clientes/List";
import FormCliente from "./pages/clientes/Formulario";
import ViewCliente from "./pages/clientes/View";

import ListQuartos from "./pages/quartos/List";
import FormQuarto from "./pages/quartos/Formulario";
import ViewQuarto from "./pages/quartos/View";

import ListReservas from "./pages/reservas/List";
import FormReserva from "./pages/reservas/Formulario";
import ViewReserva from "./pages/reservas/View";

import ListUsuarios from "./pages/usuarios/List";
import FormUsuario from "./pages/usuarios/Formulario";
import ViewUsuario from "./pages/usuarios/View";

function App() {
  return (
    <>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <ToastContainer autoClose={3000} />
          <Menu />
  
          <Container className="flex-grow-1 mt-4 mb-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
  
              <Route element={<PrivateRoute nivel={2} />}>
                <Route path="/clientes" element={<ListClientes />} />
                <Route path="/clientes/novo" element={<FormCliente />} />
              </Route>
              <Route element={<PrivateRoute nivel={1} />}>
                <Route path="/clientes/editar/:id" element={<FormCliente />} />
                <Route path="/clientes/:id" element={<ViewCliente />} />
              </Route>
  
              <Route element={<PrivateRoute nivel={3} />}>
                <Route path="/usuarios" element={<ListUsuarios />} />
                <Route path="/usuarios/novo" element={<FormUsuario />} />
              </Route>
              <Route element={<PrivateRoute nivel={1} />}>
                <Route path="/usuarios/editar/:id" element={<FormUsuario />} />
                <Route path="/usuarios/:id" element={<ViewUsuario />} />
              </Route>
  
              <Route path="/quartos" element={<ListQuartos />} />
              <Route element={<PrivateRoute nivel={2} />}>
                <Route path="/quartos/novo" element={<FormQuarto />} />
                <Route path="/quartos/editar/:id" element={<FormQuarto />} />
              </Route>
              <Route path="/quartos/:id" element={<ViewQuarto />} />
  
              <Route element={<PrivateRoute nivel={1} />}>
                <Route path="/reservas" element={<ListReservas />} />
                <Route path="/reservas/novo" element={<FormReserva />} />
                <Route path="/reservas/editar/:id" element={<FormReserva />} />
                <Route path="/reservas/:id" element={<ViewReserva />} />
              </Route>
  
            </Routes>
          </Container>
          <Rodape />
        </div>
      </Router>
    </>
  );
}

export default App;
