import { createContext, useContext, ReactNode } from "react";

const PIDContext = createContext<string | undefined>(undefined);

interface PIDProviderProps {
    pid: string;
    children: ReactNode;
}

export const PIDProvider = ({ pid, children }: PIDProviderProps) => (
    <PIDContext.Provider value={pid}>{children}</PIDContext.Provider>
);

export const usePID = (): string => {
    const context = useContext(PIDContext);
    if (context === undefined) {
        throw new Error("usePID must be used within a PIDProvider");
    }
    return context;
};