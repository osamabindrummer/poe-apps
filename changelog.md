# Changelog

## 2025-10-10

- **assets/css/inversiones.css**: afiné los breakpoints móviles para que `.glass-surface` ajuste su ancho y márgenes según el dispositivo; corregí la alineación de métricas destacadas en pantallas pequeñas y añadí un corte específico para 480 px.
- **assets/js/inversiones.js**: generé etiquetas dinámicas en el eje X del gráfico para limitar los ticks según el ancho disponible, oculté la leyenda redundante y reutilizo el cálculo tras un `resize` con debounce ligero.
- **compraroarrendar.html**: reubiqué el callout bajo el resumen de resultados de inversión para mantener la jerarquía visual y evitar saltos en el formulario.

## 2025-10-09

- **compraroarrendar.html**: externalicé los estilos y la lógica en `assets/css/compraroarrendar.css` y `assets/js/compraroarrendar.js`, mejorando la responsividad y organización; reorganicé el layout con contenedores reutilizables; añadí botones sin manejadores inline.
- **Ajustes posteriores en Comprar vs Arrendar**: implementé el autocompletado del pie al 20 % del valor de la propiedad y actualicé la etiqueta; añadí enlace a datos de la tasa de interés para vivienda del Banco Central; modifiqué el layout final para ocupar todo el ancho en desktop y apilar los paneles en móviles; actualicé estilos para nuevos elementos.
- **coordenadas.html**: moví estilos y scripts a `assets/css/coordenadas.css` y `assets/js/coordenadas.js`; sustituí manejadores inline por listeners en el script; reforcé el diseño con botones accesibles, mensajes de estado y tablas responsivas.
- **inversiones.html**: trasladé la configuración y lógica a `assets/js/inversiones.js`, añadí `assets/css/inversiones.css` con un tema tipo “glassmorphism”, ajusté el HTML para usar los nuevos estilos y mantener el gráfico funcional en modo claro/oscuro.
- **Actualizaciones posteriores en Inversiones**: mejoré la responsividad móvil para apilar los paneles, añadí un callout comparativo bajo el gráfico, ajusté el efecto hover de los paneles y rediseñé el botón “🚀 Calcular Inversión” con un degradado azul consistente.
