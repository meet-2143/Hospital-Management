module.exports.arrayOfStrings = function(x) {
  return x.forEach(function(i){ return typeof i === "string" });
}