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
        annualReturn: document.getElementById('annualReturn')
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

    const currencyFormatter = new Intl.NumberFormat('es-CL');

    function formatCurrencyInput(input) {
        const raw = input.value.replace(/\D/g, '');
        input.value = raw ? currencyFormatter.format(parseInt(raw, 10)) : '';
    }

    function unformatNumber(value) {
        if (!value) return 0;
        return parseInt(String(value).replace(/\D/g, ''), 10) || 0;
    }

    function updateMonthlyInvestment(monthlyPayment) {
        const monthlyRentValue = unformatNumber(inputs.monthlyRent.value);

        if (monthlyPayment && monthlyRentValue && monthlyPayment > monthlyRentValue) {
            const difference = monthlyPayment - monthlyRentValue;
            inputs.monthlyInvestment.value = currencyFormatter.format(difference);
        } else {
            inputs.monthlyInvestment.value = '';
        }
    }

    function updateInitialInvestment() {
        inputs.initialInvestment.value = inputs.downPayment.value;
    }

    function updateDownPaymentFromHomePrice() {
        const homePriceValue = unformatNumber(inputs.homePrice.value);

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
        const homePriceValue = unformatNumber(inputs.homePrice.value);
        const downPaymentValue = unformatNumber(inputs.downPayment.value);
        const interestRateValue = parseFloat(inputs.interestRate.value);
        const loanTermYears = parseInt(inputs.loanTerm.value, 10);

        if (!homePriceValue || !downPaymentValue || !loanTermYears || Number.isNaN(interestRateValue)) {
            return null;
        }

        const loanAmount = homePriceValue - downPaymentValue;
        if (loanAmount <= 0) {
            return null;
        }

        const monthlyRate = interestRateValue / 100 / 12;
        const numberOfPayments = loanTermYears * 12;

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
        outputs.downPaymentResult.textContent = currencyFormatter.format(downPaymentValue);
        outputs.totalCostBuy.textContent = currencyFormatter.format(totalCost);

        updateMonthlyInvestment(monthlyPayment);

        return {
            monthlyPayment,
            totalCost,
            downPayment: downPaymentValue,
            loanTerm: loanTermYears,
            homePrice: homePriceValue
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

        const downPaymentValue = unformatNumber(inputs.downPayment.value);
        scenarioDescriptions.buy.textContent = `Al comprar una vivienda por $${currencyFormatter.format(buyResults.homePrice)}, aportando con un pie de $${currencyFormatter.format(downPaymentValue)} y pagando un dividendo mensual de $${currencyFormatter.format(buyResults.monthlyPayment)}, habrás pagado al final $${currencyFormatter.format(buyResults.totalCost)} (costo total). Al término de ${buyResults.loanTerm} años, con una apreciación de 4% anual, esa propiedad podría ser vendida por al menos $${currencyFormatter.format(finalPropertyValue)}.`;

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

        const currentMonthlyPayment = unformatNumber(outputs.monthlyPayment.textContent);
        if (currentMonthlyPayment) {
            updateMonthlyInvestment(currentMonthlyPayment);
        }
    }

    function attachEventListeners() {
        inputs.homePrice.addEventListener('input', () => {
            formatCurrencyInput(inputs.homePrice);
            updateDownPaymentFromHomePrice();
        });
        inputs.downPayment.addEventListener('input', () => {
            formatCurrencyInput(inputs.downPayment);
            updateInitialInvestment();
        });
        inputs.monthlyRent.addEventListener('input', handleMonthlyRentInput);

        document.querySelectorAll('.calculate-btn').forEach((button) => {
            button.addEventListener('click', calculateAll);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        attachEventListeners();
        updateDownPaymentFromHomePrice();
        updateInitialInvestment();
    });
})();
