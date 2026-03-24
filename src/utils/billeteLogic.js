// Lógica del acarreo de billetes
// Billetes disponibles: 100.000, 50.000, 20.000, 10.000

const BILLETES = [100000, 50000, 20000, 10000];

// Inventario inicial del cajero
export const INVENTARIO_INICIAL = {
  100000: 50,
  50000: 100,
  20000: 150,
  10000: 200
};

// Límites de retiro por transacción
export const LIMITES_RETIRO = {
  nequi: {
    maximo: 2700000,
    minimo: 10000,
    nombre: 'Nequi (Retiro por Celular)'
  },
  ahorroMano: {
    maximo: 1000000,
    minimo: 10000,
    nombre: 'Bancolombia A la Mano'
  },
  cuentaAhorros: {
    maximo: 2700000,
    minimo: 10000,
    nombre: 'Cuenta de Ahorros'
  }
};

/**
 * Valida los límites de retiro según el tipo de cuenta
 * @param {number} monto - Monto a retirar
 * @param {string} tipoRetiro - Tipo de retiro (nequi, ahorroMano, cuentaAhorros)
 * @returns {object} - Resultado de la validación
 */
export const validarLimitesRetiro = (monto, tipoRetiro) => {
  const limites = LIMITES_RETIRO[tipoRetiro];
  
  if (!limites) {
    return {
      valido: false,
      mensaje: "Tipo de retiro inválido"
    };
  }

  // Validar monto mínimo
  if (monto < limites.minimo) {
    return {
      valido: false,
      mensaje: `El monto mínimo de retiro es ${formatearMoneda(limites.minimo)}`
    };
  }

  // Validar monto máximo por transacción
  if (monto > limites.maximo) {
    return {
      valido: false,
      mensaje: `El monto máximo por retiro es ${formatearMoneda(limites.maximo)}`
    };
  }

  return {
    valido: true,
    limites
  };
};

/**
 * Implementa el algoritmo de acarreo con matriz de billetes
 * Denominaciones: 10.000, 20.000, 50.000, 100.000
 * @param {number} monto - Monto a retirar
 * @param {object} stock - Inventario actual de billetes
 * @returns {object|null} - { billetes, filas } o null si no es posible
 */
const calcularAcarreo = (monto, stock) => {
  const denoms = [...BILLETES].sort((a, b) => a - b);
  const filas = [];
  let total = 0;
  let carry = 0;
  const tempStock = { ...stock };
  let maxIter = 300;

  while (total < monto && maxIter-- > 0) {
    const fila = {};
    let tieneAlguno = false;

    for (let i = 0; i < denoms.length; i++) {
      const d = denoms[i];
      if (i < carry) {
        fila[d] = 0;
        continue;
      }
      if (total + d <= monto && (tempStock[d] || 0) > 0) {
        fila[d] = 1;
        total += d;
        tempStock[d]--;
        tieneAlguno = true;
      } else {
        fila[d] = 0;
      }
    }

    if (tieneAlguno) {
      filas.push({ ...fila, subtotal: total });
      carry++;
    } else {
      if (carry === 0) return null;
      carry = 0;
    }
  }

  if (total !== monto) return null;

  const billetes = {};
  for (const d of denoms) {
    const count = filas.reduce((acc, f) => acc + f[d], 0);
    if (count > 0) billetes[d] = count;
  }

  return { billetes, filas };
};

/**
 * Calcula la repartición de billetes usando el algoritmo de acarreo
 * @param {number} monto - Monto a retirar
 * @param {object} inventarioActual - Inventario actual de billetes
 * @returns {object} - Resultado con billetes distribuidos o error
 */
export const calcularBilletes = (monto, inventarioActual = null) => {
  // Validar que el monto sea múltiplo de 10000
  if (monto % 10000 !== 0) {
    return {
      exito: false,
      mensaje: "El monto debe ser múltiplo de $10.000. No se aceptan retiros que requieran billetes de $5.000"
    };
  }

  if (monto <= 0) {
    return {
      exito: false,
      mensaje: "El monto debe ser mayor a $0"
    };
  }

  const stock = inventarioActual ? { ...inventarioActual } : {
    10000: 9999,
    20000: 9999,
    50000: 9999,
    100000: 9999
  };

  const resultado = calcularAcarreo(monto, stock);

  if (!resultado) {
    return {
      exito: false,
      mensaje: inventarioActual
        ? "No hay suficientes billetes en el cajero para completar esta transacción. Por favor intente con un monto menor."
        : "No se puede entregar este monto con los billetes disponibles (10.000, 20.000, 50.000, 100.000)"
    };
  }

  return {
    exito: true,
    distribucion: resultado.billetes,
    filas: resultado.filas,
    monto
  };
};

/**
 * Calcula el número de retiros posibles basado en el inventario de billetes
 * @param {object} inventario - Inventario de billetes disponibles
 * @param {number} montoPromedio - Monto promedio de retiro
 * @returns {number} - Número estimado de retiros posibles
 */
export const calcularRetirosDisponibles = (inventario, montoPromedio = 100000) => {
  let totalDinero = 0;
  
  for (let [billete, cantidad] of Object.entries(inventario)) {
    totalDinero += parseInt(billete) * cantidad;
  }
  
  return Math.floor(totalDinero / montoPromedio);
};

/**
 * Predice cuántos billetes se deben tener para cumplir una meta de retiros.
 * Fórmula solicitada: (montoRetiro - 10.000) * numeroRetiros
 * @param {number} montoRetiro - Monto de cada retiro
 * @param {number} numeroRetiros - Cantidad de retiros a proyectar
 * @returns {object} - Resultado de la predicción
 */
export const predecirBilletesNecesarios = (montoRetiro, numeroRetiros) => {
  if (!Number.isFinite(montoRetiro) || montoRetiro <= 0) {
    return {
      exito: false,
      mensaje: 'El monto por retiro debe ser mayor a $0'
    };
  }

  if (montoRetiro < 10000) {
    return {
      exito: false,
      mensaje: 'El monto por retiro debe ser mínimo de $10.000'
    };
  }

  if (montoRetiro % 10000 !== 0) {
    return {
      exito: false,
      mensaje: 'El monto por retiro debe ser múltiplo de $10.000'
    };
  }

  if (!Number.isFinite(numeroRetiros) || !Number.isInteger(numeroRetiros) || numeroRetiros <= 0) {
    return {
      exito: false,
      mensaje: 'La cantidad de retiros debe ser un número entero mayor a 0'
    };
  }

  const resultadoUnitario = calcularBilletes(montoRetiro);

  if (!resultadoUnitario.exito) {
    return {
      exito: false,
      mensaje: resultadoUnitario.mensaje
    };
  }

  const denominaciones = [...BILLETES].sort((a, b) => a - b);
  const billetesPorRetiro = {};
  const billetesNecesarios = {};

  for (const denominacion of denominaciones) {
    const cantidadPorRetiro = resultadoUnitario.distribucion[denominacion] || 0;
    billetesPorRetiro[denominacion] = cantidadPorRetiro;
    billetesNecesarios[denominacion] = cantidadPorRetiro * numeroRetiros;
  }

  const montoBaseFormula = (montoRetiro - 10000) * numeroRetiros;
  const montoReservaMinima = 10000 * numeroRetiros;
  const montoTotalProyectado = montoBaseFormula + montoReservaMinima;
  const totalBilletesNecesarios = Object.values(billetesNecesarios).reduce((acc, val) => acc + val, 0);

  return {
    exito: true,
    montoRetiro,
    numeroRetiros,
    billetesPorRetiro,
    billetesNecesarios,
    totalBilletesNecesarios,
    montoBaseFormula,
    montoReservaMinima,
    montoTotalProyectado
  };
};

/**
 * Formatea un número como moneda colombiana
 * @param {number} monto 
 * @returns {string}
 */
export const formatearMoneda = (monto) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(monto);
};
