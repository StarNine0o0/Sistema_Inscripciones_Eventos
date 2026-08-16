import React from 'react';
import './Charts.css';

/**
 * Gráfica de barras horizontal, sin librerías externas.
 * data: [{ etiqueta: string, valor: number }]
 */
const BarChartSimple = ({ data, sufijo = '', color = '#2563eb' }) => {
    const maximo = Math.max(1, ...data.map((d) => d.valor));

    return (
        <div className="bar-chart">
            {data.map((d, i) => (
                <div className="bar-row" key={i}>
                    <span className="bar-label" title={d.etiqueta}>{d.etiqueta}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{ width: `${Math.max(4, (d.valor / maximo) * 100)}%`, backgroundColor: color }}
                        />
                    </div>
                    <span className="bar-value">{d.valor}{sufijo}</span>
                </div>
            ))}
        </div>
    );
};

export default BarChartSimple;