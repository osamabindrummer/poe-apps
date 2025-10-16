'use strict';

(function () {
    const inputs = {
        homePrice: document.getElementById('homePrice'),
        downPayment: document.getElementById('downPayment'),
        interestRate: document.getElementById('interestRate'),
        loanTerm: document.getElementById('loanTerm'),
        monthlyRent: document.getElementById('monthlyRent'),
        initialInvestment: document.getElementById('initialInvestment'),
        monthlyInvestment: document.getElementById('monthlyInvestment'),
        annualReturn: document.getElementById('annualReturn'),
        ufValue: document.getElementById('ufValue')
    };

    const outputs = {
        monthlyPayment: document.getElementById('monthlyPayment'),
        downPaymentResult: document.getElementById('downPaymentResult'),
        totalCostBuy: document.getElementById('totalCostBuy'),
        totalRent: document.getElementById('totalRent'),
        totalInvested: document.getElementById('totalInvested'),
        finalInvestmentValue: document.getElementById('finalInvestmentValue'),
        buyPatrimony: document.getElementById('buyPatrimony'),
        rentPatrimony: document.getElementById('rentPatrimony'),
        difference: document.getElementById('difference')
    };

    const comparisonItems = {
        buy: document.getElementById('buyComparison'),
        rent: document.getElementById('rentComparison'),
        difference: document.getElementById('differenceComparison')
    };

    const scenarioDescriptions = {
        buy: document.getElementById('buyScenario'),
        rent: document.getElementById('rentScenario')
    };

    const recommendation = document.getElementById('recommendation');

    const controls = {
        dividendCurrencyToggle: document.getElementById('dividendCurrencyToggle'),
        ufInputGroup: document.querySelector('[data-uf-input-group]'),
        monthlyPaymentPrefix: document.getElementById('monthlyPaymentPrefix'),
        monthlyPaymentExplanation: document.getElementById('monthlyPaymentExplanation'),
        monthlyPaymentRentHint: document.getElementById('monthlyPaymentRentHint'),
        totalCostLabel: document.getElementById('totalCostLabel'),
        totalCostHelper: document.getElementById('totalCostHelper'),
        homePriceLabel: document.querySelector('[data-home-price-label]')
    };

    const currencyFormatter = new Intl.NumberFormat('es-CL');
    const ufFormatter = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const UF_ANNUAL_GROWTH_RATE = 0.035;
    const HOME_PRICE_PLACEHOLDERS = {
        clp: 'Ej: 100.000.000',
        uf: 'Ej: 3.500'
    };
    let lastMonthlyPaymentReferenceClp = 0;

    function isUfSelected() {
        return Boolean(controls.dividendCurrencyToggle && controls.dividendCurrencyToggle.checked);
    }

    function formatCurrencyInput(input) {
        const raw = input.value.replace(/\D/g, '');
        input.value = raw ? currencyFormatter.format(parseInt(raw, 10)) : '';
    }

    function unformatNumber(value) {
        if (!value) return 0;
        return parseInt(String(value).replace(/\D/g, ''), 10) || 0;
    }

    function parseUfInput(value) {
        if (!value) return 0;
        const normalized = String(value)
            .replace(/\./g, '')
            .replace(/,/g, '.')
            .replace(/[^0-9.]/g, '');
        return parseFloat(normalized) || 0;
    }

    function formatHomePriceInput() {
        if (isUfSelected()) {
            inputs.homePrice.value = inputs.homePrice.value.replace(/[^0-9.,]/g, '');
        } else {
            formatCurrencyInput(inputs.homePrice);
        }
    }

    function getHomePriceClp() {
        if (!inputs.homePrice) {
            return 0;
        }

        if (!isUfSelected()) {
            return unformatNumber(inputs.homePrice.value);
        }

        const ufValue = parseFloat(inputs.ufValue && inputs.ufValue.value);
        if (!ufValue || Number.isNaN(ufValue) || ufValue <= 0) {
            return 0;
        }

        const homePriceUf = parseUfInput(inputs.homePrice.value);
        if (!homePriceUf) {
            return 0;
        }

        return Math.round(homePriceUf * ufValue);
    }

    function updateHomePriceLabel(usingUf) {
        if (!controls.homePriceLabel || !inputs.homePrice) {
            return;
        }

        controls.homePriceLabel.textContent = usingUf
            ? 'Valor de la Propiedad (UF)'
            : 'Valor de la Propiedad (CLP)';
        inputs.homePrice.placeholder = usingUf
            ? HOME_PRICE_PLACEHOLDERS.uf
            : HOME_PRICE_PLACEHOLDERS.clp;
    }

    function updateMonthlyInvestment(monthlyPaymentClp) {
        const monthlyRentValue = unformatNumber(inputs.monthlyRent.value);

        if (monthlyPaymentClp && monthlyRentValue && monthlyPaymentClp > monthlyRentValue) {
            const difference = Math.round(monthlyPaymentClp - monthlyRentValue);
            inputs.monthlyInvestment.value = currencyFormatter.format(difference);
        } else {
            inputs.monthlyInvestment.value = '';
        }
    }

    function updateInitialInvestment() {
        inputs.initialInvestment.value = inputs.downPayment.value;
    }

    function updateDownPaymentFromHomePrice() {
        const homePriceValue = getHomePriceClp();

        if (!homePriceValue) {
            inputs.downPayment.value = '';
            inputs.initialInvestment.value = '';
            return;
        }

        const downPaymentValue = Math.round(homePriceValue * 0.2);
        inputs.downPayment.value = currencyFormatter.format(downPaymentValue);
        updateInitialInvestment();
    }

    function calculateMortgage() {
        const homePriceValue = getHomePriceClp();
        const downPaymentValue = unformatNumber(inputs.downPayment.value);
        const interestRateValue = parseFloat(inputs.interestRate.value);
        const loanTermYears = parseInt(inputs.loanTerm.value, 10);

        lastMonthlyPaymentReferenceClp = 0;

        if (!homePriceValue || !downPaymentValue || !loanTermYears || Number.isNaN(interestRateValue)) {
            return null;
        }

        const loanAmount = homePriceValue - downPaymentValue;
        if (loanAmount <= 0) {
            return null;
        }

        const monthlyRate = interestRateValue / 100 / 12;
        const numberOfPayments = loanTermYears * 12;

        const usingUf = isUfSelected();
        outputs.downPaymentResult.textContent = currencyFormatter.format(downPaymentValue);

        if (!usingUf) {
            let monthlyPayment;
            if (monthlyRate === 0) {
                monthlyPayment = Math.round(loanAmount / numberOfPayments);
            } else {
                const factor = Math.pow(1 + monthlyRate, numberOfPayments);
                monthlyPayment = Math.round(loanAmount * (monthlyRate * factor) / (factor - 1));
            }

            const totalPayments = monthlyPayment * numberOfPayments;
            const totalCost = totalPayments + downPaymentValue;

            outputs.monthlyPayment.textContent = currencyFormatter.format(monthlyPayment);
            outputs.totalCostBuy.textContent = currencyFormatter.format(totalCost);
            controls.monthlyPaymentPrefix.textContent = '$';
            controls.monthlyPaymentExplanation.textContent = '';
            controls.monthlyPaymentRentHint.textContent = '';
            controls.totalCostLabel.textContent = 'Costo Total';
            controls.totalCostHelper.textContent = '';

            updateMonthlyInvestment(monthlyPayment);
            lastMonthlyPaymentReferenceClp = monthlyPayment;

            return {
                currency: 'CLP',
                monthlyPayment,
                totalCost,
                downPayment: downPaymentValue,
                loanTerm: loanTermYears,
                homePrice: homePriceValue,
                numberOfPayments,
                totalDividendsClp: totalPayments,
                referenceMonthlyPaymentClp: monthlyPayment
            };
        }

        const ufValue = parseFloat(inputs.ufValue && inputs.ufValue.value);
        if (!ufValue || Number.isNaN(ufValue) || ufValue <= 0) {
            return null;
        }

        const homePriceUf = homePriceValue / ufValue;
        const downPaymentUf = downPaymentValue / ufValue;
        const loanAmountUf = homePriceUf - downPaymentUf;

        if (loanAmountUf <= 0) {
            return null;
        }

        let monthlyPaymentUf;
        if (monthlyRate === 0) {
            monthlyPaymentUf = loanAmountUf / numberOfPayments;
        } else {
            const factorUf = Math.pow(1 + monthlyRate, numberOfPayments);
            monthlyPaymentUf = loanAmountUf * (monthlyRate * factorUf) / (factorUf - 1);
        }

        const monthlyUfGrowthFactor = Math.pow(1 + UF_ANNUAL_GROWTH_RATE, 1 / 12);
        let totalDividendsClp = 0;
        let currentUfValue = ufValue;
        let lastMonthPaymentClp = 0;

        for (let month = 0; month < numberOfPayments; month += 1) {
            const paymentClp = monthlyPaymentUf * currentUfValue;
            totalDividendsClp += paymentClp;
            lastMonthPaymentClp = paymentClp;
            currentUfValue *= monthlyUfGrowthFactor;
        }

        const totalCost = Math.round(totalDividendsClp + downPaymentValue);
        const firstMonthPaymentClp = monthlyPaymentUf * ufValue;
        const lastMonthPaymentClpRounded = Math.round(lastMonthPaymentClp);

        outputs.monthlyPayment.textContent = ufFormatter.format(monthlyPaymentUf);
        outputs.totalCostBuy.textContent = currencyFormatter.format(totalCost);
        controls.monthlyPaymentPrefix.textContent = 'UF';
        controls.monthlyPaymentExplanation.textContent = `≈ $${currencyFormatter.format(Math.round(firstMonthPaymentClp))} en la cuota 1 y ≈ $${currencyFormatter.format(lastMonthPaymentClpRounded)} en la cuota ${numberOfPayments}.`;

        const monthlyRentValue = unformatNumber(inputs.monthlyRent.value);
        if (monthlyRentValue) {
            controls.monthlyPaymentRentHint.textContent = `Arriendo promedio ingresado: $${currencyFormatter.format(monthlyRentValue)}.`;
        } else {
            controls.monthlyPaymentRentHint.textContent = '';
        }

        controls.totalCostLabel.textContent = `Costo Total (pie + ${numberOfPayments} cuotas)`;
        controls.totalCostHelper.textContent = 'Incluye reajuste UF proyectado al 3,5% anual.';

        updateMonthlyInvestment(firstMonthPaymentClp);
        lastMonthlyPaymentReferenceClp = firstMonthPaymentClp;

        return {
            currency: 'UF',
            monthlyPayment: monthlyPaymentUf,
            totalCost,
            downPayment: downPaymentValue,
            loanTerm: loanTermYears,
            homePrice: homePriceValue,
            numberOfPayments,
            ufValue,
            totalDividendsClp: Math.round(totalDividendsClp),
            referenceMonthlyPaymentClp: firstMonthPaymentClp
        };
    }

    function calculateInvestment() {
        const monthlyRentValue = unformatNumber(inputs.monthlyRent.value);
        const initialInvestmentValue = unformatNumber(inputs.initialInvestment.value);
        const monthlyInvestmentValue = unformatNumber(inputs.monthlyInvestment.value);
        const annualReturnValue = parseFloat(inputs.annualReturn.value);
        const loanTermYears = parseInt(inputs.loanTerm.value, 10) || 25;

        if (!monthlyRentValue || !initialInvestmentValue || Number.isNaN(annualReturnValue)) {
            return null;
        }

        const monthlyReturn = annualReturnValue / 12 / 100;
        const months = loanTermYears * 12;

        const totalInvested = initialInvestmentValue + (monthlyInvestmentValue * months);
        const futureValueInitial = initialInvestmentValue * Math.pow(1 + monthlyReturn, months);
        const futureValueAnnuity = monthlyReturn === 0
            ? monthlyInvestmentValue * months
            : monthlyInvestmentValue * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        const finalInvestmentValue = Math.round(futureValueInitial + futureValueAnnuity);
        const totalRent = monthlyRentValue * months;
        const netGain = finalInvestmentValue - totalInvested;

        outputs.totalRent.textContent = currencyFormatter.format(totalRent);
        outputs.totalInvested.textContent = currencyFormatter.format(totalInvested);
        outputs.finalInvestmentValue.textContent = currencyFormatter.format(finalInvestmentValue);

        return {
            totalRent,
            totalInvested,
            finalInvestmentValue,
            netGain
        };
    }

    function resetComparisonState() {
        Object.values(comparisonItems).forEach((item) => {
            item.classList.remove('winner', 'loser');
        });
    }

    function calculateAll(event) {
        if (event) {
            event.preventDefault();
        }

        const buyResults = calculateMortgage();
        const rentResults = calculateInvestment();

        if (!buyResults || !rentResults) {
            resetComparisonState();
            recommendation.textContent = 'Completa todos los datos para comparar.';
            return;
        }

        const propertyGrowthRate = 0.04;
        const finalPropertyValue = Math.round(
            buyResults.homePrice * Math.pow(1 + propertyGrowthRate, buyResults.loanTerm)
        );

        const buyPatrimony = finalPropertyValue;
        const rentPatrimony = rentResults.finalInvestmentValue;
        const differenceValue = rentPatrimony - buyPatrimony;

        outputs.buyPatrimony.textContent = `$${currencyFormatter.format(buyPatrimony)}`;
        outputs.rentPatrimony.textContent = `$${currencyFormatter.format(rentPatrimony)}`;
        outputs.difference.textContent = `$${currencyFormatter.format(Math.abs(differenceValue))}`;

        const downPaymentValue = buyResults.downPayment;
        const monthlyPaymentClpEquivalent = Math.round(buyResults.referenceMonthlyPaymentClp || 0);
        const totalDividendPayments = Math.max(0, Math.round(buyResults.totalCost - buyResults.downPayment));
        const dividendDescription = buyResults.currency === 'UF'
            ? `UF ${ufFormatter.format(buyResults.monthlyPayment)} (≈ $${currencyFormatter.format(monthlyPaymentClpEquivalent)} en la cuota 1)`
            : `$${currencyFormatter.format(Math.round(buyResults.monthlyPayment))}`;
        const homePriceDescription = currencyFormatter.format(buyResults.homePrice);
        const downPaymentDescription = currencyFormatter.format(downPaymentValue);
        const totalDividendsDescription = currencyFormatter.format(totalDividendPayments);
        const totalCostDescription = currencyFormatter.format(buyResults.totalCost);
        const finalPropertyValueDescription = currencyFormatter.format(finalPropertyValue);

        if (buyResults.currency === 'UF') {
            scenarioDescriptions.buy.textContent = `Al comprar una vivienda por $${homePriceDescription}, aportando con un pie de $${downPaymentDescription} y pagando un dividendo mensual de ${dividendDescription}, terminarías desembolsando aproximadamente $${totalDividendsDescription} en dividendos (considerando un reajuste UF de 3,5% anual). Sumado al pie, el costo total proyectado sería de $${totalCostDescription}. Al término de ${buyResults.loanTerm} años, con una apreciación de 4% anual, esa propiedad podría valer alrededor de $${finalPropertyValueDescription}.`;
        } else {
            scenarioDescriptions.buy.textContent = `Al comprar una vivienda por $${homePriceDescription}, aportando con un pie de $${downPaymentDescription} y pagando un dividendo mensual de ${dividendDescription}, habrás pagado al final $${totalCostDescription} (pie + dividendos). Al término de ${buyResults.loanTerm} años, con una apreciación de 4% anual, esa propiedad podría ser vendida por al menos $${finalPropertyValueDescription}.`;
        }

        const initialInvestmentAmount = unformatNumber(inputs.initialInvestment.value);
        scenarioDescriptions.rent.textContent = `Al arrendar una vivienda e invertir la diferencia, con un monto inicial de $${currencyFormatter.format(initialInvestmentAmount)} (igual al pie de la casa), luego de ${buyResults.loanTerm} años con una rentabilidad de ${inputs.annualReturn.value}% anual, podrías acumular $${currencyFormatter.format(rentResults.finalInvestmentValue)}.`;

        resetComparisonState();

        if (differenceValue > 0) {
            comparisonItems.rent.classList.add('winner');
            comparisonItems.buy.classList.add('loser');
            recommendation.textContent = '🏆 Mejor arrendar e invertir';
        } else if (differenceValue < 0) {
            comparisonItems.buy.classList.add('winner');
            comparisonItems.rent.classList.add('loser');
            recommendation.textContent = '🏆 Mejor comprar';
        } else {
            recommendation.textContent = '🤝 Ambos escenarios son equivalentes';
        }
    }

    function handleMonthlyRentInput() {
        formatCurrencyInput(inputs.monthlyRent);

        if (isUfSelected()) {
            const monthlyRentValue = unformatNumber(inputs.monthlyRent.value);
            controls.monthlyPaymentRentHint.textContent = monthlyRentValue
                ? `Arriendo promedio ingresado: $${currencyFormatter.format(monthlyRentValue)}.`
                : '';
        } else {
            controls.monthlyPaymentRentHint.textContent = '';
        }

        if (lastMonthlyPaymentReferenceClp) {
            updateMonthlyInvestment(lastMonthlyPaymentReferenceClp);
        }
    }

    function attachEventListeners() {
        inputs.homePrice.addEventListener('input', () => {
            formatHomePriceInput();
            updateDownPaymentFromHomePrice();
        });
        inputs.downPayment.addEventListener('input', () => {
            formatCurrencyInput(inputs.downPayment);
            updateInitialInvestment();
        });
        inputs.monthlyRent.addEventListener('input', handleMonthlyRentInput);

        if (controls.dividendCurrencyToggle) {
            controls.dividendCurrencyToggle.addEventListener('change', () => {
                const usingUf = isUfSelected();
                const ufValueNumber = parseFloat(inputs.ufValue && inputs.ufValue.value);
                if (usingUf) {
                    const clpValue = unformatNumber(inputs.homePrice.value);
                    if (clpValue && ufValueNumber && !Number.isNaN(ufValueNumber) && ufValueNumber > 0) {
                        inputs.homePrice.value = ufFormatter.format(clpValue / ufValueNumber);
                    } else {
                        inputs.homePrice.value = '';
                    }
                } else {
                    const homePriceUf = parseUfInput(inputs.homePrice.value);
                    if (homePriceUf && ufValueNumber && !Number.isNaN(ufValueNumber) && ufValueNumber > 0) {
                        inputs.homePrice.value = currencyFormatter.format(Math.round(homePriceUf * ufValueNumber));
                    } else {
                        inputs.homePrice.value = '';
                    }
                }

                updateHomePriceLabel(usingUf);
                formatHomePriceInput();
                updateDownPaymentFromHomePrice();
                if (controls.ufInputGroup) {
                    controls.ufInputGroup.classList.toggle('hidden', !usingUf);
                }
                controls.monthlyPaymentPrefix.textContent = usingUf ? 'UF' : '$';
                if (!usingUf) {
                    controls.monthlyPaymentExplanation.textContent = '';
                    controls.monthlyPaymentRentHint.textContent = '';
                    controls.totalCostLabel.textContent = 'Costo Total';
                    controls.totalCostHelper.textContent = '';
                } else {
                    handleMonthlyRentInput();
                }
                calculateAll();
            });
        }

        if (inputs.ufValue) {
            inputs.ufValue.addEventListener('input', () => {
                if (isUfSelected()) {
                    updateDownPaymentFromHomePrice();
                }
                calculateAll();
            });
        }

        document.querySelectorAll('.calculate-btn').forEach((button) => {
            button.addEventListener('click', calculateAll);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        attachEventListeners();
        updateDownPaymentFromHomePrice();
        updateInitialInvestment();
        if (controls.ufInputGroup) {
            controls.ufInputGroup.classList.toggle('hidden', !isUfSelected());
        }
        controls.monthlyPaymentPrefix.textContent = isUfSelected() ? 'UF' : '$';
        updateHomePriceLabel(isUfSelected());
        formatHomePriceInput();
    });
})();
