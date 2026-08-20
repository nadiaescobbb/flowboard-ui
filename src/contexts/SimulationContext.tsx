import React, { createContext, useContext, useState } from 'react';
import { SimMode, SimulationState } from '../types';

interface SimulationContextType {
  simState: SimulationState;
  setMode: (mode: SimMode) => void;
  toggleSlowNetwork: () => void;
  toggleError500: () => void;
  toggleEmptyState: () => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simState, setSimState] = useState<SimulationState>({
    mode: 'live',
    slowNetwork: false,
    error500: false,
    emptyState: false,
  });

  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const setMode = (mode: SimMode) => {
    setSimState((prev) => ({
      ...prev,
      mode,
      error500: mode === 'error500',
    }));
  };

  const toggleSlowNetwork = () => {
    setSimState((prev) => ({ ...prev, slowNetwork: !prev.slowNetwork }));
  };

  const toggleError500 = () => {
    setSimState((prev) => ({ ...prev, error500: !prev.error500 }));
  };

  const toggleEmptyState = () => {
    setSimState((prev) => ({ ...prev, emptyState: !prev.emptyState }));
  };

  return (
    <SimulationContext.Provider
      value={{
        simState,
        setMode,
        toggleSlowNetwork,
        toggleError500,
        toggleEmptyState,
        isInspectorOpen,
        setIsInspectorOpen,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
