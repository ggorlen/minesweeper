// Returns a random integer between two bounds 
function rand(lo, hi) {
  if (!hi) {
    hi = lo;
    lo = 0;
  }
  return Math.floor(Math.random() * (hi - lo)) + lo;
}
