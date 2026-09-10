import {Box, Flex, Stack, Text} from '@sanity/ui'
import React, {useEffect} from 'react'
import {
  type FieldMember,
  FormFieldValidationStatus,
  ObjectInputMember,
  ObjectInputProps,
  PatchEvent,
  set,
} from 'sanity'
import styled from 'styled-components'

import {LinkValue} from '../types'

const ValidationErrorWrapper = styled(Box)`
  contain: size;
  margin-bottom: 6px;
  margin-left: auto;
  margin-right: 12px;
`

const FullWidthStack = styled(Stack)`
  width: 100%;
`

/**
 * Custom input component for the link object.
 * Nicely renders the type and link fields next to each other, with the
 * description and any validation errors for the link field below them.
 *
 * The rest of the fields ("blank" and "advanced") are rendered as usual.
 */
export function LinkInput(props: ObjectInputProps<LinkValue>): React.ReactElement {
  const [textField, typeField, linkField, ...otherFields] = props.members as FieldMember[]
  const {value, onChange} = props

  const disableText = props.schemaType.options?.disableText

  // Set a default value for text if disableText is true
  useEffect(() => {
    if (disableText && (!value?.text || value.text === '')) {
      // Create a patch to set a placeholder value
      const patch = PatchEvent.from(set('_disabled_', ['text']))
      onChange(patch)
    }
  }, [disableText, value?.text, onChange])

  const {
    field: {
      validation: linkFieldValidation,
      schemaType: {description: linkFieldDescription},
    },
  } = linkField

  const description = linkFieldDescription

  const renderProps = {
    renderAnnotation: props.renderAnnotation,
    renderBlock: props.renderBlock,
    renderField: props.renderField,
    renderInlineBlock: props.renderInlineBlock,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  }

  return (
    <Stack gap={4}>
      {/* Only render text field if not disabled */}

      {!disableText && (
        <ObjectInputMember
          member={{
            ...textField,
            field: {
              ...textField.field,
              schemaType: {
                ...textField.field.schemaType,
                title: textField.field.schemaType.title,
              },
            },
          }}
          {...renderProps}
        />
      )}

      <Stack gap={3}>
        <Text as="label" weight="medium" size={1}>
          Link
        </Text>

        {/* Render any validation errors for the link field */}
        {linkFieldValidation.length > 0 && (
          <ValidationErrorWrapper>
            <FormFieldValidationStatus
              fontSize={1}
              placement="top-start"
              validation={linkFieldValidation}
            />
          </ValidationErrorWrapper>
        )}

        <Flex gap={2} align="center">
          {/* Render the type field (without its label) */}
          <ObjectInputMember
            member={{
              ...typeField,
              field: {
                ...typeField.field,
                schemaType: {
                  ...typeField.field.schemaType,
                  title: undefined,
                },
              },
            }}
            {...renderProps}
          />

          <FullWidthStack gap={2}>
            {/* Render the input for the selected type of link (withouts its label) */}
            <ObjectInputMember
              member={{
                ...linkField,
                field: {
                  ...linkField.field,
                  schemaType: {
                    ...linkField.field.schemaType,
                    title: undefined,
                  },
                },
              }}
              {...renderProps}
            />
          </FullWidthStack>
        </Flex>

        {/* Render the description of the selected link field, if any */}
        {description && (
          <Text muted size={1}>
            {description}
          </Text>
        )}
      </Stack>

      {/* Render the rest of the fields as usual */}
      {otherFields.map((field) => (
        <ObjectInputMember key={field.key} member={field} {...renderProps} />
      ))}
    </Stack>
  )
}
