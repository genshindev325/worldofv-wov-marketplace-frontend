import { Map, OrderedMap } from "immutable";
import { Context, createContext, ReactNode, useState } from "react";
import AnimatedModal, { AnimatedModalProps } from "../modals/AnimatedModal";
import { OfferData } from "../types/OfferData";

export type ModalContentProps = Pick<
    AnimatedModalProps,
    "isOpen" | "setIsOpen"
>;

export interface SelectionTarget<T> {
    id?: string;
    ModalContent?: (props: ModalContentProps) => JSX.Element;
    submitLabel: string;
    onSubmit: (selectedItems: Map<string, T>) => void;
    maxSelectedCount: number;
    minSelectedCount?: number;
    /**
     * Check if the candidate is eligible for selection.
     * @returns A message containing the validation error.
     */
    validate: (item: T) => string | undefined;
}

export interface BatchSelectContext<T> {
    selectionTarget: SelectionTarget<T> | null;
    setSelectionTarget: (selectionTarget: SelectionTarget<T>) => void;
    isSelecting: boolean;
    setSelecting: (isSelecting: boolean) => void;
    selectedItems: Map<string, T>;
    /**
     * @returns the validation error message from the `validate` function.
     */
    selectItem: (item: T) => string | undefined;
    selectItems: (items: T[]) => void;
    deselectItem: (id: string) => void;
    replaceItems: (items: T[]) => void;
    deselectAll: () => void;
    /**
     * Check if the candidate is eligible for selection.
     * @returns A message containing the validation error.
     */
    validate: (item: T) => string | undefined;
    submit: () => void;
    maxSelectedCount: number;
    minSelectedCount: number;
    submitLabel: string;
    alwaysActive?: boolean;
}

// TODO add type definition for token data
export const TokenBatchSelectContext = createContext<BatchSelectContext<any>>(
    new Proxy({} as any, {
        get() {
            throw new Error("Context not initialized.");
        },
    })
);

export const OfferBatchSelectContext = createContext<
    BatchSelectContext<OfferData>
>(
    new Proxy({} as any, {
        get() {
            throw new Error("Context not initialized.");
        },
    })
);

export interface BatchSelectProviderProps<T> {
    /**
     * Extract a unique identifier for items to use as key in the map.
     */
    getId: (item: T) => string;
    context: Context<BatchSelectContext<T>>;
    children?: ReactNode;
    alwaysActive?: boolean;
}

export function BatchSelectProvider<T>({
    getId,
    children,
    context,
    alwaysActive = false,
}: BatchSelectProviderProps<T>) {
    const [isSelecting, setSelecting] = useState(alwaysActive);
    const [selectedItems, setSelectedItems] = useState(OrderedMap<string, T>());
    const [target, setTarget] = useState<SelectionTarget<T> | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const setSelectingHandler = (isSelecting: boolean) => {
        if (alwaysActive) {
            throw new Error(
                "Cannot disable selection mode when `alwaysActive` is true."
            );
        }

        deselectAll();
        setSelecting(isSelecting);
    };

    const setSelectionTarget = (selectionTarget: SelectionTarget<T>) => {
        deselectAll();
        setTarget(selectionTarget);
    };

    const selectItem = (item: T) => {
        if (target == null) throw new Error("You need to set a target");

        if (selectedItems.size >= target.maxSelectedCount) {
            return "You reached the selection limit.";
        }

        const error = target.validate(item);
        if (error) return error;

        setSelectedItems(selectedItems.set(getId(item), item));
    };

    const selectItems = (items: T[]) => {
        if (target == null) throw new Error("You need to set a target");

        setSelectedItems((selectedItems) => {
            let itemsToSelect = items
                .filter(
                    (i) => !target.validate(i) && !selectedItems.has(getId(i))
                )
                .slice(0, target.maxSelectedCount - selectedItems.size);

            return selectedItems.merge(itemsToSelect.map((i) => [getId(i), i]));
        });
    };

    const replaceItems = (items: T[]) => {
        deselectAll();
        selectItems(items);
    };

    const deselectItem = (id: string) => {
        setSelectedItems(selectedItems.remove(id));
    };

    const deselectAll = () => {
        setSelectedItems(OrderedMap());
    };

    const submit = () => {
        if (target == null) throw new Error("You need to set a target");

        if (selectedItems.size < (target.minSelectedCount || 0)) {
            throw new Error(`Minimum selected count not reached.`);
        }

        target.onSubmit(selectedItems);

        if (target?.ModalContent != null) {
            setIsOpen(true);
        }
    };

    return (
        <context.Provider
            value={{
                selectionTarget: target || null,
                setSelectionTarget,
                isSelecting,
                setSelecting: setSelectingHandler,
                selectItem,
                selectItems,
                replaceItems,
                deselectItem,
                deselectAll,
                submit,
                selectedItems,
                maxSelectedCount: target?.maxSelectedCount ?? 0,
                minSelectedCount: target?.minSelectedCount || 1,
                submitLabel: target?.submitLabel ?? "",
                validate: target?.validate || (() => undefined),
                alwaysActive,
            }}
        >
            <>
                {children}
                {target?.ModalContent != null && (
                    <AnimatedModal
                        title={target?.submitLabel ?? ""}
                        // contentPadding={16}
                        transitionProps={{ mountOnEnter: false }}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    >
                        <target.ModalContent
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </AnimatedModal>
                )}
            </>
        </context.Provider>
    );
}
