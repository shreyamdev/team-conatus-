/**
 * Generates a URL-safe hash from a string
 * @param {string} str
 * @returns {string}
 */
function createHash(str) {
  if (!str) return 'unknown';
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Creates a clean slug from title
 * @param {string} title
 * @returns {string}
 */
function createSlug(title) {
  if (!title) return 'story';
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
}

/**
 * Obtains or generates a reliable URL-safe article identifier.
 * @param {Object} article
 * @returns {string}
 */
export function getArticleId(article) {
  if (!article) return '';

  if (article.article_id && typeof article.article_id === 'string' && article.article_id.length > 5) {
    // If it has standard alphanumerics and dashes, return directly
    if (/^[a-zA-Z0-9_-]+$/.test(article.article_id)) {
      return article.article_id;
    }
  }

  // Fallback: derive deterministic ID from link or title
  const seed = article.link || article.title || 'untitled';
  const hash = createHash(seed);
  const slug = createSlug(article.title);

  return `${slug}-${hash}`;
}

/**
 * Checks if an article matches a given articleId from URL params.
 * @param {Object} article
 * @param {string} targetId
 * @returns {boolean}
 */
export function matchesArticleId(article, targetId) {
  if (!article || !targetId) return false;
  const directId = article.article_id;
  if (directId === targetId) return true;

  const generatedId = getArticleId(article);
  if (generatedId === targetId) return true;

  // Partial match fallback if slug matches hash suffix
  if (targetId.includes('-')) {
    const targetHash = targetId.split('-').pop();
    if (generatedId.endsWith(targetHash)) return true;
  }

  return false;
}
