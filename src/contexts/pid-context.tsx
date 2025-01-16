import { createContext, useContext } from "react";

const PIDContext = createContext();

export const PIDProvider = ({ pid, children }) => (
    <PIDContext.Provider value={pid}>{children}</PIDContext.Provider>
);

export const usePID = () => {
    const context = useContext(PIDContext);
    if (!context) {
        throw new Error("usePID must be used within a PIDProvider");
    }
    return context;
};
