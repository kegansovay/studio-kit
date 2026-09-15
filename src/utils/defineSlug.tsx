import {defineField, type FieldDefinition, type SlugValue, type ValidationContext} from 'sanity'

import SlugInput from '../components/SlugInput'
import type {SlugParams} from '../types'
import {buildFullUrl, type SlugFolder} from './fullUrl'

/** Flags a `fullUrl` that doesn't match the folder and `current`, e.g. on documents created outside the Studio */
function validateFullUrl(folder: SlugFolder | undefined) {
  return async (
    value: SlugValue | undefined,
    context: ValidationContext,
  ): Promise<true | string> => {
    if (!value?.current) {
      return true
    }

    let resolvedFolder: string | undefined
    if (typeof folder === 'function') {
      if (!context.document) {
        return true
      }
      try {
        resolvedFolder = await folder(context.document)
      } catch {
        // The input logs folder errors, so don't block publishing on them
        return true
      }
    } else {
      resolvedFolder = folder
    }

    const expected = buildFullUrl(value.current, resolvedFolder)
    const stored = 'fullUrl' in value ? value.fullUrl : undefined
    if (stored === expected) {
      return true
    }

    const problem =
      stored === undefined || stored === ''
        ? 'is missing'
        : `is out of date (${JSON.stringify(stored)})`
    return `fullUrl ${problem}, it should be "${expected}". Open this document in the Studio to update it.`
  }
}

/** @public */
export function defineSlug(schema: SlugParams = {}): FieldDefinition<'slug'> {
  const {components, options, readOnly, validation, ...field} = schema
  const {url = '', folder, locked} = options ?? {}

  return defineField({
    ...field,
    name: field.name ?? 'slug',
    title: field.title ?? 'URL',
    type: 'slug',
    components: {
      ...components,
      input: (props) => <SlugInput {...props} url={url} folder={folder} />,
    },
    options: {
      maxLength: 200,
      source: 'name',
      ...options,
    },
    readOnly: locked ?? readOnly,
    validation: (rule, context) => {
      const ownRules = validation?.(rule, context) ?? []
      return [
        rule.required(),
        rule.custom(validateFullUrl(folder)),
        ...(Array.isArray(ownRules) ? ownRules : [ownRules]),
      ]
    },
  })
}
