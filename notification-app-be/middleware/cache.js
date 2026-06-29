// simple in-memory cache with TTL
// tried redis first but it was overkill for this project
const cache = new Map();
const DEFAULT_TTL = 30 * 1000; // 30 seconds

function getCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

function setCache(key, data, ttl = DEFAULT_TTL) {
    cache.set(key, {
        data,
        expiry: Date.now() + ttl,
    });
}

// clear everything when data changes (POST, PUT, DELETE)
function invalidateCache() {
    cache.clear();
}

module.exports = { getCache, setCache, invalidateCache };
