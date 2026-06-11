// Paleta de colores consistente con el estilo del proyecto (#1f6feb)
const COLORES = [
    '#1f6feb', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
    '#9c755f', '#bab0ac'
];

function mostrarError(loadingId, mensaje) {
    const el = document.getElementById(loadingId);
    if (el) {
        el.className = 'error-msg';
        el.textContent = mensaje;
    }
}

function ocultarLoading(loadingId, canvasId) {
    const loading = document.getElementById(loadingId);
    const canvas = document.getElementById(canvasId);
    if (loading) loading.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
}

// Gráfico 1:  Miembros por día 
fetch('/api/stats/miembros_por_dia')
    .then(res => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
    })
    .then(data => {
        if (!data.length) {
            mostrarError('loading-lineas', 'No hay datos de registros aún.');
            return;
        }
        ocultarLoading('loading-lineas', 'graficoLineas');

        const labels = data.map(d => d.dia);
        const valores = data.map(d => d.cantidad);

        new Chart(document.getElementById('graficoLineas'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Miembros registrados',
                    data: valores,
                    borderColor: '#1f6feb',
                    backgroundColor: 'rgba(31,111,235,0.12)',
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#1f6feb',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Fecha de registro' },
                        ticks: { maxRotation: 45, minRotation: 30 }
                    },
                    y: {
                        title: { display: true, text: 'Cantidad de miembros' },
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    })
    .catch(() => mostrarError('loading-lineas', 'No se pudo cargar el gráfico.'));

// Gráfico 2: Actividades por tipo 
fetch('/api/stats/actividades_por_tipo')
    .then(res => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
    })
    .then(data => {
        if (!data.length) {
            mostrarError('loading-torta', 'No hay actividades registradas aún.');
            return;
        }
        ocultarLoading('loading-torta', 'graficoTorta');

        const labels = data.map(d => d.tipo);
        const valores = data.map(d => d.total);

        new Chart(document.getElementById('graficoTorta'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: valores,
                    backgroundColor: COLORES.slice(0, labels.length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.label}: ${ctx.parsed} actividades`
                        }
                    }
                }
            }
        });
    })
    .catch(() => mostrarError('loading-torta', 'No se pudo cargar el gráfico.'));

// Gráfico 3:  Actividades por comuna 
fetch('/api/stats/actividades_por_comuna')
    .then(res => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
    })
    .then(data => {
        if (!data.length) {
            mostrarError('loading-barras', 'No hay datos disponibles.');
            return;
        }
        ocultarLoading('loading-barras', 'graficoBarras');

        const labels = data.map(d => d.comuna);
        const valores = data.map(d => d.total);

        new Chart(document.getElementById('graficoBarras'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total de actividades',
                    data: valores,
                    backgroundColor: COLORES[0],
                    borderColor: '#155bb5',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Comuna' },
                        ticks: { maxRotation: 45, minRotation: 30 }
                    },
                    y: {
                        title: { display: true, text: 'Total de actividades' },
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    })
    .catch(() => mostrarError('loading-barras', 'No se pudo cargar el gráfico.'));
