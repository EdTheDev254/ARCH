export const resolveImagePath = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // import.meta.env.BASE_URL is set in vite.config.js (e.g., '/ARCH/')
    const baseUrl = import.meta.env.BASE_URL;

    // Remove leading slash from path if present to avoid double slashes
    // assuming BASE_URL ends with a slash (which it usually does in Vite)
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${baseUrl}${cleanPath}`;
};
