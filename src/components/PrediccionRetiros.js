import React, { useState } from 'react';
import { formatearMoneda, predecirBilletesNecesarios } from '../utils/billeteLogic';
import { useInventario } from '../context/InventarioContext';
import '../styles/Retiro.css';

const DENOMINACIONES = [10000, 20000, 50000, 100000];

const PrediccionRetiros = ({
  onVolver,
  mostrarBotonVolver = true,
  embebido = false,
  titulo = 'Predicción de Retiros'
}) => {
  const { inventario, calcularTotalDisponible } = useInventario();
  const [cantidadRetiros, setCantidadRetiros] = useState('1');
  const [montoRetiro, setMontoRetiro] = useState('100000');
  const [prediccion, setPrediccion] = useState(null);
  const claseContenedor = embebido ? 'prediccion-embebida' : 'retiro-container';

  const handleCantidadRetirosChange = (e) => {
    setCantidadRetiros(e.target.value.replace(/\D/g, ''));
  };

  const handleMontoRetiroChange = (e) => {
    setMontoRetiro(e.target.value.replace(/\D/g, ''));
  };

  const handleCalcularPrediccion = () => {
    const numeroRetiros = parseInt(cantidadRetiros, 10);
    const monto = parseInt(montoRetiro, 10);

    const resultadoPrediccion = predecirBilletesNecesarios(monto, numeroRetiros);

    if (!resultadoPrediccion.exito) {
      alert(resultadoPrediccion.mensaje);
      return;
    }

    setPrediccion(resultadoPrediccion);
  };

  const totalBilletesDisponibles = Object.values(inventario).reduce((acumulado, cantidad) => {
    return acumulado + cantidad;
  }, 0);

  return (
    <div className={claseContenedor}>
      <h2>{titulo}</h2>

      <div className="paso">
        <p className="prediccion-text">
          Esta opción está separada de los retiros por cuenta y sirve para planear cuántos billetes
          necesitas para cumplir una meta de retiros.
        </p>

        <div className="form-group">
          <label>Cantidad de retiros deseados:</label>
          <input
            type="text"
            value={cantidadRetiros}
            onChange={handleCantidadRetirosChange}
            placeholder="Ej: 25"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Monto por retiro:</label>
          <input
            type="text"
            value={montoRetiro}
            onChange={handleMontoRetiroChange}
            placeholder="Ej: 100000"
            className="input-field"
          />
          <small>Debe ser múltiplo de $10.000</small>
        </div>

        <div className="button-group">
          <button onClick={handleCalcularPrediccion} className="btn-primary">
            Calcular Predicción
          </button>
          {mostrarBotonVolver && onVolver && (
            <button onClick={onVolver} className="btn-secondary">
              Menú Principal
            </button>
          )}
        </div>

        {prediccion && prediccion.exito && (
          <div className="prediccion-box">
            <h4>📊 Resultado de la predicción:</h4>
            <p className="prediccion-text">
              Fórmula aplicada: ({formatearMoneda(prediccion.montoRetiro)} - {formatearMoneda(10000)}) * {prediccion.numeroRetiros} ={' '}
              <strong>{formatearMoneda(prediccion.montoBaseFormula)}</strong>
            </p>
            <p className="prediccion-text">
              Total proyectado para cumplir la meta: <strong>{formatearMoneda(prediccion.montoTotalProyectado)}</strong>
            </p>

            <div className="billetes-table">
              <table>
                <thead>
                  <tr>
                    <th>Denominación</th>
                    <th>Billetes por retiro</th>
                    <th>Billetes requeridos</th>
                    <th>Billetes disponibles</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {DENOMINACIONES.map((denominacion) => {
                    const requeridos = prediccion.billetesNecesarios[denominacion] || 0;
                    const disponibles = inventario[denominacion] || 0;
                    const diferencia = disponibles - requeridos;

                    return (
                      <tr key={denominacion}>
                        <td>{formatearMoneda(denominacion)}</td>
                        <td>{prediccion.billetesPorRetiro[denominacion] || 0}</td>
                        <td>{requeridos}</td>
                        <td>{disponibles}</td>
                        <td>{diferencia >= 0 ? `Sobran ${diferencia}` : `Faltan ${Math.abs(diferencia)}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>-</strong></td>
                    <td><strong>{prediccion.totalBilletesNecesarios}</strong></td>
                    <td><strong>{totalBilletesDisponibles}</strong></td>
                    <td><strong>Meta de {prediccion.numeroRetiros} retiros</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="inventario-info">
              <h5>Inventario actual del cajero:</h5>
              <ul>
                {Object.entries(inventario).map(([billete, cantidad]) => (
                  <li key={billete}>
                    {formatearMoneda(parseInt(billete, 10))}: {cantidad} billetes = {formatearMoneda(parseInt(billete, 10) * cantidad)}
                  </li>
                ))}
              </ul>
              <p className="total-disponible">
                <strong>Total disponible: {formatearMoneda(calcularTotalDisponible())}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrediccionRetiros;
