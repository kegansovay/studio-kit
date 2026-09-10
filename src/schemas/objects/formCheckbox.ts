import {RiCheckboxLine} from 'react-icons/ri'
import {defineField, defineType} from 'sanity'

import {FormFieldEnum} from '../../enums'
import {formCommon} from '../common'

export default defineType({
  name: FormFieldEnum.enum.formCheckbox,
  title: 'Single Checkbox',
  type: 'object',
  icon: RiCheckboxLine,
  fields: [
    ...formCommon,
    defineField({
      title: 'Value',
      name: 'value',
      type: 'string',
      description: 'The value this checkbox represents',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Default checked',
      name: 'checkedDefault',
      description: 'Set this to be the initially checked',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'fieldLabel',
      options: 'options',
    },
    prepare({title}: {title?: string}) {
      return {title}
    },
  },
})
