import {RiBillLine} from 'react-icons/ri'
import {defineField, defineType} from 'sanity'

import {FormFieldEnum} from '../../enums'
import {getFormFields} from '../common'

/** Remove the 'Form Group' option from the list fields you're able to insert */
const filteredFields = getFormFields().filter(function (field) {
  return field.type !== FormFieldEnum.enum.formGroup
})

export default defineType({
  name: FormFieldEnum.enum.formGroup,
  title: 'Form Group',
  type: 'object',
  icon: RiBillLine,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A short description about this group of fields (optional)',
      type: 'string',
    }),
    defineField({
      name: 'fields',
      type: 'array',
      of: filteredFields,
    }),
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare({title}: {title: string; subtitle?: string}) {
      return {
        title,
        subtitle: 'A group of fields',
      }
    },
  },
})
