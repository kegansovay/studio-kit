# @madebythread/thread-kit

A collection of opinionated plugins, fields, & components for building in Sanity Studio. Some plugins have been adapted from various users to better fit our needs.

## Installation

```sh
npm install @madebythread/thread-kit
```

## Features & Usage

### Character Count Input

Adds a little character count tag to a text or string field.

Add as a component input:

- The character limit is pulled from .max() rule. The default is 160

```ts
import { CharacterCountInput } from '@madebythread/thread-kit'

defineField({
  name: 'title',
  type: 'string',
  components: {input: CharacterCountInput},
  validation: (Rule) => Rule.required().max(70),
}),
```

### Link

**All credit to [Sanity Plugin Link Field](https://github.com/winteragency/sanity-plugin-link-field)** – This is just a modified/simplified version of their plugin. See their documentation for more.

###### Modifications:

- No custom Links
- Adjusted input styling
- Text by default
- Validation requirements for all fields

Setup plugin in `sanity.config.ts`:

```ts
import {linkField} from '@madebythread/thread-kit'

export default defineConfig({
  //...
  plugins: [
    //...
    linkField({
      linkableSchemaTypes: pageTypes,
      enableAnchorLinks: false, //optional default is true
      enableLinkParameters: false, //optional default is true
    }),
  ],
})
```

### defineSlug

This is a slug input field that allows for folder a prefix.
This component is dapted from hdoro's [slug plugin](https://github.com/hdoro/sanity-plugin-prefixed-slug)

For frontend: can query for `slug.fullUrl` and get the prefix. But you still have access to `slug.current`

```ts
import { defineSlug } from '@madebythread/thread-kit'

defineSlug({
  name: 'slug', //required
  options: {
    url: URL, //required to show full url
    folder: 'podcast/media', //optional
    locked: true, //optional
  },
}),
```

### Forms

_Coming Soon_

## License

[MIT](LICENSE) © Kegan Sovay

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
