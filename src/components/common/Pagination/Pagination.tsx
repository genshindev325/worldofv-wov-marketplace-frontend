import { useMediaQuery } from "@react-hook/media-query";
import { FC } from "react";
import styled, { CSSProperties, useTheme } from "styled-components";
import usePagination, {
    PAGINATION_DOTS,
    UsePaginationProps,
} from "../../../hooks/usePagination";
import mixins from "../../../styles/_mixins";
import CircleButton from "../../CircleButton";
import Icon from "../../Icon";

const { media } = mixins;

interface PaginationProps extends UsePaginationProps {
    onPageChange: (newPage: number) => void;
    className?: string;
    style?: CSSProperties;
}

export const Pagination: FC<PaginationProps> = ({
    totalCount,
    pageSize,
    currentPage,
    siblingCount = 1,
    onPageChange,
    className,
    style,
}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.a})`);

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        pageSize,
        siblingCount: isSmallScreen ? 0 : siblingCount,
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
        return null;
    }

    const handlePageChange = (newPage: number) => {
        onPageChange(newPage);
    };

    const onNext = () => {
        handlePageChange(currentPage + 1);
    };

    const onPrevious = () => {
        handlePageChange(currentPage - 1);
    };

    const lastPage = paginationRange[paginationRange.length - 1];

    return (
        <Container {...{ className, style }}>
            <CircleButton
                small
                outline
                disabled={currentPage === 1}
                onClick={onPrevious}
            >
                <Icon icon="arrow-left" />
            </CircleButton>

            {paginationRange.map((pageNumber, i) => {
                if (pageNumber === PAGINATION_DOTS) {
                    return (
                        <CircleButton
                            small
                            outline
                            disabled
                            key={`${pageNumber}_${i}`}
                        >
                            <Icon icon="more" />
                        </CircleButton>
                    );
                }

                return (
                    <CircleButton
                        key={pageNumber}
                        small
                        outline={pageNumber !== currentPage}
                        onClick={() => handlePageChange(Number(pageNumber))}
                    >
                        {pageNumber}
                    </CircleButton>
                );
            })}

            <CircleButton
                small
                outline
                disabled={currentPage === lastPage}
                onClick={onNext}
            >
                <Icon icon="arrow-right" />
            </CircleButton>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;

    > * {
        &:not(:first-child) {
            margin-left: 12px;

            ${media.a`
                margin-left: 6px;
            `}
        }
    }

    > ${CircleButton} {
        .icon {
            color: inherit;
        }
    }
`;
