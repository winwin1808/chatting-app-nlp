export function logRoute(req, res, next) {
    console.log(`${req.method} ${req.originalUrl} route called`);
    next();
  }