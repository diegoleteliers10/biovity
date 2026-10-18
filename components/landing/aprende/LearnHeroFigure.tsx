export function LearnHeroFigure() {
  return (
    <svg
      viewBox="0 0 760 520"
      role="img"
      aria-labelledby="learn-figure-title learn-figure-description"
      className="block h-auto w-full overflow-visible"
      stroke="var(--primary)"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <title id="learn-figure-title">Una cápsula de aprendizaje científico</title>
      <desc id="learn-figure-description">
        Un cuaderno abierto reúne contenido, ejercicios y una evaluación. Una ruta conecta cada
        etapa con un certificado.
      </desc>
      <defs>
        <filter id="learn-bench-shadow" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse
        cx="380"
        cy="450"
        rx="259"
        ry="24"
        fill="var(--primary)"
        opacity="0.1"
        stroke="none"
        filter="url(#learn-bench-shadow)"
      />
      <ellipse
        cx="190"
        cy="371"
        rx="74"
        ry="4"
        fill="var(--primary)"
        opacity="0.12"
        stroke="none"
      />
      <ellipse
        cx="548"
        cy="369"
        rx="43"
        ry="5"
        fill="var(--primary)"
        opacity="0.12"
        stroke="none"
      />

      <g strokeWidth="1.5">
        <path d="M145 113h470" fill="none" stroke="var(--border)" strokeWidth="3" />
        <path
          data-learn-thread
          d="M145 113h470"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="3"
        />
      </g>

      <g strokeWidth="1.5">
        <circle cx="145" cy="113" r="19" fill="var(--surface-container-lowest)" />
        <path
          d="M134 106q6-2 11 2 5-4 11-2v13q-6-2-11 2-5-4-11-2Z"
          fill="var(--surface-container-highest)"
        />
        <path
          d="M145 108v13m-11-15 11 4 11-4"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.2"
        />

        <circle cx="302" cy="113" r="19" fill="var(--surface-container-lowest)" />
        <path d="m296 123 2-7 11-14 5 4-11 14Z" fill="var(--surface-container-highest)" />
        <path d="m298 116 5 4m-7 3 2-7" fill="none" stroke="var(--secondary)" strokeWidth="1.2" />
        <path d="m309 102 5 4" fill="none" stroke="var(--accent)" strokeWidth="1.2" />

        <circle cx="459" cy="113" r="19" fill="var(--surface-container-lowest)" />
        <rect
          x="451"
          y="102"
          width="16"
          height="22"
          rx="2"
          fill="var(--surface-container-highest)"
        />
        <path
          d="M455 108h8m-8 5h8m-8 5h5"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="1.2"
        />
        <path
          d="m454 108 1.5 1.5 2-3m-3.5 8 1.5 1.5 2-3"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.2"
        />

        <circle cx="615" cy="113" r="19" fill="var(--surface-container-lowest)" />
        <path d="M607 102h16v17h-16Z" fill="var(--surface-container-highest)" />
        <path
          d="M619 102v5h4m-12 1h7m-7 3h7"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.2"
        />
        <circle cx="615" cy="115" r="3" fill="var(--accent)" />
        <path d="m613 118-2 9 4-2m4-7 2 9-4-2" fill="var(--secondary)" strokeWidth="1.2" />
      </g>

      <g fill="none" stroke="var(--border)" strokeDasharray="2 4" strokeWidth="0.9">
        <path d="M145 133v81" />
        <path d="M302 133v189l-24 9" />
        <path d="M459 133v53" />
        <path d="M615 133v184l-17 12" />
      </g>

      <g strokeWidth="2">
        <path
          d="m147 218 206-52v219L147 424Z"
          fill="color-mix(in srgb, var(--primary) 78%, black)"
        />
        <path d="m158 214 195-48v205l-195 41Z" fill="var(--surface-container-highest)" />
        <path d="m166 211 187-45v195l-187 39Z" fill="var(--surface-container-lowest)" />
        <path
          d="m353 166 228 43v212l-228-62Z"
          fill="color-mix(in srgb, var(--primary) 78%, black)"
        />
        <path d="m353 166 218 42v195l-218-57Z" fill="var(--surface-container-lowest)" />
        <path d="m353 166 8 5v193l-8-2Z" fill="var(--surface-container-highest)" />
        <path
          d="m147 424 206-39v13l-206 43Z"
          fill="color-mix(in srgb, var(--primary) 78%, black)"
        />
        <path
          d="m353 385 228 62v-26l-228-62Z"
          fill="color-mix(in srgb, var(--primary) 78%, black)"
        />
        <path
          d="m157 421 195-37m9-213 202 39m-202 179 202 54"
          fill="none"
          stroke="var(--surface-container-lowest)"
          strokeWidth="0.9"
        />
        <path d="m353 167 9 5v193l-9 20" fill="none" stroke="var(--border)" strokeWidth="0.9" />
      </g>

      <g strokeWidth="0.9">
        <path
          d="m206 247 21-5m-21 13 21-5m-21 13 21-5m-21 13 21-5m-21 13 21-5m-21 13 21-5"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path
          d="m241 240 68-16m-68 8 68-16"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path
          d="m241 265 68-16m-68 8 68-16m-68 34 68-16m-68 8 68-16"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path
          d="m241 301 68-16m-68 8 68-16m-68 34 68-16m-68 8 68-16"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path
          d="m241 337 68-14m-68 8 68-14"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
      </g>

      <g strokeWidth="1.5">
        <path d="m230 280 41-10v49l-41 9Z" fill="var(--surface-container-low)" />
        <path
          d="m236 286 28-7m-28 12 28-7m-28 12 18-4"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="0.9"
        />
        <path d="m239 318 6 5 13-17" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
        <path d="m283 267 29-7v39l-29 7Z" fill="var(--secondary)" opacity="0.16" />
        <circle cx="292" cy="274" r="3" fill="var(--secondary)" />
        <circle cx="292" cy="285" r="3" fill="var(--accent)" />
        <circle cx="292" cy="296" r="3" fill="var(--surface-container-highest)" />
        <path
          d="m300 274 8-2m-8 11 8-2m-8 11 8-2"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="0.9"
        />
      </g>

      <g strokeWidth="1.5">
        <path d="m383 193 164 31v121l-164-42Z" fill="var(--surface-container-low)" />
        <path d="m394 203 141 27v9l-141-27Z" fill="var(--surface-container-highest)" />
        <path d="m394 204 9 2v8l-9-2Z" fill="var(--secondary)" />
        <path d="m409 207 9 2v8l-9-2Z" fill="var(--accent)" />
        <path d="m424 210 9 2v8l-9-2Z" fill="var(--primary)" opacity="0.35" />
        <path
          d="m443 219 73 14m-73-5 73 14m-73-5 73 14m-73-5 73 14"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path d="m394 244 30 6v38l-30-8Z" fill="var(--surface-container-lowest)" />
        <path
          d="m402 252 15 3m-15 6 15 3m-15 6 10 2"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <path
          d="m435 252 94 18m-94 8 94 18m-94 8 94 18"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <circle cx="441" cy="252" r="4" fill="var(--surface-container-lowest)" />
        <circle cx="441" cy="270" r="4" fill="var(--surface-container-lowest)" />
        <circle cx="441" cy="288" r="4" fill="var(--surface-container-lowest)" />
        <path
          d="m439 252 1.5 1.5 2-3m-2 21 1.5 1.5 2-3"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="0.9"
        />
        <path d="m440 288 2 2 3-4" fill="none" stroke="var(--accent)" strokeWidth="0.9" />
      </g>

      <g
        transform="translate(0 -6) translate(545 342) scale(1.2) translate(-545 -342)"
        strokeWidth="1.5"
      >
        <path d="m514 342 51 12v12l-51-14Z" fill="var(--surface-container-highest)" />
        <path d="m514 342 51 12 25-16-50-12Z" fill="var(--surface-container-lowest)" />
        <path
          d="m524 342 32 8m-28-12 32 8m-29-12 32 8"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.9"
        />
        <circle cx="545" cy="338" r="12" fill="var(--surface-container-low)" />
        <circle cx="545" cy="338" r="8" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
        <path d="m541 338 3 3 6-7" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
        <path d="m538 347 1 13 6-5 5 9 1-16Z" fill="var(--accent)" />
        <path d="m550 347 2 16 6-9 6 5-2-14Z" fill="var(--accent)" />
        <path
          d="m541 354 4 2m8-1 4-2"
          fill="none"
          stroke="var(--accent-foreground)"
          strokeWidth="0.9"
        />
      </g>

      <g strokeWidth="1.5">
        <path d="m147 356 99-24 13 11-109 26Z" fill="var(--surface-container-lowest)" />
        <path d="m132 360 15-4 3 13-18 4Z" fill="var(--surface-container-highest)" />
        <path d="m132 360 15-4 3 13-18 4Z" fill="none" stroke="var(--border)" strokeWidth="0.9" />
        <path d="m246 332 7-2 6 13-13 3Z" fill="var(--surface-container-highest)" />
        <path d="m253 330 11-3 3 12-11 4Z" fill="var(--accent)" />
        <path
          d="m150 359 93-23"
          fill="none"
          stroke="var(--surface-container-highest)"
          strokeWidth="0.9"
        />
        <path d="m130 363 2 7" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.9" />
        <path d="m126 366 6-6v12Z" fill="var(--primary)" />
        <path d="m126 366 6-6v12Z" fill="none" stroke="var(--primary)" strokeWidth="0.9" />
        <path d="m147 356 4 13-3 1-3-13Z" fill="var(--surface-container-highest)" />
      </g>

      <g fill="var(--surface-container-lowest)" strokeWidth="1.5">
        <circle cx="157" cy="219" r="2.5" />
        <circle cx="345" cy="170" r="2.5" />
        <circle cx="575" cy="211" r="2.5" />
        <circle cx="575" cy="398" r="2.5" />
        <circle cx="153" cy="418" r="2.5" />
        <circle cx="357" cy="386" r="2.5" />
        <circle cx="242" cy="371" r="2" />
        <circle cx="546" cy="369" r="2" />
      </g>
    </svg>
  )
}
