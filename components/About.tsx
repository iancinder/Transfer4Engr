import Reveal from "./Reveal";

const CREDENTIALS = [
  { label: "Transferred into", value: "UT Austin ECE" },
  { label: "Engineering GPA", value: "4.00" },
  { label: "Time to transfer", value: "1 year" },
];

/**
 * Founder story. Credibility here comes from Ian's real record — no
 * invented social proof anywhere on the site.
 */
export default function About() {
  return (
    <section id="about" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left column: heading + credential stats */}
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
              About the founder
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              &ldquo;I just did this. I&apos;ll show you exactly how.&rdquo;
            </h2>

            <dl className="mt-10 divide-y divide-line border border-line rounded-sm">
              {CREDENTIALS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-4 px-4 py-3.5"
                >
                  <dt className="font-mono text-xs uppercase tracking-wider text-ink-400">
                    {stat.label}
                  </dt>
                  <dd className="font-mono text-sm font-medium text-plum-600">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Right column: the story */}
          <Reveal delay={0.12}>
            <div className="space-y-5 text-base leading-relaxed text-ink-700">
              <p>
                Hi - I&apos;m Ian.
                A year ago I was headed off to a middling 4-year OOS engineering
                program, excited to give that school a chance but wanting
                to keep the door of transferring open. Now, a year and some change later,
                I am at a better school and am a better engineer because of that choice.
                I want to give you the guidance I wish I had and see you succeed past whatever
                people tell you is possible.
              </p>
              <p>
                I didn&apos;t get into UT by accident - I probably went to at least 20 different
                clubs&apos; meetings, trying to see where I had a chance to contribute in a way
                that would look good on my application file. I went to so many goddamned research
                connects (and didn&apos;t even land my role through one of them). All of this is to say
                I will help you (obviously, you&apos;re paying me to), but you have to be willing to work
                alongside the help I&apos;m giving.
              </p>
              <p>
                While trying to apply as a transfer, I found the seemingly complete lack of
                worthwhile transfer content to be frustrating. It is NOT the same as freshman admissions,
                and treating it that way will get you nowhere. I also offer the unique perspective of someone
                who knows where the gaps lie, because I stood where you stand not even a year ago.
              </p>
              <p>
                If you are like me, and know you are capable of more than your current school
                has to offer you, please consider reaching out or filling out the assessment -
                I personally read each response and try my best to give an honest read on where you stand.
              </p>
              <p className="font-mono text-sm text-plum-600">— Ian</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
