# Try TypeScript

<p align="center">
  <img src="https://try-typescript.com/favicon.svg" alt="Try TypeScript Logo" width="80" />
</p>

<p align="center">
  <strong>Learn TypeScript interactively - for free!</strong>
</p>

<p align="center">
  <a href="https://try-typescript.com">
    <img src="https://img.shields.io/badge/Live Demo-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/rodrigooler/try-typescript/stargazers">
    <img src="https://img.shields.io/github/stars/rodrigooler/try-typescript?style=for-the-badge" alt="Stars" />
  </a>
  <a href="https://github.com/rodrigooler/try-typescript/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </a>
</p>

---

## About The Project

**Try TypeScript** is an interactive platform designed to help people enter the world of programming through TypeScript in an easy and engaging way.

### Our Mission

We believe that learning to code should be accessible to everyone. Our goal is to:

- Lower the barrier to entry for aspiring developers
- Provide hands-on practice with real code execution
- Support multiple languages (English & Portuguese)
- Create a fun, gamified learning experience

### Why TypeScript?

TypeScript is one of the most in-demand programming languages today, used by companies like Google, Microsoft, Airbnb, and many more. Learning TypeScript opens doors to:

- Frontend development (React, Vue, Angular)
- Backend development (Node.js, Deno)
- Full-stack careers
- Better job opportunities and higher salaries

### Features

- 🎯 **150+ Interactive Lessons** - From basics to advanced topics
- 🖥️ **In-Browser Code Editor** - Full syntax highlighting with Monaco Editor
- ⚡ **Real-Time Execution** - Run TypeScript code instantly
- 🌐 **Bilingual Support** - Available in English and Portuguese
- 🎉 **Gamification** - Progress tracking and celebration animations
- 📱 **Mobile-First Design** - Learn on any device
- 🔒 **GitHub OAuth** - Secure authentication system
- 🆓 **100% Free** - No paywalls, ever

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rodrigooler/try-typescript.git

# Navigate to the project
cd try-typescript

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

---

## Project Structure

```
try-typescript/
├── public/
│   └── favicon.svg          # TypeScript favicon
├── src/
│   ├── data/
│   │   └── lessons/         # Lesson content
│   │       ├── lessons.ts   # Portuguese lessons
│   │       ├── lessons-en.ts # English lessons
│   │       └── types.ts     # Type definitions
│   ├── i18n/
│   │   ├── index.ts         # i18n configuration
│   │   ├── en.ts            # English translations
│   │   └── ptBR.ts          # Portuguese translations
│   ├── App.tsx              # Main application
│   ├── callback.tsx         # OAuth callback handler
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── workers/
│   └── oauth.ts             # GitHub OAuth Worker
├── index.html               # HTML template with SEO
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md
```

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Help us identify and fix issues
- 💡 **Suggest Features** - Share your ideas for improvements
- 📝 **Add Lessons** - Create new TypeScript tutorials
- 🌍 **Translate** - Add more language support
- 🎨 **Improve UI/UX** - Make the platform more beautiful
- 📖 **Improve Documentation** - Help others get started

### Contributing Guide

1. **Fork the Repository**

   ```bash
   git fork https://github.com/rodrigooler/try-typescript
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Run `npm run lint` before committing
   - Ensure `npm run build` passes

4. **Commit Your Changes**

   ```bash
   git commit -m "Add amazing new feature"
   ```

5. **Push to GitHub**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

---

## Pull Request Template

```markdown
## Description

<!-- Briefly describe what this PR does -->

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Documentation update
- [ ] 🎨 Style change
- [ ] ♻️ Code refactor

## Testing

<!-- Describe testing you performed -->

## Screenshots (if applicable)

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix works
- [ ] New and existing unit tests pass locally
```

---

## Code Style

We use modern tools to maintain code quality:

- **Linting**: oxlint
- **Formatting**: oxfmt
- **TypeScript**: Strict mode enabled

```bash
# Check code style
npm run lint

# Auto-fix formatting
npm run format
```

---

## Supported Languages

| Language        | Code    | Status      |
| --------------- | ------- | ----------- |
| English         | `en`    | ✅ Complete |
| Portuguese (BR) | `pt-BR` | ✅ Complete |

Want to add a new language? See our [i18n guide](./docs/i18n.md) (coming soon).

---

## Roadmap

- [ ] Add more advanced lessons
- [ ] User accounts and progress saving
- [ ] Leaderboard system
- [ ] Certificates of completion
- [ ] Community challenges
- [ ] Video tutorials integration
- [ ] Mobile app (PWA)
- [ ] AI-powered code reviews
- [ ] More language support (Spanish, French, Chinese)

---

## Technologies Used

<p align="left">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Monaco_Editor-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="Monaco Editor" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
</p>

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Acknowledgments

- Inspired by [Ruby-Lang](https://www.ruby-lang.org/) documentation
- Built with love for the TypeScript community
- Thanks to all contributors and users!

---

## Support

- ⭐ Star us on GitHub
- 🐛 Report bugs via GitHub Issues
- 💬 Join our community
- 📧 Contact: oler@try-typescript.com

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/rodrigooler">Rodrigo Oler</a>
</p>

<p align="center">
  <sub>Free to use. Free to modify. Free to learn.</sub>
</p>
