#!/bin/bash

# Script to add missing shadcn UI components

# Navigate to the auth-service directory
cd /home/crock/Documents/projects/work/tekrem/erp/auth-service

# Add form components
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add slider
npx shadcn@latest add calendar

# Add navigation components
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination
npx shadcn@latest add tabs
npx shadcn@latest add command

# Add feedback components
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add skeleton
npx shadcn@latest add sonner

# Add display components
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add hover-card
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add carousel
npx shadcn@latest add aspect-ratio
npx shadcn@latest add scroll-area
npx shadcn@latest add collapsible
npx shadcn@latest add resizable

# Add additional components
npx shadcn@latest add drawer
npx shadcn@latest add input-otp
npx shadcn@latest add menubar
npx shadcn@latest add sidebar
npx shadcn@latest add toggle
npx shadcn@latest add toggle-group
npx shadcn@latest add context-menu

echo "All shadcn UI components have been added successfully!"
