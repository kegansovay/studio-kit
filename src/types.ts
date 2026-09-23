import type {ComponentType} from 'react'
import type {
  ConditionalProperty,
  FieldDefinition,
  SlugDefinition,
  SlugInputProps,
  SlugOptions,
} from 'sanity'

import type {SlugFolder} from './utils/fullUrl'

interface ExtendedSlugOptions extends SlugOptions {
  /** Site origin shown in front of the path in the input, e.g. `https://example.com` */
  url?: string
  /** Folder in front of `slug.current`, e.g. `'podcast/media'`, or a function of the document that returns one */
  folder?: SlugFolder
  /** Makes the field read-only */
  locked?: ConditionalProperty
}

/** Props that can be set on a field when used inside an object (e.g. group, fieldset). Sanity's SlugDefinition doesn't include these in its type, but defineField accepts them. */
/** @public */
export interface SlugFieldOverrides {
  /** Assign this field to one or more field groups. Use group names defined on the parent object's `groups`. */
  group?: string | string[]
  /** Assign this field to a fieldset. Use the fieldset name from the parent object's `fieldsets`. */
  fieldset?: string
}

/**
 * Parameters for defineSlug(). Extends Sanity's SlugDefinition with thread-kit options (url, folder, locked)
 * and object-field props (group, fieldset) so you can pass the same props you would to defineField for a slug.
 * @public
 */
export type SlugParams = Omit<SlugDefinition, 'type' | 'options' | 'name'> &
  SlugFieldOverrides & {
    name?: string
    options?: ExtendedSlugOptions
  }

export interface ExtendedSlugInputProps extends SlugInputProps {
  url: string
  folder?: SlugFolder
}

export interface LinkFieldPluginOptions {
  linkableSchemaTypes: string[]
  enableLinkParameters?: boolean
  enableAnchorLinks?: boolean
  /** Adds a `Manual` link type: a hand-typed path on this site, e.g. `/about/our-team`. Off by default */
  enableManualLinks?: boolean
  customFields?: FieldDefinition[]
}

export interface FormBuilderPluginOptions {
  /** Registers the `formModule` object type (a reference to a `form` document) for page builders */
  enableModule?: boolean
  additionalFieldTypes?: {title: string; value: string}[]
  additionalSelectPresets?: {title: string; value: string}[]
  /** Icon for the `form` document and `formModule`: an emoji or an icon component. Defaults to 📝 */
  formIcon?: string | ComponentType
}
