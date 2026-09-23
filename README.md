# @kegansovay/studio-kit

A collection of opinionated plugins, fields, & components for building in Sanity Studio. Some plugins have been adapted from various users to better fit our needs.

## Compatibility

| thread-kit | Sanity Studio  | Notes                                    |
| ---------- | -------------- | ---------------------------------------- |
| 2.x        | 6.9.2 or later | ESM only, React 19.2+, Node 22.12+       |
| 1.x        | v4 and v5      | `npm install @kegansovay/studio-kit@1` |

## Installation

```sh
npm install @kegansovay/studio-kit
```

`sanity`, `react` and `styled-components` are peer dependencies, which every Sanity Studio already has.

## Features & Usage

### Character Count Input

Adds a character count tag above a string or text field. Pass the limit to `CharacterCountInput()`; the default is 160.

```ts
import {CharacterCountInput} from '@kegansovay/studio-kit'

defineField({
  name: 'title',
  type: 'string',
  components: {input: CharacterCountInput(70)},
  validation: (rule) => rule.required().max(70),
})
```

### Link

**All credit to [Sanity Plugin Link Field](https://github.com/winteragency/sanity-plugin-link-field)** – This is just a modified/simplified version of their plugin. See their documentation for more.

###### Modifications:

- No custom Links
- Adjusted input styling
- Text by default, or no text with `linkOnly`
- Validation requirements for all fields

Setup plugin in `sanity.config.ts`:

```ts
import {linkField} from '@kegansovay/studio-kit'

export default defineConfig({
  //...
  plugins: [
    //...
    linkField({
      linkableSchemaTypes: pageTypes,
      enableAnchorLinks: false, //optional default is true
      enableLinkParameters: false, //optional default is true
      enableManualLinks: true, //optional default is false
    }),
  ],
})
```

The plugin registers two object types with the same input:

| Type       | Fields                                  | Use it for                                          |
| ---------- | --------------------------------------- | --------------------------------------------------- |
| `link`     | `text`, `type` and the link destination | Buttons and text links                              |
| `linkOnly` | `type` and the link destination         | Cards, images and links whose label comes elsewhere |

```ts
defineField({name: 'cta', type: 'link'})
defineField({name: 'cardLink', type: 'linkOnly'})
```

Apart from `text`, both store the same fields, so one GROQ projection works for both.

#### Manual links

`enableManualLinks: true` adds a **Manual** option to the link type dropdown: a plain text field for a path on this site, stored as `path`.

Use it for routes that aren't Sanity documents — a Shopify collection, an app route, a page handled outside the CMS. Prefer an internal link when the destination is a document, since that keeps the reference intact when the slug changes.

The path must start with `/`, must not start with `//`, and must not contain spaces. Nothing checks it against the live site, so a typo ships as a 404 — the field description says as much under the input. **Anchor** and **Parameters** are available on a manual link; **Open in new window** isn't, same as internal links.

```groq
type == 'manual' => {
  "link": path,
}
```

> **Upgrading from 1.x:** the `options: {disableText: true}` field option is gone. Use `type: 'linkOnly'` instead. The old option wrote `text: "_disabled_"` into documents; link previews ignore it, but unset it anywhere your frontend renders `text`.

### defineSlug

A slug field with a folder prefix, adapted from hdoro's [slug plugin](https://github.com/hdoro/sanity-plugin-prefixed-slug).

It stores `slug.current` plus `slug.fullUrl`, the path your frontend can route on: the folder followed by `slug.current`, always starting with `/`.

```ts
import {defineSlug} from '@kegansovay/studio-kit'

defineSlug({
  name: 'slug', // optional, default 'slug'
  options: {
    url: 'https://example.com', // optional, shown in front of the path
    folder: 'podcast/media', // optional, a string or (document) => string | Promise<string>
    locked: true, // optional, boolean or ({document}) => boolean, makes the field read-only
    source: 'title', // optional, default 'name'
  },
})

// → {_type: 'slug', current: 'episode-1', fullUrl: '/podcast/media/episode-1'}
```

The slug is always required. Any `validation` you pass is added on top.

#### Keeping `fullUrl` in sync

The Studio input writes `fullUrl`, so documents created elsewhere, for example by AI agents through the Sanity MCP server, scripts or the HTTP API, don't have it until something sets it. `defineSlug` covers this in two ways:

- **The input repairs it.** When a document is opened in the Studio and its `fullUrl` is missing or out of date (for example because its folder changed), the input rewrites it. On a published document that creates a draft to publish. Locked, read-only slugs are left alone.
- **Validation flags it.** A missing or wrong `fullUrl` is a validation error, so it blocks publishing from the Studio and shows up in `sanity documents validate`.

When you create documents in code, build the value with `buildFullUrl`:

```ts
import {buildFullUrl} from '@kegansovay/studio-kit'

buildFullUrl('episode-1', 'podcast/media') // '/podcast/media/episode-1'
```

### Forms

`FormBuilderPlugin` registers a `form` document and the field types it uses.

```ts
import {FormBuilderPlugin} from '@kegansovay/studio-kit'

export default defineConfig({
  //...
  plugins: [
    FormBuilderPlugin({
      enableModule: true, // optional, registers `formModule`
      formIcon: '📝', // optional, emoji or icon component for `form` and `formModule`
      additionalFieldTypes: [{title: 'Date', value: 'date'}], // optional
      additionalSelectPresets: [{title: 'Languages', value: 'languages'}], // optional
    }),
  ],
})
```

`formModule` is an object holding a reference to a `form` document, for page builders:

```ts
defineField({name: 'pageBuilder', type: 'array', of: [{type: 'formModule'}]})
```

> **`formModule` only exists with `enableModule: true`.** Without it, any schema that uses `{type: 'formModule'}` fails with "formModule is not a type".

### emojiIcon

Sanity renders `icon` as a component, so a plain emoji string doesn't show up. `emojiIcon` turns an emoji into an icon component you can use for schema types, field groups, preview `media`, structure list items and document actions.

```ts
import {emojiIcon} from '@kegansovay/studio-kit'

defineType({
  name: 'page',
  type: 'document',
  icon: emojiIcon('🖥️'),
  fields: [
    //...
  ],
})
```

## License

[MIT](LICENSE) © Kegan Sovay

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugins/tree/main/packages/%40sanity/plugin-kit) for verification, linking and linting (oxlint and oxfmt), and [@sanity/pkg-utils](https://github.com/sanity-io/pkg-utils) to build.

```sh
npm run build # verify the package and build dist
npm run lint
npm run format
npm run link-watch # test in a local Studio with hot reload
```
