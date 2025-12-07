// Per RFC 9309 and Google recommendations for robots.txt parsing
// https://github.com/trybyte-app/robotstxt-ts-port

/** Maximum robots.txt size in bytes (500 KiB per RFC 9309) */
export const MAX_ROBOTS_TXT_SIZE = 500 * 1024;

/** Maximum number of URLs to process in a single batch */
export const MAX_URL_COUNT = 10000;

/** Maximum length of a single URL */
export const MAX_URL_LENGTH = 2048;

/** Regex for valid user-agent format (per library docs: only a-zA-Z_- allowed) */
export const USER_AGENT_REGEX = /^[a-zA-Z_-]+$/;

/** Number of URLs to process per chunk for non-blocking processing */
export const CHUNK_SIZE = 100;
