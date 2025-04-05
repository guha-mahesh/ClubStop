import { createContext, useState, ReactNode, useContext } from "react";
import React from "react";

interface GlobalContextType {
  signed: boolean;
  setSigned: (signed: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [signed, setSigned] = useState<boolean>(false);

  return (
    <GlobalContext.Provider value={{ signed, setSigned }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};
