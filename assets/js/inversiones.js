'use strict';

(() => {
    const tailwindConfig = {
        theme: {
            extend: {
                colors: {
                    primary: '#3454D1',
                    primaryDark: '#1F2C73',
                    primaryLight: '#5C7AEA',
                    secondary: '#9333ea',
                    accent: '#06b6d4'
                }
            }
        }
    };

    window.tailwind = window.tailwind || {};
    window.tailwind.config = tailwindConfig;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDark.matches) {
        document.documentElement.classList.add('dark');
    }

    prefersDark.addEventListener('change', (event) => {
        document.documentElement.classList.toggle('dark', event.matches);
        window.setTimeout(calculateAndRender, 100);
    });

    let growthChart = null;

    const currencyFormatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    function formatCLP(value) {
        return currencyFormatter.format(value);
    }

    function formatThousands(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function parseFormattedNumber(str) {
        return parseFloat(String(str).replace(/\./g, '')) || 0;
    }

    function calculateInvestment(initial, monthly, years, annualReturn) {
        const months = years * 12;
        const monthlyRate = annualReturn / 100 / 12;

        const points = [];

        for (let year = 0; year <= years; year += 1) {
            const elapsedMonths = year * 12;
            const initialValue = initial * Math.pow(1 + monthlyRate, elapsedMonths);

            let monthlyValue = 0;
            if (elapsedMonths > 0) {
                monthlyValue = monthlyRate === 0
                    ? monthly * elapsedMonths
                    : monthly * ((Math.pow(1 + monthlyRate, elapsedMonths) - 1) / monthlyRate);
            }

            const contributions = initial + (monthly * elapsedMonths);
            const totalValue = initialValue + monthlyValue;

            points.push({
                year,
                contributions,
                totalValue,
                gains: totalValue - contributions
            });
        }

        return points;
    }

    function updateChart(dataset) {
        const canvas = document.getElementById('growthChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labels = dataset.map((point) => `Año ${point.year}`);
        const containerWidth = canvas.parentElement?.offsetWidth || window.innerWidth;
        const approxLabelWidth = 80;
        const maxTicks = Math.max(2, Math.floor(containerWidth / approxLabelWidth));
        const tickStep = Math.max(1, Math.ceil(labels.length / maxTicks));

        if (growthChart) {
            growthChart.destroy();
        }

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? '#4b5563' : '#e5e7eb';

        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Aportes acumulados',
                        data: dataset.map((point) => point.contributions),
                        borderColor: '#5C7AEA',
                        backgroundColor: 'rgba(92, 122, 234, 0.12)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Valor total',
                        data: dataset.map((point) => point.totalValue),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        fill: '+1',
                        tension: 0.4,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            callback: (value) => formatCLP(value)
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            maxTicksLimit: maxTicks,
                            callback(value, index) {
                                if (index % tickStep === 0) {
                                    if (typeof value === 'number' && typeof this.getLabelForValue === 'function') {
                                        return this.getLabelForValue(value);
                                    }
                                    return labels[index] ?? value;
                                }
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function syncCurrencyInput(event) {
        const input = event.currentTarget;
        const numericValue = parseFormattedNumber(input.value);
        input.value = numericValue > 0 ? formatThousands(numericValue) : '';
        input.dataset.value = numericValue;
    }

    function updateCallout({ contributions, totalValue }, years, annualReturn) {
        const savings = formatCLP(contributions);
        const invested = formatCLP(totalValue);
        const gain = formatCLP(totalValue - contributions);

        document.getElementById('calloutSavings').textContent = savings;
        document.getElementById('calloutYears').textContent = years;
        document.getElementById('calloutSavingsEnd').textContent = savings;
        document.getElementById('calloutRate').textContent = `${annualReturn}%`;
        document.getElementById('calloutInvestedEnd').textContent = invested;
        document.getElementById('calloutGain').textContent = gain;
    }

    function calculateAndRender() {
        const initial = parseFloat(document.getElementById('aporteInicial').dataset.value) || 0;
        const monthly = parseFloat(document.getElementById('aporteMensual').dataset.value) || 0;
        const years = parseInt(document.getElementById('años').value, 10) || 1;
        const annualReturn = parseFloat(document.getElementById('rentabilidad').value) || 0;

        const dataPoints = calculateInvestment(initial, monthly, years, annualReturn);
        const finalPoint = dataPoints[dataPoints.length - 1];

        document.getElementById('totalAportado').textContent = formatCLP(finalPoint.contributions);
        document.getElementById('ganancias').textContent = formatCLP(finalPoint.gains);
        document.getElementById('montoFinal').textContent = formatCLP(finalPoint.totalValue);

        updateCallout(finalPoint, years, annualReturn);
        updateChart(dataPoints);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        calculateAndRender();
    }

    function initCurrencyInputs() {
        const inputs = document.querySelectorAll('.currency-input');
        inputs.forEach((input) => {
            input.addEventListener('input', syncCurrencyInput);
            input.addEventListener('blur', calculateAndRender);
            const numericValue = parseFormattedNumber(input.value);
            input.value = numericValue > 0 ? formatThousands(numericValue) : '';
            input.dataset.value = numericValue;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        initCurrencyInputs();
        calculateAndRender();

        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                calculateAndRender();
            }, 200);
        });
    });
})();
