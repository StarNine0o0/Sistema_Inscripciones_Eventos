import React, { useState } from 'react';
import ModalEvento from '../ModalEvento/ModalEvento';
import InicioSection from './sections/InicioSection';
import EventosSection from './sections/EventosSection';
import EstudiantesSection from './sections/EstudiantesSection';
import AnaliticasSection from './sections/AnaliticasSection';
import ConfiguracionSection from './sections/ConfiguracionSection';
import { crearEvento, actualizarEvento } from '../../api/eventosApi';
import { useToast } from '../../context/ToastContext';
import './Dashboard.css';

const SECCIONES = [
    { id: 'dashboard', label: 'Dashboard', icono: 'dashboard' },
    { id: 'eventos', label: 'Eventos', icono: 'calendar_month' },
    { id: 'estudiantes', label: 'Estudiantes', icono: 'group' },
    { id: 'analiticas', label: 'Analíticas', icono: 'analytics' },
    { id: 'configuracion', label: 'Configuración', icono: 'settings' },
];

const Dashboard = ({ usuario }) => {
    const { showToast } = useToast();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState('dashboard');

    // Estados del Modal de eventos (se comparte entre Inicio y Eventos)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    // Se usa para forzar que las tablas de eventos vuelvan a pedir datos tras guardar
    const [refrescoEventos, setRefrescoEventos] = useState(0);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleAbrirCrear = () => {
        setEventoSeleccionado(null);
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (evento) => {
        setEventoSeleccionado(evento);
        setIsModalOpen(true);
    };

    const handleGuardarEvento = async (datosEvento, esEdicion) => {
        if (esEdicion) {
            await actualizarEvento(datosEvento.id_evento, datosEvento);
            showToast(`Evento "${datosEvento.nombre_evento}" actualizado con éxito.`, 'success');
        } else {
            await crearEvento(datosEvento);
            showToast(`Evento "${datosEvento.nombre_evento}" creado con éxito.`, 'success');
        }
        setRefrescoEventos((n) => n + 1);
    };

    const renderSeccion = () => {
        switch (seccionActiva) {
            case 'eventos':
                return (
                    <EventosSection
                        key={refrescoEventos}
                        onNuevoEvento={handleAbrirCrear}
                        onEditarEvento={handleAbrirEditar}
                    />
                );
            case 'estudiantes':
                return <EstudiantesSection />;
            case 'analiticas':
                return <AnaliticasSection key={refrescoEventos} />;
            case 'configuracion':
                return <ConfiguracionSection usuario={usuario} />;
            case 'dashboard':
            default:
                return (
                    <InicioSection
                        key={refrescoEventos}
                        usuario={usuario}
                        onNuevoEvento={handleAbrirCrear}
                        onEditarEvento={handleAbrirEditar}
                    />
                );
        }
    };

    return (
        <div className="dashboard-container">
            <aside className={`${isCollapsed ? 'anchoPequeño' : 'anchoNormal'}`}></aside>
            {/* Sidebar Lateral */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-info">
                        <h2 className="brand-title">UniEvents</h2>
                        <span className="brand-subtitle">Admin Panel</span>
                    </div>
                    <button className="menu-toggle" onClick={toggleSidebar} title="Alternar Menú">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {SECCIONES.map((sec) => (
                        <a
                            key={sec.id}
                            href={`#${sec.id}`}
                            className={`nav-item ${seccionActiva === sec.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSeccionActiva(sec.id);
                            }}
                        >
                            <span className="material-symbols-outlined nav-icon">{sec.icono}</span>
                            <span className="nav-text">{sec.label}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Área de Contenido Principal */}
            <main className="main-content">
                {renderSeccion()}
            </main>

            {/* MODAL REUTILIZABLE, disponible desde cualquier sección */}
            <ModalEvento
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventoAEditar={eventoSeleccionado}
                onSave={handleGuardarEvento}
            />
        </div>
    );
};

export default Dashboard;
