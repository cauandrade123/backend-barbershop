// Encaminha rejeições para o error handler central em vez de deixar cada
// controller repetir try/catch.
export default function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
