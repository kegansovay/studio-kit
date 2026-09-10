import type {ComponentType} from 'react'
import {SlugDefinition, SlugInputProps, SlugOptions, type FieldDefinition} from 'sanity'

interface ExtendedSlugOptions extends SlugOptions {
  url: string
  folder?: string
  locked?: boolean | (({document}: any) => boolean)
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
  folder?: string
}

export interface LinkFieldPluginOptions {
  linkableSchemaTypes: string[]
  enableLinkParameters?: boolean
  enableAnchorLinks?: boolean
  customFields?: FieldDefinition[]
}

export interface LinkFieldOptions {
  disableText?: boolean
}

export interface CustomizableLink {
  parameters?: string
  anchor?: string
  blank?: boolean
}

export interface InternalLink extends CustomizableLink {
  type: 'internal'
  internalLink?: {
    _type: string
    [key: string]: unknown
  }
}

export interface ExternalLink extends CustomizableLink {
  type: 'external'
  url?: string
}

export interface EmailLink {
  type: 'email'
  email?: string
}

export interface PhoneLink {
  type: 'phone'
  phone?: string
}

export type LinkValue = {_key?: string; _type?: 'link'; text?: string} & (
  | InternalLink
  | ExternalLink
  | EmailLink
  | PhoneLink
)

export type SanityLink = {
  text: string
  link: string
  blank?: boolean
  parameters?: string
  anchor?: string
  type?: string
}

export interface FormBuilderPluginOptions {
  /** Registers the `formModule` object type (a reference to a `form` document) for page builders */
  enableModule?: boolean
  additionalFieldTypes?: {title: string; value: string}[]
  additionalSelectPresets?: {title: string; value: string}[]
  /** Icon for the `form` document and `formModule`: an emoji or an icon component. Defaults to 📝 */
  formIcon?: string | ComponentType
}
