import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import Section from "../components/Section";
import SectionSidebar from "../components/SectionSidebar";
import { socials } from "../data/content";
import { fireConfetti } from "../lib/confetti";
import { flashPress } from "../lib/pressFlash";

const navItems = [{ id: "contact", label: "Contact" }];

const serviceId = import.meta.env.VITE_SERVICE_ID;
const templateId = import.meta.env.VITE_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;

const emptyForm = { name: "", email: "", message: "" };

const inputClass =
  "rounded-xl border border-panel-border bg-panel px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none";

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const sendButtonRef = useRef(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Sends the message, then pops confetti from the button once it goes through
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: form.name,
          email: form.email,
          subject: "Portfolio contact form",
          message: form.message,
        },
        publicKey,
      );
      const rect = sendButtonRef.current?.getBoundingClientRect();
      if (rect) fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setStatus("sent");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="flex flex-col gap-16 pb-16 pt-10">
      <SectionSidebar sections={navItems} />
      <Section id="contact" title="Contact">
        <p className="max-w-sm text-sm text-text-dim">
          Got a question, an opportunity, or just want to say hi, send a message below.
        </p>

        {status === "sent" ? (
          <div className="rounded-2xl border border-panel-border bg-panel p-6 text-sm text-text-dim">
            <p className="font-medium text-text">Message sent, thanks!</p>
            <p className="mt-1">I'll get back to you soon.</p>
            <p className="mt-2 text-xs italic">Feel free to check out any of my social platforms below.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 text-xs text-accent-2"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-faint" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-faint" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-faint" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className={`resize-none ${inputClass}`}
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400">
                Something went wrong sending that, please try again.
              </p>
            )}

            <button
              ref={sendButtonRef}
              type="submit"
              disabled={status === "sending"}
              onPointerDown={flashPress}
              className="flex w-fit items-center gap-2 rounded-full bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-200 shadow-[inset_0_0_0_2px_#616467] transition duration-200 hover:bg-[#616467] hover:text-white data-[pressed]:bg-[#616467] data-[pressed]:text-white disabled:opacity-60"
            >
              {status === "sending" && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="size-3.5 animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                </svg>
              )}
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}

        <div className="flex gap-2.5 pt-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="flex size-9 items-center justify-center rounded-full border border-panel-border bg-panel transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              <img src={social.icon} alt="" className="size-4 opacity-85 invert brightness-150" />
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
