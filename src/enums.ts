const FORM_DOCUMENT_TYPES = {
  formEntry: 'formEntry',
  form: 'form',
} as const

const FORM_FIELD_TYPES = {
  formField: 'formField',
  formTextarea: 'formTextarea',
  formSelect: 'formSelect',
  formCheckbox: 'formCheckbox',
  formCheckboxGroup: 'formCheckboxGroup',
  formRadioButton: 'formRadioButton', //Hidden
  formRadioButtonGroup: 'formRadioButtonGroup',
  formGroupedCheckbox: 'formGroupedCheckbox', //Hidden
  formGroup: 'formGroup',
} as const

export type FormDocumentType = (typeof FORM_DOCUMENT_TYPES)[keyof typeof FORM_DOCUMENT_TYPES]
export type FormFieldType = (typeof FORM_FIELD_TYPES)[keyof typeof FORM_FIELD_TYPES]

export const FormDocumentTypeEnum = {
  enum: FORM_DOCUMENT_TYPES,
  options: Object.values(FORM_DOCUMENT_TYPES),
}

export const FormFieldEnum = {
  enum: FORM_FIELD_TYPES,
  options: Object.values(FORM_FIELD_TYPES),
}
