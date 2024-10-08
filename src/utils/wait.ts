export async function wait(ms: number) {
    return new Promise((res, rej) => {
        setInterval(() => {
            res(true);
        }, ms);
    });
}
