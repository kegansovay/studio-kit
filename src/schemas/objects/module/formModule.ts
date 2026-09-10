import type {ComponentType} from 'react'
import {defineField, defineType} from 'sanity'

import {FormDocumentTypeEnum} from '../../../enums'

export default (icon: ComponentType) =>
  defineType({
    name: 'formModule',
    type: 'object',
    icon,
    fields: [
      defineField({
        name: 'form',
        type: 'reference',
        to: [{type: FormDocumentTypeEnum.enum.form}],
      }),
    ],
    preview: {
      select: {
        title: 'form.formTitle',
      },
      prepare: ({title}: {title?: string}) => {
        return {
          title: 'Form',
          subtitle: title,
        }
      },
    },
  })
