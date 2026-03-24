import React, { useState, useEffect } from 'react';
import { calcularBilletes, formatearMoneda, validarLimitesRetiro } from '../utils/billeteLogic';
import { useInventario } from '../context/InventarioContext';
import '../styles/Retiro.css';

const RetiroCelular = ({ onVolver }) => {
  const { inventario, descontarBilletes, LIMITES_RETIRO } = useInventario();
  const [celular, setCelular] = useState('');
  const [clave, setClave] = useState('');
  const [claveGenerada, setClaveGenerada] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(60);
  const [montoSeleccionado, setMontoSeleccionado] = useState(null);
  const [otroMonto, setOtroMonto] = useState('');
  const [claveIngresada, setClaveIngresada] = useState('');
  const [resultado, setResultado] = useState(null);
  const [paso, setPaso] = useState(1); // 1: celular, 2: clave generada, 3: monto, 4: validar clave, 5: resultado

  const montosRapidos = [50000, 100000, 200000, 300000, 500000];

  // Generar clave automáticamente
  const generarClave = () => {
    const nuevaClave = Math.floor(100000 + Math.random() * 900000).toString();
    setClave(nuevaClave);
    setClaveGenerada(true);
    setTiempoRestante(60);
  };

  // Temporizador para la clave
  useEffect(() => {
    if (claveGenerada && tiempoRestante > 0) {
      const timer = setTimeout(() => {
        setTiempoRestante(tiempoRestante - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (tiempoRestante === 0) {
      generarClave(); // Generar nueva clave
    }
  }, [claveGenerada, tiempoRestante]);

  const validarCelular = (valor) => {
    // Solo números, máximo 10 dígitos
    const numeros = valor.replace(/\D/g, '');
    const celularLimpio = numeros.slice(0, 10);

    // Nequi: el número debe iniciar con 3
    if (celularLimpio.length > 0 && celularLimpio[0] !== '3') {
      return '';
    }

    return celularLimpio;
  };

  const handleCelularChange = (e) => {
    const valorValidado = validarCelular(e.target.value);
    setCelular(valorValidado);
  };

  const handleContinuar = () => {
    if (celular.length !== 10) {
      alert('El número de celular debe tener exactamente 10 dígitos');
      return;
    }

    if (celular[0] !== '3') {
      alert('El número de celular debe iniciar con 3');
      return;
    }

    generarClave();
    setPaso(2);
  };

  const handleContinuarAClave = () => {
    setPaso(3);
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

  const handleContinuarAValidacion = () => {
    const monto = montoSeleccionado || parseInt(otroMonto);
    
    if (!monto || monto <= 0) {
      alert('Por favor seleccione o ingrese un monto válido');
      return;
    }

    // Validar límites de retiro
    const validacionLimites = validarLimitesRetiro(monto, 'nequi');
    
    if (!validacionLimites.valido) {
      alert(validacionLimites.mensaje);
      return;
    }

    setPaso(4); // Ir al paso de validación de clave
  };

  const handleRetirar = () => {
    // Validar que la clave ingresada sea correcta
    if (claveIngresada !== clave) {
      alert('❌ Clave incorrecta. Por favor verifique e intente nuevamente.');
      setClaveIngresada('');
      return;
    }

    const monto = montoSeleccionado || parseInt(otroMonto);

    // Calcular billetes considerando inventario
    const resultado = calcularBilletes(monto, inventario);
    
    if (resultado.exito) {
      // Descontar billetes del inventario
      descontarBilletes(resultado.distribucion, 'Celular (Nequi)', '0' + celular);
      
      setResultado({
        ...resultado,
        celular: '0' + celular, // Agregar 0 al inicio
        clave: clave
      });
      setPaso(5);
    } else {
      alert(resultado.mensaje);
    }
  };

  const handleNuevoRetiro = () => {
    setCelular('');
    setClave('');
    setClaveGenerada(false);
    setMontoSeleccionado(null);
    setOtroMonto('');
    setClaveIngresada('');
    setResultado(null);
    setPaso(1);
  };

  return (
    <div className="retiro-container">
      <h2>Retiro por Celular (Estilo Nequi)</h2>

      {paso === 1 && (
        <div className="paso">
          <div className="form-group">
            <label>Número de Celular (10 dígitos):</label>
            <input
              type="text"
              value={celular}
              onChange={handleCelularChange}
              placeholder="3001234567"
              maxLength={10}
              className="input-field"
            />
            <small>{celular.length}/10 dígitos - Debe iniciar con 3</small>
          </div>
          <div className="button-group">
            <button 
              onClick={handleContinuar} 
              disabled={celular.length !== 10 || celular[0] !== '3'}
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
            <p><strong>Número:</strong> 0{celular}</p>
            <p><strong>Clave temporal generada:</strong> <span className="clave-visible">{clave}</span></p>
            <p className="timer">Tiempo restante: {tiempoRestante}s</p>
            <small>⚠️ Guarde esta clave, la necesitará para confirmar el retiro</small>
          </div>

          <div className="button-group">
            <button onClick={handleContinuarAClave} className="btn-primary">
              Continuar
            </button>
            <button onClick={() => setPaso(1)} className="btn-secondary">
              Atrás
            </button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="paso">
          <div className="limites-info">
            <h4>📋 Límites de Retiro Nequi:</h4>
            <p>• Mínimo: {formatearMoneda(LIMITES_RETIRO.nequi.minimo)}</p>
            <p>• Máximo por retiro: <strong>{formatearMoneda(LIMITES_RETIRO.nequi.maximo)}</strong></p>
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
            <button onClick={handleContinuarAValidacion} className="btn-primary">
              Continuar
            </button>
            <button onClick={() => setPaso(2)} className="btn-secondary">
              Atrás
            </button>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="paso">
          <div className="info-box">
            <p><strong>Número:</strong> 0{celular}</p>
            <p><strong>Monto a retirar:</strong> {formatearMoneda(montoSeleccionado || parseInt(otroMonto))}</p>
          </div>

          <div className="form-group">
            <label>Ingrese la clave de 6 dígitos:</label>
            <input
              type="text"
              value={claveIngresada}
              onChange={(e) => setClaveIngresada(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="input-field"
              style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
            />
            <small>{claveIngresada.length}/6 dígitos</small>
          </div>

          <div className="button-group">
            <button 
              onClick={handleRetirar} 
              disabled={claveIngresada.length !== 6}
              className="btn-primary"
            >
              Confirmar Retiro
            </button>
            <button onClick={() => setPaso(3)} className="btn-secondary">
              Atrás
            </button>
          </div>
        </div>
      )}

      {paso === 5 && resultado && (
        <div className="paso resultado">
          <div className="success-box">
            <h3>✓ Retiro Exitoso</h3>
            <div className="info-section">
              <p><strong>Número:</strong> {resultado.celular}</p>
              <p><strong>Clave utilizada:</strong> {resultado.clave}</p>
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

export default RetiroCelular;
