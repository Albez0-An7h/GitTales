# GitTales - The Story of your GitHub Journey

GitTales is a React application that visualizes GitHub profiles, displaying user information, pull requests, commit history, and contribution heatmaps.

## Description

GitTales provides an interactive way to explore GitHub profiles and their activity. The application shows:
- User profile details
- Pull request history
- Language usage statistics
- Contribution heatmaps
- Commit history

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Albez0-An7h/GitTales.git
   cd GitTales
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your GitHub API token:
   ```
   VITE_GITHUB_API_TOKEN=your_github_personal_access_token
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Dependencies

### Production Dependencies
- **React:** ^19.0.0
- **React DOM:** ^19.0.0
- **React Router DOM:** ^7.4.1
- **Tailwind CSS:** ^4.0.17
- **@tailwindcss/vite:** ^4.0.17
- **React Icons:** ^5.5.0
- **React GitHub Calendar:** ^4.5.6
- **Axios:** ^1.8.4

### Development Dependencies
- **Vite:** ^6.2.0
- **@vitejs/plugin-react:** ^4.3.4
- **ESLint:** ^9.21.0
- **@eslint/js:** ^9.21.0
- **eslint-plugin-react-hooks:** ^5.1.0
- **eslint-plugin-react-refresh:** ^0.4.19
- **@types/react:** ^19.0.10
- **@types/react-dom:** ^19.0.4
- **globals:** ^15.15.0

## Features

- **User Profiles:** View detailed information about GitHub users
- **Pull Request History:** See a user's pull request activity
- **Contribution Heatmap:** Visual representation of contribution activity
- **Language Statistics:** See which programming languages a user works with most
- **Commit History:** View recent commits by users

## Environment Setup

For local development, ensure you have a GitHub Personal Access Token with appropriate permissions. Create a `.env` file in the project root with:

```
VITE_GITHUB_API_TOKEN=your_github_personal_access_token
```

## Scripts

- **Start development server:** `npm start`
- **Build for production:** `npm run build`
- **Lint code:** `npm run lint`
- **Preview production build:** `npm run preview`

## Browser Support

GitTales is compatible with modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Favicon by <a href="https://iconscout.com/icons/octocat" class="text-underline font-size-sm" target="_blank">Octocat</a> by <a href="https://iconscout.com/contributors/benjamin-j-sperry" class="text-underline font-size-sm" target="_blank">Benjamin J sperry</a>
