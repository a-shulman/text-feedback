# @diplodoc/text-feedback

Diplodoc CLI extension that adds a floating feedback button when users select text in the documentation. Clicking the button opens a form where the user can report a typo, incorrect information, or other issue with the selected fragment.

## Installation

```bash
npm install @diplodoc/text-feedback
```

## Usage

Register the extension in your Diplodoc build script:

```typescript
import {Build} from '@diplodoc/cli';
import {Extension as TextFeedback} from '@diplodoc/text-feedback';

const build = new Build();
build.apply(new TextFeedback());
build.run();
```

Or in `.yfm` config (if your build script supports extension loading):

```yaml
textFeedback: https://your-backend.example.com/feedback
```

### CLI flag

```bash
yfm build -i ./docs -o ./build --text-feedback https://your-backend.example.com/feedback
```

## Configuration

### Short form (endpoint URL only)

```yaml
textFeedback: https://your-backend.example.com/feedback
```

### Full form (with Yandex Metrica)

```yaml
textFeedback:
  endpoint: https://your-backend.example.com/feedback
  metrika:
    counterId: 12345678
    goals:
      button: my-feedback-button   # default: selection-feedback-button
      submit: my-submit             # default: selection-submit
      cancel: my-cancel             # default: selection-cancel
```

### Config type

```typescript
type TextFeedbackObject = {
    endpoint: string;
    metrika?: {
        counterId: number;
        goals?: {
            button?: string;
            submit?: string;
            cancel?: string;
        };
    };
};

type Config = {
    textFeedback?: string | TextFeedbackObject;
};
```

## What it does

- Injects a browser script (`_extensions/feedback/feedback.js`) into every generated HTML page
- When a user selects 5+ characters of text within `.dc-doc-page__content`, a floating button appears near the selection
- The button auto-hides after 5 seconds if not clicked
- Clicking opens a form with issue type options (typo, incorrect info, missing example, bad graphics, other) plus optional comment and contact fields
- On submit, sends a POST request to the configured endpoint:

```json
{
    "url": "https://docs.example.com/page",
    "title": "Page title",
    "suggestion": "typo",
    "selected_text": "the selected fragment",
    "comment": "optional comment",
    "contact": "optional contact"
}
```

- Shows a success/error popup after submission
- Enforces a 7-second cooldown between submissions

## Package Structure

```
build/
├── index.js          # Node.js extension (CJS)
├── index.d.ts        # TypeScript declarations
├── config.d.ts
└── resources/
    └── feedback.js   # Browser bundle (IIFE, minified)
```

## Development

```bash
npm install
npm run build       # Build node + browser bundles + declarations
npm test            # Run tests
npm run typecheck   # Type check (node + browser)
```
