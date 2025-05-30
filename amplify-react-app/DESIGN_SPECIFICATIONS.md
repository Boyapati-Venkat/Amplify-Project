
# DataFlow - Design Specifications for Figma Recreation

## Brand Identity
- **App Name**: DataFlow
- **Logo**: Database icon in gradient circle
- **Tagline**: "Transform Your Data Into Actionable Insights"

## Color Palette

### Primary Colors
- **Blue Primary**: `#2563eb` (blue-600)
- **Purple Primary**: `#9333ea` (purple-600)
- **Blue Secondary**: `#1d4ed8` (blue-700)
- **Purple Secondary**: `#7c3aed` (purple-700)

### Gradients
- **Primary Gradient**: `linear-gradient(to right, #2563eb, #9333ea)`
- **Background Gradient**: `linear-gradient(to bottom right, #dbeafe, #ffffff, #faf5ff)`

### Neutral Colors
- **Gray 50**: `#f9fafb`
- **Gray 100**: `#f3f4f6`
- **Gray 200**: `#e5e7eb`
- **Gray 300**: `#d1d5db`
- **Gray 600**: `#4b5563`
- **Gray 700**: `#374151`
- **Gray 900**: `#111827`
- **White**: `#ffffff`

### Status Colors
- **Success Green**: `#16a34a` (green-600)
- **Error Red**: `#dc2626` (red-600)
- **Warning Yellow**: `#ca8a04` (yellow-600)

## Typography

### Font Family
- Primary: Inter, system-ui, sans-serif

### Font Sizes & Weights
- **Heading 1**: 48px (3rem), Font Weight: 700 (Bold)
- **Heading 2**: 36px (2.25rem), Font Weight: 700 (Bold)
- **Heading 3**: 24px (1.5rem), Font Weight: 600 (Semibold)
- **Heading 4**: 20px (1.25rem), Font Weight: 600 (Semibold)
- **Body Large**: 18px (1.125rem), Font Weight: 400 (Regular)
- **Body**: 16px (1rem), Font Weight: 400 (Regular)
- **Body Small**: 14px (0.875rem), Font Weight: 400 (Regular)
- **Caption**: 12px (0.75rem), Font Weight: 400 (Regular)

## Spacing System
- **4px**: 0.25rem
- **8px**: 0.5rem
- **12px**: 0.75rem
- **16px**: 1rem
- **20px**: 1.25rem
- **24px**: 1.5rem
- **32px**: 2rem
- **48px**: 3rem
- **64px**: 4rem
- **80px**: 5rem

## Border Radius
- **Small**: 6px (0.375rem)
- **Medium**: 8px (0.5rem)
- **Large**: 12px (0.75rem)
- **XL**: 16px (1rem)
- **2XL**: 24px (1.5rem)
- **Full**: 9999px (rounded-full)

## Shadows
- **Small**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Large**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **XL**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## Page Layouts

### 1. Landing Page (`/`)
**Layout**: Full-width with sections
- **Header Navigation**: 
  - Logo (left): Database icon + "DataFlow" text
  - Sign In button (right): Outlined style
  - Height: 64px, Padding: 24px horizontal

- **Hero Section**:
  - Background: Gradient from blue-50 to purple-50
  - Main heading: "Transform Your Data Into Actionable Insights"
  - Subheading: Description text in gray-600
  - CTA Buttons: Primary gradient button + outlined secondary
  - Padding: 80px vertical, 24px horizontal

- **Features Grid**:
  - 3 columns on desktop, responsive
  - Each card: White background with backdrop blur
  - Icon: Gradient background circle (48px)
  - Card padding: 24px
  - Gap between cards: 32px

- **CTA Section**:
  - Background: Blue to purple gradient
  - White text
  - Centered content
  - Padding: 80px vertical

- **Footer**:
  - Gray background
  - Logo + copyright
  - Padding: 48px vertical

### 2. Auth Page (`/auth`)
**Layout**: Centered card on gradient background
- **Background**: Same gradient as landing
- **Card**: 
  - White background with backdrop blur
  - Max width: 400px
  - Padding: 32px
  - Border radius: 16px
  - Shadow: XL shadow

### 3. Onboarding (`/onboarding`)
**Layout**: Centered with progress indicator
- **Progress Bar**: 
  - Full width at top
  - Blue color
  - Height: 8px
  - Step indicator text below

- **Step Cards**:
  - Same styling as auth card
  - Max width: 512px
  - Icon in gradient circle (64px)
  - Navigation buttons at bottom

### 4. Dashboard (`/dashboard`)
**Layout**: Full application layout
- **Navigation Bar**:
  - White background with backdrop blur
  - Logo (left) + User avatar dropdown (right)
  - Height: 64px
  - Border bottom: gray-200

- **Welcome Banner**:
  - Gradient background (blue to purple)
  - White text
  - Sparkles icon
  - Rounded corners: 16px
  - Margin bottom: 32px

- **Tab Navigation**:
  - 3 tabs: Overview, Upload Data, View Data
  - White background with backdrop blur
  - Icons + text labels

- **Content Area**:
  - Grid layout for overview cards
  - Full width for upload/data tabs

## Component Specifications

### Buttons
**Primary Button**:
- Background: Blue to purple gradient
- Text: White
- Padding: 12px 32px
- Border radius: 12px
- Font weight: 600
- Hover: Darker gradient

**Secondary Button**:
- Background: Transparent
- Border: 1px gray-300
- Text: Gray-700
- Same padding and radius as primary
- Hover: Gray-50 background

### Cards
**Standard Card**:
- Background: White with 80% opacity
- Backdrop blur effect
- Border: None (border-0)
- Shadow: Large shadow
- Border radius: 12px
- Padding: 24px

### Form Elements
**Input Fields**:
- Height: 44px
- Border: 1px gray-200
- Border radius: 8px
- Padding: 12px horizontal
- Focus: Blue-500 border and ring

**Labels**:
- Font size: 14px
- Font weight: 500
- Color: Gray-700
- Margin bottom: 8px

### Icons
**Icon System**: Lucide React
- **Standard Size**: 20px (w-5 h-5)
- **Large Size**: 24px (w-6 h-6)
- **Navigation Icons**: 16px (w-4 h-4)
- **Colors**: Match text color or use gradient for accent icons

### Data Table
**Table Styling**:
- Header: Gray-50 background
- Borders: Gray-200
- Row hover: Gray-50
- Cell padding: 16px
- Font size: 14px

**Badges**:
- Score 90+: Default (dark)
- Score 80-89: Secondary (gray)
- Score <80: Outline style
- Border radius: 6px
- Padding: 4px 8px

## Responsive Breakpoints
- **Mobile**: 0-768px
- **Tablet**: 768px-1024px
- **Desktop**: 1024px+

## Animation Guidelines
- **Fade In**: 0.3s ease-out
- **Scale**: 0.2s ease-out
- **Hover Transitions**: 0.2s ease
- **Page Transitions**: 0.3s ease-out

## File Upload Component
**Upload Area**:
- Border: 2px dashed gray-300
- Border radius: 12px
- Padding: 32px
- Center aligned content
- Hover state: Blue border and background

**Progress Indicators**:
- Height: 8px
- Blue color for progress
- Gray background
- Border radius: 4px

## Usage Notes for Figma
1. Create a component library with all buttons, cards, and form elements
2. Use auto-layout for responsive behavior
3. Create variants for different button states
4. Use consistent spacing using 8px grid system
5. Apply effects for backdrop blur and shadows
6. Use proper text styles for hierarchy
7. Create responsive frames for different screen sizes
