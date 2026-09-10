import {Box, Flex, Stack, Text} from '@sanity/ui'
import type {ReactElement} from 'react'
import {
  type FieldMember,
  FormFieldValidationStatus,
  ObjectInputMember,
  type ObjectInputProps,
  type ObjectMember,
} from 'sanity'
import {styled} from 'styled-components'

const ValidationErrorWrapper = styled(Box)`
  contain: size;
  margin-bottom: 6px;
  margin-left: auto;
  margin-right: 12px;
`

const FullWidthStack = styled(Stack)`
  width: 100%;
`

/** Fields that hold the link destination. Only the one matching `type` is visible at a time. */
const DESTINATION_FIELDS = new Set(['internalLink', 'url', 'email', 'phone'])

function isFieldMember(member: ObjectMember): member is FieldMember {
  return member.kind === 'field'
}

/** Drops a member's label so its input can sit inline next to another one */
function withoutTitle(member: FieldMember): FieldMember {
  return {
    ...member,
    field: {...member.field, schemaType: {...member.field.schemaType, title: undefined}},
  }
}

/**
 * Custom input component for the `link` and `linkOnly` objects.
 * Renders the type and destination fields next to each other, with the destination's description
 * and validation errors below them. `text` (on `link` only) and the other fields render as usual.
 */
export function LinkInput(props: ObjectInputProps): ReactElement {
  const {
    members,
    renderAnnotation,
    renderBlock,
    renderField,
    renderInlineBlock,
    renderInput,
    renderItem,
    renderPreview,
  } = props
  const renderProps = {
    renderAnnotation,
    renderBlock,
    renderField,
    renderInlineBlock,
    renderInput,
    renderItem,
    renderPreview,
  }

  const fieldMembers = members.filter(isFieldMember)
  const textMember = fieldMembers.find((member) => member.name === 'text')
  const typeMember = fieldMembers.find((member) => member.name === 'type')
  const destinationMember = fieldMembers.find((member) => DESTINATION_FIELDS.has(member.name))
  const otherMembers = members.filter(
    (member) => member !== textMember && member !== typeMember && member !== destinationMember,
  )

  const validation = destinationMember?.field.validation ?? []
  const description = destinationMember?.field.schemaType.description

  return (
    <Stack gap={4}>
      {textMember && <ObjectInputMember member={textMember} {...renderProps} />}

      <Stack gap={3}>
        <Text as="label" weight="medium" size={1}>
          Link
        </Text>

        {validation.length > 0 && (
          <ValidationErrorWrapper>
            <FormFieldValidationStatus fontSize={1} placement="top-start" validation={validation} />
          </ValidationErrorWrapper>
        )}

        <Flex gap={2} align="center">
          {typeMember && <ObjectInputMember member={withoutTitle(typeMember)} {...renderProps} />}

          {destinationMember && (
            <FullWidthStack gap={2}>
              <ObjectInputMember member={withoutTitle(destinationMember)} {...renderProps} />
            </FullWidthStack>
          )}
        </Flex>

        {description && (
          <Text muted size={1}>
            {description}
          </Text>
        )}
      </Stack>

      {otherMembers.map((member) => (
        <ObjectInputMember key={member.key} member={member} {...renderProps} />
      ))}
    </Stack>
  )
}
