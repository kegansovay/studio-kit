import {Stack} from '@sanity/ui'
import React from 'react'
import type {StringInputProps} from 'sanity'

/**
 * Returns a character count input component for use as a string field's input.
 * Set `components.input` to CharacterCountInput(maxCount), e.g. CharacterCountInput(70).
 * @param maxCount - Maximum character count to display (and used for overflow styling). Default 160.
 * @public
 */
export function CharacterCountInput(maxCount: number = 160) {
  function CharacterCountInputComponent(props: StringInputProps): React.ReactElement {
    return (
      <Stack gap={3}>
        <div>
          <div
            style={{
              display: 'inline-block',
              padding: '0.15rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              borderRadius: '.2rem',
              fontSize: '0.75rem',
              border:
                props.value?.length && props.value.length > maxCount
                  ? '1px solid #f76d5f'
                  : '1px solid',
            }}
          >
            {props.value?.length ? props.value.length : '0'}/{maxCount}
          </div>
        </div>

        {props.renderDefault(props)}
      </Stack>
    )
  }
  CharacterCountInputComponent.displayName = 'CharacterCountInput'
  return CharacterCountInputComponent
}
