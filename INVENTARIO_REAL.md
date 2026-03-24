# 🔄 Sistema de Inventario Real - Cajero ATM

## Cambios Implementados

El cajero ahora funciona como un cajero real con un inventario limitado de billetes que se descuenta con cada transacción.

## ✨ Nuevas Características

### 1. **Inventario Limitado**
El cajero ahora tiene cantidades específicas de cada denominación:
- **$100.000**: 50 billetes (Total: $5.000.000)
- **$50.000**: 100 billetes (Total: $5.000.000)
- **$20.000**: 150 billetes (Total: $3.000.000)
- **$10.000**: 200 billetes (Total: $2.000.000)

**Total inicial**: $15.000.000 en inventario

### 2. **Descuento Automático**
- Cada vez que se realiza un retiro exitoso, los billetes se descuentan automáticamente del inventario
- El sistema verifica que haya suficientes billetes antes de aprobar una transacción
- Si no hay suficientes billetes, muestra un error y sugiere intentar con un monto menor

### 3. **Panel de Estado del Cajero** (siempre visible)
Muestra en tiempo real:
- **Total Disponible**: Cantidad total de dinero en el cajero
- **Retiros Estimados**: Número aproximado de retiros posibles (basado en promedio de $100.000)
- **Transacciones Hoy**: Contador de transacciones realizadas
- **Billetes Disponibles**: Detalle de cada denominación con:
  - Cantidad de billetes
  - Total por denominación
  - Alertas cuando el inventario está bajo

### 4. **Sistema de Alertas**
- **Alerta amarilla** (⚠️): Cuando una denominación tiene menos de 30 billetes
- **Alerta roja** (⚠️): Cuando una denominación tiene menos de 10 billetes
- **Banner de advertencia**: Aparece arriba cuando alguna denominación está en estado crítico

### 5. **Historial de Transacciones**
Un registro completo de todas las transacciones que incluye:
- Tipo de retiro (Celular, Ahorro a la Mano, Cuenta de Ahorros)
- Identificador (número de cuenta/celular)
- Monto retirado
- Fecha y hora exacta
- Distribución de billetes utilizada

### 6. **Persistencia de Datos**
- El inventario se guarda en `localStorage` del navegador
- Las transacciones se mantienen entre sesiones
- El sistema recuerda el estado incluso si se cierra y vuelve a abrir el navegador

### 7. **Funciones de Administración**

#### Ver Historial
- Muestra las últimas 50 transacciones
- Información detallada de cada retiro
- Formato legible con fecha/hora en español

#### Resetear Inventario
- Restaura el inventario a los valores iniciales
- Borra todas las transacciones
- Útil para comenzar una nueva simulación

## 🎯 Flujo de Funcionamiento

### Antes de un Retiro:
1. El sistema verifica el monto solicitado
2. Calcula la distribución de billetes usando metodología del acarreo
3. **NUEVO**: Verifica que hay suficientes billetes en inventario
4. Si no hay suficientes, rechaza la operación

### Durante un Retiro Exitoso:
1. Se muestran los billetes a entregar
2. Se descuentan automáticamente del inventario
3. Se registra la transacción en el historial
4. Se actualiza el localStorage

### Después del Retiro:
1. El panel de estado se actualiza en tiempo real
2. Se recalculan los retiros estimados
3. Se muestran alertas si alguna denominación está baja

## 💡 Ejemplo de Uso Real

### Escenario 1: Retiro Normal
```
Usuario retira: $280.000
Inventario tiene:
- $100.000: 50 → suficiente (necesita 2)
- $50.000: 100 → suficiente (necesita 1)
- $20.000: 150 → suficiente (necesita 1)
- $10.000: 200 → suficiente (necesita 1)

✅ Transacción aprobada
Inventario después:
- $100.000: 48 (se usaron 2)
- $50.000: 99 (se usó 1)
- $20.000: 149 (se usó 1) 
- $10.000: 199 (se usó 1)
```

### Escenario 2: Inventario Insuficiente
```
Usuario retira: $500.000
Inventario tiene:
- $100.000: 3 (necesita 5)
- $50.000: 2 
- $20.000: 5
- $10.000: 10

❌ Transacción rechazada
Mensaje: "No hay suficientes billetes en el cajero para completar 
esta transacción. Por favor intente con un monto menor."
```

### Escenario 3: Optimización del Acarreo
```
Usuario retira: $300.000
Inventario tiene:
- $100.000: 0 (agotados)
- $50.000: 50
- $20.000: 100
- $10.000: 200

El sistema automáticamente ajusta:
✅ 6 billetes de $50.000 = $300.000

Inventario después:
- $50.000: 44 (se usaron 6)
```

## 🔧 Archivos Modificados/Creados

### Nuevos Archivos:
1. **`src/context/InventarioContext.js`**
   - Context API de React para estado global del inventario
   - Funciones de gestión de inventario
   - Persistencia en localStorage

2. **`src/components/InventarioStatus.js`**
   - Componente visual del panel de estado
   - Muestra inventario en tiempo real
   - Gestión de historial

3. **`src/styles/Inventario.css`**
   - Estilos del panel de estado
   - Animaciones y alertas
   - Diseño responsive

### Archivos Modificados:
1. **`src/utils/billeteLogic.js`**
   - Función `calcularBilletes()` ahora acepta inventario como parámetro
   - Verifica disponibilidad antes de calcular
   - Mensajes de error mejorados

2. **`src/components/RetiroCelular.js`**
   - Usa `useInventario()` hook
   - Descuenta billetes automáticamente
   - Registra transacciones

3. **`src/components/RetiroAhorroMano.js`**
   - Integración con inventario real
   - Validación de disponibilidad

4. **`src/components/RetiroCuentaAhorros.js`**
   - Muestra inventario actual
   - Predicción de retiros en tiempo real

5. **`src/App.js`**
   - Envuelto con `InventarioProvider`
   - Muestra `InventarioStatus` siempre visible

## 📊 Ventajas del Sistema

### Para el Usuario:
- Experiencia más realista
- Feedback inmediato sobre disponibilidad
- Transparencia del inventario

### Para la Evaluación:
- Demuestra gestión de estado avanzada
- Implementa Context API de React
- Persistencia de datos
- Lógica de negocio compleja

### Para el Aprendizaje:
- Simula un cajero real
- Enseña limitaciones de recursos
- Muestra optimización de inventario

## 🚀 Cómo Probar

1. **Realizar múltiples retiros**
   - Observa cómo disminuye el inventario
   - Verifica el historial de transacciones

2. **Agotar un tipo de billete**
   - Realiza múltiples retiros de $100.000
   - Observa cómo el sistema se adapta

3. **Verificar persistencia**
   - Realiza algunos retiros
   - Cierra el navegador
   - Vuelve a abrir → El inventario se mantiene

4. **Resetear inventario**
   - Click en "Resetear Inventario"
   - Todo vuelve a valores iniciales

## 🎓 Conceptos Aplicados

- **React Context API**: Estado global sin prop drilling
- **localStorage**: Persistencia de datos del navegador
- **Custom Hooks**: `useInventario()` para lógica reutilizable
- **Optimistic Updates**: UI responde inmediatamente
- **Error Handling**: Validación robusta de inventario
- **Real-time Updates**: Estado sincronizado en todos los componentes

## 📝 Notas Técnicas

- El inventario se guarda en `localStorage` con la key `'inventarioCajero'`
- Las transacciones se limitan a las últimas 50 para no consumir mucha memoria
- El sistema soporta navegadores modernos con soporte de localStorage
- En caso de error en localStorage, usa valores por defecto en memoria

---

**Desarrollo completado** ✅ 
Sistema completamente funcional con inventario real limitado y gestión de transacciones.
