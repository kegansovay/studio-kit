import type {SanityDocument} from 'sanity'

/**
 * The folder in front of `slug.current`: a static path such as `'podcast/media'`, or a function
 * of the document that returns one.
 * @public
 */
export type SlugFolder =
  | string
  | ((document: SanityDocument) => string | undefined | Promise<string | undefined>)

/**
 * The path in front of `slug.current`: `/` without a folder, otherwise `/folder/`.
 * No slash is added after a folder that ends in a hash or query string.
 */
export function buildPrefix(folder?: string): string {
  const path = folder?.trim().replace(/^\/+/, '')
  if (!path) {
    return '/'
  }
  const needsSlash = !path.endsWith('/') && !path.includes('#') && !path.includes('?')
  return `/${path}${needsSlash ? '/' : ''}`
}

/**
 * Builds `slug.fullUrl`: the folder prefix followed by `slug.current`, always starting with `/`.
 * This is the value the slug input stores and `defineSlug` validates against.
 *
 * @example
 * ```ts
 * buildFullUrl('episode-1', 'podcast/media') // '/podcast/media/episode-1'
 * ```
 * @public
 */
export function buildFullUrl(current: string, folder?: string): string {
  return `${buildPrefix(folder)}${current.replace(/^\/+/, '')}`
}

/** Resolves a folder option for a document. Rejects if a folder function throws. */
export async function resolveFolder(
  folder: SlugFolder | undefined,
  document: SanityDocument,
): Promise<string | undefined> {
  return typeof folder === 'function' ? folder(document) : folder
}
