# 🏦 Cajero Automático ATM - Metodología del Acarreo

Sistema de cajero automático desarrollado en React que implementa la metodología del acarreo para la distribución eficiente de billetes.

## 📋 Descripción del Proyecto

Este proyecto es una actividad evaluativa (40% del primer corte) que implementa un cajero automático con tres tipos diferentes de retiros, siguiendo la metodología del acarreo explicada en clase.

## ✨ Características Principales

### 1. 📱 Retiro por Número de Celular (Estilo Nequi)
- **Número de celular**: Vector de 10 dígitos
- **Validación**: Solo acepta números, no caracteres alfabéticos ni especiales
- **Clave temporal**: 6 dígitos visible por 60 segundos
- **Renovación automática**: La clave se regenera cada 60 segundos
- **Reporte**: Muestra el número con 11 dígitos (agregando 0 al inicio)

### 2. 💳 Retiro Ahorro a la Mano
- **Cuenta**: Vector de 11 dígitos
- **Validaciones especiales**:
  - Primer dígito: Solo 0 o 1
  - Segundo dígito: Debe ser 3
  - No acepta caracteres alfabéticos ni especiales
- **Clave PIN**: 4 dígitos no visibles

### 3. 🏦 Retiro por Cuenta de Ahorros
- **Cuenta**: 11 dígitos (0-9)
- **Validación**: Solo números, sin caracteres especiales
- **Clave PIN**: 4 dígitos no visibles
- **Predicción**: Muestra cantidad estimada de retiros posibles

## 💵 Metodología del Acarreo

El sistema implementa la metodología del acarreo de billetes con las siguientes características:

- **Billetes disponibles**: $100.000, $50.000, $20.000, $10.000
- **No incluye**: Billetes de $5.000
- **Algoritmo**: Empieza con la denominación más alta y distribuye de mayor a menor
- **Validación**: Los montos deben ser múltiplos de $10.000

### Ejemplo de Acarreo

Para un retiro de **$280.000**:
- 2 billetes de $100.000 = $200.000
- 1 billete de $50.000 = $50.000
- 1 billete de $20.000 = $20.000
- 1 billete de $10.000 = $10.000
- **Total**: 5 billetes

Si se intenta retirar $145.000, el sistema muestra un mensaje de error porque no se puede entregar con los billetes disponibles (requeriría un billete de $5.000).

## 🛠️ Tecnologías Utilizadas

- **React**: Framework principal
- **JavaScript ES6+**: Lógica del negocio
- **CSS3**: Estilos y diseño responsive
- **React Hooks**: useState, useEffect para gestión de estado

## 📁 Estructura del Proyecto

```
cajeroatm/
├── src/
│   ├── components/
│   │   ├── RetiroCelular.js          # Componente retiro celular
│   │   ├── RetiroAhorroMano.js       # Componente ahorro a la mano
│   │   └── RetiroCuentaAhorros.js    # Componente cuenta de ahorros
│   ├── utils/
│   │   └── billeteLogic.js           # Lógica del acarreo
│   ├── styles/
│   │   └── Retiro.css                # Estilos de los componentes
│   ├── App.js                        # Componente principal
│   ├── App.css                       # Estilos principales
│   └── index.js                      # Punto de entrada
├── public/
├── package.json
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd cajeroatm
   ```

2. **Instalar dependencias** (si no están instaladas)
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`
   - Si no se abre, abre manualmente el navegador e ingresa la URL

## 📖 Guía de Uso

### Pantalla Principal
Al iniciar la aplicación, verás tres opciones de retiro:
1. Retiro por Celular
2. Ahorro a la Mano
3. Cuenta de Ahorros

### Flujo de Retiro

#### Opción 1: Retiro por Celular
1. Ingresar número de celular (10 dígitos)
2. Se genera automáticamente una clave de 6 dígitos
3. La clave es visible por 60 segundos y luego se renueva
4. Seleccionar monto (opciones rápidas o ingresar monto personalizado)
5. Ver resultado con distribución de billetes

#### Opción 2: Ahorro a la Mano
1. Ingresar cuenta (11 dígitos: 0/1 + 3 + 9 dígitos)
2. Ingresar clave PIN (4 dígitos, no visible)
3. Seleccionar monto
4. Ver resultado con distribución de billetes

#### Opción 3: Cuenta de Ahorros
1. Ingresar cuenta (11 dígitos)
2. Ingresar clave PIN (4 dígitos, no visible)
3. Seleccionar monto
4. Ver resultado con:
   - Distribución de billetes
   - Predicción de retiros disponibles
   - Inventario actual del cajero

### Montos Rápidos
Todos los tipos de retiro incluyen botones de monto rápido:
- $50.000
- $100.000
- $200.000
- $300.000
- $500.000
- Opción "Otro" para monto personalizado

## ⚠️ Validaciones Implementadas

### Retiro por Celular
- ✅ Exactamente 10 dígitos
- ✅ Solo números
- ✅ Clave temporal renovable

### Ahorro a la Mano
- ✅ Exactamente 11 dígitos
- ✅ Primer dígito: 0 o 1
- ✅ Segundo dígito: 3
- ✅ Solo números
- ✅ Clave de 4 dígitos oculta

### Cuenta de Ahorros
- ✅ Exactamente 11 dígitos
- ✅ Solo números (0-9)
- ✅ Clave de 4 dígitos oculta

### Validación de Montos
- ✅ Debe ser múltiplo de $10.000
- ✅ No puede requerir billetes de $5.000
- ✅ Debe ser mayor a $0
- ✅ Mensaje de error si no es posible con billetes disponibles

## 📊 Funciones del Sistema

### Cálculo de Billetes (`billeteLogic.js`)
```javascript
calcularBilletes(monto)
- Valida que el monto sea múltiplo de 10.000
- Aplica metodología del acarreo
- Retorna distribución de billetes o mensaje de error
```

### Predicción de Retiros
```javascript
calcularRetirosDisponibles(inventario, montoPromedio)
- Calcula total de dinero disponible
- Estima cantidad de retiros posibles
- Usado en cuenta de ahorros
```

### Formateo de Moneda
```javascript
formatearMoneda(monto)
- Formatea números como moneda colombiana (COP)
- Ejemplo: 100000 → $100.000
```

## 🎨 Características de Interfaz

- **Diseño Responsive**: Funciona en móviles, tablets y escritorio
- **Gradientes modernos**: Interfaz visual atractiva
- **Transiciones suaves**: Efectos hover y animaciones
- **Tablas informativas**: Visualización clara de billetes
- **Indicadores visuales**: Estados de carga, errores y éxito
- **Temporizador visual**: Cuenta regresiva de clave temporal

## 📝 Requisitos Académicos Cumplidos

✅ Metodología del acarreo implementada  
✅ Tres tipos de retiros funcionales  
✅ Validaciones específicas por tipo de retiro  
✅ Retiros fijos en pantalla + opción "otro"  
✅ No incluye billetes de $5.000  
✅ Validación de montos no entregables  
✅ Muestra cantidad de billetes por denominación  
✅ Predicción de retiros disponibles  
✅ Interfaz visual completa  
✅ Ningún carácter alfabético ni especial en campos numéricos  

## 🔧 Comandos Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test

# Eject configuración (no recomendado)
npm run eject
```

## 📚 Conocimientos Previos Aplicados

- Ingeniería de Software II
- Programación orientada a componentes
- Validación de datos
- Algoritmos de distribución (acarreo)
- Diseño de interfaces de usuario
- Gestión de estado en React

## 👨‍💻 Desarrollo

Proyecto desarrollado como actividad evaluativa para la asignatura de Ingeniería de Software.

**Peso evaluativo**: 40% del primer corte

## 📄 Licencia

Este proyecto es de uso académico.

---

**Nota**: El inventario del cajero es simulado. En un sistema real, esto estaría conectado a una base de datos con el inventario real de billetes del cajero.
