"use client";

const steps = [
  {
    number: "01",
    actor: "Teacher",
    title: "Create a notebook",
    description:
      "Sign up and create a course notebook. Give it a name, subject, and description. You get a public profile page students can discover.",
  },
  {
    number: "02",
    actor: "Teacher",
    title: "Upload your materials",
    description:
      "Drag in your PDF syllabus, lecture notes, reading lists, and assignments. We index every word so students can query it all.",
  },
  {
    number: "03",
    actor: "Student",
    title: "Find your teacher",
    description:
      "Students search for your profile or you share a direct link. They see all your public notebooks and can open any with one click.",
  },
  {
    number: "04",
    actor: "Student",
    title: "Chat to learn",
    description:
      "Students ask questions in natural language. The AI answers using only your uploaded materials — grounded, accurate, no hallucinations.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-ink text-paper relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-widest uppercase text-amber-400 mb-4">How It Works</p>
          <h2 className="heading-lg text-paper mb-5">
            Simple for teachers.<br />
            <em className="text-amber-400">Powerful for students.</em>
          </h2>
          <p className="font-body text-lg text-paper/60 max-w-xl mx-auto">
            Four steps from signup to your first student conversation.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-paper/10 via-amber-400/40 to-paper/10 pointer-events-none" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Number badge */}
              <div className="relative inline-flex w-12 h-12 items-center justify-center rounded-full border border-paper/20 bg-paper/5 mb-6">
                <span className="font-display font-bold text-sm text-amber-400">{step.number}</span>
              </div>

              {/* Actor tag */}
              <div className="mb-4">
                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded-full border ${
                    step.actor === "Teacher"
                      ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                      : "bg-paper/10 border-paper/20 text-paper/60"
                  }`}
                >
                  {step.actor}
                </span>
              </div>

              <h3 className="font-display text-xl text-paper mb-3">{step.title}</h3>
              <p className="font-body text-sm text-paper/55 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-amber-400 text-ink px-7 py-3.5 rounded-full font-body font-semibold text-sm tracking-wide hover:bg-amber-300 transition-colors duration-300"
          >
            Start for Free — No Card Needed
          </a>
          <a
            href="#"
            className="font-body text-sm text-paper/50 hover:text-paper transition-colors underline underline-offset-4"
          >
            See a demo notebook →
          </a>
        </div>
      </div>
    </section>
  );
}