// wanted to use winston but this works fine for now
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // store original end to capture status code
    const originalEnd = res.end;
    res.end = function (...args) {
        const duration = Date.now() - start;
        const status = res.statusCode;

        // color based on status code
        let color = '\x1b[32m'; // green for 2xx
        if (status >= 400 && status < 500) color = '\x1b[33m'; // yellow for 4xx
        if (status >= 500) color = '\x1b[31m'; // red for 5xx

        const reset = '\x1b[0m';
        const timestamp = new Date().toISOString();

        console.log(
            `${color}[${timestamp}] ${req.method} ${req.originalUrl} ${status} - ${duration}ms${reset}`
        );

        originalEnd.apply(res, args);
    };

    next();
};

module.exports = { requestLogger };
