const ctx = document.getElementById('revenueExpensesChart').getContext('2d');

const revenueExpensesChart = new Chart(ctx, {
    type: 'line', // Change to 'line' chart
    data: {
        labels: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'], // Chapter names
        datasets: [
          {
            label: 'Revenue ($)',
            data: [500, 1000, 750, 1300, 900], // Revenue values
            borderColor: 'rgba(54, 162, 235, 1)', // Line color for revenue
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Transparent fill
            borderWidth: 2,
            tension: 0, // Curve effect for lines
            yAxisID: 'yRevenue', // Link to specific y-axis for revenue
            pointStyle: 'circle', // Points for each value
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Expenses ($)',
            data: [300, 400, 500, 700, 600], // Expense values
            borderColor: 'rgba(255, 99, 132, 1)', // Line color for expenses
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Transparent fill
            borderWidth: 2,
            tension: 0, // Curve effect for lines
            yAxisID: 'yExpenses', // Link to specific y-axis for expenses
            pointStyle: 'rect', // Points for each value
            pointRadius: 5,
            pointHoverRadius: 5
          }
        ]
    },
    options: {
        scales: {
            yRevenue: {
                type: 'linear',
                position: 'left', // Revenue on the left axis
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue ($)'
                }
            },
            yExpenses: {
                type: 'linear',
                position: 'right', // Expenses on the right axis
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false // Don't show grid lines for this axis
                },
                title: {
                    display: true,
                    text: 'Expenses ($)'
                }
            }
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Rev Business Evaluation'
            }
        }
    }
});
