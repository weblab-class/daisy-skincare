
export const levenshteinDistance = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    const matrix = [];

    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[s2.length][s1.length];
  };

  export const calculateSimilarity = (query, text) => {
    const q = query.toLowerCase().trim();
    const t = text.toLowerCase().trim();

    if (!q || !t) return 0;

    if (q === t) return 1.0;

    if (t.startsWith(q)) return 0.95;

    if (t.includes(q)) return 0.85;

    const words = t.split(/\s+/);
    const queryWords = q.split(/\s+/);

    if (queryWords.every(qw => words.some(w => w.startsWith(qw)))) {
      return 0.8;
    }

    const matchingWords = queryWords.filter(qw =>
      words.some(w => w.includes(qw) || qw.includes(w))
    );
    if (matchingWords.length > 0) {
      return 0.7 * (matchingWords.length / queryWords.length);
    }

    const maxLength = Math.max(q.length, t.length);
    const distance = levenshteinDistance(q, t);

    const similarity = 1 - (distance / maxLength);

    return similarity > 0.6 ? similarity * 0.6 : 0;
  };

  export const fuzzyFilter = (items, query, getTextFn, minScore = 0.3) => {
    if (!query || !query.trim()) {
      return items;
    }

    const itemsWithScores = items
      .map(item => ({
        item,
        score: calculateSimilarity(query, getTextFn(item))
      }))
      .filter(({ score }) => score >= minScore)
      .sort((a, b) => b.score - a.score);

    return itemsWithScores.map(({ item }) => item);
  };


  export const normalizeString = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ');   // Normalize whitespace
  };

 
  export const matchesWithTypoTolerance = (query, text, maxTypos = 2) => {
    const q = normalizeString(query);
    const t = normalizeString(text);

    if (!q) return true;
    if (!t) return false;

    // Quick checks first
    if (t.includes(q)) return true;

    // Check with typo tolerance
    const distance = levenshteinDistance(q, t);
    const tolerance = Math.min(maxTypos, Math.floor(q.length / 4)); // Max 25% of query length

    return distance <= tolerance;
  };


  export const highlightMatches = (text, query) => {
    if (!query || !query.trim()) return text;

    const normalizedQuery = query.toLowerCase().trim();
    const normalizedText = text.toLowerCase();

    let bestMatch = { start: -1, length: 0 };

    const exactIndex = normalizedText.indexOf(normalizedQuery);
    if (exactIndex !== -1) {
      bestMatch = { start: exactIndex, length: normalizedQuery.length };
    } else {
      const words = normalizedQuery.split(/\s+/);
      for (const word of words) {
        const index = normalizedText.indexOf(word);
        if (index !== -1 && word.length > bestMatch.length) {
          bestMatch = { start: index, length: word.length };
        }
      }
    }

    if (bestMatch.start === -1) return text;

    return {
      before: text.substring(0, bestMatch.start),
      match: text.substring(bestMatch.start, bestMatch.start + bestMatch.length),
      after: text.substring(bestMatch.start + bestMatch.length)
    };
  };

  export default {
    levenshteinDistance,
    calculateSimilarity,
    fuzzyFilter,
    normalizeString,
    matchesWithTypoTolerance,
    highlightMatches
  };
