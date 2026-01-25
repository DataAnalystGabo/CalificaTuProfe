import React, { useState, useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import Button from '../Button'; // Reusing existing Button component if compatible, or standard buttons

export default function FilterModal({ isOpen, onClose, title, options, initialSelected = [], onApply }) {
    const [selected, setSelected] = useState(initialSelected);

    // Reset selected when modal opens with new initialSelected
    useEffect(() => {
        if (isOpen) {
            setSelected(initialSelected);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h3 className="text-xl text-stone-700 font-bold">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Scrollable List */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col gap-3">
                        {options.map((option, index) => {
                            const isObject = typeof option === 'object' && option !== null;
                            const label = isObject ? option.label : option;
                            const value = isObject ? option.value : option;
                            
                            return (
                                <label 
                                    key={index} 
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                                >
                                    <input 
                                        type="checkbox"
                                        checked={selected.includes(value)}
                                        onChange={() => toggleOption(value)}
                                        className="w-5 h-5 rounded border-stone-300 text-sky-500 focus:ring-sky-500/20 accent-sky-500 cursor-pointer"
                                    />
                                    <span className="text-stone-600 font-medium cursor-pointer">{label}</span>
                                </label>
                            );
                        })}
                        {options.length === 0 && (
                            <p className="text-stone-400 text-center py-4">No hay opciones disponibles.</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/50">
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
