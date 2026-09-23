import {ChevronDownIcon} from '@sanity/icons/ChevronDown'
import {Button} from '@sanity/ui'
import {Menu, MenuButton, MenuItem} from '@sanity/ui/menu'
import {AtSignIcon, GlobeIcon, LinkIcon, PhoneIcon, RouteIcon} from 'lucide-react'
import React, {ComponentType} from 'react'
import {set, type StringInputProps} from 'sanity'
import {styled} from 'styled-components'

import {LinkFieldPluginOptions} from '../types'

export interface LinkType {
  title: string
  value: string
  icon: ComponentType
}

const defaultLinkTypes: LinkType[] = [
  {title: 'Internal', value: 'internal', icon: LinkIcon},
  {title: 'Manual', value: 'manual', icon: RouteIcon},
  {title: 'URL', value: 'external', icon: GlobeIcon},
  {title: 'Email', value: 'email', icon: AtSignIcon},
  {title: 'Phone', value: 'phone', icon: PhoneIcon},
]

// `&&` raises specificity above @sanity/ui's static button and menu styles
const LinkTypeButton = styled(Button)`
  && {
    height: 100%;
    padding: 0.2rem;
  }
  svg.lucide {
    width: 1rem;
    height: 1rem;
  }
`

const LinkTypeMenuItem = styled(MenuItem)`
  && svg.lucide {
    width: 1rem;
    height: 1rem;
  }
`

/**
 * Custom input component for the "type" field on the link object.
 * Renders a button with an icon and a dropdown menu to select the link type.
 */
export function LinkTypeInput({
  value,
  onChange,
  linkableSchemaTypes,
  enableManualLinks,
}: StringInputProps & {
  linkableSchemaTypes: LinkFieldPluginOptions['linkableSchemaTypes']
  enableManualLinks?: LinkFieldPluginOptions['enableManualLinks']
}): React.ReactElement {
  // Disable internal links if not enabled for any schema types, and manual links unless opted in
  const linkTypes = defaultLinkTypes.filter((type) => {
    if (type.value === 'internal') return linkableSchemaTypes?.length > 0
    if (type.value === 'manual') return !!enableManualLinks
    return true
  })

  const selectedType = linkTypes.find((type) => type.value === value) || linkTypes[0]

  return (
    <MenuButton
      button={
        <LinkTypeButton
          type="button"
          mode="ghost"
          icon={<selectedType.icon />}
          iconRight={<ChevronDownIcon />}
          title="Select link type"
          aria-label={`Select link type (currently: ${selectedType.title})`}
        />
      }
      id="link-type"
      menu={
        <Menu>
          {linkTypes.map((type) => (
            <LinkTypeMenuItem
              key={type.value}
              text={type.title}
              icon={<type.icon />}
              onClick={() => {
                onChange(set(type.value))
              }}
            />
          ))}
        </Menu>
      }
    />
  )
}
