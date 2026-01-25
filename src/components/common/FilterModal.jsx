import React, { useState, useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaCheck } from "react-icons/fa6";
import Button from '../Button'; // Reutilizando el componente Button existente si es compatible, o botones estándar
import Search from '../Search';

export default function FilterModal({ isOpen, onClose, title, options, initialSelected = [], onApply }) {
    const [selected, setSelected] = useState(initialSelected);
    const [searchTerm, setSearchTerm] = useState("");

    // Resetear seleccionados cuando el modal se abre con nuevos initialSelected
    useEffect(() => {
        if (isOpen) {
            setSelected(initialSelected);
            setSearchTerm(""); // Reseteamos la búsqueda al abrir el modal
        }
    }, [isOpen, initialSelected]);

    if (!isOpen) return null;

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    const handleApply = () => {
        onApply(selected);
        onClose();
    };

    // Filtramos opciones basadas en lo que el usuario tipeó
    const filteredOptions = options.filter(option => {
        const isObject = typeof option === 'object' && option !== null;
        const label = isObject ? option.label : option;
        return String(label).toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Superposición */}
            <div 
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Contenedor del Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in fade-in zoom-in duration-200">
                
                {/* Cabecera */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h3 className="text-xl text-stone-700 font-bold">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Área de Búsqueda */}
                <div className="px-6 pt-4">
                    <Search 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                    />
                </div>

                {/* Cuerpo - Lista Scrolleable */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex flex-col gap-3">
                        {filteredOptions.map((option, index) => {
                            const isObject = typeof option === 'object' && option !== null;
                            const label = isObject ? option.label : option;
                            const value = isObject ? option.value : option;
                            
                            return (
                                <label 
                                    key={index} 
                                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox"
                                            checked={selected.includes(value)}
                                            onChange={() => toggleOption(value)}
                                            className="peer w-5 h-5 rounded border border-stone-300 appearance-none checked:bg-sky-500 checked:border-sky-500 cursor-pointer transition-all group-hover:border-sky-500"
                                        />
                                        <FaCheck className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <span className="text-stone-600 font-medium cursor-pointer group-hover:text-sky-600 transition-colors">{label}</span>
                                </label>
                            );
                        })}
                        {filteredOptions.length === 0 && (
                            <p className="text-stone-400 text-center py-4">No se encontraron resultados.</p>
                        )}
                        {options.length === 0 && (
                            <p className="text-stone-400 text-center py-4">No hay opciones disponibles.</p>
                        )}
                    </div>
                </div>

                {/* Pie de página */}
                <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/50 mt-auto">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-stone-500 font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleApply}
                        className="px-5 py-2.5 rounded-xl bg-sky-400 text-white font-bold shadow-lg shadow-sky-400/20 hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </div>
    );
}
