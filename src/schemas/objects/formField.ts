import {IconType} from 'react-icons'
import {
  RiAtLine,
  RiCalendarLine,
  RiEyeOffLine,
  RiNumber7,
  RiPhoneLine,
  RiText,
  RiTimeLine,
} from 'react-icons/ri'
import {TbWorldWww} from 'react-icons/tb'
import {defineField, defineType} from 'sanity'

import {FormFieldEnum} from '../../enums'
import {formCommon} from '../common'

/** Alter the subtitle text label by the input type */
const labelSubtitleController = (type: string): string => {
  switch (type) {
    case 'url':
      return type.toUpperCase()
    case 'tel':
      return 'Phone'
    default:
      return type[0].toUpperCase() + type.slice(1) //Capitalise first letter
  }
}

/** Alter the icon by the input type */
const iconController = (type: string): IconType => {
  switch (type) {
    case 'email':
      return RiAtLine
    case 'tel':
      return RiPhoneLine
    case 'number':
      return RiNumber7
    case 'url':
      return TbWorldWww
    case 'date':
      return RiCalendarLine
    case 'time':
      return RiTimeLine
    case 'hidden':
      return RiEyeOffLine
    default:
      return RiText
  }
}

export default (fieldTypeOptions: Array<{title: string; value: string}>) =>
  defineType({
    name: FormFieldEnum.enum.formField,
    title: 'Input Field',
    type: 'object',
    icon: RiText,
    fields: [
      ...formCommon,
      defineField({
        name: 'fieldType',
        title: 'Field Type',
        description: 'Select a field type i.e. text, email, tel, number',
        type: 'string',
        options: {
          list: fieldTypeOptions,
        },
        initialValue: 'text',
        validation: (Rule) => Rule.required(),
      }),

      // Email field options
      // defineField({
      //   title: `Add as 'reply-to' email`,
      //   name: 'replyToEmail',
      //   type: 'boolean',
      //   hidden: ({parent}: {parent: {fieldType: string}}) => parent.fieldType !== 'email',
      // }),

      // Number field options
      defineField({
        title: `Minimum Number`,
        name: 'minNumber',
        type: 'number',
        hidden: ({parent}: {parent: {fieldType: string}}) => parent.fieldType !== 'number',
        validation: (rule) => rule.min(1),
      }),
      defineField({
        title: `Maximum Number`,
        name: 'maxNumber',
        type: 'number',
        hidden: ({parent}: {parent: {fieldType: string}}) => parent.fieldType !== 'number',
      }),

      // Hidden field options
      defineField({
        title: `Custom value`,
        name: 'hiddenFieldValue',
        type: 'string',
        hidden: ({parent}: {parent: {fieldType: string}}) => parent.fieldType !== 'hidden',
      }),

      defineField({
        title: 'Field Placeholder',
        name: 'fieldPlaceholder',
        type: 'string',
        description: 'Placeholder text (optional)',
      }),
    ],
    preview: {
      select: {
        title: 'fieldLabel',
        type: 'fieldType',
      },
      prepare({title, type}) {
        const mediaIcon = iconController(type)
        return {
          title: `Input - ${title}`,
          subtitle: `Type - ${labelSubtitleController(type)}`,
          media: mediaIcon,
        }
      },
    },
  })
