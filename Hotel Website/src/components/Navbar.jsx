import React from "react"
import {Link} from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// Utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card", 
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  const baseClasses = "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses
  
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={combinedClasses}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="images/logo-icon.png" alt="Monarch" />
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Monarch
            </span>
          </a>
        </div>


        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>


        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b">
          <Link to="/" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            Home
          </Link>
          
          <Link to="/about" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            About
          </Link>
          
          <Link to="/contact" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            Contact
          </Link>
        </div>
      </div>
    </header>
  )
}