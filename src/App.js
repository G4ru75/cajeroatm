import React, { useState } from 'react';
import './App.css';
import { InventarioProvider } from './context/InventarioContext';
import RetiroCelular from './components/RetiroCelular';
import RetiroAhorroMano from './components/RetiroAhorroMano';
import RetiroCuentaAhorros from './components/RetiroCuentaAhorros';
import InventarioStatus from './components/InventarioStatus';
import PrediccionRetiros from './components/PrediccionRetiros';

function App() {
  const [vistaActual, setVistaActual] = useState('menu');
  const panelOperativoActivo = vistaActual === 'panel-operativo';

  const volverAlMenu = () => {
    setVistaActual('menu');
  };

  const abrirPanelOperativo = () => {
    setVistaActual('panel-operativo');
  };

  return (
    <InventarioProvider>
      <div className="App">
        <div className="app-container">
          <header className="app-header">
            <div className="header-inner">
              <div className="header-logo">
                <div className="header-logo-icon">🏦</div>
                <div className="header-logo-text">
                  <h1>BancoATM</h1>
                  <span>Sistema de Retiros</span>
                </div>
              </div>

              <div className="header-actions">
                <div className="header-info">
                  <span className="header-dot"></span>
                  <span>Cajero en línea &nbsp;|&nbsp; {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>

                <button
                  className="header-action-btn"
                  onClick={panelOperativoActivo ? volverAlMenu : abrirPanelOperativo}
                >
                  {panelOperativoActivo ? 'Volver al Cajero' : 'Panel Operativo'}
                </button>
              </div>
            </div>
          </header>

          {!panelOperativoActivo && vistaActual === 'menu' && (
            <div className="atm-shell">
              <div className="atm-top-label">ATM 24 HORAS</div>

              <div className="menu-principal atm-screen">
                <h2>Seleccione el tipo de retiro</h2>
                <p className="menu-subtitle">Use los botones para continuar</p>
                <div className="menu-divider"></div>

                <div className="menu-opciones">
                  <button
                    className="opcion-card"
                    onClick={() => setVistaActual('celular')}
                  >
                    <div className="opcion-icon">📱</div>
                    <h3>Retiro por Celular</h3>
                    <p>Retiro estilo Nequi con número de celular y clave temporal de 6 dígitos</p>
                    <span className="opcion-arrow">›</span>
                  </button>

                  <button
                    className="opcion-card"
                    onClick={() => setVistaActual('ahorro-mano')}
                  >
                    <div className="opcion-icon">💳</div>
                    <h3>Ahorro a la Mano</h3>
                    <p>Cuenta de 11 dígitos con validación de formato y autorización PIN</p>
                    <span className="opcion-arrow">›</span>
                  </button>

                  <button
                    className="opcion-card"
                    onClick={() => setVistaActual('cuenta-ahorros')}
                  >
                    <div className="opcion-icon">🏦</div>
                    <h3>Cuenta de Ahorros</h3>
                    <p>Retiro tradicional por cuenta de ahorros con control de límites y billetes</p>
                    <span className="opcion-arrow">›</span>
                  </button>
                </div>

                <div className="info-metodologia">
                  <h3>Información del Cajero</h3>
                  <p>Denominaciones disponibles: $100.000, $50.000, $20.000 y $10.000.</p>
                  <p>Los montos deben ser múltiplos de $10.000.</p>
                </div>
              </div>
            </div>
          )}

        {!panelOperativoActivo && vistaActual === 'celular' && (
          <div className="content-area">
            <RetiroCelular onVolver={volverAlMenu} />
          </div>
        )}

        {!panelOperativoActivo && vistaActual === 'ahorro-mano' && (
          <div className="content-area">
            <RetiroAhorroMano onVolver={volverAlMenu} />
          </div>
        )}

        {!panelOperativoActivo && vistaActual === 'cuenta-ahorros' && (
          <div className="content-area">
            <RetiroCuentaAhorros onVolver={volverAlMenu} />
          </div>
        )}

        {panelOperativoActivo && (
          <div className="panel-operativo-layout">
            <section className="panel-operativo-section">
              <div className="panel-operativo-title">
                <h2>Panel Operativo</h2>
                <p>Aquí se centraliza el historial, el inventario y la analítica del cajero.</p>
              </div>

              <InventarioStatus
                mostrarHistorialInicial={true}
                mostrarLimitesInicial={true}
              />
            </section>

            <section className="panel-operativo-section">
              <PrediccionRetiros
                embebido={true}
                mostrarBotonVolver={false}
                titulo="Predicción de Dinero"
              />
            </section>
          </div>
        )}
      </div>
    </div>
    </InventarioProvider>
  );
}

export default App;
