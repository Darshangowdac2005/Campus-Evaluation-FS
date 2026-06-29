// wanted to use winston but this works fine for now
// standalone logging middleware module

const requestLogger = (req, res, next) => {
    const start = Date.now();

    const originalEnd = res.end;
    res.end = function (...args) {
        const duration = Date.now() - start;
        const status = res.statusCode;

        let color = '\x1b[32m'; // green
        if (status >= 400 && status < 500) color = '\x1b[33m'; // yellow
        if (status >= 500) color = '\x1b[31m'; // red

        const reset = '\x1b[0m';
        const dim = '\x1b[2m';
        const timestamp = new Date().toLocaleTimeString();

        console.log(
            `${dim}${timestamp}${reset} ${color}${req.method}${reset} ${req.originalUrl} ${color}${status}${reset} ${dim}${duration}ms${reset}`
        );

        originalEnd.apply(res, args);
    };

    next();
};

module.exports = { requestLogger };
