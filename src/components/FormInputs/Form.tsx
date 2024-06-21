import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import React from "react";
import {
    Control,
    DefaultValues,
    FieldErrors,
    FieldValues,
    SubmitHandler,
    useForm,
    UseFormRegister,
    UseFormReturn,
    UseFormSetError,
    UseFormWatch,
} from "react-hook-form";

interface Props<T extends FieldValues> {
    className?: string;
    style?: React.CSSProperties;
    defaultValues?: DefaultValues<T>;
    validationSchema?: any;
    resetOnSubmit?: boolean;
    onSubmit?: SubmitHandler<T>;
    render: (props: UseFormReturn<T>) => React.ReactNode;
}

export interface FormInputProps<T extends object = any> {
    register?: UseFormRegister<T>;
    setError?: UseFormSetError<T>;
    watch?: UseFormWatch<T>;
    errors?: FieldErrors<T>;
    control?: Control<T>;
}

/**
 * @deprecated Use `useForm` directly instead.
 */
const Form = <T extends object>({
    defaultValues,
    validationSchema,
    resetOnSubmit,
    onSubmit,
    className,
    style,
    render,
}: Props<T>): JSX.Element => {
    const methods = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues,
        resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    });

    const {
        reset,
        handleSubmit,
        setError,
        register,
        watch,
        control,
        formState: { errors },
    } = methods;

    const onSubmitSuccessResetForm = async (values: T) => {
        if (_.isFunction(onSubmit)) {
            const isSuccess = await onSubmit(values);

            if (isSuccess) {
                reset();
            }
        }
    };

    React.useEffect(() => {
        reset(defaultValues || ({} as any));
    }, [defaultValues, reset]);

    const renderChildren = (children: any) =>
        React.Children.map(children, (child: any) => {
            if (!child) return;

            const Component = child.type;

            if (child?.props?.inputProps?.name) {
                return React.createElement(Component, {
                    ...child.props,
                    ...{ control, register, errors, watch, setError },
                });
            }

            if (child?.props?.children) {
                return (
                    <Component {...child.props}>
                        {renderChildren(child.props.children)}
                    </Component>
                );
            }

            return child;
        });

    return (
        <form
            onSubmit={
                onSubmit
                    ? handleSubmit(
                          resetOnSubmit ? onSubmitSuccessResetForm : onSubmit
                      )
                    : undefined
            }
            {...{ className, style }}
        >
            {renderChildren(render(methods))}
        </form>
    );
};

export default Form;
