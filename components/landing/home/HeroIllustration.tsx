const keyboardRows = [
  { id: "numbers", u: 0.13, v: 0.12, keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] },
  { id: "letters", u: 0.13, v: 0.24, keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] },
  { id: "home", u: 0.166, v: 0.36, keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L"] },
  { id: "bottom", u: 0.238, v: 0.48, keys: ["Z", "X", "C", "V", "B", "N", "M"] },
  { id: "modifiers-left", u: 0.17, v: 0.6, keys: ["Fn", "Ctrl", "Alt"] },
  { id: "modifiers-right", u: 0.72, v: 0.6, keys: ["Left", "Down", "Right"] },
] as const
const keyboardKeyWidth = 0.055
const keyboardKeyDepth = 0.085
const keyboardKeyPitch = 0.072
const spacebar = { u: 0.39, v: 0.6, width: 0.3, depth: keyboardKeyDepth }
const projectKeyboardPoint = (u: number, v: number) => ({
  x: 200 + 314 * u + 58 * v,
  y: 282 - (314 * 13 * u) / 270 + 48 * v,
})
const keyboardPath = (u: number, v: number, width: number, depth: number) => {
  const backLeft = projectKeyboardPoint(u, v)
  const backRight = projectKeyboardPoint(u + width, v)
  const frontRight = projectKeyboardPoint(u + width, v + depth)
  const frontLeft = projectKeyboardPoint(u, v + depth)

  return `M${backLeft.x} ${backLeft.y}L${backRight.x} ${backRight.y}L${frontRight.x} ${frontRight.y}L${frontLeft.x} ${frontLeft.y}Z`
}
const rackTubes = [0, 1, 2, 3, 4] as const
const microscopeObjectives = [
  { x: 105, y: 86, length: 18, band: "var(--secondary)" },
  { x: 123, y: 87, length: 29, band: "var(--secondary)" },
  { x: 141, y: 85, length: 21, band: "var(--primary)" },
] as const

export function HeroIllustration() {
  return (
    <div className="mx-auto w-full max-w-[36rem] text-primary">
      <svg
        viewBox="0 0 640 480"
        role="img"
        aria-label="Biovity conecta ciencias y oportunidades laborales"
        aria-describedby="hero-illustration-description"
        className="h-auto w-full overflow-visible"
        strokeLinejoin="round"
        strokeWidth="0.9"
      >
        <desc id="hero-illustration-description">
          Un microscopio, un perfil científico y un computador que muestra una oferta de trabajo en
          Biovity.
        </desc>
        <defs>
          <linearGradient id="laptop-shell" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0" stopColor="var(--surface-container-lowest)" />
            <stop offset="1" stopColor="var(--surface-container-highest)" />
          </linearGradient>
          <linearGradient id="laptop-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 78%, black)" />
          </linearGradient>
          <linearGradient id="glass-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--secondary)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--secondary)" stopOpacity="0.58" />
          </linearGradient>
          <filter id="bench-shadow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="contact-shadow" x="-20%" y="-150%" width="140%" height="400%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <clipPath id="screen-offer-clip">
            <rect x="270" y="100" width="241" height="168" />
          </clipPath>
        </defs>

        <ellipse
          cx="324"
          cy="405"
          rx="256"
          ry="25"
          fill="var(--primary)"
          opacity="0.12"
          filter="url(#bench-shadow)"
        />

        <g
          fill="var(--primary)"
          opacity="0.12"
          filter="url(#contact-shadow)"
          transform="matrix(1 -0.048148 0 1 0 0)"
        >
          <ellipse cx="96" cy="317.62" rx="75" ry="4" />
          <ellipse cx="102" cy="421.91" rx="59" ry="4" />
          <ellipse cx="393" cy="413.92" rx="30" ry="3" />
          <ellipse cx="550" cy="433.48" rx="67" ry="4" />
          <ellipse cx="164" cy="442.9" rx="65" ry="3" />
        </g>

        <g transform="translate(10 110)" stroke="var(--primary)" strokeLinejoin="round">
          <path
            d="M8 177v10c0 9 35 16 78 16s78-7 78-16v-10Z"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="86"
            cy="177"
            rx="78"
            ry="15"
            fill="var(--surface-container-lowest)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="86"
            cy="177"
            rx="66"
            ry="10"
            fill="var(--surface-container-low)"
            strokeWidth="0.9"
          />
          <path
            d="M17 185c13 7 39 11 69 11s56-4 69-11"
            fill="none"
            strokeOpacity="0.25"
            strokeWidth="0.9"
          />
          <circle
            cx="39"
            cy="188"
            r="1.5"
            fill="var(--surface-container-highest)"
            strokeWidth="0.6"
          />
          <circle
            cx="133"
            cy="188"
            r="1.5"
            fill="var(--surface-container-highest)"
            strokeWidth="0.6"
          />
          <ellipse
            cx="115"
            cy="176"
            rx="16"
            ry="5"
            fill="var(--surface-container-highest)"
            strokeWidth="0.9"
          />
          <ellipse cx="115" cy="174" rx="11" ry="3" fill="url(#glass-fill)" strokeWidth="0.9" />

          <path
            d="M39 173 35 113C31 76 50 45 87 40l13 18C70 62 57 84 60 111l7 60q-12 8-28 2Z"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <path
            d="M42 110c-2-28 11-51 37-59"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="m44 140 3 28"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M49 173q9 3 18-2" fill="none" strokeOpacity="0.35" strokeWidth="0.9" />
          <circle
            cx="50"
            cy="157"
            r="1.5"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.6"
          />

          <path d="M105 149v9q10 6 20 0v-9Z" fill="var(--primary)" strokeWidth="0.9" />
          <ellipse
            cx="115"
            cy="149"
            rx="10"
            ry="3.5"
            fill="var(--surface-container-highest)"
            strokeWidth="0.9"
          />
          <path d="M60 132 132 128l23 11-75 7Z" fill="var(--primary)" strokeWidth="0.9" />
          <path d="M80 146 155 139v5l-75 7Z" fill="var(--primary)" strokeWidth="0.9" />
          <path
            d="M60 132 80 146v5l-20-14Z"
            fill="var(--surface-container-highest)"
            strokeWidth="0.9"
          />
          <path
            d="M87 134 126 132l14 6-40 3Z"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <path
            d="M101 135 119 134l8 3-19 2Z"
            fill="url(#glass-fill)"
            stroke="var(--secondary)"
            strokeWidth="0.6"
          />
          <path
            d="m89 132 3 6m37-8 3 6"
            fill="none"
            stroke="var(--surface-container-highest)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="149"
            cy="146"
            r="3"
            fill="var(--surface-container-highest)"
            strokeWidth="0.9"
          />
          <circle
            cx="59"
            cy="122"
            r="12"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <circle
            cx="59"
            cy="122"
            r="8.5"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <circle cx="59" cy="122" r="4" fill="var(--secondary)" strokeWidth="0.9" />
          <circle cx="44" cy="130" r="5.5" fill="var(--primary)" strokeWidth="0.9" />
          <circle
            cx="44"
            cy="130"
            r="2.5"
            fill="var(--surface-container-highest)"
            strokeWidth="0.6"
          />

          <path
            d="M87 40q17-1 26 9l20 16q9 7 2 14l-17 7-17-17-14-12Z"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <path
            d="m99 49 24 20"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g transform="rotate(-32 104 48)">
            <path d="M97 17h14v33H97Z" fill="var(--surface-container-highest)" strokeWidth="0.9" />
            <path
              d="M100 24v20"
              fill="none"
              stroke="var(--surface-container-lowest)"
              strokeWidth="1.5"
            />
            <path d="M95 12h18v10H95Z" fill="var(--primary)" strokeWidth="0.9" />
            <ellipse cx="104" cy="12" rx="9" ry="3" fill="var(--primary)" strokeWidth="0.9" />
            <ellipse
              cx="104"
              cy="11.5"
              rx="5.5"
              ry="1.6"
              fill="var(--secondary)"
              stroke="var(--surface-container-highest)"
              strokeWidth="0.6"
            />
            <path
              d="M96 20h16"
              fill="none"
              stroke="var(--surface-container-highest)"
              strokeWidth="0.9"
            />
          </g>
          <path d="M101 82v5c0 4 10 7 23 7s23-3 23-7v-5Z" fill="var(--primary)" strokeWidth="0.9" />
          <ellipse
            cx="124"
            cy="82"
            rx="23"
            ry="7"
            fill="var(--surface-container-highest)"
            strokeWidth="0.9"
          />
          {microscopeObjectives.map((objective) => (
            <g key={objective.x}>
              <path
                d={`M${objective.x - 5} ${objective.y}h10v${objective.length}q-5 4-10 0Z`}
                fill="var(--surface-container-highest)"
                strokeWidth="0.9"
              />
              <path
                d={`M${objective.x - 4.5} ${objective.y + 5}h9`}
                stroke={objective.band}
                strokeWidth="1.5"
              />
              <path
                d={`M${objective.x - 2} ${objective.y + 8}v${objective.length - 11}`}
                stroke="var(--surface-container-lowest)"
                strokeWidth="0.9"
              />
              <ellipse
                cx={objective.x}
                cy={objective.y + objective.length}
                rx="4.5"
                ry="1.6"
                fill="var(--primary)"
                strokeWidth="0.6"
              />
            </g>
          ))}
        </g>

        <g
          transform="matrix(0.993421053 -0.047831384 0.06 0.96 -24.738947 16.771579)"
          stroke="var(--primary)"
          strokeLinejoin="round"
        >
          <path
            d="M216 71q0-10 10-10h284q10 0 10 10v205q0 10-10 10H226q-10 0-10-10Z"
            fill="url(#laptop-edge)"
            strokeWidth="2.4"
          />
          <path
            d="M228 76h283v192H228Z"
            fill="var(--surface-container-lowest)"
            stroke="var(--surface-container-lowest)"
            strokeWidth="1.5"
          />
          <path d="M228 76h283v24H228Z" fill="var(--surface-container-low)" stroke="none" />
          <circle cx="239" cy="88" r="3" fill="#e58b83" stroke="none" />
          <circle cx="249" cy="88" r="3" fill="#e3b25e" stroke="none" />
          <circle cx="259" cy="88" r="3" fill="var(--secondary)" stroke="none" />
          <path
            d="M275 83h147q5 0 5 5t-5 5H275q-5 0-5-5t5-5Z"
            fill="var(--surface-container-highest)"
            stroke="none"
          />
          <circle cx="282" cy="88" r="2" fill="var(--muted-foreground)" stroke="none" />
          <text
            x="435"
            y="91"
            fill="var(--muted-foreground)"
            stroke="none"
            fontSize="7.5"
            fontFamily="var(--font-geist-mono)"
          >
            biovity.cl
          </text>

          <path d="M228 100h41v168h-41Z" fill="var(--surface-container-low)" stroke="none" />
          <circle cx="248" cy="118" r="9" fill="var(--primary)" stroke="none" />
          <path
            d="M244 118h8m-4-4v8"
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="0.9"
          />
          <path
            d="M239 138h18m-18 7h13m-13 7h16"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="236"
            y="164"
            width="27"
            height="17"
            rx="4"
            fill="var(--secondary)"
            opacity="0.14"
            stroke="none"
          />
          <path
            d="M241 170h16m-16 5h11"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M239 193h18m-18 7h14m-14 7h16m-16 28h15m-15 7h11m-11 7h14"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeOpacity="0.58"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <text
            x="282"
            y="119"
            fill="var(--primary)"
            stroke="none"
            fontSize="10"
            fontWeight="700"
            fontFamily="var(--font-geist-sans)"
          >
            BIOVITY
          </text>
          <text
            x="282"
            y="137"
            fill="var(--foreground)"
            stroke="none"
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--font-geist-sans)"
          >
            Empleos en ciencias
          </text>
          <rect
            x="282"
            y="145"
            width="213"
            height="21"
            rx="6"
            fill="var(--surface-container-low)"
            stroke="var(--border)"
            strokeWidth="0.9"
          />
          <circle
            cx="292"
            cy="155.5"
            r="3.5"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="0.9"
          />
          <path d="m295 158 3 3" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.9" />
          <text
            x="303"
            y="159"
            fill="var(--foreground)"
            fillOpacity="0.75"
            stroke="none"
            fontSize="7.5"
            fontFamily="var(--font-geist-sans)"
          >
            Cargo o especialidad
          </text>
          <rect
            x="282"
            y="174"
            width="213"
            height="71"
            rx="7"
            fill="var(--surface-container-lowest)"
            stroke="var(--border)"
            strokeWidth="0.9"
          />
          <rect
            x="291"
            y="183"
            width="25"
            height="25"
            rx="6"
            fill="var(--secondary)"
            opacity="0.12"
            stroke="none"
          />
          <path
            d="M298 201v-7a5 5 0 0 1 10 0v7m-12 0h14"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text
            x="323"
            y="190"
            fill="var(--foreground)"
            stroke="none"
            fontSize="8"
            fontWeight="700"
            fontFamily="var(--font-geist-sans)"
          >
            Analista de laboratorio
          </text>
          <text
            x="323"
            y="202"
            fill="var(--foreground)"
            fillOpacity="0.75"
            stroke="none"
            fontSize="7.5"
            fontFamily="var(--font-geist-sans)"
          >
            Bioquímica · Santiago
          </text>
          <rect x="323" y="211" width="74" height="17" rx="5" fill="var(--primary)" stroke="none" />
          <text
            x="332"
            y="222.5"
            fill="var(--primary-foreground)"
            stroke="none"
            fontSize="7.5"
            fontWeight="600"
            fontFamily="var(--font-geist-sans)"
          >
            Ver oferta
          </text>
          <path
            d="m389 217 4 3-4 3"
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="478" cy="184" r="3" fill="var(--secondary)" stroke="none" />
          <text
            x="464"
            y="188"
            textAnchor="end"
            fill="var(--secondary)"
            stroke="none"
            fontSize="7.5"
            fontWeight="600"
            fontFamily="var(--font-geist-sans)"
          >
            Nueva
          </text>
          <g clipPath="url(#screen-offer-clip)">
            <rect
              x="282"
              y="251"
              width="213"
              height="71"
              rx="7"
              fill="var(--surface-container-lowest)"
              stroke="var(--border)"
              strokeWidth="0.9"
            />
            <rect
              x="291"
              y="260"
              width="25"
              height="25"
              rx="6"
              fill="var(--secondary)"
              fillOpacity="0.12"
              stroke="none"
            />
            <path
              d="M298 277v-7h11v7m-13 0h15"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="0.9"
            />
            <path
              d="M323 263h93m-93 9h64"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.45"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </g>
          <circle cx="357" cy="276" r="2.8" fill="var(--surface-container-highest)" stroke="none" />
        </g>

        <g stroke="var(--primary)" strokeLinejoin="round">
          <path d={keyboardPath(0, 0, 1, 1)} fill="url(#laptop-shell)" strokeWidth="2.4" />
          <path d="M200 282 258 330v12l-58-48Z" fill="var(--primary)" strokeWidth="0.9" />
          <path d="M258 330 572 314.88148v12L258 342Z" fill="url(#laptop-edge)" strokeWidth="0.9" />
          <path
            d={keyboardPath(0.025, 0.06, 0.95, 0.88)}
            fill="var(--surface-container-low)"
            strokeWidth="0.9"
          />
          <path
            d={keyboardPath(0.09, 0.08, 0.84, 0.65)}
            fill="var(--surface-container-highest)"
            stroke="var(--border)"
            strokeWidth="0.6"
          />
          <path
            d="M258 330 572 314.88148"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeOpacity="0.7"
            strokeWidth="0.9"
          />
          <path
            d="M385 329.885 445 326.996"
            fill="none"
            stroke="var(--surface-container-highest)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M217 280.52 499.06 266.94" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M219 279.92 497 266.54"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeOpacity="0.6"
            strokeWidth="0.9"
          />
          <circle cx="217" cy="280.52" r="2" fill="var(--surface-container-highest)" />
          <circle cx="499.06" cy="266.94" r="2" fill="var(--surface-container-highest)" />
        </g>
        {keyboardRows.map((row) => (
          <g key={row.id}>
            {row.keys.map((key, keyIndex) => {
              const u = row.u + keyIndex * keyboardKeyPitch

              return (
                <path
                  key={`${row.id}-${key}`}
                  d={keyboardPath(u, row.v, keyboardKeyWidth, keyboardKeyDepth)}
                  fill="var(--surface-container-lowest)"
                  stroke="var(--primary)"
                  strokeOpacity="0.10"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
              )
            })}
          </g>
        ))}
        <path
          d={keyboardPath(spacebar.u, spacebar.v, spacebar.width, spacebar.depth)}
          fill="var(--surface-container-lowest)"
          stroke="var(--primary)"
          strokeOpacity="0.10"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path
          d={keyboardPath(0.36, 0.77, 0.28, 0.16)}
          fill="var(--surface-container-highest)"
          stroke="var(--primary)"
          strokeOpacity="0.12"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <path
          d={keyboardPath(0.37, 0.79, 0.26, 0.12)}
          fill="var(--surface-container-lowest)"
          stroke="var(--border)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <circle cx="556" cy="322.65" r="1.3" fill="var(--secondary)" />

        <g transform="rotate(-8 113 374)" stroke="var(--primary)" strokeLinejoin="round">
          <path d="M49 336h114v74H49Z" fill="var(--surface-container-lowest)" strokeWidth="1.5" />
          <path d="M49 336h114v14H49Z" fill="var(--primary)" stroke="none" />
          <circle cx="61" cy="343" r="2" fill="var(--secondary)" stroke="none" />
          <text
            x="68"
            y="346"
            fill="var(--primary-foreground)"
            stroke="none"
            fontSize="7.5"
            fontWeight="700"
            fontFamily="var(--font-geist-mono)"
          >
            PERFIL
          </text>
          <circle cx="71" cy="371" r="12" fill="var(--surface-container-highest)" stroke="none" />
          <circle cx="71" cy="367" r="4" fill="var(--secondary)" />
          <path
            d="M63 379c1-7 4-9 8-9s7 2 8 9"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M92 362h55m-55 7h43m-43 7h51m-51 17h49m-49 6h37"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeOpacity="0.66"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M92 384h30m5 0h20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M154 354v48" fill="none" stroke="var(--border)" strokeWidth="0.9" />
          <circle cx="154" cy="359" r="1.6" fill="var(--surface-container-highest)" />
        </g>

        <g stroke="var(--primary)" strokeLinejoin="round">
          <path d="M362 380v7a31 10 0 0 0 62 0v-7" fill="url(#glass-fill)" strokeWidth="0.9" />
          <ellipse
            cx="393"
            cy="380"
            rx="31"
            ry="10"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <ellipse cx="393" cy="380" rx="26" ry="7" fill="url(#glass-fill)" strokeWidth="0.6" />
          <ellipse
            cx="393"
            cy="379.5"
            rx="20"
            ry="4.5"
            fill="none"
            stroke="var(--secondary)"
            strokeOpacity="0.45"
            strokeWidth="0.6"
          />
          <path
            d="M366 383a30 8 0 0 0 54 0"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <path
            d="M368 377c4-3 10-4 17-4"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="translate(549 378) scale(1.08) translate(-549 -378)"
          stroke="var(--primary)"
          strokeLinejoin="round"
        >
          <path
            d="m487 372 92-8 32 21-92 10Z"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <path d="M487 372 519 395v10l-32-23Z" fill="var(--primary)" opacity="0.75" />
          <path d="M519 395 611 385v10l-92 10Z" fill="var(--primary)" opacity="0.52" />
          <path
            d="M495.72 373.82 576.68 366.78 602.28 385.18 521.32 392.22Z"
            fill="var(--surface-container-low)"
          />
          {rackTubes.map((tube) => {
            const x = 504 + tube * 16
            const y = 357 - tube * 1.4
            return (
              <g key={tube}>
                <ellipse
                  cx={x + 4}
                  cy={y + 22}
                  rx="5.2"
                  ry="1.8"
                  fill="var(--primary)"
                  fillOpacity="0.18"
                  strokeWidth="0.6"
                />
                <path
                  d={`M${x} ${y}v20q0 5 4 5t4-5v-20Z`}
                  fill="url(#glass-fill)"
                  strokeWidth="0.9"
                />
                <path d={`M${x} ${y}h8v4h-8Z`} fill="var(--primary)" strokeWidth="0.9" />
                <path
                  d={`M${x + 1.5} ${y + 15}h5`}
                  stroke={tube === 2 ? "var(--accent)" : "var(--secondary)"}
                  strokeWidth="1.5"
                />
                <path
                  d={`M${x + 2} ${y + 7}v5`}
                  stroke="var(--surface-container-lowest)"
                  strokeWidth="0.9"
                />
              </g>
            )
          })}
          <path
            d="M499 374 575 367.4"
            fill="none"
            stroke="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <circle cx="496" cy="378" r="1.3" fill="var(--surface-container-lowest)" />
          <circle cx="603" cy="390" r="1.3" fill="var(--surface-container-lowest)" />
        </g>

        <g
          transform="translate(8 8)"
          stroke="var(--primary)"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path
            d="m92 416 111-7 17 9-112 9Z"
            fill="var(--surface-container-highest)"
            strokeWidth="1.5"
          />
          <path
            d="m96 414 106-7 7 4-107 7Z"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <path
            d="m98 411 101-7 5 3-102 7Z"
            fill="var(--surface-container-lowest)"
            strokeWidth="0.9"
          />
          <path d="m108 411 83-6" fill="none" stroke="var(--secondary)" strokeWidth="0.9" />
          <path
            d="m118 417 80-5"
            fill="none"
            stroke="var(--primary)"
            strokeOpacity="0.3"
            strokeWidth="0.9"
          />
          <circle cx="97" cy="415" r="1.4" fill="var(--primary)" />
          <circle cx="205" cy="408" r="1.4" fill="var(--primary)" />
        </g>
      </svg>
    </div>
  )
}
