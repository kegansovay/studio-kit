import {LinkIcon} from '@sanity/icons/Link'
import {defineField, definePlugin, defineType, type FieldDefinition} from 'sanity'

import {LinkInput} from '../../components/LinkInput'
import {LinkTypeInput} from '../../components/LinkTypeInput'
import type {LinkFieldPluginOptions} from '../../types'

const LINK_TYPE_TITLES: Record<string, string> = {
  internal: 'Internal Link',
  external: 'External Link',
  email: 'Email Link',
  phone: 'Phone',
}

/** Placeholder `text` that the removed `disableText` option (1.4 – 1.6) wrote into documents */
const LEGACY_DISABLED_TEXT = '_disabled_'

interface LinkPreviewSelection {
  text?: string
  type?: string
  internalLinkTitle?: string
  internalLinkName?: string
  url?: string
  email?: string
  phone?: string
}

interface LinkTypeConfig {
  name: string
  title: string
  includeText: boolean
  linkableSchemaTypes: string[]
  enableLinkParameters: boolean
  enableAnchorLinks: boolean
  customFields: FieldDefinition[]
}

/** Reads the link `type` from the parent object in validation callbacks */
function getLinkType(parent: unknown): unknown {
  return typeof parent === 'object' && parent !== null && 'type' in parent ? parent.type : undefined
}

function getTypeTitle(type: string | undefined): string {
  if (!type) return 'Link'
  return LINK_TYPE_TITLES[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

function getDestination(selection: LinkPreviewSelection): string | undefined {
  switch (selection.type) {
    case 'internal':
      return selection.internalLinkTitle || selection.internalLinkName
    case 'external':
      return selection.url
    case 'email':
      return selection.email
    case 'phone':
      return selection.phone
    default:
      return undefined
  }
}

function defineLinkType({
  name,
  title,
  includeText,
  linkableSchemaTypes,
  enableLinkParameters,
  enableAnchorLinks,
  customFields,
}: LinkTypeConfig) {
  return defineType({
    name,
    title,
    type: 'object',
    icon: LinkIcon,
    fieldsets: [
      {
        name: 'advanced',
        title: 'Advanced',
        description: 'Optional. Add anchor links and custom parameters.',
        options: {
          collapsible: true,
          collapsed: true,
        },
      },
    ],
    fields: [
      ...(includeText
        ? [
            defineField({
              name: 'text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ]
        : []),

      defineField({
        name: 'type',
        type: 'string',
        initialValue: 'internal',
        validation: (rule) => rule.required(),
        components: {
          input: (props) => <LinkTypeInput {...props} linkableSchemaTypes={linkableSchemaTypes} />,
        },
      }),

      // Internal
      defineField({
        name: 'internalLink',
        type: 'reference',
        to: linkableSchemaTypes.map((type) => ({type})),
        options: {
          disableNew: true,
        },
        description: 'Link to another page or document on the website.',
        hidden: ({parent}) => !!parent?.type && parent?.type !== 'internal',
        validation: (rule) =>
          rule.custom((value, context) =>
            !value && getLinkType(context.parent) === 'internal' ? 'Link is required' : true,
          ),
      }),

      // External
      defineField({
        name: 'url',
        type: 'url',
        description:
          'Link to an absolute URL to a page on another website. Must start with "https://"',
        validation: (rule) =>
          rule
            .uri({
              scheme: ['https', 'http'],
            })
            .custom((value, context) =>
              !value && getLinkType(context.parent) === 'external' ? 'Link is required' : true,
            ),
        hidden: ({parent}) => parent?.type !== 'external',
      }),

      // E-mail
      defineField({
        name: 'email',
        type: 'email',
        description: 'Link to send an e-mail to the given address.',
        hidden: ({parent}) => parent?.type !== 'email',
        validation: (rule) =>
          rule.custom((value, context) =>
            !value && getLinkType(context.parent) === 'email' ? 'Email is required' : true,
          ),
      }),

      // Phone
      defineField({
        name: 'phone',
        type: 'string',
        description: 'Link to call the given phone number.',
        validation: (rule) =>
          rule.custom((value, context) => {
            if (getLinkType(context.parent) !== 'phone') {
              return true
            }
            if (!value) {
              return 'Phone is required'
            }
            return (
              (/^\+?[0-9\s-]*$/.test(value) && !value.startsWith('-') && !value.endsWith('-')) ||
              'Must be a valid phone number'
            )
          }),
        hidden: ({parent}) => parent?.type !== 'phone',
      }),

      // New tab
      defineField({
        title: 'Open in new window',
        name: 'blank',
        type: 'boolean',
        initialValue: false,
        hidden: ({parent}) =>
          parent?.type === 'email' || parent?.type === 'phone' || parent?.type === 'internal',
      }),

      // Parameters
      ...(enableLinkParameters
        ? [
            defineField({
              title: 'Parameters',
              name: 'parameters',
              type: 'string',
              description: 'Optional. Add custom parameters to the URL, such as UTM tags.',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const type = getLinkType(context.parent)
                  if (!value || type === 'email' || type === 'phone') {
                    return true
                  }
                  if (!value.startsWith('?')) {
                    return 'Must start with ?; eg. ?utm_source=example.com&utm_medium=referral'
                  }
                  if (value.length === 1) {
                    return 'Must contain at least one parameter'
                  }
                  return true
                }),
              hidden: ({parent}) => parent?.type === 'email' || parent?.type === 'phone',
              fieldset: 'advanced',
            }),
          ]
        : []),

      // Anchor
      ...(enableAnchorLinks
        ? [
            defineField({
              title: 'Anchor',
              name: 'anchor',
              type: 'string',
              description: 'Optional. Add an anchor to link to a specific section on the page.',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const type = getLinkType(context.parent)
                  if (!value || type === 'email' || type === 'phone') {
                    return true
                  }
                  if (!value.startsWith('#')) {
                    return 'Must start with #; eg. #page-section-1'
                  }
                  if (value.length === 1) {
                    return 'Must contain at least one character'
                  }
                  return (
                    /^([-?/:@._~!$&'()*+,;=a-zA-Z0-9]|%[0-9a-fA-F]{2})*$/.test(value.slice(1)) ||
                    'Invalid URL fragment'
                  )
                }),
              hidden: ({parent}) => parent?.type === 'email' || parent?.type === 'phone',
              fieldset: 'advanced',
            }),
          ]
        : []),

      ...customFields,
    ],

    preview: {
      select: {
        text: 'text',
        type: 'type',
        internalLinkTitle: 'internalLink.title',
        internalLinkName: 'internalLink.name',
        url: 'url',
        email: 'email',
        phone: 'phone',
      },
      prepare(selection: LinkPreviewSelection) {
        const typeTitle = getTypeTitle(selection.type)
        const destination = getDestination(selection)
        const text = selection.text === LEGACY_DISABLED_TEXT ? undefined : selection.text

        if (text) {
          return {title: text, subtitle: destination || typeTitle}
        }
        return {title: destination || typeTitle, subtitle: destination ? typeTitle : undefined}
      },
    },

    components: {
      input: LinkInput,
    },
  })
}

/**
 * Registers two object types that share the same fields and input:
 * - `link`: link text plus a destination
 * - `linkOnly`: just the destination, for places where the text comes from elsewhere
 *
 * @public
 */
export const linkField = definePlugin<LinkFieldPluginOptions | void>((props) => {
  const {
    linkableSchemaTypes = ['page'],
    enableLinkParameters = true,
    enableAnchorLinks = true,
    customFields = [],
  } = props || {}

  const config = {linkableSchemaTypes, enableLinkParameters, enableAnchorLinks, customFields}

  return {
    name: 'link-field',
    schema: {
      types: [
        defineLinkType({...config, name: 'link', title: 'Link', includeText: true}),
        defineLinkType({...config, name: 'linkOnly', title: 'Link (no text)', includeText: false}),
      ],
    },
  }
})
