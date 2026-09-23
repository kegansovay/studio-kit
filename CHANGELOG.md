# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-09-22

### Added

- `enableManualLinks` option for `linkField()` (default `false`). When on, the link type dropdown gains a **Manual** option: a `path` string for a hand-typed route on the same site, stored alongside the other destinations and projected with `type == 'manual' => {"link": path}`

  The path must start with `/`, and can't start with `//` or contain spaces. Pasting a full `https://` URL gives an error that says to drop the origin. Nothing checks the path against the live site, which the field description says. Anchor and parameters apply; "open in new window" is hidden, as it is for internal links

## [2.0.1] - 2026-09-14

### Removed

- The default `description` that `defineSlug` added to the slug field. A `description` you pass yourself still shows

## [2.0.0] - 2026-09-10

Requires Sanity Studio 6.9.2 or later. Stay on 1.x for Sanity v4 and v5.

### Added

- `linkOnly` object type, registered by `linkField()` alongside `link`: the same destination fields without `text`
- `emojiIcon(emoji)` helper that turns an emoji into an icon component
- `formIcon` option for `FormBuilderPlugin` (an emoji or a component) for the `form` document and `formModule`
- `buildFullUrl(current, folder)` helper and `SlugFolder` type
- `defineSlug` keeps `slug.fullUrl` in sync: the input repairs a missing or outdated `fullUrl` when a document is opened, validation flags it, and the default field description explains how it's built

### Changed

- **Breaking:** peer dependencies are now `sanity ^6.9.2`, `react ^19.2` and `styled-components ^6.1.15`. styled-components used to be bundled into `dist`
- **Breaking:** the package is ESM only and needs Node 22.12 or later
- Upgraded to `@sanity/ui` 4, `@sanity/icons` 5 and `lucide-react` 1
- The `form` document and `formModule` use a 📝 icon by default
- `defineSlug` keeps your own `validation`, `readOnly` and `options.maxLength` instead of overwriting them, and `options.url` is optional
- `defineSlug` accepts a function for `options.folder`, which the input already supported
- Link previews show the referenced document's title or name
- `@sanity/util` and `speakingurl` are declared dependencies instead of being bundled, and `zod` is no longer used

### Removed

- **Breaking:** the link field's `options.disableText`. Use `type: 'linkOnly'` instead. Link previews ignore the `_disabled_` text it wrote
- Sanity v2 compatibility files (`sanity.json`, `v2-incompatible.js`) and `@sanity/incompatible-plugin`

### Fixed

- `slug.fullUrl` missed the folder when a folder function resolved after typing, and didn't update when the folder changed
- `defineSlug` crashed when `options.folder` was a function, and an empty folder produced URLs starting with `//`
- A custom `slugify` gets the slug source context instead of an empty object
- Link previews crashed when `type` was unset
- Removed debug `console.log` calls from the link input

### Security

- Refreshed the lockfile, which updates `browserslist` to 4.28.9. The remaining `npm audit` findings are in the Sanity CLI that the `sanity` dev dependency pulls in, and don't ship with the package

## [1.6.0] - 2026-03-12

### Changed

- **Breaking:** `CharacterCountInput` is a factory: use `CharacterCountInput(70)` instead of passing `CharacterCountInput` directly

### Removed

- **Breaking:** `noteField` and `defineNote`

## [1.4.0] - 2025-05-08

### Added

- Add customFields option to the plugin to add extra fields globally
- Added options: {disableText: true } to individual schema to optionally remove text input

## [1.3.1] - 2025-01-28

### Added

- Spread standard schema props for NoteField

## [1.3.0] - 2025-01-09

### Added

- LinkField remove relative and helper text for https

## [1.2.6] - 2024-11-04

### Added

- FormAction URL field

## [1.2.4] - 2024-11-01

### Added

- Enable Module option for FormBuilder

### Changed

- Enable module option for FormBuilder
- Change link icon
- Changed formSelect array to be 'selectOption'

## [1.2.0]

### Added

- FormBuilder Plugin

## [version]

### Added

- Features added

### Changed

- Changes in existing functionality

### Deprecated

- Features that will be removed in upcoming releases

### Removed

- Features that have been removed

### Fixed

- Bug fixes

### Security

- Vulnerability fixes
