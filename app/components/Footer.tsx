import { BookOpen } from "lucide-react";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Docs", "API", "Help Center", "Status"],
    Legal: ["Privacy", "Terms", "Cookies"],
  };

  return (
    <footer className="bg-ink text-paper px-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-paper/10 flex items-center justify-center">
                <BookOpen size={15} className="text-amber-400" />
              </div>
              <span className="font-display font-semibold text-lg">
                Nano<span className="text-amber-400">Syllabus</span>
              </span>
            </div>
            <p className="font-body text-sm text-paper/50 leading-relaxed max-w-xs">
              The easiest way for teachers to share knowledge and for students to access it — through conversation.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {["𝕏", "in", "📧"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-paper/5 hover:bg-paper/10 border border-paper/10 flex items-center justify-center text-paper/50 hover:text-paper transition-all duration-200 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-xs uppercase tracking-widest text-paper/30 mb-5">
                {category}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-body text-sm text-paper/50 hover:text-paper transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-paper/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-paper/30">
            © 2025 NanoSyllabus. All rights reserved.
          </p>
          <p className="font-mono text-xs text-paper/20">
            Built for educators, powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}