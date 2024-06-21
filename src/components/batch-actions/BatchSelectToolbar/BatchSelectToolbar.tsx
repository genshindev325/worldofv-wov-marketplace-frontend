import { Context, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { BatchSelectContext } from "../../../providers/BatchSelectProvider";
import { Button } from "../../common/Button";

export interface BatchSelectToolbarProps {
    selectionContext: Context<BatchSelectContext<any>>;
    className?: string;
    items?: any[];
}

export function BatchSelectToolbar({
    selectionContext,
    className,
    items,
}: BatchSelectToolbarProps) {
    const {
        isSelecting,
        setSelecting,
        selectedItems,
        selectItems,
        deselectAll,
        maxSelectedCount,
        minSelectedCount,
        submit,
        submitLabel,
        alwaysActive,
    } = useContext(selectionContext);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isSelecting || alwaysActive) return;

        const header = document.getElementsByTagName("header")[0];

        const toolbarOffset =
            containerRef.current!.getBoundingClientRect().top +
            window.scrollY -
            header.clientHeight;

        // If the toolbar is not within the first 3/4 of the viewport,
        // scroll it into view
        if (window.scrollY < toolbarOffset - window.innerHeight * (3 / 4)) {
            window.scrollTo({ top: toolbarOffset, behavior: "smooth" });
        }
    }, [isSelecting, alwaysActive]);

    const onMount = (ref: HTMLDivElement) => {
        if (ref) {
            containerRef.current = ref;
        }
    };

    return (
        <Container
            isVisible={alwaysActive || isSelecting}
            ref={onMount}
            className={className}
        >
            {!alwaysActive && (
                <Button small outline onClick={() => setSelecting(false)}>
                    Cancel
                </Button>
            )}

            <Button
                small
                outline
                disabled={!selectedItems.size}
                onClick={deselectAll}
            >
                Deselect All
            </Button>

            {items && (
                <Button
                    small
                    outline
                    disabled={selectedItems.size >= maxSelectedCount}
                    onClick={() => selectItems(items)}
                >
                    Select All
                </Button>
            )}

            <Button
                small
                disabled={selectedItems.size < minSelectedCount}
                onClick={submit}
            >
                {submitLabel} ({selectedItems.size} / {maxSelectedCount}{" "}
                selected)
            </Button>
        </Container>
    );
}

const Container = styled.div<{ isVisible: boolean }>`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    display: ${({ isVisible }) => (isVisible ? "visible" : "none")};

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        flex-direction: column;
        justify-content: stretch;
    }

    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.a}) {
        & > :last-child {
            margin-inline-start: auto;
        }
    }
`;
