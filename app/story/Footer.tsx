const SOURCES = [
  {
    text: "Home Office, A Fairer Pathway to Settlement: Government Response to the Consultation (CP 1707), November 2026. Chapter 2, Chapter 8, Annexes A and B.",
    href: "https://www.gov.uk/government/consultations/earned-settlement",
  },
  {
    text: "Home Secretary's statement on earned settlement, 2 November 2026.",
    href: "https://www.gov.uk/government/speeches/home-secretary-earned-settlement-statement",
  },
  {
    text: "Immigration Skills Charge increase of 32% from 16 December 2025.",
    href: "https://www.mondaq.com/uk/general-immigration/1708274/immigration-skills-charge-isc-increase-from-16th-december-2025",
  },
  {
    text: "Household example: our own calculation using 2026/27 income tax and National Insurance rates for England, including employer contributions.",
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <h2 className="kicker">Sources</h2>
        <ol className="sources">
          {SOURCES.map((s) => (
            <li key={s.text}>
              {s.href ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.text}
                </a>
              ) : (
                s.text
              )}
            </li>
          ))}
        </ol>
        <p className="footer-note">
          An independent, non-partisan page made by a skilled-worker family on the ten-year path. Illustrations are
          AI-generated. Nothing here is legal advice.
        </p>
      </div>
    </footer>
  );
}
