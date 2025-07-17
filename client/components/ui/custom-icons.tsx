import React from "react";

// Document/File Icon - based on the blue document design
export function DocumentIcon({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
        fill="#E8F4FD"
        stroke="#0093DD"
        strokeWidth="1.5"
      />
      <path
        d="M14 2V8H20"
        stroke="#0093DD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11H17"
        stroke="#0093DD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 14H17"
        stroke="#0093DD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 17H13"
        stroke="#0093DD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Like/Thumbs Up Icon - based on the thumbs up design
export function LikeIcon({
  count,
  className = "",
  isLiked = false,
  ...props
}: React.SVGProps<SVGSVGElement> & { count?: number; isLiked?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isLiked ? "text-[#0093DD]" : "text-[#535862]"}
        {...props}
      >
        <path
          d="M6.2334 15.2916L8.81673 17.2916C9.15006 17.6249 9.90006 17.7916 10.4001 17.7916H13.5667C14.5667 17.7916 15.6501 17.0416 15.9001 16.0416L17.9001 9.95823C18.3167 8.79156 17.5667 7.79156 16.3167 7.79156H12.9834C12.4834 7.79156 12.0667 7.37489 12.1501 6.79156L12.5667 4.12489C12.7334 3.37489 12.2334 2.54156 11.4834 2.29156C10.8167 2.04156 9.9834 2.37489 9.65006 2.87489L6.2334 7.95823"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeMiterlimit="10"
          fill={isLiked ? "currentColor" : "none"}
        />
        <path
          d="M1.9834 15.2915V7.12484C1.9834 5.95817 2.4834 5.5415 3.65007 5.5415H4.4834C5.65006 5.5415 6.15007 5.95817 6.15007 7.12484V15.2915C6.15007 16.4582 5.65006 16.8748 4.4834 16.8748H3.65007C2.4834 16.8748 1.9834 16.4582 1.9834 15.2915Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isLiked ? "currentColor" : "none"}
        />
      </svg>
      {count !== undefined && (
        <span className="text-xs font-normal text-[#535862] leading-6">
          {count}
        </span>
      )}
    </div>
  );
}

// Comment Icon - based on the comment bubble design
export function CommentIcon({
  count,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { count?: number }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#535862]"
        {...props}
      >
        <path
          d="M2.5 6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V11C17.5 12.4001 17.5 13.1002 17.2275 13.635C16.9878 14.1054 16.6054 14.4878 16.135 14.7275C15.6002 15 14.9001 15 13.5 15H11.4031C10.8831 15 10.6231 15 10.3743 15.051C10.1537 15.0963 9.94017 15.1712 9.73957 15.2737C9.51347 15.3892 9.31043 15.5517 8.90434 15.8765L6.91646 17.4668C6.56973 17.7442 6.39636 17.8829 6.25045 17.8831C6.12356 17.8832 6.00352 17.8255 5.92436 17.7263C5.83333 17.6123 5.83333 17.3903 5.83333 16.9463V15C5.05836 15 4.67087 15 4.35295 14.9148C3.49022 14.6836 2.81635 14.0098 2.58519 13.147C2.5 12.8291 2.5 12.4416 2.5 11.6667V6.5Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count !== undefined && (
        <span className="text-xs font-normal text-[#535862] leading-6">
          {count}
        </span>
      )}
    </div>
  );
}

// Write Post Icon - Pencil with underline
export function WritePostIcon({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current"
        {...props}
      >
        <path
          d="M13.5858 2.58579C14.3668 1.80474 15.6332 1.80474 16.4142 2.58579C17.1953 3.36683 17.1953 4.63317 16.4142 5.41421L6.82843 15H4V12.1716L13.5858 2.58579Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 4L15 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="w-6 h-0.5 bg-current"></div>
    </div>
  );
}

// Not Found Icon - Document with question mark or empty state
export function NotFoundIcon({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="20"
        y="10"
        width="80"
        height="100"
        rx="4"
        fill="#E8F4FD"
        stroke="#0093DD"
        strokeWidth="2"
      />
      <rect
        x="10"
        y="20"
        width="80"
        height="100"
        rx="4"
        fill="#0093DD"
        opacity="0.1"
      />
      <line
        x1="30"
        y1="35"
        x2="70"
        y2="35"
        stroke="#0093DD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="45"
        x2="80"
        y2="45"
        stroke="#0093DD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="55"
        x2="75"
        y2="55"
        stroke="#0093DD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="65"
        x2="60"
        y2="65"
        stroke="#0093DD"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Share/Views Icon - Eye icon for views
export function ViewsIcon({
  count,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { count?: number }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#535862]"
        {...props}
      >
        <path
          d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="10"
          cy="10"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count !== undefined && (
        <span className="text-xs font-normal text-[#535862] leading-6">
          {count}
        </span>
      )}
    </div>
  );
}
