import { useEffect, useMemo, useState } from "react";

const PROGRAM_API_URL = "https://dashboard.igeco.mx/api/programa/completo";
const MEDIA_BASE_URL = "https://dashboard.igeco.mx";
const DRONE_PROGRAM_ID = 10;

export function ConferenceProgram({ language = "es" }) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function getProgram() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(PROGRAM_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const json = await response.json();
        const stages = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        const droneProgram =
          stages.find((stage) => Number(stage.id) === DRONE_PROGRAM_ID) ||
          null;

        setProgram(droneProgram ? normalizeProgram(droneProgram) : null);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al cargar el programa:", error);
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getProgram();

    return () => {
      controller.abort();
    };
  }, []);

  const days = useMemo(() => program?.dias || [], [program]);
  const selectedDay = days[activeDay] || days[0] || null;

  useEffect(() => {
    if (days.length > 0 && activeDay > days.length - 1) {
      setActiveDay(0);
    }
  }, [activeDay, days.length]);

  if (loading) {
    return (
      <section className="bg-[#050505] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="rounded-lg border border-white/10 bg-[#111] px-5 py-4 text-sm text-white/75">
            {language === "es" ? "Cargando programa..." : "Loading program..."}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#050505] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="rounded-lg border border-red-400/30 bg-[#1a0a0a] px-5 py-4 text-sm text-red-100">
            {language === "es"
              ? "No se pudo cargar el programa."
              : "The program could not be loaded."}
          </p>
        </div>
      </section>
    );
  }

  if (!program || days.length === 0) {
    return (
      <section className="bg-[#050505] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="rounded-lg border border-white/10 bg-[#111] px-5 py-4 text-sm text-white/75">
            {language === "es"
              ? "No hay información de programa disponible."
              : "No program information available."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#050505] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-9">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.22em] text-cyan-300">
            {language === "es" ? "Agenda" : "Agenda"}
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black uppercase leading-none md:text-5xl">
                {pickText(language, program.name, program.name_en) ||
                  "DRONE THEATER"}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
                {language === "es"
                  ? "Selecciona un día para ver horarios, conferencias y ponentes del programa."
                  : "Pick a day to see the schedule, conferences and speakers."}
              </p>
            </div>
          </div>
        </header>

        <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
          {language === "es" ? "Selecciona el día" : "Select a day"}
        </div>
        <DayNavigation
          days={days}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          language={language}
          className="mb-8"
        />

        {selectedDay ? (
          <DayBanner
            day={selectedDay}
            language={language}
            index={activeDay}
          />
        ) : null}

        <SessionLegend language={language} />

        <div className="space-y-5">
          {selectedDay ? (
            <ProgramDay
              key={selectedDay.id ?? `${selectedDay.date}-${activeDay}`}
              day={selectedDay}
              language={language}
              index={activeDay}
            />
          ) : null}
        </div>

      </div>
    </section>
  );
}

function DayNavigation({
  days,
  activeDay,
  setActiveDay,
  language,
  className = "",
}) {

  return (
    <nav
      className={`${className} flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0d0d0d] p-3 lg:flex-row lg:items-center lg:justify-between`}
      aria-label={
        language === "es" ? "Navegación por días" : "Day navigation"
      }
    >

      <div className="flex flex-wrap justify-center gap-2">
        {days.map((day, index) => {
          const isActive = index === activeDay;
          return (
            <button
              key={day.id ?? `${day.date}-${index}`}
              type="button"
              className={
                isActive
                  ? "min-h-12 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-black text-black shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                  : "min-h-12 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
              }
              aria-current={isActive ? "date" : undefined}
              onClick={() => setActiveDay(index)}
            >
              <span className="block text-xs uppercase tracking-[0.16em]">
                {language === "es" ? "Día" : "Day"} {index + 1}
              </span>
              <span>{day.name || formatDateShort(day.date, language)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function DayBanner({ day, language, index }) {
  const sessions = day.conferencias || [];

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-[#121212] p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 flex-none place-items-center rounded-lg bg-cyan-300 text-3xl font-black text-black">
          {dayNumber(day.date) || index + 1}
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
            {day.name || `${language === "es" ? "Día" : "Day"} ${index + 1}`}
          </p>
          <h3 className="mt-1 text-2xl font-black text-white">
            {formatDateLong(day.date, language)}
          </h3>
        </div>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-black text-zinc-200">
        <span className="h-2 w-2 rounded-full border-2 border-cyan-300" />
        {sessions.length}{" "}
        {language === "es"
          ? sessions.length === 1
            ? "sesión"
            : "sesiones"
          : sessions.length === 1
            ? "session"
            : "sessions"}
      </span>
    </div>
  );
}

function SessionLegend({ language }) {
  return (
    <div className="mb-5 flex flex-wrap gap-3 text-sm font-semibold text-zinc-300">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-cyan-300" />
        {language === "es" ? "Conferencia" : "Conference"}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#0d9488]" />
        Panel
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#2563eb]" />
        Keynote
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#c2410c]" />
        {language === "es" ? "Taller" : "Workshop"}
      </div>
    </div>
  );
}

function ProgramDay({ day, language }) {
  const sessions = day.conferencias || [];

  if (sessions.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-[#111] p-5 text-sm text-zinc-300">
        {language === "es"
          ? "No hay sesiones para este día."
          : "No sessions for this day."}
      </p>
    );
  }

  return (
    <>
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} language={language} />
      ))}
    </>
  );
}

function SessionRow({ session, language }) {
  const title = pickText(language, session.title, session.title_en);
  const description = pickText(
    language,
    session.description,
    session.description_en,
  );
  const speakers = session.ponentes || [];
  const tags = normalizeTags(session.tags);
  const logo = mediaUrl(session.company_logo, "logos");
  const sessionLanguage = languageLabel(session.language, language);
  const meta = typeMeta(session.type);

  return (
    <article
      className="overflow-hidden rounded-lg border bg-[#111] transition hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(34,211,238,0.12)]"
      style={{ borderColor: meta.color }}
    >
      <div
        className="px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
        style={{ background: meta.color }}
      >
        {typeLabel(session.type, language)}
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-sm font-black text-white"
                style={{ background: meta.color }}
              >
                {formatTime(session.start_time)} - {formatTime(session.end_time)}
              </span>
              {sessionLanguage ? (
                <span
                  className="rounded-full border px-3 py-1.5 text-sm font-bold text-white"
                  style={{ borderColor: meta.color }}
                >
                {language === "es" ? "Idioma : " : "Language : "}{sessionLanguage}
                </span>
              ) : null}
              {session.room ? (
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-bold text-zinc-300">
                  {session.room}
                </span>
              ) : null}
            </div>

            <h4 className="text-xl font-black leading-tight text-white md:text-2xl">
              {title || (language === "es" ? "Sesión" : "Session")}
            </h4>
          </div>

          {logo ? (
            <div className="w-full max-w-44 flex-none rounded-lg border border-white/10 bg-white p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Powered by
              </p>
              <img
                className="max-h-16 w-full object-contain"
                src={logo}
                alt={session.company || title || ""}
                loading="lazy"
              />
            </div>
          ) : null}
        </div>

        {description ? (
          <p className="mt-4 max-w-5xl whitespace-pre-line text-sm leading-7 text-zinc-300 md:text-base">
            {description}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {speakers.length > 0 ? (
          <div className="mt-5">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              {language === "es"
                ? speakers.length === 1
                  ? "Ponente"
                  : "Ponentes"
                : speakers.length === 1
                  ? "Speaker"
                  : "Speakers"}
            </p>
            <div className="grid gap-3 lg:grid-cols-2">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id ?? speaker.name}
                  speaker={speaker}
                  language={language}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function SpeakerCard({ speaker, language }) {
  const photo = mediaUrl(speaker.photo, "ponentes");
  const role = pickText(
    language,
    speaker.position_esp || speaker.position,
    speaker.position_eng,
  );
  const company = pickText(language, speaker.company, speaker.company_eng);
  const bio = pickText(language, speaker.bio_esp, speaker.bio_eng);

  return (
    <div className="rounded-lg border border-white/10 bg-[#171717] p-3 transition hover:border-cyan-300/60">
      <div className="flex gap-3">
        {photo ? (
          <img
            className="h-16 w-16 flex-none rounded-full object-cover"
            src={photo}
            alt={speaker.name || ""}
            loading="lazy"
          />
        ) : (
          <span className="grid h-16 w-16 flex-none place-items-center rounded-full bg-zinc-800 text-lg font-black text-zinc-300">
            {initials(speaker.name)}
          </span>
        )}
        <div className="min-w-0">
          <h5 className="text-base font-black leading-tight text-white">
            {speaker.name}
          </h5>
          {role ? (
            <p className="mt-1 text-sm font-semibold text-zinc-300">{role}</p>
          ) : null}
          {company ? <p className="text-sm text-cyan-200">{company}</p> : null}
        </div>
      </div>

      {bio ? (
        <details className="mt-4 group">
          <summary className="cursor-pointer text-sm font-bold text-cyan-200 transition hover:text-cyan-100">
            {language === "es" ? "Semblanza" : "Bio"}
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-300">
            {bio}
          </p>
        </details>
      ) : null}
    </div>
  );
}

function normalizeProgram(program) {
  const dias = (program.dias || [])
    .slice()
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    .map((day) => ({
      ...day,
      conferencias: (day.conferencias || [])
        .slice()
        .sort((a, b) =>
          String(a.start_time || "").localeCompare(String(b.start_time || "")),
        ),
    }));

  return { ...program, dias };
}

function pickText(language, es, en) {
  const primary = language === "en" ? en : es;
  const fallback = language === "en" ? es : en;
  return cleanText(primary) || cleanText(fallback);
}

function cleanText(value) {
  if (value == null) return "";
  return String(value).trim();
}

function formatTime(value) {
  if (!value) return "";
  const [hour, minute] = String(value).split(":");
  return minute == null ? hour : `${hour}:${minute}`;
}

function dayNumber(dateStr) {
  const datePart = String(dateStr || "").slice(0, 10);
  const match = datePart.match(/^\d{4}-\d{2}-(\d{2})$/);
  return match ? match[1] : "";
}

function formatDateLong(dateStr, language) {
  const datePart = String(dateStr || "").slice(0, 10);
  if (!datePart) return "";
  const date = new Date(`${datePart}T12:00:00`);
  if (Number.isNaN(date.getTime())) return datePart;

  return date.toLocaleDateString(language === "en" ? "en-US" : "es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateStr, language) {
  const datePart = String(dateStr || "").slice(0, 10);
  if (!datePart) return "";
  const date = new Date(`${datePart}T12:00:00`);
  if (Number.isNaN(date.getTime())) return datePart;

  return date.toLocaleDateString(language === "en" ? "en-US" : "es-MX", {
    month: "short",
    day: "numeric",
  });
}

function mediaUrl(value, folder) {
  const path = cleanText(value);
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MEDIA_BASE_URL}/${folder}/${path}`;
}

function languageLabel(value, language) {
  const code = cleanText(value).toLowerCase();
  if (!code) return "";
  if (code === "es") return language === "es" ? "Español" : "Spanish";
  if (code === "en") return language === "es" ? "Inglés" : "English";
  return `${language === "es" ? "Idioma" : "Language"}: ${value}`;
}

function typeMeta(type) {
  const meta = {
    keynote: { color: "#2563eb" },
    panel: { color: "#0d9488" },
    conference: { color: "#22d3ee" },
    presentation: { color: "#0891b2" },
    technical: { color: "#64748b" },
    workshop: { color: "#c2410c" },
    break: { color: "#52525b" },
  };
  return meta[cleanText(type).toLowerCase()] || { color: "#22d3ee" };
}

function typeLabel(type, language) {
  const fallback = language === "en" ? "Session" : "Sesión";
  const labels = {
    keynote: ["Keynote", "Keynote"],
    panel: ["Panel", "Panel"],
    conference: ["Conferencia", "Conference"],
    presentation: ["Presentación", "Presentation"],
    technical: ["Técnica", "Technical"],
    workshop: ["Taller", "Workshop"],
    break: ["Receso", "Break"],
  };
  const key = cleanText(type).toLowerCase();
  const label = labels[key];
  if (!label) return cleanText(type) || fallback;
  return language === "en" ? label[1] : label[0];
}

function normalizeTags(tags) {
  let parsed = tags;

  for (let i = 0; i < 2; i += 1) {
    if (typeof parsed !== "string") break;
    const value = parsed.trim();
    if (!value) return [];
    try {
      parsed = JSON.parse(value);
    } catch {
      return [value];
    }
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.map(cleanText).filter(Boolean);
}

function initials(name) {
  const parts = cleanText(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
