export function Footer() {
  return (
    <footer
      aria-label="Footer"
      className="relative z-10 bg-[#080d0a] px-4 py-12 md:px-8 md:py-16 lg:px-16"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <svg
          aria-hidden="true"
          className="mb-6 h-12 w-12 text-eid-gold/50"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <path
            d="M24 4L28.5 13.5L38 18L28.5 22.5L24 32L19.5 22.5L10 18L19.5 13.5L24 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M24 16L32 24L24 32L16 24L24 16Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        <p
          className="font-arabic text-2xl text-eid-gold"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
        </p>
        <p
          className="mt-3 font-body text-sm text-eid-muted"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="250"
        >
          May Allah accept [our deeds] from us and from you.
        </p>
        <div className="mt-6 h-px w-16 bg-eid-gold/30" />
        <p
          className="mt-6 font-body text-xs text-eid-muted"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-delay="400"
        >
          Made with ♥ for Eid 1446H
        </p>
      </div>
    </footer>
  );
}
