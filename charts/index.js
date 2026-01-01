import { chartInstances, setChartInstance, CONFIG } from '../config/constants.js';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/index.js';

// ========== CHART RENDERING ==========

/**
 * Destroy existing chart if it exists
 */
export function destroyChart(chartKey) {
    if (chartInstances[chartKey]) {
        chartInstances[chartKey].destroy();
        chartInstances[chartKey] = null;
    }
}

/**
 * Render charts for the selected model
 */
export function renderCharts(modelKey, data) {
    // Destroy existing charts
    destroyChart('primary');
    destroyChart('secondary1');
    destroyChart('secondary2');

    // Model-specific chart rendering
    if (modelKey === 'one-time') {
        renderOneTimePurchaseCharts(data);
    } else if (modelKey === 'subscription') {
        renderSubscriptionCharts(data);
    } else if (modelKey === 'freemium') {
        renderFreemiumCharts(data);
    } else if (modelKey === 'usage-based') {
        renderUsageBasedCharts(data);
    } else if (modelKey === 'tiered') {
        renderTieredCharts(data);
    } else if (modelKey === 'per-seat') {
        renderPerSeatCharts(data);
    }
}

export function renderOneTimePurchaseCharts(data) {
    // Primary Chart: Revenue over time (stacked area)
    const primaryOptions = {
        series: [
            {
                name: 'License Revenue',
                data: data.map(d => d.licenseRevenue.toFixed(2))
            },
            {
                name: 'Maintenance Revenue',
                data: data.map(d => d.maintenanceRevenue.toFixed(2))
            }
        ],
        chart: {
            type: 'area',
            height: 400,
            stacked: true,
            toolbar: { show: true },
            background: 'transparent'
        },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: {
                rotate: -45,
                rotateAlways: false,
                style: { colors: '#9CA3AF' }
            }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: {
                formatter: val => formatCurrency(val),
                style: { colors: '#9CA3AF' }
            }
        },
        grid: {
            borderColor: '#374151'
        },
        tooltip: {
            theme: 'dark',
            y: { formatter: val => formatCurrency(val) }
        },
        legend: {
            position: 'top',
            labels: { colors: '#9CA3AF' }
        },
        title: {
            text: 'Revenue Breakdown: License vs Maintenance',
            align: 'center',
            style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
        },
        subtitle: {
            text: 'License revenue declines while maintenance provides recurring stability',
            align: 'center',
            style: { fontSize: '12px', color: '#9CA3AF' }
        }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Total Revenue Line
    const secondary1Options = {
        series: [{
            name: 'Total Revenue',
            data: data.map(d => d.totalRevenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Total Monthly Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'Combined license and maintenance revenue over time', align: 'center', style: { fontSize: '11px', color: '#9CA3AF' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Customer Growth
    const secondary2Options = {
        series: [{
            name: 'Total Customers',
            data: data.map(d => d.totalCustomers)
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        plotOptions: {
            bar: { borderRadius: 4, dataLabels: { position: 'top' } }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        title: { text: 'Customer Base Growth', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

export function renderSubscriptionCharts(data) {
    // Primary Chart: MRR Growth
    const primaryOptions = {
        series: [
            {
                name: 'MRR',
                data: data.map(d => d.mrr.toFixed(2))
            },
            {
                name: 'ARR',
                data: data.map(d => d.arr.toFixed(2))
            }
        ],
        chart: { type: 'line', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'MRR and ARR Growth', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'Monthly and annual recurring revenue trends', align: 'center', style: { fontSize: '12px', color: '#9CA3AF' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Customer Count
    const secondary1Options = {
        series: [{
            name: 'Customers',
            data: data.map(d => d.customers)
        }],
        chart: { type: 'area', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.2 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        title: { text: 'Customer Count', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: MRR Components
    const secondary2Options = {
        series: [
            {
                name: 'New MRR',
                data: data.map(d => d.newMRR.toFixed(2))
            },
            {
                name: 'Expansion MRR',
                data: data.map(d => d.expansionMRR.toFixed(2))
            },
            {
                name: 'Churned MRR',
                data: data.map(d => -d.churnedMRR.toFixed(2))
            }
        ],
        chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.positive, CONFIG.chartColors.moderate, CONFIG.chartColors.negative],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'MRR Change (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(Math.abs(val)) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'MRR Components', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

export function renderFreemiumCharts(data) {
    // Primary Chart: Free vs Paid Users
    const primaryOptions = {
        series: [
            {
                name: 'Free Users',
                data: data.map(d => d.freeUsers)
            },
            {
                name: 'Paid Users',
                data: data.map(d => d.paidUsers)
            }
        ],
        chart: { type: 'area', height: 400, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.positive],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Users', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Free vs Paid Users', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'User base growth and conversion funnel visualization', align: 'center', style: { fontSize: '12px', color: '#9CA3AF' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Revenue from Paid Users
    const secondary1Options = {
        series: [{
            name: 'Revenue',
            data: data.map(d => d.revenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Revenue from Paid Users', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Conversion Rate
    const secondary2Options = {
        series: [{
            name: 'Conversion Rate',
            data: data.map(d => d.conversionRate.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Conversion Rate (%)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => val.toFixed(1) + '%', style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => val.toFixed(1) + '%' } },
        title: { text: 'Free-to-Paid Conversion Rate', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

export function renderUsageBasedCharts(data) {
    // Primary Chart: Revenue with variance band
    const primaryOptions = {
        series: [
            {
                name: 'Revenue',
                data: data.map(d => d.revenue.toFixed(2))
            },
            {
                name: 'High Range',
                data: data.map(d => d.revenueHigh.toFixed(2))
            },
            {
                name: 'Low Range',
                data: data.map(d => d.revenueLow.toFixed(2))
            }
        ],
        chart: { type: 'line', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive, CONFIG.chartColors.negative],
        stroke: { curve: 'smooth', width: [3, 1, 1], dashArray: [0, 5, 5] },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Revenue with Usage Variance', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'Revenue fluctuations based on customer usage patterns', align: 'center', style: { fontSize: '12px', color: '#9CA3AF' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Average Usage per Customer
    const secondary1Options = {
        series: [{
            name: 'Avg Usage',
            data: data.map(d => d.avgUsage.toFixed(2))
        }],
        chart: { type: 'area', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.2 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Units', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) + ' units' } },
        title: { text: 'Avg Usage per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Revenue per Customer
    const secondary2Options = {
        series: [{
            name: 'Revenue per Customer',
            data: data.map(d => d.revenuePerCustomer.toFixed(2))
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Revenue per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

export function renderTieredCharts(data) {
    // Primary Chart: Revenue by Tier
    const primaryOptions = {
        series: [
            {
                name: 'Starter Revenue',
                data: data.map(d => d.starterRevenue.toFixed(2))
            },
            {
                name: 'Professional Revenue',
                data: data.map(d => d.proRevenue.toFixed(2))
            },
            {
                name: 'Enterprise Revenue',
                data: data.map(d => d.enterpriseRevenue.toFixed(2))
            }
        ],
        chart: { type: 'area', height: 400, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Revenue by Tier', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'Revenue contribution from each pricing tier', align: 'center', style: { fontSize: '12px', color: '#9CA3AF' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Customer Distribution by Tier
    const secondary1Options = {
        series: [
            {
                name: 'Starter',
                data: data.map(d => d.starterCustomers)
            },
            {
                name: 'Professional',
                data: data.map(d => d.proCustomers)
            },
            {
                name: 'Enterprise',
                data: data.map(d => d.enterpriseCustomers)
            }
        ],
        chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Customer Distribution by Tier', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Total Revenue
    const secondary2Options = {
        series: [{
            name: 'Total Revenue',
            data: data.map(d => d.totalRevenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Total Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

export function renderPerSeatCharts(data) {
    // Primary Chart: Total Seats
    const primaryOptions = {
        series: [{
            name: 'Total Seats',
            data: data.map(d => d.totalSeats)
        }],
        chart: { type: 'area', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Seats', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) + ' seats' } },
        title: { text: 'Total Seats Over Time', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } },
        subtitle: { text: 'Growth in total seats across all customers', align: 'center', style: { fontSize: '12px', color: '#9CA3AF' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Average Seats per Customer
    const secondary1Options = {
        series: [{
            name: 'Avg Seats',
            data: data.map(d => d.avgSeatsPerCustomer.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Seats', style: { color: '#9CA3AF' } },
            labels: { formatter: val => val.toFixed(1), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => val.toFixed(1) + ' seats' } },
        title: { text: 'Avg Seats per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChartsGrid').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Revenue
    const secondary2Options = {
        series: [{
            name: 'Revenue',
            data: data.map(d => d.revenue.toFixed(2))
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.positive],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue (R)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Monthly Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

/**
 * Update metrics panel with calculated values
 */
export function updateMetrics(modelKey, data) {
    const metricsPanel = document.getElementById('metricsPanel');
    const metricsContent = document.getElementById('metricsContent');

    const lastMonth = data[data.length - 1];
    const firstMonth = data[0];

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, d) => {
        if (modelKey === 'one-time') return sum + d.totalRevenue;
        if (modelKey === 'subscription') return sum + d.mrr;
        if (modelKey === 'freemium') return sum + d.revenue;
        if (modelKey === 'usage-based') return sum + d.revenue;
        if (modelKey === 'tiered') return sum + d.totalRevenue;
        if (modelKey === 'per-seat') return sum + d.revenue;
        return sum;
    }, 0);

    // Calculate average growth rate
    const revenueValues = data.map(d => {
        if (modelKey === 'one-time') return d.totalRevenue;
        if (modelKey === 'subscription') return d.mrr;
        if (modelKey === 'freemium') return d.revenue;
        if (modelKey === 'usage-based') return d.revenue;
        if (modelKey === 'tiered') return d.totalRevenue;
        if (modelKey === 'per-seat') return d.revenue;
        return 0;
    });

    let totalGrowth = 0;
    let growthCount = 0;
    for (let i = 1; i < revenueValues.length; i++) {
        if (revenueValues[i-1] > 0) {
            const growth = ((revenueValues[i] - revenueValues[i-1]) / revenueValues[i-1]) * 100;
            totalGrowth += growth;
            growthCount++;
        }
    }
    const avgGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;

    // Model-specific metrics
    let metricsHTML = `
        <div class="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Total Revenue</div>
            <div class="text-2xl font-bold text-gray-100">${formatCurrency(totalRevenue)}</div>
        </div>
        <div class="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Avg Monthly Growth</div>
            <div class="text-2xl font-bold text-gray-100">${formatPercentage(avgGrowth)}</div>
        </div>
        <div class="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Final Month Revenue</div>
            <div class="text-2xl font-bold text-gray-100">${formatCurrency(revenueValues[revenueValues.length - 1])}</div>
        </div>
    `;

    // Add model-specific metric
    if (modelKey === 'subscription') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Final ARR</div>
                <div class="text-2xl font-bold text-gray-100">${formatCurrency(lastMonth.arr)}</div>
            </div>
        `;
    } else if (modelKey === 'freemium') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Conversion Rate</div>
                <div class="text-2xl font-bold text-gray-100">${formatPercentage(lastMonth.conversionRate)}</div>
            </div>
        `;
    } else if (modelKey === 'usage-based') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Avg Usage per Customer</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.avgUsage)}</div>
            </div>
        `;
    } else if (modelKey === 'tiered') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Customers</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalCustomers)}</div>
            </div>
        `;
    } else if (modelKey === 'per-seat') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Seats</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalSeats)}</div>
            </div>
        `;
    } else if (modelKey === 'one-time') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Customers</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalCustomers)}</div>
            </div>
        `;
    }

    metricsContent.innerHTML = metricsHTML;
    metricsPanel.classList.remove('hidden');
}

