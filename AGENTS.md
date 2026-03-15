# AGENTS.md - Project Context and Best Practices

## Project Overview

**Try TypeScript** is an interactive platform for learning TypeScript. The project aims to help people enter the world of programming through hands-on, engaging TypeScript lessons.

### Core Features
- 150 interactive lessons (Portuguese + English)
- In-browser code execution
- Monaco Editor with syntax highlighting
- GitHub OAuth authentication
- Progress tracking with confetti celebrations
- Mobile-first responsive design

---

## Code Standards

### Language
- **Code**: English
- **Comments**: English
- **UI Translations**: English and Portuguese (for lessons)
- **Variable/Function Names**: English (camelCase)

### Tech Stack
- TypeScript (strict mode)
- React 19
- Vite 8
- TailwindCSS 4
- Monaco Editor
- Cloudflare Workers (for OAuth)

---

## Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Run linter (REQUIRED before commit)
npm run lint

# Auto-fix formatting (REQUIRED before commit)
npm run format

# Preview production build
npm run preview
```

---

## Best Practices

### Before Committing
1. Run `npm run lint` - Must pass with 0 errors
2. Run `npm run format` - Must pass with 0 errors
3. Test the build with `npm run build`

### Code Style
- Use oxlint for linting
- Use oxfmt for formatting
- Follow TypeScript strict mode
- Use meaningful variable names
- Add comments for complex logic

### Git Commits
Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `chore:` for maintenance
- `refactor:` for code improvements

### Adding New Lessons

1. Add lesson to `src/data/lessons/lessons.ts` (Portuguese)
2. Add translation to `src/data/lessons/lessons-en.ts` (English)
3. Add UI strings to `src/i18n/ptBR.ts` and `src/i18n/en.ts`
4. Test locally

### Lesson Structure
```typescript
{
  id: number,           // Unique sequential ID
  title: string,        // Lesson title
  level: "basic" | "medium" | "advanced",
  content: string,      // Explanation
  task: string,         // What user should do
  hint: string,         // Optional hint
  starterCode: string   // Initial code
}
```

---

## File Structure

```
src/
├── App.tsx              # Main application
├── callback.tsx         # OAuth callback handler
├── main.tsx            # Entry point
├── index.css           # Global styles
├── data/lessons/       # Lesson content
│   ├── types.ts        # Type definitions
│   ├── lessons.ts      # Portuguese lessons
│   ├── lessons-en.ts  # English lessons
│   └── index.ts        # Export functions
└── i18n/              # Translations
    ├── index.ts        # i18n logic
    ├── en.ts           # English strings
    └── ptBR.ts         # Portuguese strings
```

---

## Environment Variables

When deploying, set these environment variables:

```env
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_AUTH_WORKER_URL=your_cloudflare_worker_url
```

---

## Common Issues

### Monaco Editor not loading
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

### Build warnings about chunk size
- Consider code splitting for Monaco Editor (future improvement)

### TypeScript errors
- Ensure `tsc -b` passes before committing

---

## Contact

For questions or contributions, open an issue on GitHub.
