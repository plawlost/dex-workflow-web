import { type ComponentProps } from "react";

interface IconProps extends ComponentProps<"svg"> {
  size?: number;
}

// Pure Geometric Icons - Jony Ive Inspired
export function TimelineIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="4" cy="10" r="2" fill="currentColor" />
      <circle cx="4" cy="16" r="2" fill="currentColor" />
      <rect x="8" y="3" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="8" y="9" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="8" y="15" width="4" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function TasksIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="7" width="10" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="11" width="12" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="15" width="8" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function RulesIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="5" y="6" width="10" height="2" rx="1" fill="currentColor" />
      <rect x="5" y="10" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="5" y="14" width="8" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="9" y="2" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="9" y="14" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="4" height="2" rx="1" fill="currentColor" />
      <rect x="14" y="9" width="4" height="2" rx="1" fill="currentColor" />
      <rect x="14.5" y="4" width="2" height="3" rx="1" fill="currentColor" transform="rotate(45 15.5 5.5)" />
      <rect x="3.5" y="13" width="2" height="3" rx="1" fill="currentColor" transform="rotate(45 4.5 14.5)" />
      <rect x="3.5" y="4" width="2" height="3" rx="1" fill="currentColor" transform="rotate(-45 4.5 5.5)" />
      <rect x="14.5" y="13" width="2" height="3" rx="1" fill="currentColor" transform="rotate(-45 15.5 14.5)" />
    </svg>
  );
}

export function HelpIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="10" cy="15" r="1" fill="currentColor" />
      <path d="M7 7.5C7 6.11929 8.11929 5 9.5 5H10.5C11.8807 5 13 6.11929 13 7.5C13 8.88071 11.8807 10 10.5 10H10V12" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="13" y="13" width="2" height="5" rx="1" fill="currentColor" transform="rotate(45 14 15.5)" />
    </svg>
  );
}

export function BellIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <path d="M6 8C6 5.79086 7.79086 4 10 4C12.2091 4 14 5.79086 14 8V12L16 14H4L6 12V8Z" 
            fill="currentColor" />
      <rect x="8" y="16" width="4" height="2" rx="2" fill="currentColor" />
    </svg>
  );
}

export function MenuIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function UserIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="7" r="4" fill="currentColor" />
      <path d="M4 18C4 14.6863 6.68629 12 10 12C13.3137 12 16 14.6863 16 18" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" transform="rotate(45 10 10)" />
      <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" transform="rotate(-45 10 10)" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="7" y="6" width="7" height="2" rx="1" fill="currentColor" transform="rotate(45 10.5 7)" />
      <rect x="7" y="12" width="7" height="2" rx="1" fill="currentColor" transform="rotate(-45 10.5 13)" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="9" width="6" height="2" rx="1" fill="currentColor" transform="rotate(-45 6 10)" />
      <rect x="8" y="12" width="10" height="2" rx="1" fill="currentColor" transform="rotate(-45 13 13)" />
    </svg>
  );
}

export function FilterIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="8" width="12" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="12" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="8" y="16" width="4" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function TrendingUpIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <path d="M3 15L7 11L11 13L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="13" y="5" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="17" y="5" width="2" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

export function SparklesIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="9" y="2" width="2" height="6" rx="1" fill="currentColor" />
      <rect x="6" y="5" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="14" y="8" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="12" y="9" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="12" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="1" y="13" width="6" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="9" y="6" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="4" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="13" y="3" width="4" height="2" rx="1" fill="currentColor" />
      <rect x="15" y="3" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="10" y="6" width="7" height="2" rx="1" fill="currentColor" transform="rotate(45 13.5 7)" />
    </svg>
  );
}

export function PlusIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="9" y="4" width="2" height="12" rx="1" fill="currentColor" />
      <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="9" width="12" height="2" rx="1" fill="currentColor" />
      <rect x="12" y="6" width="6" height="2" rx="1" fill="currentColor" transform="rotate(45 15 7)" />
      <rect x="12" y="12" width="6" height="2" rx="1" fill="currentColor" transform="rotate(-45 15 13)" />
    </svg>
  );
}

// Status and Action Icons
export function SuccessIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="8" fill="rgb(34 197 94)" />
      <rect x="5" y="9" width="4" height="2" rx="1" fill="white" transform="rotate(-45 7 10)" />
      <rect x="8" y="12" width="7" height="2" rx="1" fill="white" transform="rotate(-45 11.5 13)" />
    </svg>
  );
}

export function WarningIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="8" fill="rgb(245 158 11)" />
      <rect x="9" y="6" width="2" height="6" rx="1" fill="white" />
      <circle cx="10" cy="14" r="1" fill="white" />
    </svg>
  );
}

export function ErrorIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="8" fill="rgb(239 68 68)" />
      <rect x="6" y="9" width="8" height="2" rx="1" fill="white" transform="rotate(45 10 10)" />
      <rect x="6" y="9" width="8" height="2" rx="1" fill="white" transform="rotate(-45 10 10)" />
    </svg>
  );
}

export function CalendarIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="2" y="7" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="2" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="12" y="2" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function PhoneIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="7" y="5" width="6" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function MailIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M3 6L10 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function MessageIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="5" y="8" width="10" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function RefreshIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <path d="M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.5 16 7.1 15.4 6 14.5" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="2" y="12" width="4" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="10" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

// Dashboard Stats Icons
export function ChartIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="13" width="3" height="5" rx="1" fill="currentColor" />
      <rect x="7" y="9" width="3" height="9" rx="1" fill="currentColor" />
      <rect x="11" y="6" width="3" height="12" rx="1" fill="currentColor" />
      <rect x="15" y="3" width="3" height="15" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ConversationIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="10" y="8" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function UsersIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="7" cy="6" r="3" fill="currentColor" />
      <circle cx="13" cy="6" r="3" fill="currentColor" />
      <path d="M1 17C1 14.2386 3.23858 12 6 12H8C10.7614 12 13 14.2386 13 17" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M7 17C7 14.2386 9.23858 12 12 12H14C16.7614 12 19 14.2386 19 17" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DocumentIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="7" y="6" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="7" y="9" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="7" y="12" width="4" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

// Platform Icons
export function SlackIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="8" width="4" height="4" rx="2" fill="currentColor" />
      <rect x="14" y="8" width="4" height="4" rx="2" fill="currentColor" />
      <rect x="8" y="2" width="4" height="4" rx="2" fill="currentColor" />
      <rect x="8" y="14" width="4" height="4" rx="2" fill="currentColor" />
      <rect x="6" y="8" width="8" height="4" rx="2" fill="currentColor" />
      <rect x="8" y="6" width="4" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}

export function GmailIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 6L10 12L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2 16L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M18 16L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function NotionIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="6" y="5" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="8" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="11" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="14" width="4" height="2" rx="1" fill="currentColor" />
    </svg>
  );
} 