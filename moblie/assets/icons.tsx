import { SVGProps } from "react"
import Svg, { Circle, Ellipse, LinearGradient, Path, RadialGradient, Stop, SvgProps } from 'react-native-svg';

export function HomeOutline(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 48 48"
      {...props}
    >
      <Path
        fill={props.color}
        d="M5.844 40.83c.34 2.376 2.408 4.17 4.8 4.17h8.516a1.62 1.62 0 0 0 1.616-1.616v-8.082a3.242 3.242 0 0 1 3.232-3.233 3.242 3.242 0 0 1 3.232 3.233v8.082A1.62 1.62 0 0 0 28.856 45h8.5c2.392 0 4.46-1.794 4.8-4.17l2.78-19.46c.048-.34.064-.68.064-1.019a7.213 7.213 0 0 0-2.957-5.819L27.887 4.236c-2.263-1.648-5.495-1.648-7.757 0L5.957 14.55A7.19 7.19 0 0 0 3 20.367c0 .34.016.68.065 1.019l2.78 19.444Zm2.02-23.663L22.037 6.855c1.147-.84 2.795-.84 3.943 0l14.172 10.312a3.981 3.981 0 0 1 1.632 3.2c0 .194-.016.372-.032.566l-2.78 19.46a1.631 1.631 0 0 1-1.6 1.39h-6.9v-6.465a6.463 6.463 0 0 0-6.464-6.465 6.463 6.463 0 0 0-6.464 6.465v6.465h-6.9a1.619 1.619 0 0 1-1.6-1.39l-2.78-19.476a6.277 6.277 0 0 1-.032-.566c0-1.26.614-2.44 1.632-3.184Z"
      />
    </Svg>
  )
}

export function HomeFilled(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 48 48"
      {...props}
    >
      <Path
        fill={props.color}
        d="M42.044 14.549 27.877 4.236c-2.278-1.648-5.476-1.648-7.754 0L5.956 14.55A7.184 7.184 0 0 0 3 20.35c0 .34.016.679.065 1.018l2.778 19.46C6.183 43.207 8.25 45 10.641 45h8.513a1.62 1.62 0 0 0 1.615-1.616v-6.466A3.241 3.241 0 0 1 24 33.686a3.241 3.241 0 0 1 3.23 3.232v6.466A1.62 1.62 0 0 0 28.847 45h8.497c2.407 0 4.458-1.794 4.814-4.17l2.778-19.46c.049-.34.065-.68.065-1.019a7.184 7.184 0 0 0-2.956-5.802Z"
      />
    </Svg>
  )
}
export const LiveTVOutline = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="m20.846 26.24-3.351 3.716a1.363 1.363 0 0 1-2.067 0c-.57-.632-.57-1.66 0-2.291l3.351-3.716c.548-.607 1.292-.949 2.067-.949.776 0 1.519.342 2.067.95l5.241 5.81 3.351-3.716a1.363 1.363 0 0 1 2.067 0c.57.632.57 1.66 0 2.291l-3.351 3.716c-.548.607-1.292.949-2.067.949-.776 0-1.519-.342-2.067-.95l-5.241-5.81Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="m20.1 15.333-8.55-7.057c-.63-.52-.63-1.365 0-1.885.63-.521 1.654-.521 2.284 0L24 14.78l10.166-8.39c.63-.521 1.654-.521 2.284 0 .63.52.63 1.365 0 1.885l-8.55 7.057h9.023c2.142 0 4.197.703 5.711 1.953C44.15 18.536 45 20.232 45 22v13.333c0 1.768-.851 3.464-2.366 4.714C41.12 41.297 39.065 42 36.924 42H11.076c-2.142 0-4.197-.703-5.711-1.953C3.85 38.797 3 37.101 3 35.333V22c0-1.768.851-3.464 2.366-4.714 1.514-1.25 3.569-1.953 5.71-1.953H20.1ZM41.77 22v13.333c0 1.061-.511 2.078-1.42 2.829-.91.75-2.142 1.171-3.427 1.171H11.077c-1.285 0-2.518-.421-3.427-1.171-.909-.75-1.42-1.768-1.42-2.829V22c0-1.06.511-2.078 1.42-2.829.91-.75 2.142-1.171 3.427-1.171h25.846c1.285 0 2.518.421 3.427 1.171.909.75 1.42 1.768 1.42 2.829Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const LiveOutline = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill={props.color}
      d="M39.758 6H8.242C5.35 6 3 8.517 3 11.61v3.156c0 .754.57 1.364 1.274 1.364.704 0 1.275-.61 1.275-1.364v-3.155c0-1.59 1.209-2.883 2.693-2.883h31.517c1.485 0 2.691 1.294 2.691 2.883v24.778c0 1.59-1.208 2.883-2.692 2.883h-11.33c-.703 0-1.274.61-1.274 1.364 0 .753.571 1.364 1.275 1.364h11.33C42.648 42 45 39.483 45 36.39V11.61C45 8.517 42.648 6 39.758 6Z"
    />
    <Path
      fill={props.color}
      d="M7.019 19.183c-.7.085-1.203.76-1.122 1.51.08.748.704 1.29 1.41 1.2 3.983-.487 7.895.974 10.727 4.005 2.832 3.032 4.194 7.216 3.742 11.483-.08.748.422 1.423 1.121 1.51.049.005.098.008.146.008.64 0 1.191-.514 1.265-1.21.542-5.096-1.09-10.098-4.472-13.718-3.382-3.624-8.05-5.366-12.817-4.788Z"
    />
    <Path
      fill={props.color}
      d="M6.17 26.068c-.695.12-1.168.82-1.056 1.562.112.745.765 1.258 1.46 1.131 2.428-.418 4.914.438 6.644 2.292 1.733 1.853 2.532 4.513 2.136 7.114-.114.744.358 1.444 1.053 1.565.07.013.139.019.207.019.614 0 1.154-.475 1.255-1.145.529-3.464-.538-7.01-2.848-9.481-2.305-2.47-5.613-3.61-8.85-3.057Z"
    />
    <Path
      fill={props.color}
      d="M7.929 40.836c2.124 0 3.847-1.843 3.847-4.117 0-2.275-1.723-4.118-3.847-4.118-2.125 0-3.847 1.843-3.847 4.117 0 2.275 1.722 4.118 3.847 4.118Z"
    />
  </Svg>
)

export function UserOutline(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 48 48"
      fill={props.color}
      {...props}
    >
      <Path
        fill={props.color}
        d="M31.07 25.114H16.877C9.196 25.114 3 31.085 3 38.372v.101c0 3.593 3.072 6.528 6.832 6.528h28.336C41.928 45 45 42.066 45 38.473v-.101c0-7.337-6.25-13.258-13.93-13.258Zm10.752 13.359c0 1.923-1.642 3.492-3.654 3.492H9.832c-2.012 0-3.654-1.57-3.654-3.492v-.101c0-5.667 4.82-10.222 10.698-10.222h14.248c5.932 0 10.698 4.605 10.698 10.222v.101ZM23.975 23.392c5.773 0 10.434-6.122 10.434-11.132 0-5.11-4.714-9.26-10.434-9.26-5.72 0-10.434 4.15-10.434 9.21 0 5.06 4.66 11.182 10.434 11.182Zm0-17.356c3.972 0 7.256 2.783 7.256 6.173 0 3.593-3.39 8.097-7.256 8.097-3.867 0-7.256-4.555-7.256-8.097 0-3.39 3.284-6.173 7.256-6.173Z"
      />
    </Svg>
  )
}

export function UserFilled(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 48 48"
      fill={props.color}
      {...props}
    >
      <Path
        fill={props.color}
        d="M31.07 25.114H16.877C9.196 25.114 3 31.085 3 38.372v.101c0 3.593 3.072 6.528 6.832 6.528h28.336C41.928 45 45 42.066 45 38.473v-.101c0-7.337-6.25-13.258-13.93-13.258ZM23.975 23.392c5.773 0 10.434-6.122 10.434-11.132 0-5.11-4.714-9.26-10.434-9.26-5.72 0-10.434 4.15-10.434 9.21 0 5.06 4.66 11.182 10.434 11.182Z"
      />
    </Svg>
  )
}

export const PlayIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill="#fff"
      d="M38.987 20.928 13.712 5.688C10.938 4.008 7 5.598 7 8.358v30.45c0 2.76 3.938 4.35 6.713 2.67l25.274-15.24c2.25-1.29 2.25-3.99 0-5.31Z"
    />
  </Svg>
)

export const PauseIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill="#fff"
      d="M15.637 5h-4.462C8.325 5 6 6.86 6 9.14V38c0 2.28 2.325 4.14 5.175 4.14h4.462c2.85 0 5.175-1.86 5.175-4.14V9.14c0-2.28-2.325-4.14-5.175-4.14ZM36.825 5h-4.463c-2.85 0-5.175 1.86-5.175 4.14V38c0 2.28 2.325 4.14 5.175 4.14h4.463C39.675 42.14 42 40.28 42 38V9.14C42 6.86 39.675 5 36.825 5Z"
    />
  </Svg>
)

export const FullScreenEnterIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill="#fff"
      d="M16.717 6.762a1.762 1.762 0 0 1-1.762 1.762h-4.67a1.762 1.762 0 0 0-1.761 1.762v4.669a1.762 1.762 0 0 1-3.524 0v-4.67A5.286 5.286 0 0 1 10.286 5h4.669a1.762 1.762 0 0 1 1.762 1.762ZM36.714 5h-4.669a1.762 1.762 0 0 0 0 3.524h4.67a1.762 1.762 0 0 1 1.761 1.762v4.669a1.762 1.762 0 0 0 3.524 0v-4.67A5.286 5.286 0 0 0 36.714 5Zm3.524 25.266a1.762 1.762 0 0 0-1.762 1.762v4.669a1.761 1.761 0 0 1-1.762 1.762h-4.669a1.762 1.762 0 0 0 0 3.523h4.67A5.285 5.285 0 0 0 42 36.697v-4.67a1.762 1.762 0 0 0-1.762-1.761Zm-25.283 8.21h-4.67a1.762 1.762 0 0 1-1.761-1.762v-4.669a1.762 1.762 0 0 0-3.524 0v4.67A5.286 5.286 0 0 0 10.286 42h4.669a1.762 1.762 0 0 0 0-3.524Z"
    />
  </Svg>
)

export const FullScreenExitIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill="#fff"
      d="M16.717 6.762v4.669a5.285 5.285 0 0 1-5.286 5.286h-4.67a1.762 1.762 0 0 1 0-3.524h4.67a1.762 1.762 0 0 0 1.762-1.762v-4.67a1.762 1.762 0 1 1 3.524 0Zm18.852 9.955h4.67a1.762 1.762 0 0 0 0-3.524h-4.67a1.762 1.762 0 0 1-1.762-1.762v-4.67a1.762 1.762 0 1 0-3.524 0v4.67a5.285 5.285 0 0 0 5.286 5.286Zm4.67 13.549h-4.67a5.285 5.285 0 0 0-5.286 5.285v4.67a1.762 1.762 0 0 0 3.524 0v-4.67a1.762 1.762 0 0 1 1.762-1.762h4.67a1.762 1.762 0 0 0 0-3.523Zm-28.808 0h-4.67a1.762 1.762 0 1 0 0 3.523h4.67a1.762 1.762 0 0 1 1.762 1.762v4.687a1.762 1.762 0 0 0 3.524 0V35.57a5.285 5.285 0 0 0-5.286-5.286v-.017Z"
    />
  </Svg>
)

export const XIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}
  >
    <Path
      fill="#fff"
      d="M37.489 42.88 24 29.395 10.511 42.88a3.806 3.806 0 0 1-5.391 0 3.805 3.805 0 0 1 0-5.391L18.605 24 5.12 10.511a3.805 3.805 0 0 1 0-5.391 3.804 3.804 0 0 1 5.391 0L24 18.605 37.489 5.12a3.805 3.805 0 0 1 5.391 0 3.805 3.805 0 0 1 0 5.391L29.395 24 42.88 37.489a3.806 3.806 0 0 1 0 5.391 3.806 3.806 0 0 1-5.391 0Z"
    />
  </Svg>
)

export const GoogleIcon = (props: SvgProps) => {
  return (
    <Svg
      viewBox="0 0 48 48"
      {...props}
    >
      <Path
        fill="#fbc02d"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <Path
        fill="#e53935"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <Path
        fill="#4caf50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <Path
        fill="#1565c0"
        d="M43.611 20.083 43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </Svg>
  )
}

export const TwitterXIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    baseProfile="basic"
    clipRule="evenodd"
    {...props}
  >
    <Path fill="#fff" d="M41 6 9.929 42H6.215L37.287 6z" />
    <Path fillRule="evenodd" d="M31.143 41 7.82 7h8.957L40.1 41z" />
    <Path
      fill="#fff"
      d="m15.724 9 20.578 30h-4.106L11.618 9h4.106m1.58-3H5.922l24.694 36h11.382L17.304 6z"
    />
  </Svg>
)
export const FacebookIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}>
    <LinearGradient
      id="a"
      x1={9.993}
      x2={40.615}
      y1={9.993}
      y2={40.615}
      gradientUnits="userSpaceOnUse"
    >
      <Stop offset={0} stopColor="#2aa4f4" />
      <Stop offset={1} stopColor="#007ad9" />
    </LinearGradient>
    <Path
      fill="url(#a)"
      d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
    />
    <Path
      fill="#fff"
      d="M26.707 29.301h5.176l.813-5.258h-5.989v-2.874c0-2.184.714-4.121 2.757-4.121h3.283V12.46c-.577-.078-1.797-.248-4.102-.248-4.814 0-7.636 2.542-7.636 8.334v3.498H16.06v5.258h4.948v14.452c.98.146 1.973.246 2.992.246.921 0 1.82-.084 2.707-.204V29.301z"
    />
  </Svg>
)
export const DiscordIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 48 48"
    {...props}>
    <RadialGradient
      id="a"
      cx={24}
      cy={560.111}
      r={32.253}
      gradientTransform="matrix(1 0 0 -1 0 570.11)"
      gradientUnits="userSpaceOnUse"
    >
      <Stop offset={0} stopColor="#8c9eff" />
      <Stop offset={0.368} stopColor="#889af8" />
      <Stop offset={0.889} stopColor="#7e8fe6" />
      <Stop offset={1} stopColor="#7b8ce1" />
    </RadialGradient>
    <Path
      fill="url(#a)"
      d="M40.107 12.15a.94.94 0 0 0-.236-.255c-.355-.267-5.744-3.889-9.865-3.889-.258 0-.825 1.1-1.016 1.987-1.994.002-7.996-.003-9.993.006-.236-.838-.844-1.99-1.008-1.99-4.122 0-9.487 3.606-9.861 3.887a.956.956 0 0 0-.236.255C7.184 13.258 2.843 20.539 2 33.783a.548.548 0 0 0 .135.395C6.728 39.321 13.318 39.929 14.724 40a.477.477 0 0 0 .427-.199l1.099-1.665-3.246-1.54v-1.609c6.329 2.817 15.356 3.104 21.993.017l.027 1.588-3.205 1.65 1.028 1.559c.092.14.26.208.427.199 1.407-.072 7.996-.679 12.588-5.823a.548.548 0 0 0 .135-.395c-.841-13.244-5.182-20.525-5.89-21.632z"
    />
    <Ellipse cx={30.5} cy={26} opacity={0.05} rx={4.5} ry={5} />
    <Ellipse cx={30.5} cy={26} opacity={0.05} rx={4} ry={4.5} />
    <Ellipse cx={30.5} cy={26} fill="#fff" rx={3.5} ry={4} />
    <Ellipse cx={17.5} cy={26} opacity={0.05} rx={4.5} ry={5} />
    <Ellipse cx={17.5} cy={26} opacity={0.05} rx={4} ry={4.5} />
    <Ellipse cx={17.5} cy={26} fill="#fff" rx={3.5} ry={4} />
  </Svg>
)


export const Eye = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1}
    fill="none"
    className="lucide lucide-eye"
    {...props}
  >
    <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <Circle cx={12} cy={12} r={3} />
  </Svg>
)

export const EyeOff = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1}
    className="lucide lucide-eye-off"
    {...props}
  >
    <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
  </Svg>
)

export const ArrowRight = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-eye-off"
    {...props}
  >
    <Path d="m9 18 6-6-6-6" />
  </Svg>
)

export const SunMoon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-sun-moon"
    {...props}
  >
    <Path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
  </Svg>
)

