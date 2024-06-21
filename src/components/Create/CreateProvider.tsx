import React from "react";
import type { FormData as CreateFormData } from "./CreateBody";

interface CreateContextProps {
    formValues: CreateFormData | undefined;
    setFormValues: React.Dispatch<
        React.SetStateAction<CreateFormData | undefined>
    >;
}

const CreateContext = React.createContext<CreateContextProps>({} as any);

const CreateProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
}) => {
    const [formValues, setFormValues] = React.useState<CreateFormData>();

    return (
        <CreateContext.Provider value={{ formValues, setFormValues }}>
            {children}
        </CreateContext.Provider>
    );
};

export const useCreate = () => React.useContext(CreateContext);

export default CreateProvider;
