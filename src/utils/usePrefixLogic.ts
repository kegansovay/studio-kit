import * as PathUtils from '@sanity/util/paths'
import {useCallback, useEffect, useRef, useState} from 'react'
import {
  isSanityDocument,
  type SanityDocument,
  set,
  setIfMissing,
  type SlugParent,
  type SlugSourceContext,
  unset,
  useFormValue,
} from 'sanity'
import speakingurl from 'speakingurl'

import type {ExtendedSlugInputProps} from '../types'
import {buildFullUrl, buildPrefix, resolveFolder, type SlugFolder} from './fullUrl'
import {useSlugContext} from './useSlugContext'

interface FolderState {
  /** False until a folder function has resolved for the first time */
  ready: boolean
  folder: string | undefined
}

/**
 * Resolves the folder option. A static folder is ready straight away. A folder function re-runs
 * whenever the document changes, and the last result is kept while it resolves.
 */
function useFolder(
  folder: SlugFolder | undefined,
  document: SanityDocument | undefined,
): FolderState {
  const [resolved, setResolved] = useState<FolderState>({ready: false, folder: undefined})

  useEffect(() => {
    if (typeof folder !== 'function' || !document) {
      return undefined
    }
    let cancelled = false
    async function resolve(doc: SanityDocument) {
      try {
        const value = await resolveFolder(folder, doc)
        if (!cancelled) {
          setResolved({ready: true, folder: value})
        }
      } catch (error) {
        console.error(`[thread-kit] Couldn't resolve the slug folder:`, error)
      }
    }
    void resolve(document)
    return () => {
      cancelled = true
    }
  }, [folder, document])

  return typeof folder === 'function' ? resolved : {ready: true, folder}
}

export function usePrefixLogic(props: ExtendedSlugInputProps) {
  const {folder: folderOption, onChange, path, readOnly, schemaType, value} = props
  const slugContext = useSlugContext()
  const formValue = useFormValue([])
  const document = isSanityDocument(formValue) ? formValue : undefined
  const {ready, folder} = useFolder(folderOption, document)

  const current = value?.current
  const storedFullUrl = value && 'fullUrl' in value ? value.fullUrl : undefined

  const updateValue = useCallback(
    (nextCurrent: string) => {
      onChange(
        nextCurrent
          ? set({
              _type: schemaType.name,
              current: nextCurrent,
              fullUrl: buildFullUrl(nextCurrent, folder),
            })
          : unset(),
      )
    },
    [onChange, schemaType.name, folder],
  )

  // Repair a missing or stale fullUrl, e.g. on documents created outside the Studio or after the
  // folder changed. The ref stops a second patch for the same value while the first is applied.
  const lastRepair = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (!ready || readOnly || !current) {
      return
    }
    const expected = buildFullUrl(current, folder)
    if (storedFullUrl === expected) {
      lastRepair.current = undefined
      return
    }
    if (lastRepair.current === expected) {
      return
    }
    lastRepair.current = expected
    onChange([setIfMissing(schemaType.name, ['_type']), set(expected, ['fullUrl'])])
  }, [ready, readOnly, current, folder, storedFullUrl, onChange, schemaType.name])

  const getSourceContext = useCallback((): SlugSourceContext => {
    const parentPath = path.slice(0, -1)
    const parent = PathUtils.get<SlugParent>(document, parentPath) ?? {}
    return {...slugContext, parentPath, parent}
  }, [document, path, slugContext])

  /**
   * Avoids trailing slashes, double slashes, spaces, special characters and uppercase letters
   */
  const formatSlug = useCallback(
    async (input?: string) => {
      const source = input || current || ''
      const slugify = schemaType.options?.slugify
      const nextCurrent = slugify
        ? await slugify(source, schemaType, getSourceContext())
        : source
            // Keep slashes between segments (segment-1/segment-2) but drop empty segments,
            // which come from starting, trailing or double slashes
            .split('/')
            .filter(Boolean)
            .map((segment) => speakingurl(segment, {symbols: true}))
            .join('/')

      updateValue(nextCurrent)
    },
    [current, schemaType, getSourceContext, updateValue],
  )

  const generateSlug = useCallback(async () => {
    const source = schemaType.options?.source
    if (!document || !source) {
      return
    }
    const sourceValue =
      typeof source === 'function'
        ? await source(document, getSourceContext())
        : PathUtils.get(document, source)

    await formatSlug(typeof sourceValue === 'string' ? sourceValue : undefined)
  }, [document, schemaType.options?.source, getSourceContext, formatSlug])

  return {
    prefix: buildPrefix(folder),
    generateSlug,
    updateValue,
    formatSlug,
  }
}
