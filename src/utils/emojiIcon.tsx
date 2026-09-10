import type {ComponentType, CSSProperties} from 'react'

const emojiStyle: CSSProperties = {
  fontSize: '1.15em',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

/**
 * Turns an emoji into an icon component. Sanity renders `icon` as `<Icon />`, so a plain emoji
 * string doesn't render. Use it anywhere Sanity expects an icon component: schema `icon`, field
 * groups, preview `media`, structure `.icon()` and document actions.
 *
 * @example
 * ```ts
 * defineType({name: 'page', type: 'document', icon: emojiIcon('🖥️'), fields: []})
 * ```
 * @public
 */
export function emojiIcon(emoji: string): ComponentType {
  function EmojiIcon() {
    return (
      <span style={emojiStyle} aria-hidden>
        {emoji}
      </span>
    )
  }
  EmojiIcon.displayName = 'EmojiIcon'
  return EmojiIcon
}
