# Stitch Design Brief

## Project Overview

Inventree is an Inventory Management System built with a modern MERN stack. The goal is to provide a polished web dashboard and management portal for businesses to track products, locations, brands, user access, inventory status, warranty expiry, and analytics.

The user-facing product includes:
- Authentication pages (login / signup)
- A central dashboard with KPI cards and charts
- Product listing, details, editing, and history pages
- Brand and location management pages
- User management administration
- Responsive layout designed for desktop-first but adaptable to smaller screens

## Audience & Users

Primary users:
- Warehouse managers
- Inventory admins
- Operations staff
- Procurement teams
- Business owners who need visibility into stock, warranty, and location status

User goals:
- Quickly understand stock health and warranty expiry
- Add, edit, and search products
- Manage brands and storage locations
- Monitor product usage and history
- Handle login/signup securely

## Visual Tone & Style

The existing UI uses a modern dark theme with glassmorphism styling, neon gradients, and futuristic dashboard visuals. Stitch should design the pages with these characteristics:
- Dark background palette with subtle gradients and glows
- Glass-card panels with blurred translucent surfaces
- Accent colors: violet, blue, emerald, gold, red
- Clean typography, high contrast text, and minimal clutter
- Soft motion/hover states for cards, buttons, and interactive elements

## Core Pages & Layout

### 1. Authentication

**Login page**
- Left panel with brand name, hero headline, value proposition, features list
- Right panel with email, password, show/hide toggle, sign-in button
- Error message area above form
- Bottom link to signup

**Signup page**
- Similar split layout with marketing panel on left and account form on right
- Fields: full name, email, password
- Create account button
- Link back to sign in

### 2. Dashboard

**Dashboard page**
- Top heading and welcome message
- KPI cards for:
  - Total Products
  - Expiring Soon
  - Active Items
  - Use-By Critical
- Main analytics charts:
  - Inventory status bar chart
  - Use-by breakdown pie chart
  - Warranty expiry bar chart
  - Recent activity / report section
- Emphasize data visualization and quick health insights

### 3. Products

**Product list page**
- Table with columns: Product, Serial No., Used By, Model, Warranty, Purchase Date, Flags, Actions
- Search field and pagination controls
- New product button
- Row actions: History, Edit

**Add/Edit product**
- Form-based product management
- Fields should include product title, manufacturer/brand, serial number, model, warranty months, purchase date, assigned user, location, type flags
- Save and cancel actions

**Product details / info page**
- Show product summary and full details
- Provide actions like edit, view history

**Product history page**
- Timeline or list of product status changes
- Track created, edited, location changes, warranty updates, usage events

### 4. Brands

**Brands page**
- A grid of brand cards showing name, description, and meta info
- New brand button
- Edit link for each brand
- Visual emphasis on brand identity and quick management

### 5. Locations

**Locations page**
- A grid of location cards with name, description, and metadata
- New location button
- Edit link for each location
- Clear visual separation for warehouse locations or storage areas

### 6. Users / Administration

**User management page**
- Ability to view users, roles, and manage access
- Likely user table with actions to change roles or remove users
- Admin-focused interface for managing accounts

## Navigation & Structure

The application uses a sidebar dashboard navigation pattern. Main sections include:
- Dashboard
- Products
- Brands
- Locations
- Users

Also support the auth flow under `/auth`.

## Functional Requirements

- Authentication and session handling
- Search and pagination for products
- Data-driven charts and analytics on dashboard
- CRUD capabilities for products, brands, and locations
- Product history tracking
- Role-aware actions in lists and edit screens

## Technical Notes for Stitch

Front-end stack:
- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animation
- Recharts for charts
- React Router DOM for page navigation

Back-end stack:
- Node.js + Express
- MongoDB for data storage
- API endpoints under `/api/v1`
- Separate microservices architecture in the repo with specialized auth and product services

## Recommended Page Components

Use these page sections and UI components:
- Hero login/signup panels with split-screen effect
- Glass cards for KPI and list items
- Responsive dashboard grid
- Search toolbar with input and action buttons
- Data tables with hover states and action buttons
- Card grid for locations / brands
- Modal, notification, or inline alerts for success/error

## Design Deliverables

Please provide:
- High-fidelity desktop screens for all pages above
- A responsive mobile/tablet adaptation concept
- Component library recommendations (cards, buttons, forms, tables, badges)
- A cohesive dark theme and color palette
- Font and icon styling suggestions

## Priority Flow

1. Login / Signup
2. Main dashboard overview
3. Product list and product form pages
4. Brand management page
5. Location management page
6. User admin page

## Notes for Stitch

This application is meant to feel modern, data-driven, and professional while remaining approachable for inventory users. Prioritize clarity in charts, strong visual hierarchy, and easy access to the most important inventory actions.

## Design Reference: Inventree Pro HTML Templates

Use the provided Inventree Pro HTML templates as the exact visual direction for the web pages. The templates already map closely to our current app screens and should inform the final styling, layout, and component treatment.

Key matched pages:
- Dashboard: dark glass cards, neon accent glows, KPI summary row, split charts section, sidebar navigation.
- Products: table-driven inventory list with sticky header, search bar, filter tabs, and rounded action buttons.
- Brands: card grid with strong hover states, status labels, and visible edit/view actions.
- Login: split-screen marketing panel with feature highlights and a glassmorphism login form.

Design qualities to carry through:
- strong dark mode with high contrast text
- subtle blurred glass panels and bordered cards
- refined violet/blue/green/red accent palette
- modern iconography using Material Symbols
- consistent page padding and responsive spacing

---

If you want, I can also prepare a second document with a visual component and page-by-page wireframe checklist for Stitch.