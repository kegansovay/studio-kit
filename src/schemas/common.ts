import {defineArrayMember, defineField} from 'sanity'

import {FormFieldEnum} from '../enums'

export const formCommon = [
  defineField({
    name: 'fieldLabel',
    title: 'Field Label',
    type: 'string',
    description: 'Text label that describes this field',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    title: 'Field Hint Message',
    name: 'fieldHintMessage',
    type: 'string',
    description: 'A message to help user understand the field (optional)',
    hidden: ({parent}) => {
      if (
        parent._type === FormFieldEnum.enum.formRadioButton ||
        parent._type === FormFieldEnum.enum.formGroupedCheckbox
      ) {
        return true
      }
      return false
    },
  }),
  defineField({
    title: 'Required Field',
    name: 'required',
    type: 'boolean',
    initialValue: false,

    hidden: ({parent}) => {
      if (
        parent._type === FormFieldEnum.enum.formCheckboxGroup ||
        parent._type === FormFieldEnum.enum.formRadioButton ||
        parent._type === FormFieldEnum.enum.formGroupedCheckbox
      ) {
        return true
      }
      return false
    },
  }),
]

/** Retrieve the custom form field types */
export function getFormFields() {
  return FormFieldEnum.options
    .filter((item) => {
      // Remove the checkboxes and radio buttons of the grouped modules
      if (
        item === FormFieldEnum.enum.formRadioButton ||
        item === FormFieldEnum.enum.formGroupedCheckbox
      ) {
        return false
      }
      return true
    })
    .map((field) => defineArrayMember({type: field}))
}
