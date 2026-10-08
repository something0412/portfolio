import emailjs from "@emailjs/browser";
import { useState } from "react";
import Section from "../components/Section";
import { socials } from "../data/content";

const serviceId = import.meta.env.VITE_SERVICE_ID;
const templateId = import.meta.env.VITE_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;

const emptyForm = { name: "", email: "", message: "" };

const inputClass =
  "rounded-xl border border-panel-border bg-panel px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none";

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        serviceId,
        templateId,
        {
          name: form.name,
          email: form.email,
          subject: "Portfolio contact form",
          message: form.message,
        },
        publicKey,
      )
      .then(() => {
        setStatus("sent");
        setForm(emptyForm);
      })
      .catch(() => setStatus("error"));
  };

  return (
    <main className="flex flex-col gap-16 pb-16 pt-10">
      <Section id="contact" title="Contact">
        <p className="max-w-sm text-sm text-text-dim">
          Got a question, an opportunity, or just want to say hi, send a message below.
        </p>

        {status === "sent" ? (
          <div className="rounded-2xl border border-panel-border bg-panel p-6 text-sm text-text-dim">
            <p className="font-medium text-text">Message sent, thanks!</p>
            <p className="mt-1">I'll get back to you soon.</p>
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
              type="submit"
              disabled={status === "sending"}
              className="w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
            >
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
