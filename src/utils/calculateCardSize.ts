const calculateCardSize = (itemsCount: number, marginSize: number) => `
    flex: 0 0 calc(${100 / itemsCount}% - ${marginSize}px);
    max-width: calc(${100 / itemsCount}% - ${marginSize}px);
`;

export default calculateCardSize;
