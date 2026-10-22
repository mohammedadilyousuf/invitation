import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../data/config';
import Reveal from './Reveal';
import { Frame, Overlay, SectionTitle } from './Ornaments';
import { fmtDate } from '../utils';

const EMPTY = { name: '', guests: '1', attendance: 'yes', message: '', website: '' }; // `website` is a spam trap

export default function RSVP() {
  const { rsvp, couple } = config;
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const attending = form.attendance === 'yes';
  const waText =
    `${attending ? 'Joyfully accepts' : 'Regretfully declines'} - ${couple.groom} & ${couple.bride}\n` +
    `Invite: ${config.invite === 'walima' ? 'Walima only' : 'Nikah & Walima'}\n` +
    `Name: ${form.name}\n` +
    (attending ? `Guests: ${form.guests}\n` : '') +
    (form.message ? `Message: ${form.message}` : '');
  const waHref = `https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(waText)}`;

  async function submit(e) {
    e.preventDefault();
    if (form.website) return setState('sent'); // bots fill the hidden field; pretend success
    if (!rsvp.endpoint) return setState('sent'); // WhatsApp-only mode
    setState('sending');
    try {
      // Google Apps Script has no CORS preflight support, so send a "simple" request:
      // text/plain body + no-cors. The response is opaque, so a resolved fetch counts as success.
      const { website, ...data } = form;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000); // never hang on "Sending…"
      await fetch(rsvp.endpoint, {
        signal: ctrl.signal,
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...data, invite: config.invite }),
      });
      clearTimeout(timer);
      setState('sent');
    } catch (err) {
      console.error('RSVP submit failed:', err);
      setState('error');
    }
  }

  return (
    <section id="rsvp" className="relative scroll-mt-4 overflow-hidden px-5 py-28 sm:py-36">
      <Overlay src="floral.jpg" className="absolute -right-10 -top-6 w-[80%] -scale-x-100 opacity-70" />
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="relative">
        <SectionTitle eyebrow="Kindly reply" title="RSVP" />
        <Reveal className="mx-auto max-w-lg">
          <div style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,75,.2))' }}>
            <Frame ch={22} bg="#100c07" innerClass="px-6 py-10 sm:px-10">
              <AnimatePresence mode="wait">
                {state === 'sent' ? (
                  <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center">
                    <p className="font-arabic text-3xl text-gold-soft" dir="rtl">جزاك الله خيرا</p>
                    <h3 className="mt-3 font-display text-4xl text-cream">Thank you, {form.name || 'dear guest'}</h3>
                    <p className="mt-4 font-display text-xl italic text-cream/80">
                      {attending
                        ? 'We are delighted that you will be joining us. Your presence is a blessing.'
                        : 'We will miss you, and keep you in our duas.'}
                    </p>
                    {rsvp.whatsappNumber && (
                      <>
                        <p className="mt-6 text-sm text-cream/60">
                          {rsvp.endpoint ? 'Your reply has been saved. You may also let the family know on WhatsApp.' : 'One last step: send your reply to the family on WhatsApp.'}
                        </p>
                        <a href={waHref} target="_blank" rel="noopener noreferrer" className={`btn-gold mt-4 ${rsvp.endpoint ? '' : 'btn-solid'}`}>
                          Send on WhatsApp
                        </a>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-7">
                    <p className="text-center font-display text-lg italic text-cream/75">
                      Kindly respond by {fmtDate(rsvp.deadline)}
                    </p>
                    <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                    <label className="block">
                      <span className="eyebrow">Guest Name</span>
                      <input required className="field" value={form.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" />
                    </label>
                    <div className="grid gap-7 sm:grid-cols-2">
                      <label className="block">
                        <span className="eyebrow">Attendance</span>
                        <select className="field" value={form.attendance} onChange={set('attendance')}>
                          <option value="yes">Joyfully accept</option>
                          <option value="no">Regretfully decline</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="eyebrow">Number of Guests</span>
                        <select className="field disabled:opacity-40" value={form.guests} onChange={set('guests')} disabled={!attending}>
                          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="block">
                      <span className="eyebrow">Message</span>
                      <textarea rows={3} className="field resize-none" value={form.message} onChange={set('message')} placeholder="Your duas and wishes" />
                    </label>
                    {state === 'error' && (
                      <p className="text-center text-sm text-red-300">
                        We couldn't save your reply. Please try again{rsvp.whatsappNumber && <>, or <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline">send it on WhatsApp</a></>}.
                      </p>
                    )}
                    <div className="text-center">
                      <button type="submit" disabled={state === 'sending'} className="btn-gold btn-solid">
                        {state === 'sending' ? 'Sending…' : 'Submit'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Frame>
          </div>
        </Reveal>
        <p className="mt-8 text-center text-sm text-cream/70">
          Questions? {config.contact.name}: <a className="text-gold-soft underline-offset-4 hover:underline" href={`tel:${config.contact.phone.replace(/\s/g, '')}`}>{config.contact.phone}</a>
        </p>
      </div>
    </section>
  );
}
