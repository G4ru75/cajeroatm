import React from 'react';
import { useInventario } from '../context/InventarioContext';
import { formatearMoneda } from '../utils/billeteLogic';
import '../styles/Inventario.css';

const InventarioStatus = ({ mostrarHistorialInicial = false, mostrarLimitesInicial = true }) => {
  const { 
    inventario, 
    calcularTotalDisponible, 
    calcularRetirosEstimados,
    resetearInventario,
    transacciones,
    LIMITES_RETIRO
  } = useInventario();

  const [mostrarHistorial, setMostrarHistorial] = React.useState(mostrarHistorialInicial);
  const [mostrarLimites, setMostrarLimites] = React.useState(mostrarLimitesInicial);

  const totalDisponible = calcularTotalDisponible();
  const retirosEstimados = calcularRetirosEstimados();

  // Verificar si el  inventario está bajo
  const inventarioBajo = Object.entries(inventario).some(([_, cantidad]) => cantidad < 10);

  return (
    <div className="inventario-status">
      <div className="status-header">
        <h3>📊 Estado del Cajero Bancolombia</h3>
        {inventarioBajo && <span className="alerta-bajo">⚠️ Inventario bajo</span>}
      </div>

      <div className="status-grid">
        <div className="status-card">
          <div className="status-label">Total Disponible</div>
          <div className="status-value">{formatearMoneda(totalDisponible)}</div>
        </div>

        <div className="status-card">
          <div className="status-label">Retiros Estimados</div>
          <div className="status-value">{retirosEstimados}</div>
          <small>(promedio $100.000)</small>
        </div>

        <div className="status-card">
          <div className="status-label">Transacciones Hoy</div>
          <div className="status-value">{transacciones.length}</div>
        </div>
      </div>

      {/* Límites por retiro */}
      {mostrarLimites && (
        <div className="limites-diarios">
          <h4>💳 Límites por Retiro Individual:</h4>
          <div className="limites-grid">
            <div className="limite-card">
              <div className="limite-titulo">📱 Nequi</div>
              <div className="limite-info">
                <p>Mínimo: {formatearMoneda(LIMITES_RETIRO.nequi.minimo)}</p>
                <p><strong>Máximo por retiro: {formatearMoneda(LIMITES_RETIRO.nequi.maximo)}</strong></p>
              </div>
            </div>

            <div className="limite-card">
              <div className="limite-titulo">💳 Ahorro a la Mano</div>
              <div className="limite-info">
                <p>Mínimo: {formatearMoneda(LIMITES_RETIRO.ahorroMano.minimo)}</p>
                <p><strong>Máximo por retiro: {formatearMoneda(LIMITES_RETIRO.ahorroMano.maximo)}</strong></p>
              </div>
            </div>

            <div className="limite-card">
              <div className="limite-titulo">🏦 Cuenta de Ahorros</div>
              <div className="limite-info">
                <p>Mínimo: {formatearMoneda(LIMITES_RETIRO.cuentaAhorros.minimo)}</p>
                <p><strong>Máximo por retiro: {formatearMoneda(LIMITES_RETIRO.cuentaAhorros.maximo)}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="inventario-detalle">
        <h4>Billetes Disponibles:</h4>
        <div className="billetes-grid">
          {Object.entries(inventario).map(([billete, cantidad]) => (
            <div 
              key={billete} 
              className={`billete-item ${cantidad < 10 ? 'bajo' : cantidad < 30 ? 'medio' : ''}`}
            >
              <div className="billete-denominacion">{formatearMoneda(parseInt(billete))}</div>
              <div className="billete-cantidad">
                {cantidad} billetes
              </div>
              <div className="billete-total">
                {formatearMoneda(parseInt(billete) * cantidad)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="inventario-acciones">
        <button 
          onClick={() => setMostrarLimites(!mostrarLimites)}
          className="btn-limites"
        >
          {mostrarLimites ? '🔒 Ocultar Límites' : '📋 Ver Límites de Retiro'}
        </button>
        <button 
          onClick={() => setMostrarHistorial(!mostrarHistorial)}
          className="btn-historial"
        >
          {mostrarHistorial ? '📊 Ocultar Historial' : '📋 Ver Historial'}
        </button>
        <button 
          onClick={resetearInventario}
          className="btn-reset"
        >
          🔄 Resetear Todo
        </button>
      </div>

      {mostrarHistorial && (
        <div className="historial-transacciones">
          <h4>Últimas Transacciones:</h4>
          {transacciones.length === 0 ? (
            <p className="sin-transacciones">No hay transacciones registradas</p>
          ) : (
            <div className="transacciones-lista">
              {transacciones.slice(0, 10).map((trans) => (
                <div key={trans.id} className="transaccion-item">
                  <div className="transaccion-header">
                    <span className="transaccion-tipo">{trans.tipoRetiro}</span>
                    <span className="transaccion-monto">{formatearMoneda(trans.monto)}</span>
                  </div>
                  <div className="transaccion-detalles">
                    <span className="transaccion-id">{trans.identificador}</span>
                    <span className="transaccion-fecha">
                      {new Date(trans.fecha).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="transaccion-billetes">
                    {Object.entries(trans.billetes).map(([billete, cant]) => (
                      <span key={billete} className="billete-usado">
                        {cant}x{formatearMoneda(parseInt(billete))}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventarioStatus;
