import { capitalize, pick } from "lodash";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GrClose } from "react-icons/gr";
import { useTheme } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import CircleButton from "../../CircleButton";
import { Button } from "../../common/Button";
import { Flex } from "../../common/Flex";
import { Spacer } from "../../common/Spacer";
import { Text } from "../../common/Text";
import { Input } from "../../FormInputs/Input";

type FieldPair = {
    id: string;
    name: string;
    value: string;
};

export type Trait = { trait_type: string; value: string };

export type ExtraAttributesProps = {
    traits?: Trait[];
    onSubmit?: (extraTraits: Trait[]) => void;
};

export const ExtraAttributes: FC<ExtraAttributesProps> = ({
    traits: initTraits,
    onSubmit = () => {},
}) => {
    const theme = useTheme();

    const [pairs, setPairs] = useState<FieldPair[]>([]);

    const {
        handleSubmit,
        register,
        setError,
        formState: { isSubmitting, errors },
        setValue,
    } = useForm({
        reValidateMode: "onChange",
    });

    // Initialize traits array
    useEffect(() => {
        if (initTraits != null && initTraits.length > 0) {
            initTraits.forEach((i) => {
                const t = handleAdd();
                setValue(t.name, i.trait_type);
                setValue(t.value, i.value);
            });
            return;
        }
        if (pairs.length !== 0) return;
        handleAdd();
    }, []);

    const handleAdd = () => {
        const id = uuidv4();

        const newPair = {
            id,
            name: `name_${id}`,
            value: `value_${id}`,
        };

        setPairs((p) => [...p, newPair]);

        return newPair;
    };

    const handleRemove = (id: string) => {
        const index = pairs.findIndex((t) => t.id === id);
        if (index === -1) return;
        setPairs([...pairs.slice(0, index), ...pairs.slice(index + 1)]);
    };

    const _onSubmit = async (values: Record<string, string>) => {
        const extraTraits: Trait[] = [];

        let hasErrors = false;

        pairs.forEach((t) => {
            if (values[t.name].trim().length === 0) {
                setError(t.name, { message: "Required" });
                hasErrors = true;
            }
            if (values[t.value].trim().length === 0) {
                setError(t.value, { message: "Required" });
                hasErrors = true;
            }
            extraTraits.push({
                trait_type: capitalize(values[t.name]),
                value: values[t.value],
            });
        });

        if (hasErrors) return;

        onSubmit(extraTraits);
    };

    return (
        <>
            <form onSubmit={handleSubmit(_onSubmit)}>
                <Flex flexDirection="column" columnGap={3}>
                    {pairs.length > 0 && (
                        <Flex alignItems="center" rowGap={1}>
                            <Text flex={1}>Type</Text>
                            <Text flex={1}>Name</Text>
                            <Spacer size={5} />
                        </Flex>
                    )}
                    {pairs.map((t) => (
                        <Flex key={t.id} alignItems="flex-start" rowGap={1}>
                            <Input
                                inputProps={{
                                    name: t.name,
                                    placeholder: "Character",
                                    style: {
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                    },
                                }}
                                register={register}
                                errors={pick(errors, t.name)}
                            />
                            <Input
                                inputProps={{
                                    name: t.value,
                                    placeholder: "Male",
                                    style: {
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                    },
                                }}
                                register={register}
                                errors={pick(errors, t.value)}
                            />
                            <CircleButton
                                type="button"
                                outline
                                onClick={() => {
                                    handleRemove(t.id);
                                }}
                            >
                                <GrClose size={16} color={theme.colors.text} />
                            </CircleButton>
                        </Flex>
                    ))}
                    <Button
                        type="button"
                        outline
                        loader={isSubmitting}
                        disabled={isSubmitting}
                        // style={{ alignSelf: "flex-end" }}
                        onClick={handleAdd}
                    >
                        Add more
                    </Button>
                    {pairs.length > 0 && (
                        <Button
                            type="submit"
                            loader={isSubmitting}
                            disabled={isSubmitting}
                            // style={{ alignSelf: "flex-end" }}
                        >
                            Submit
                        </Button>
                    )}
                </Flex>
            </form>
        </>
    );
};
