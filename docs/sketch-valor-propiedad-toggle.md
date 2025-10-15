# Sketch: Toggle CLP/UF junto al campo "Valor de la Propiedad"

## Objetivos clave
- Ubicar el selector de moneda como una mini columna adosada al campo de precio para mantener la altura de los paneles.
- Permitir que la persona ingrese el valor de la propiedad en CLP o UF y convertir internamente a CLP para todos los cálculos y resultados.
- Mantener el resto de los campos (pie, arriendo, totales) formateados en pesos chilenos y clarificar la sumatoria de cuotas cuando se proyecta en UF.

## Vista previa en texto
```
┌─────────────────────────────┐  ┌────────────┐
│ Valor de la Propiedad (CLP) │  │  CLP  ○ UF │
│ [ 100.000.000            ]  │  └────────────┘
└─────────────────────────────┘
│ Pie inicial 20% (CLP)       │
│ [ 20.000.000              ] │
└─────────────────────────────┘
```
- En modo **CLP**, el campo conserva el formateo de miles y el cálculo del pie automático en pesos.
- Al cambiar a **UF**, el campo muestra el valor en UF (permite decimales), el pie se recalcula en CLP usando el valor UF ingresado y se despliega el panel para capturar dicho valor.
- Los botones de "Calcular" de ambos paneles mantienen su alineación porque el nuevo selector ocupa el mismo alto que el input en desktop y se apila debajo en mobile.

## Detalles de interacción
1. Cambiar de CLP a UF convierte el número actual utilizando el valor UF disponible (cuando existe) y actualiza la etiqueta del campo.
2. El valor del pie y las inversiones sincronizadas se recalculan automáticamente con el equivalente en CLP.
3. El "Dividendo mensual" muestra UF con una referencia en CLP para la primera cuota, mientras que el "Costo Total" aclara la sumatoria de cuotas en CLP, manteniendo consistencia de moneda en los resultados.
