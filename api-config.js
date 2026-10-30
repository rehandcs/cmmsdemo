(function () {
    const serverHost = 'localhost';
    const serverPort = '3001';
    const normalizedHost = (window.location.hostname || '').trim().toLowerCase();

    const preferredBase = (() => {
        if (/^https?:$/.test(window.location.protocol)) {
            return window.location.origin;
        }
        return `http://${normalizedHost || serverHost}:${serverPort}`;
    })();

    function normalizeApiUrl(url) {
        if (!url) return url;
        const target = String(url);
        return target
            .replace(/^http:\/\/localhost:(3000|3001)/i, preferredBase)
            .replace(/^http:\/\/127\.0\.0\.1:(3000|3001)/i, preferredBase)
            .replace(/^http:\/\/10\.18\.\d+\.\d+:(3000|3001)/i, preferredBase)
            .replace(/^http:\/\/192\.168\.\d+\.\d+:(3000|3001)/i, preferredBase);
    }

    window.CMMS_API_BASE = preferredBase;
    window.CMMS_API_URL = preferredBase;
    window.API_BASE = preferredBase;
    window.API_CONFIG = { BASE_URL: preferredBase };

    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        if (typeof input === 'string') {
            return nativeFetch(normalizeApiUrl(input), init);
        }

        if (input && typeof input === 'object' && typeof input.url === 'string') {
            const cloned = new Request(normalizeApiUrl(input.url), input);
            return nativeFetch(cloned, init);
        }

        return nativeFetch(input, init);
    };
})();
