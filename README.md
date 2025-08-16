# Mini Seller Console

A modern React application for managing sales leads with advanced filtering, sorting, and inline editing capabilities.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library

## Features

### 🎯 Lead Management
- **Table View**: Clean, sortable table layout for better data overview
- **Search & Filter**: Search leads by name or company
- **Status Filtering**: Filter by lead status (New, Contacted, Qualified, Lost)
- **Advanced Sorting**: Sort by score, name, or company (ascending/descending)
- **Real-time Statistics**: View lead counts, status distribution, and average scores
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### ✏️ Inline Editing
- **Slide-over Panel**: Modern slide-over interface for editing leads
- **Email Validation**: Real-time email format validation
- **Status Updates**: Easy status changes with visual feedback
- **Form Validation**: Comprehensive error handling and validation
- **Unsaved Changes**: Confirmation dialog for unsaved changes
- **Success Notifications**: Toast notifications for user feedback

### 🎨 Modern UI Components
- **Modular Architecture**: Reusable components with clear separation of concerns
- **Custom Hooks**: Clean data management with specialized hooks
- **Type Safety**: Full TypeScript support with proper interfaces
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Project Structure

```
src/
├── components/
│   └── ui/           # Global UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       ├── SlideOver.tsx
│       └── Toast.tsx
├── features/         # Feature-based modules
│   └── leads/        # Leads management feature
│       ├── components/
│       │   ├── LeadTable.tsx
│       │   ├── LeadFilters.tsx
│       │   ├── LeadEditForm.tsx
│       │   └── LeadStats.tsx
│       ├── hooks/
│       │   ├── useLeads.ts
│       │   └── useLeadEdit.ts
│       ├── types/
│       │   └── lead.ts
│       └── index.ts  # Feature exports
├── shared/           # Shared utilities and hooks
│   ├── hooks/
│   │   ├── useToast.ts
│   │   └── useSlideOver.ts
│   ├── utils/        # Future utility functions
│   └── index.ts      # Shared exports
├── pages/
│   └── LeadsPage.tsx # Main leads management page
└── App.tsx           # Main application component
```

## Getting Started

### Prerequisites

- Node.js 16+ (recommended: Node.js 18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### Lead Management
1. **View All Leads**: The dashboard displays all leads in a responsive table
2. **Search**: Use the search bar to find leads by name or company
3. **Filter by Status**: Select a specific status to filter results
4. **Sort Results**: Choose sorting criteria and order
5. **View Statistics**: Monitor lead performance with real-time stats
6. **Edit Leads**: Click on any lead row to open the slide-over editor

### Inline Editing
1. **Open Editor**: Click on any lead in the table
2. **Edit Email**: Update email with real-time validation
3. **Change Status**: Select from available status options
4. **Save Changes**: Click "Save Changes" to update the lead
5. **Cancel**: Click "Cancel" to discard changes (with confirmation if needed)

### Data Source
The application uses `leads.json` in the root directory as the data source. Each lead contains:
- Name and company information
- Contact details (email)
- Lead source and score
- Current status

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture Highlights

### 🏗️ Feature-Based Architecture
- **Separation of Concerns**: Clear boundaries between features and shared code
- **Modular Design**: Each feature is self-contained with its own components, hooks, and types
- **Scalability**: Easy to add new features without affecting existing ones
- **Team Collaboration**: Different teams can work on different features independently

### 🎯 Feature Organization
- **Co-location**: All related code (components, hooks, types) is grouped together
- **Clear Ownership**: Each feature has its own directory with clear responsibilities
- **Reusability**: Features can be easily reused or extracted into separate packages
- **Testing**: Feature-based testing is straightforward and isolated

### 🚀 Shared Resources
- **Global Components**: UI components that can be used across all features
- **Shared Hooks**: Reusable business logic (toast, slide-over, etc.)
- **Utilities**: Common utility functions and helpers
- **Type Definitions**: Shared TypeScript interfaces and types

### 📊 Import Structure
```typescript
// Feature-specific imports
import { useLeads } from '../features/leads/hooks/useLeads';
import { LeadTable } from '../features/leads/components/LeadTable';

// Shared imports
import { useToast } from '../shared/hooks/useToast';
import { Button } from '../components/ui/Button';

// Type imports
import type { Lead } from '../features/leads/types/lead';
```

### 🔧 Development Guidelines

#### Adding New Features
1. **Create Feature Directory**: `src/features/[feature-name]/`
2. **Organize by Type**: Components, hooks, types, and utils within the feature
3. **Export Public API**: Create an `index.ts` file for clean imports
4. **Use Shared Resources**: Leverage global components and hooks when possible

#### Code Organization Principles
- **Feature-First**: Organize by business features, not technical concerns
- **Co-location**: Keep related files close together
- **Clear Boundaries**: Separate feature-specific from shared code
- **Consistent Patterns**: Use the same structure across all features

#### Best Practices
- **Single Responsibility**: Each file has one clear purpose
- **Type Safety**: Use TypeScript for all new code
- **Reusability**: Design components and hooks for reuse
- **Performance**: Use memoization and avoid unnecessary re-renders
- **Testing**: Write tests for each feature in isolation

### 🎨 User Experience
- **Table Layout**: Better data density and readability
- **Slide-over Panel**: Non-intrusive editing interface
- **Real-time Validation**: Immediate feedback on form inputs
- **Toast Notifications**: Clear success/error feedback
- **Loading States**: Visual feedback during operations
- **Responsive Design**: Works on all screen sizes

### 🔧 Maintainability
- **Modular Design**: Easy to extend and modify
- **Type Safety**: Catch errors at compile time
- **Consistent Styling**: Tailwind CSS for maintainable styles
- **Clean Code**: Well-documented and organized codebase
- **Error Handling**: Comprehensive error management
- **Testable Code**: Logic separated for easy unit testing
