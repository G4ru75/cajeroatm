import React, { createContext, useState, useContext, useEffect } from 'react';
import { INVENTARIO_INICIAL, calcularRetirosDisponibles, LIMITES_RETIRO } from '../utils/billeteLogic';

const InventarioContext = createContext();

export const useInventario = () => {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario debe ser usado dentro de un InventarioProvider');
  }
  return context;
};

export const InventarioProvider = ({ children }) => {
  // Estado del inventario actual
  const [inventario, setInventario] = useState(() => {
    // Intentar cargar del localStorage
    const guardado = localStorage.getItem('inventarioCajero');
    return guardado ? JSON.parse(guardado) : { ...INVENTARIO_INICIAL };
  });

  // Historial de transacciones
  const [transacciones, setTransacciones] = useState(() => {
    const guardado = localStorage.getItem('transaccionesCajero');
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guardar en localStorage cuando cambie el inventario
  useEffect(() => {
    localStorage.setItem('inventarioCajero', JSON.stringify(inventario));
  }, [inventario]);

  // Guardar transacciones en localStorage
  useEffect(() => {
    localStorage.setItem('transaccionesCajero', JSON.stringify(transacciones));
  }, [transacciones]);

  // Descontar billetes del inventario
  const descontarBilletes = (distribucion, tipoRetiro, identificador) => {
    const nuevoInventario = { ...inventario };
    
    for (let [billete, cantidad] of Object.entries(distribucion)) {
      nuevoInventario[billete] -= cantidad;
    }

    setInventario(nuevoInventario);

    // Registrar transacción
    const nuevaTransaccion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      tipoRetiro,
      identificador,
      monto: Object.entries(distribucion).reduce((total, [billete, cant]) => {
        return total + (parseInt(billete) * cant);
      }, 0),
      billetes: distribucion
    };

    setTransacciones([nuevaTransaccion, ...transacciones].slice(0, 50)); // Mantener últimas 50
  };

  // Recargar inventario (para admin)
  const recargarInventario = (nuevoInventario = INVENTARIO_INICIAL) => {
    setInventario({ ...nuevoInventario });
    alert('Inventario recargado exitosamente');
  };

  // Resetear inventario a valores iniciales
  const resetearInventario = () => {
    setInventario({ ...INVENTARIO_INICIAL });
    setTransacciones([]);
    localStorage.removeItem('inventarioCajero');
    localStorage.removeItem('transaccionesCajero');
    alert('Inventario reseteado a valores iniciales');
  };

  // Calcular total de dinero disponible
  const calcularTotalDisponible = () => {
    return Object.entries(inventario).reduce((total, [billete, cantidad]) => {
      return total + (parseInt(billete) * cantidad);
    }, 0);
  };

  // Calcular retiros estimados
  const calcularRetirosEstimados = (montoPromedio = 100000) => {
    return calcularRetirosDisponibles(inventario, montoPromedio);
  };

  const value = {
    inventario,
    transacciones,
    descontarBilletes,
    recargarInventario,
    resetearInventario,
    calcularTotalDisponible,
    calcularRetirosEstimados,
    LIMITES_RETIRO
  };

  return (
    <InventarioContext.Provider value={value}>
      {children}
    </InventarioContext.Provider>
  );
};
