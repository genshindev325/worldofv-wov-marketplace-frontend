import React from "react";

interface GlobalConfigContextProps {
    /**
     * Flag to set counters ON/OFF.
     * TODO: ideally we should read this value from the server
     */
    countersOn: boolean;
}

const GlobalConfigContext = React.createContext<GlobalConfigContextProps>(
    {} as any
);

export const GlobalConfigProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
}) => {
    return (
        <GlobalConfigContext.Provider
            value={{
                countersOn: true,
            }}
        >
            {children}
        </GlobalConfigContext.Provider>
    );
};

export const useGlobalConfig = () => React.useContext(GlobalConfigContext);
