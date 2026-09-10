import {PencilIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'

import {FormDocumentTypeEnum} from '../../enums'
import {getFormFields} from '../common'

export default defineType({
  name: FormDocumentTypeEnum.enum.form,
  title: 'Forms',
  type: 'document',
  icon: PencilIcon,
  fields: [
    defineField({
      name: 'formTitle',
      title: 'Form Title',
      description: 'The title of the form',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Form description',
      description: 'A short description about this form',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'formAction',
      title: 'Form Action URL',
      type: 'string',
    }),

    // defineField({
    //   name: 'emailTo',
    //   title: 'Email To',
    //   description: 'The email address(s) to which this form will be sent to',
    //   type: 'array',
    //   of: [defineArrayMember({type: 'string'})],
    //   options: {
    //     layout: 'tags',
    //   },
    //   validation: (Rule) =>
    //     Rule.custom((values) => {
    //       //if (!values) return 'Please enter at least one email address'
    //       if (!emailFieldSchema.safeParse(values).success) {
    //         return 'Please ensure all items are valid email addresses'
    //       }

    //       return true
    //     }),
    // }),

    // defineField({
    //   name: 'emailSubject',
    //   title: 'Email Subject',
    //   description: 'Custom email subject',
    //   type: 'string',
    // }),
    defineField({
      name: 'formFields',
      title: 'Form Fields',
      description: 'Add form fields',
      type: 'array',
      of: [...getFormFields()],
    }),
  ],
})
