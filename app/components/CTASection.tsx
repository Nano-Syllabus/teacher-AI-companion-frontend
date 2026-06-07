import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl bg-ink text-paper overflow-hidden px-10 py-20">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-400/15 rounded-full blur-[80px] pointer-events-none" />

          <p className="section-label text-amber-400 relative">Ready to begin?</p>
          <h2 className="relative font-display text-4xl md:text-5xl font-bold text-paper leading-tight mb-6">
            Turn your materials into<br />
            <em className="text-amber-400">a living classroom.</em>
          </h2>
          <p className="relative font-body text-lg text-paper/60 max-w-xl mx-auto mb-10">
            Join thousands of educators who give their students 24/7 access to expert knowledge — powered by their own course materials.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-amber-400 text-ink px-8 py-4 rounded-full font-body font-semibold text-sm hover:bg-amber-300 transition-colors duration-300 group"
            >
              Create Your First Notebook
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border border-paper/20 text-paper px-8 py-4 rounded-full font-body font-medium text-sm hover:border-paper/50 transition-colors duration-300"
            >
              See an Example →
            </a>
          </div>

          <p className="relative mt-8 font-mono text-xs text-paper/30">
            Free forever plan · No credit card · Setup in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}