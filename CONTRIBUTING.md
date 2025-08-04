# Contributing to CordKit

Thank you for your interest in contributing to CordKit! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or higher
- Node.js v18.0.0+ (for Discord.js compatibility)
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the Repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cordkit.git
   cd cordkit
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Test the CLI**

   ```bash
   # Test basic functionality
   bun run index.ts --help
   bun run index.ts init --help
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting and structure
- Use descriptive variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Commit Messages

Follow the conventional commits format:

```
type(scope): description

feat(cli): add new dashboard command
fix(templates): resolve TypeScript template issue
docs(readme): update installation instructions
```

Types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Test Your Changes**: Ensure all functionality works
3. **Create Clear PR**: Describe what you've changed and why
4. **Link Issues**: Reference any related issues

## 🛠️ Development Areas

### 1. CLI Commands (`src/commands/`)

Add new CLI commands or enhance existing ones:

**Adding a New Command:**

```typescript
// src/commands/example.ts
import { Command } from "commander";

export function createExampleCommand(): Command {
  return new Command("example")
    .description("Example command description")
    .option("-f, --flag", "Example flag")
    .action(async (options) => {
      // Command implementation
    });
}
```

**Update CLI Registration:**

```typescript
// src/cli.ts
import { createExampleCommand } from "./commands/example.js";

program.addCommand(createExampleCommand());
```

### 2. Bot Templates (`src/templates/`)

Enhance bot generation templates:

**Template Structure:**

- Main bot files (index.ts/js)
- Command handlers
- Configuration files
- Documentation

**Adding New Bot Types:**

```typescript
// In src/templates/initTemplate.ts
case 'new-bot-type':
  // Add specific features for this bot type
  features.push('feature1', 'feature2');
  break;
```

### 3. Plugin System

Create new plugins for bot functionality:

**Plugin Structure:**

```typescript
// Plugin generator function
function generatePluginName(language: "typescript" | "javascript") {
  return {
    filename: `plugins/plugin-name.${language === "typescript" ? "ts" : "js"}`,
    content: `// Plugin implementation`,
  };
}
```

### 4. Migrations

Add new migration tasks for project updates:

**Migration Structure:**

```typescript
// In src/commands/migrate.ts
{
  id: 'migration-name',
  name: 'Migration Display Name',
  description: 'What this migration does',
  async execute(projectPath: string) {
    // Migration implementation
  }
}
```

## 🧪 Testing

### Manual Testing

1. **Test CLI Commands**

   ```bash
   bun run index.ts init --template typescript --bot-type general
   bun run index.ts list
   bun run index.ts plugins --list
   ```

2. **Test Generated Projects**

   ```bash
   cd generated-project
   bun install
   bun run start --dry-run  # If supported
   ```

3. **Test Edge Cases**
   - Invalid inputs
   - Missing files
   - Permission issues

### Automated Testing

We welcome contributions to add automated testing:

- Unit tests for utility functions
- Integration tests for CLI commands
- Template generation tests

## 📋 Feature Ideas

### High Priority

- **Web Dashboard**: Browser-based project management
- **GitHub Integration**: Repository creation and deployment
- **Plugin Marketplace**: Community plugin sharing
- **AI Assistant**: Intelligent code suggestions

### Medium Priority

- **More Bot Types**: Game-specific bots, crypto bots
- **Cloud Deployment**: AWS, GCP, Azure configurations
- **Database Options**: PostgreSQL, MongoDB support
- **Advanced Analytics**: Performance monitoring

### Low Priority

- **GUI Version**: Desktop application
- **VS Code Extension**: IDE integration
- **Mobile Support**: React Native bot templates

## 🐛 Bug Reports

### Before Reporting

1. **Check Existing Issues**: Search for similar problems
2. **Test Latest Version**: Ensure you're using the latest code
3. **Minimal Reproduction**: Create a simple test case

### Bug Report Template

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**

1. Run command `...`
2. Select option `...`
3. Error occurs

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**

- OS: Windows/macOS/Linux
- Bun Version: x.x.x
- CordKit Version: x.x.x
- Node.js Version: x.x.x

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Summary**
Brief description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you implement this?

**Alternative Solutions**
Other ways to address the problem

**Additional Context**
Examples, mockups, or related features
```

## 📚 Documentation

### Areas for Documentation Improvement

- **API Documentation**: JSDoc for all public functions
- **Tutorial Videos**: Screen recordings of common workflows
- **Advanced Guides**: Complex bot development patterns
- **Troubleshooting**: Common issues and solutions

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI elements
- Keep documentation up-to-date with code changes

## 🎖️ Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: Feature attribution
- **GitHub Releases**: Contributor mentions

### Contribution Types

- 💻 Code contributions
- 📝 Documentation improvements
- 🐛 Bug reports and testing
- 💡 Feature suggestions
- 🎨 Design and UX improvements

## 📞 Community

### Getting Help

- **GitHub Issues**: Technical problems and questions
- **GitHub Discussions**: General questions and ideas
- **Discord Server**: Real-time community chat (if available)

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Follow the code of conduct

## 📄 Legal

### License

By contributing to CordKit, you agree that your contributions will be licensed under the MIT License.

### Copyright

- Retain original copyright notices
- Add your copyright for substantial contributions
- Don't include copyrighted material without permission

---

**Thank you for contributing to CordKit!** 🚀

Every contribution, no matter how small, helps make Discord bot development better for everyone. We appreciate your time and effort!

_If you have questions about contributing, please open an issue or reach out to the maintainers._
