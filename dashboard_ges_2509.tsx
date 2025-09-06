import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";

// ====== Primer dashboard: Sangre ======
// Índice = colesterolTotal / hdl
const bloodTestData = [
  { fecha: "2021-02-08", glucemia: 97,  trigliceridos: 292, colesterolTotal: 216, hdl: 44, ldl: 114, vldl: 58, indice: 4.91 },
  { fecha: "2022-03-28", glucemia: 109, trigliceridos: 209, colesterolTotal: 199, hdl: 43, ldl: 114, vldl: 42, indice: 4.63 },
  { fecha: "2022-07-09", glucemia: 100, trigliceridos: 189, colesterolTotal: 156, hdl: 46, ldl: 72,  vldl: 38, indice: 3.39 },
  { fecha: "2023-04-06", glucemia: 102, trigliceridos: 260, colesterolTotal: 193, hdl: 33, ldl: 114, vldl: 52, indice: 5.85 },
  { fecha: "2023-06-13", glucemia: 98,  trigliceridos: 118, colesterolTotal: 104, hdl: 37, ldl: 43,  vldl: 24, indice: 2.81 },
  { fecha: "2023-08-21", glucemia: 96,  trigliceridos: 162, colesterolTotal: 148, hdl: 41, ldl: 75,  vldl: 32, indice: 3.61 },
  { fecha: "2024-02-15", glucemia: 100, trigliceridos: 287, colesterolTotal: 169, hdl: 39, ldl: 72,  vldl: 57, indice: 4.33 },
  { fecha: "2024-09-24", glucemia: 107, trigliceridos: 143, colesterolTotal: 131, hdl: 38, ldl: 64,  vldl: 29, indice: 3.45 },
  { fecha: "2025-03-12", glucemia: 106, trigliceridos: 163, colesterolTotal: 137, hdl: 42, ldl: 63,  vldl: 33, indice: 3.20 },
  { fecha: "2025-09-03", glucemia: 103, trigliceridos: 279, colesterolTotal: 167, hdl: 46, ldl: 65, vldl: 56, indice: 3.63 }
];

function BloodTestGraphs() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Gráficas de Exámenes de Sangre</h1>

      {/* Gráfica 1: Glucemia, Triglicéridos y Colesterol Total */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">Glucemia, Triglicéridos y Colesterol Total</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bloodTestData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="glucemia" stroke="#8884d8" activeDot={{ r: 8 }} name="Glucemia (mg/dL)" />
            <Line type="monotone" dataKey="trigliceridos" stroke="#82ca9d" name="Triglicéridos (mg/dL)" />
            <Line type="monotone" dataKey="colesterolTotal" stroke="#ff7300" name="Colesterol Total (mg/dL)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 2: HDL, LDL, VLDL e Índice Colesterol Total/HDL */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">Colesterol HDL, LDL y VLDL</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bloodTestData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hdl" fill="#8884d8" name="Colesterol HDL" />
            <Bar dataKey="ldl" fill="#82ca9d" name="Colesterol LDL" />
            <Bar dataKey="vldl" fill="#ffc658" name="Colesterol VLDL" />
          </BarChart>
        </ResponsiveContainer>

        <h3 className="text-lg font-semibold text-center mt-6">Índice Colesterol Total/HDL</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={bloodTestData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="indice" stroke="#8884d8" activeDot={{ r: 8 }} name="Índice (Colesterol Total/HDL)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ====== Segundo dashboard: Perfil Bioquímico y Hepático ======
const liverProfileData = [
  { fecha: "2021-02-08", alt: 22, ast: 25, fosfatasa: 80, bilirrubinaTotal: 0.8, bilirrubinaDirecta: 0.2, proteinas: 7.1, albumina: 4.2 },
  { fecha: "2022-03-28", alt: 26, ast: 29, fosfatasa: 85, bilirrubinaTotal: 0.9, bilirrubinaDirecta: 0.3, proteinas: 7.3, albumina: 4.3 },
  { fecha: "2022-07-09", alt: 24, ast: 27, fosfatasa: 78, bilirrubinaTotal: 0.7, bilirrubinaDirecta: 0.2, proteinas: 7.0, albumina: 4.1 },
  { fecha: "2023-04-06", alt: 30, ast: 35, fosfatasa: 90, bilirrubinaTotal: 1.2, bilirrubinaDirecta: 0.4, proteinas: 6.8, albumina: 3.9 },
  { fecha: "2023-06-13", alt: 28, ast: 32, fosfatasa: 88, bilirrubinaTotal: 1.0, bilirrubinaDirecta: 0.3, proteinas: 7.0, albumina: 4.0 },
  { fecha: "2023-08-21", alt: 25, ast: 30, fosfatasa: 82, bilirrubinaTotal: 0.9, bilirrubinaDirecta: 0.3, proteinas: 7.2, albumina: 4.2 },
  { fecha: "2024-02-15", alt: 27, ast: 33, fosfatasa: 84, bilirrubinaTotal: 1.1, bilirrubinaDirecta: 0.4, proteinas: 6.9, albumina: 3.8 },
  { fecha: "2024-09-24", alt: 26, ast: 34, fosfatasa: 86, bilirrubinaTotal: 1.0, bilirrubinaDirecta: 0.3, proteinas: 7.1, albumina: 4.0 },
  { fecha: "2025-03-12", alt: 29, ast: 36, fosfatasa: 89, bilirrubinaTotal: 1.3, bilirrubinaDirecta: 0.5, proteinas: 6.7, albumina: 3.7 }
];

function LiverProfileGraphs() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Gráficas del Perfil Bioquímico y Hepático</h1>

      {/* Gráfica 1: Enzimas hepáticas */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">Enzimas Hepáticas (ALT, AST, Fosfatasa Alcalina)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liverProfileData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="alt" stroke="#ff7300" name="ALT (TGP)" />
            <Line type="monotone" dataKey="ast" stroke="#8884d8" name="AST (TGO)" />
            <Line type="monotone" dataKey="fosfatasa" stroke="#82ca9d" name="Fosfatasa Alcalina" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 2: Bilirrubina total y directa */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">Bilirrubina Total y Directa</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liverProfileData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bilirrubinaTotal" stroke="#ff7300" name="Bilirrubina Total (mg/dL)" />
            <Line type="monotone" dataKey="bilirrubinaDirecta" stroke="#8884d8" name="Bilirrubina Directa (mg/dL)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 3: Proteínas totales y albúmina */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">Proteínas Totales y Albúmina</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liverProfileData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="proteinas" stroke="#82ca9d" name="Proteínas Totales (g/dL)" />
            <Line type="monotone" dataKey="albumina" stroke="#ff7300" name="Albúmina (g/dL)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ====== Tercer dashboard: Orina ======
const urineData = [
  { fecha: "2021-02-08", densidad: 1025, pH: 5.0 },
  { fecha: "2022-03-28", densidad: 1013, pH: 6.50 },
  { fecha: "2022-07-09", densidad: 1018, pH: 5.00 },
  { fecha: "2023-04-06", densidad: 1003, pH: 6.50 },
  { fecha: "2023-08-21", densidad: 1006, pH: 6.50 },
  { fecha: "2024-02-15", densidad: 1018, pH: 5.50 },
  { fecha: "2024-09-24", densidad: 1023, pH: 6.00 },
  { fecha: "2025-03-12", densidad: 1022, pH: 5.50 },
  { fecha: "2025-09-03", densidad: 1022, pH: 5.50 }
];

const urineResumen = [
  { fecha: "2021-02-08", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Indicio", cristales: "No se Observan" },
  { fecha: "2022-03-28", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2022-07-09", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2023-04-06", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2023-08-21", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2024-02-15", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2024-09-24", leucocitos: "15", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2025-03-12", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" },
  { fecha: "2025-09-03", leucocitos: "Negativo", nitritos: "Negativo", glucosa: "Negativo", proteinas: "Negativo", cristales: "No se Observan" }
];

function UrineAnalysis() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Resultados de Exámenes de Orina</h1>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <ComposedChart data={urineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis yAxisId="left" label={{ value: "Densidad", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: "pH", angle: -90, position: "insideRight" }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="densidad" fill="#8884d8" name="Densidad" />
            <Line yAxisId="right" type="monotone" dataKey="pH" stroke="#82ca9d" name="pH" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-semibold">Resumen de Parámetros Relevantes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Fecha</th>
              <th className="border px-4 py-2 text-left">Leucocitos</th>
              <th className="border px-4 py-2 text-left">Nitritos</th>
              <th className="border px-4 py-2 text-left">Glucosa</th>
              <th className="border px-4 py-2 text-left">Proteínas</th>
              <th className="border px-4 py-2 text-left">Cristales</th>
            </tr>
          </thead>
          <tbody>
            {urineResumen.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-100">
                <td className="border px-4 py-2">{item.fecha}</td>
                <td className="border px-4 py-2">{item.leucocitos}</td>
                <td className="border px-4 py-2">{item.nitritos}</td>
                <td className="border px-4 py-2">{item.glucosa}</td>
                <td className="border px-4 py-2">{item.proteinas}</td>
                <td className="border px-4 py-2">{item.cristales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ====== Self-tests mínimos (no afectan UI) ======
(function runSelfTests() {
  try {
    // Test 1: índice ≈ colesterolTotal/hdl cuando ambos existen y hdl>0
    const tol = 0.06;
    bloodTestData.forEach(r => {
      if (typeof r.colesterolTotal === 'number' && typeof r.hdl === 'number' && r.hdl > 0 && typeof r.indice === 'number') {
        const calc = r.colesterolTotal / r.hdl;
        console.assert(Math.abs(calc - r.indice) < tol, `Indice fuera de tolerancia en ${r.fecha}: esperado≈${calc.toFixed(2)}, actual=${r.indice}`);
      }
    });
    // Test 2: claves mínimas en hepático
    const hepKeys = ['alt','ast','fosfatasa','bilirrubinaTotal','bilirrubinaDirecta','proteinas','albumina'];
    console.assert(liverProfileData.every(r => hepKeys.every(k => k in r)), 'Faltan claves en liverProfileData');
    // Test 3: orina chart numérico
    console.assert(urineData.every(r => typeof r.densidad === 'number' && typeof r.pH === 'number'), 'Orina: densidad/pH deben ser numéricos');
  } catch (e) {
    console.warn('Self-tests: advertencia', e);
  }
})();

// ====== Contenedor para previsualización en Canvas ======
export default function App() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 p-6">
      <BloodTestGraphs />
      <div className="h-px bg-gray-200" />
      <LiverProfileGraphs />
      <div className="h-px bg-gray-200" />
      <UrineAnalysis />
    </div>
  );
}

export { BloodTestGraphs, LiverProfileGraphs, UrineAnalysis };

