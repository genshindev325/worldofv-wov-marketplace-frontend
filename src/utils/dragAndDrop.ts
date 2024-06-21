export const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const onDragEndHandler = (array: any[], result: any) => {
    if (!result.destination) {
        return;
    }

    if (result.destination.index === result.source.index) {
        return;
    }

    return reorder(array, result.source.index, result.destination.index);
};
