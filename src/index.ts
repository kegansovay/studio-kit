import {definePlugin} from 'sanity'

import {FormDocumentType, FormDocumentTypeEnum, FormFieldEnum, FormFieldType} from './enums'
import formDocument from './schemas/documents/form'
import formCheckbox from './schemas/objects/formCheckbox'
import formCheckboxGroup from './schemas/objects/formCheckboxGroup'
import formField from './schemas/objects/formField'
import formGroup from './schemas/objects/formGroup'
import formRadioButton from './schemas/objects/formRadioButton'
import formRadioButtonGroup from './schemas/objects/formRadioButtonGroup'
import formSelect from './schemas/objects/formSelect'
import formTextarea from './schemas/objects/formTextarea'
import formModule from './schemas/objects/module/formModule'
import {FormBuilderPluginOptions} from './types'

/* ------------- Character Input, Link Field and helper objects ------------- */
/** @public */ export {CharacterCountInput} from './components/CharacterCountInput'
/** @public */ export {linkField} from './schemas/objects/linkField'
/** @public */ export {defineSlug} from './utils'
/** @public */ export type {SlugParams, SlugFieldOverrides} from './types'

/* ------------------------ Form Builder Plugin below ----------------------- */

/** @public */
export const FormBuilderPlugin = definePlugin<FormBuilderPluginOptions | void>((props) => {
  const {
    enableModule = false,
    additionalFieldTypes = [],
    additionalSelectPresets = [],
  } = props || {}

  const defaultFieldTypes = [
    {title: 'Text', value: 'text'},
    {title: 'Email', value: 'email'},
    {title: 'Telephone', value: 'tel'},
    {title: 'Number', value: 'number'},
    {title: 'URL', value: 'url'},
    {title: 'Hidden', value: 'hidden'},
  ]
  const defaultSelectPresets = [
    {title: 'Countries', value: 'countries'},
    {title: 'Currencies', value: 'currencies'},
  ]

  const fieldTypes = [...defaultFieldTypes, ...additionalFieldTypes]
  const selectPresets = [...defaultSelectPresets, ...additionalSelectPresets]
  const enabledTypes = enableModule ? [formModule] : []

  return {
    name: 'form-builder',
    schema: {
      types: [
        formDocument,
        formField(fieldTypes),
        formTextarea,
        formSelect(selectPresets),
        formCheckbox,
        formCheckboxGroup,
        formRadioButton,
        formRadioButtonGroup,
        formGroup,
        ...enabledTypes,
      ],
    },
  }
})

/** @public */
export const FormBuilderEnums = {
  documents: FormDocumentTypeEnum.enum,
  fields: FormFieldEnum.enum,
}

/** @public */
export type FormBuilderEnumsType = {
  documents: FormDocumentType
  fields: FormFieldType
}
