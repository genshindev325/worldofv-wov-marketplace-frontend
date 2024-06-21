export async function createFileFromUrl(
    url: string,
    fileName: string,
    mimeType: string
) {
    const response = await fetch(url);
    const data = await response.blob();
    const metadata = {
        type: mimeType,
    };
    return new File([data], fileName, metadata);
}
