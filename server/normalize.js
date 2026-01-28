function buildInsensitiveRegex(str) {
    if (!str) return undefined;

    const escaped = str
      .trim()
      .replace(/\s+/g, "\\s+")     // allow flexible spacing
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars

    return new RegExp(`^${escaped}$`, "i"); // exact match, case-insensitive
  }

  module.exports = { buildInsensitiveRegex };
