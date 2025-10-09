'use strict';

(() => {
    const state = {
        husoIndividual: 18,
        husoMasivo: 18,
        coordinates: []
    };

    const elements = {
        individual: {
            zoneSelector: document.getElementById('singleZoneSelector'),
            utmE: document.getElementById('utmE'),
            utmN: document.getElementById('utmN'),
            latitud: document.getElementById('latitud'),
            longitud: document.getElementById('longitud'),
            convertButton: document.getElementById('convertButton'),
            resetButton: document.getElementById('resetButton')
        },
        masivo: {
            zoneSelector: document.getElementById('bulkZoneSelector'),
            dataInput: document.getElementById('pasteData'),
            convertButton: document.getElementById('convertAllButton'),
            copyButton: document.getElementById('copyResultsButton'),
            tableBody: document.getElementById('resultsTableBody')
        },
        messages: {
            error: document.getElementById('errorMessage'),
            success: document.getElementById('successMessage')
        }
    };

    function setActiveZone(selector, selectedZone) {
        selector.querySelectorAll('.zone-option').forEach((option) => {
            option.classList.toggle('active', Number(option.dataset.zone) === selectedZone);
        });
    }

    function showError(message) {
        elements.messages.error.textContent = message;
        elements.messages.error.style.display = 'block';
        elements.messages.success.style.display = 'none';
        window.clearTimeout(elements.messages.error._timeout);
        elements.messages.error._timeout = window.setTimeout(() => {
            elements.messages.error.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        elements.messages.success.textContent = message;
        elements.messages.success.style.display = 'block';
        elements.messages.error.style.display = 'none';
        window.clearTimeout(elements.messages.success._timeout);
        elements.messages.success._timeout = window.setTimeout(() => {
            elements.messages.success.style.display = 'none';
        }, 5000);
    }

    function hideMessages() {
        elements.messages.error.style.display = 'none';
        elements.messages.success.style.display = 'none';
    }

    function parseChileanNumber(value) {
        if (!value) return NaN;
        return parseFloat(String(value).replace(/\./g, '').replace(',', '.'));
    }

    function convertirUTMaGeo(utmE, utmN, huso) {
        const a = 6378137.0;
        const f = 1 / 298.257223563;
        const k0 = 0.9996;
        const e2 = 2 * f - f * f;
        const ep2 = e2 / (1 - e2);

        const lonOrigin = huso === 18 ? -75.0 : -69.0;
        const falseEasting = 500000.0;
        const falseNorthing = 10000000.0;

        const x = utmE - falseEasting;
        const y = utmN - falseNorthing;

        const M = y / k0;
        const mu = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * Math.pow(e2, 3)) / 256));

        const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
        const phi1rad = mu
            + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu)
            + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu)
            + (151 * Math.pow(e1, 3) / 96) * Math.sin(6 * mu);

        const C1 = ep2 * Math.pow(Math.cos(phi1rad), 2);
        const T1 = Math.pow(Math.tan(phi1rad), 2);
        const N1 = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(phi1rad), 2));
        const R1 = (a * (1 - e2)) / Math.pow(1 - e2 * Math.pow(Math.sin(phi1rad), 2), 1.5);
        const D = x / (N1 * k0);

        const lat = phi1rad - (N1 * Math.tan(phi1rad) / R1) * (
            (Math.pow(D, 2) / 2)
            - (5 + 3 * T1 + 10 * C1 - 4 * Math.pow(C1, 2) - 9 * ep2) * Math.pow(D, 4) / 24
            + (61 + 90 * T1 + 298 * C1 + 45 * Math.pow(T1, 2) - 252 * ep2 - 3 * Math.pow(C1, 2)) * Math.pow(D, 6) / 720
        );

        const lonRad = (
            D
            - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6
            + (5 - 2 * C1 + 28 * T1 - 3 * Math.pow(C1, 2) + 8 * ep2 + 24 * Math.pow(T1, 2)) * Math.pow(D, 5) / 120
        ) / Math.cos(phi1rad);

        return {
            latitud: lat * 180 / Math.PI,
            longitud: lonOrigin + lonRad * 180 / Math.PI
        };
    }

    function convertirIndividual() {
        const utmE = parseChileanNumber(elements.individual.utmE.value);
        const utmN = parseChileanNumber(elements.individual.utmN.value);

        if (Number.isNaN(utmE) || Number.isNaN(utmN)) {
            showError('Por favor ingresa valores válidos para ambas coordenadas.');
            return;
        }

        const resultado = convertirUTMaGeo(utmE, utmN, state.husoIndividual);
        elements.individual.latitud.value = resultado.latitud.toFixed(6).replace('.', ',');
        elements.individual.longitud.value = resultado.longitud.toFixed(6).replace('.', ',');
        showSuccess('Conversión individual realizada correctamente.');
    }

    function limpiarIndividual() {
        elements.individual.utmE.value = '';
        elements.individual.utmN.value = '';
        elements.individual.latitud.value = '';
        elements.individual.longitud.value = '';
        elements.individual.utmE.focus();
        hideMessages();
    }

    function convertirMasivo() {
        const data = elements.masivo.dataInput.value.trim();
        if (!data) {
            showError('Por favor pega datos de coordenadas primero.');
            return;
        }

        hideMessages();
        state.coordinates = [];
        elements.masivo.tableBody.innerHTML = '';

        const lines = data.split('\n').filter((line) => line.trim());

        for (const line of lines) {
            const parts = line.split(/[\t\s]+/).filter((part) => part.trim());

            if (parts.length !== 3) {
                showError(`Formato incorrecto en línea: ${line}. Usa formato: Punto UTM_E UTM_N`);
                elements.masivo.tableBody.innerHTML = '';
                state.coordinates = [];
                return;
            }

            const [punto, utmEStr, utmNStr] = parts;
            const utmE = parseChileanNumber(utmEStr);
            const utmN = parseChileanNumber(utmNStr);

            if (Number.isNaN(utmE) || Number.isNaN(utmN)) {
                showError(`Coordenadas inválidas en línea: ${line}`);
                elements.masivo.tableBody.innerHTML = '';
                state.coordinates = [];
                return;
            }

            const resultado = convertirUTMaGeo(utmE, utmN, state.husoMasivo);

            state.coordinates.push({
                punto,
                utmE,
                utmN,
                latitud: resultado.latitud,
                longitud: resultado.longitud
            });
        }

        const fragment = document.createDocumentFragment();
        state.coordinates.forEach((coord) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${coord.punto}</td>
                <td>${coord.latitud.toFixed(6).replace('.', ',')}</td>
                <td>${coord.longitud.toFixed(6).replace('.', ',')}</td>
                <td>${coord.utmE.toLocaleString('es-CL')}</td>
                <td>${coord.utmN.toLocaleString('es-CL')}</td>
            `;
            fragment.appendChild(row);
        });

        elements.masivo.tableBody.appendChild(fragment);
        showSuccess(`¡Conversión completada! Se procesaron ${state.coordinates.length} coordenadas.`);
    }

    function copyToClipboardFallback(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showSuccess('¡Tabla copiada al portapapeles! Ahora puedes pegarla en Excel.');
        } catch (error) {
            showError('No se pudo copiar la tabla. Intenta copiar manualmente.');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function copiarTabla() {
        if (state.coordinates.length === 0) {
            showError('No hay resultados para copiar. Realiza la conversión primero.');
            return;
        }

        let tableText = 'Punto\tLatitud\tLongitud\tUTM E\tUTM N\n';
        state.coordinates.forEach((coord) => {
            tableText += `${coord.punto}\t${coord.latitud.toFixed(6).replace('.', ',')}\t${coord.longitud.toFixed(6).replace('.', ',')}\t${coord.utmE}\t${coord.utmN}\n`;
        });

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(tableText).then(() => {
                showSuccess('¡Tabla copiada al portapapeles! Ahora puedes pegarla en Excel.');
            }).catch(() => copyToClipboardFallback(tableText));
        } else {
            copyToClipboardFallback(tableText);
        }
    }

    function attachEventListeners() {
        elements.individual.zoneSelector.addEventListener('click', (event) => {
            const button = event.target.closest('.zone-option');
            if (!button) return;
            state.husoIndividual = Number(button.dataset.zone);
            setActiveZone(elements.individual.zoneSelector, state.husoIndividual);
        });

        elements.masivo.zoneSelector.addEventListener('click', (event) => {
            const button = event.target.closest('.zone-option');
            if (!button) return;
            state.husoMasivo = Number(button.dataset.zone);
            setActiveZone(elements.masivo.zoneSelector, state.husoMasivo);
        });

        elements.individual.convertButton.addEventListener('click', convertirIndividual);
        elements.individual.resetButton.addEventListener('click', limpiarIndividual);
        elements.masivo.convertButton.addEventListener('click', convertirMasivo);
        elements.masivo.copyButton.addEventListener('click', copiarTabla);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && (event.target === elements.individual.utmE || event.target === elements.individual.utmN)) {
                convertirIndividual();
            }
        });
    }

    attachEventListeners();
})();
