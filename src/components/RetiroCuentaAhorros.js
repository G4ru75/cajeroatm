import React, { useState } from 'react';
import { calcularBilletes, formatearMoneda, validarLimitesRetiro } from '../utils/billeteLogic';
import { useInventario } from '../context/InventarioContext';
import '../styles/Retiro.css';

const RetiroCuentaAhorros = ({ onVolver }) => {
  const { inventario, descontarBilletes, LIMITES_RETIRO } = useInventario();
  const [cuenta, setCuenta] = useState('');
  const [clave, setClave] = useState('');
  const [montoSeleccionado, setMontoSeleccionado] = useState(null);
  const [otroMonto, setOtroMonto] = useState('');
  const [resultado, setResultado] = useState(null);
  const [paso, setPaso] = useState(1); // 1: ingresar cuenta y clave, 2: seleccionar monto, 3: resultado

  const montosRapidos = [50000, 100000, 200000, 300000, 500000];

  const validarCuenta = (valor) => {
    // Solo números, máximo 11 dígitos
    return valor.replace(/\D/g, '').slice(0, 11);
  };

  const validarClave = (valor) => {
    // Solo números, máximo 4 dígitos
    return valor.replace(/\D/g, '').slice(0, 4);
  };

  const handleCuentaChange = (e) => {
    const valorValidado = validarCuenta(e.target.value);
    setCuenta(valorValidado);
  };

  const handleClaveChange = (e) => {
    const valorValidado = validarClave(e.target.value);
    setClave(valorValidado);
  };

  const handleContinuar = () => {
    if (cuenta.length === 11 && clave.length === 4) {
      setPaso(2);
    }
  };

  const handleSeleccionarMonto = (monto) => {
    setMontoSeleccionado(monto);
    setOtroMonto('');
  };

  const handleOtroMontoChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    setOtroMonto(valor);
    setMontoSeleccionado(null);
  };

  const handleRetirar = () => {
    const monto = montoSeleccionado || parseInt(otroMonto);
    
    if (!monto || monto <= 0) {
      alert('Por favor seleccione o ingrese un monto válido');
      return;
    }

    // Validar límites de retiro
    const validacionLimites = validarLimitesRetiro(monto, 'cuentaAhorros');
    
    if (!validacionLimites.valido) {
      alert(validacionLimites.mensaje);
      return;
    }

    const resultado = calcularBilletes(monto, inventario);
    
    if (resultado.exito) {
      // Descontar billetes del inventario
      descontarBilletes(resultado.distribucion, 'Cuenta de Ahorros', cuenta);

      setResultado({
        ...resultado,
        cuenta: cuenta
      });
      setPaso(3);
    } else {
      alert(resultado.mensaje);
    }
  };

  const handleNuevoRetiro = () => {
    setCuenta('');
    setClave('');
    setMontoSeleccionado(null);
    setOtroMonto('');
    setResultado(null);
    setPaso(1);
  };

  return (
    <div className="retiro-container">
      <h2>Retiro por Cuenta de Ahorros</h2>

      {paso === 1 && (
        <div className="paso">
          <div className="form-group">
            <label>Número de Cuenta (11 dígitos):</label>
            <input
              type="text"
              value={cuenta}
              onChange={handleCuentaChange}
              placeholder="12345678901"
              maxLength={11}
              className="input-field"
            />
            <small>{cuenta.length}/11 dígitos</small>
          </div>

          <div className="form-group">
            <label>Clave (4 dígitos):</label>
            <input
              type="password"
              value={clave}
              onChange={handleClaveChange}
              placeholder="****"
              maxLength={4}
              className="input-field"
            />
            <small>{clave.length}/4 dígitos</small>
          </div>

          <div className="button-group">
            <button 
              onClick={handleContinuar} 
              disabled={cuenta.length !== 11 || clave.length !== 4}
              className="btn-primary"
            >
              Continuar
            </button>
            <button onClick={onVolver} className="btn-secondary">
              Volver
            </button>
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="paso">
          <div className="info-box">
            <p><strong>Cuenta:</strong> {cuenta}</p>
            <p><strong>Clave:</strong> ****</p>
          </div>

          <div className="limites-info">
            <h4>📋 Límites de Retiro Cuenta de Ahorros:</h4>
            <p>• Mínimo: {formatearMoneda(LIMITES_RETIRO.cuentaAhorros.minimo)}</p>
            <p>• Máximo por retiro: <strong>{formatearMoneda(LIMITES_RETIRO.cuentaAhorros.maximo)}</strong></p>
          </div>

          <h3>Seleccione el monto a retirar:</h3>
          <div className="montos-rapidos">
            {montosRapidos.map(monto => (
              <button
                key={monto}
                onClick={() => handleSeleccionarMonto(monto)}
                className={montoSeleccionado === monto ? 'btn-monto selected' : 'btn-monto'}
              >
                {formatearMoneda(monto)}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Otro monto:</label>
            <input
              type="text"
              value={otroMonto}
              onChange={handleOtroMontoChange}
              placeholder="Ingrese otro monto"
              className="input-field"
            />
          </div>

          <div className="button-group">
            <button onClick={handleRetirar} className="btn-primary">
              Retirar
            </button>
            <button onClick={() => setPaso(1)} className="btn-secondary">
              Atrás
            </button>
          </div>
        </div>
      )}

      {paso === 3 && resultado && (
        <div className="paso resultado">
          <div className="success-box">
            <h3>✓ Retiro Exitoso</h3>
            <div className="info-section">
              <p><strong>Cuenta:</strong> {resultado.cuenta}</p>
              <p><strong>Monto retirado:</strong> {formatearMoneda(resultado.monto)}</p>
            </div>

            <h4>Matriz de acarreo:</h4>
            <div className="billetes-table">
              <table>
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>$10.000</th>
                    <th>$20.000</th>
                    <th>$50.000</th>
                    <th>$100.000</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.filas && resultado.filas.map((fila, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{fila[10000]}</td>
                      <td>{fila[20000]}</td>
                      <td>{fila[50000]}</td>
                      <td>{fila[100000]}</td>
                      <td>{formatearMoneda(fila.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>{resultado.distribucion[10000] || 0}</strong></td>
                    <td><strong>{resultado.distribucion[20000] || 0}</strong></td>
                    <td><strong>{resultado.distribucion[50000] || 0}</strong></td>
                    <td><strong>{resultado.distribucion[100000] || 0}</strong></td>
                    <td><strong>{formatearMoneda(resultado.monto)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleNuevoRetiro} className="btn-primary">
              Nuevo Retiro
            </button>
            <button onClick={onVolver} className="btn-secondary">
              Menú Principal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetiroCuentaAhorros;
