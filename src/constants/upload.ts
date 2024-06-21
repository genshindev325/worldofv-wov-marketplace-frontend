export const BATCH_MINT_MAX_TOKEN_COUNT = 10;
export const MAX_EDITION_COUNT = 100;

export const SINGLE_MINT_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const BATCH_MINT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const PROFILE_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const COLLECTION_MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024;

export const SUPPORTED_IMAGE_MIME_TYPES = [
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/webp",
    "image/png",
    "image/bmp",
    "image/tiff",
];

export const SUPPORTED_VIDEO_MIME_TYPES = ["video/mp4"];

export const SUPPORTED_MIME_TYPES = [
    ...SUPPORTED_IMAGE_MIME_TYPES,
    ...SUPPORTED_VIDEO_MIME_TYPES,
];
