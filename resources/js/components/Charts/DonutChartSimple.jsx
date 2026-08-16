import React from 'react';
import './Charts.css';

const PALETA = ['#2563eb', '#16a34a', '#ea580c', '#9333ea', '#dc2626', '#0891b2'];

/**
 * Gráfica de dona en SVG puro.
 * data: [{ etiqueta: string, valor: number }]
 */
const DonutChartSimple = ({ data }) => {
    const total = data.reduce((acc, d) => acc + d.valor, 0) || 1;
    const radio = 60;
    const circunferencia = 2 * Math.PI * radio;
    let acumulado = 0;

    return (
        <div className="donut-chart">
            <svg viewBox="0 0 160 160" className="donut-svg">
                <g transform="translate(80,80) rotate(-90)">
                    <circle r={radio} fill="none" stroke="#f1f5f9" strokeWidth="22" />
                    {data.map((d, i) => {
                        const porcion = d.valor / total;
                        const largo = porcion * circunferencia;
                        const offset = circunferencia * (1 - acumulado);
                        acumulado += porcion;
                        return (
                            <circle
                                key={i}
                                r={radio}
                                fill="none"
                                stroke={PALETA[i % PALETA.length]}
                                strokeWidth="22"
                                strokeDasharray={`${largo} ${circunferencia - largo}`}
                                strokeDashoffset={offset}
                            />
                        );
                    })}
                </g>
                <text x="80" y="76" textAnchor="middle" className="donut-total">{total}</text>
                <text x="80" y="94" textAnchor="middle" className="donut-total-label">Total</text>
            </svg>

            <ul className="donut-legend">
                {data.map((d, i) => (
                    <li key={i}>
                        <span className="legend-dot" style={{ backgroundColor: PALETA[i % PALETA.length] }} />
                        <span className="legend-label">{d.etiqueta}</span>
                        <span className="legend-value">{d.valor}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DonutChartSimple;