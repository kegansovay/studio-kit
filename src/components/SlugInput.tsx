import {Box, Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {Code} from '@sanity/ui/code'
import {type ChangeEvent, type FocusEvent, type ReactElement, useCallback} from 'react'
import {styled} from 'styled-components'

import type {ExtendedSlugInputProps} from '../types'
import {usePrefixLogic} from '../utils/usePrefixLogic'

const UrlPrefix = styled(Card)`
  flex: 0 1 min-content;

  pre {
    padding: 1em 0;
  }

  pre,
  code {
    overflow: hidden;
    white-space: nowrap;
    max-width: 30ch;
    text-overflow: ellipsis;
  }

  // When no generate button is available, make it bigger
  &[data-no-generate='true'] {
    pre,
    code {
      max-width: 35ch;
    }
  }
`

/**
 * Custom slug component for better UX & safer slugs:
 * - shows the final URL for the relative address (adds the BASE.PATH/ at the start)
 * - removes special characters and starting/trailing slashes
 * - keeps `fullUrl` in sync with the folder and `current`
 */
export default function SlugInput(props: ExtendedSlugInputProps): ReactElement {
  const {elementProps, readOnly, schemaType, url, value} = props
  const {onBlur: onElementBlur} = elementProps
  const baseUrl = url.endsWith('/') ? url : `${url}/`

  const {prefix, generateSlug, updateValue, formatSlug} = usePrefixLogic(props)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => updateValue(event.currentTarget.value),
    [updateValue],
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      formatSlug(event.currentTarget.value).catch((error: unknown) => {
        console.error(`[thread-kit] Couldn't format the slug:`, error)
      })
      onElementBlur(event)
    },
    [formatSlug, onElementBlur],
  )

  const handleGenerate = useCallback(() => {
    generateSlug().catch((error: unknown) => {
      console.error(`[thread-kit] Couldn't generate the slug:`, error)
    })
  }, [generateSlug])

  return (
    <Stack gap={3}>
      <Text size={1}>
        {/* Slice off the prefix's initial slash, baseUrl already ends with one */}
        {`${baseUrl}${prefix.slice(1)}${value?.current ?? ''}`}
      </Text>
      <Flex style={{gap: '0.5em'}} align="center">
        {prefix !== '/' && (
          <UrlPrefix data-no-generate={!schemaType.options?.source}>
            <Code size={2}>{prefix.slice(1)}</Code>
          </UrlPrefix>
        )}
        <Box flex={3}>
          <TextInput
            value={value?.current ?? ''}
            readOnly={readOnly}
            {...elementProps}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Box>
        {schemaType.options?.source && (
          <Button
            mode="ghost"
            type="button"
            disabled={readOnly}
            onClick={handleGenerate}
            text="Generate"
          />
        )}
      </Flex>
    </Stack>
  )
}
