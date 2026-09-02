import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LIFE_YEARS,
  TOTAL_WEEKS,
  WEEKS_PER_YEAR,
  calculateLifeSnapshot,
  formatDateInput,
  getWeekDetails,
} from "./lib/life.js";
import {
  clearBirthDate,
  readBirthDate,
  saveBirthDate,
} from "./lib/storage.js";

const AGE_MARKERS = Array.from({ length: 16 }, (_, index) => (index + 1) * 5);
const WEEK_INDEXES = Array.from({ length: TOTAL_WEEKS }, (_, index) => index);

type OnboardingStep = "age" | "birth-date";

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function LifeCalendar() {
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("age");
  const [ageInput, setAgeInput] = useState("");
  const [birthDateInput, setBirthDateInput] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ageInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const todayInput = useMemo(() => formatDateInput(), []);

  useEffect(() => {
    const loadStoredDate = window.setTimeout(() => {
      const storedBirthDate = readBirthDate();
      if (storedBirthDate) setBirthDate(storedBirthDate);
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(loadStoredDate);
  }, []);

  useEffect(() => {
    if (onboardingStep === "birth-date") {
      birthDateInputRef.current?.focus();
    } else {
      ageInputRef.current?.focus();
    }
  }, [onboardingStep]);

  const snapshot = useMemo(
    () => (birthDate ? calculateLifeSnapshot(birthDate) : null),
    [birthDate],
  );

  const enteredDateSnapshot = useMemo(() => {
    if (!birthDateInput) return null;
    try {
      return calculateLifeSnapshot(birthDateInput);
    } catch {
      return null;
    }
  }, [birthDateInput]);

  const ageMismatch =
    enteredDateSnapshot &&
    ageInput !== "" &&
    enteredDateSnapshot.age !== Number(ageInput);

  const weekCells = useMemo(() => {
    if (!birthDate || !snapshot) return null;

    return WEEK_INDEXES.map((weekIndex) => {
      const details = getWeekDetails(birthDate, weekIndex);
      const isLived = weekIndex < snapshot.weeksAlive;
      const isCurrent = weekIndex === snapshot.weeksAlive;

      return (
        <span
          aria-hidden="true"
          className={`week${isLived ? " week--lived" : ""}${isCurrent ? " week--current" : ""}`}
          data-tooltip={`Semana ${details.number}\n${details.dateRange}\nEdad: ${details.age} años`}
          data-week=""
          key={weekIndex}
        />
      );
    });
  }, [birthDate, snapshot]);

  function continueToBirthDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const age = Number(ageInput);
    if (!Number.isInteger(age) || age < 0 || age > 79) {
      setError("Ingresá una edad entre 0 y 79 años.");
      return;
    }
    setError("");
    setOnboardingStep("birth-date");
  }

  function submitBirthDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enteredDateSnapshot) {
      setError("Elegí una fecha de nacimiento válida.");
      return;
    }
    if (enteredDateSnapshot.age < 0) {
      setError("La fecha de nacimiento no puede ser futura.");
      return;
    }
    if (enteredDateSnapshot.age >= LIFE_YEARS) {
      setError("Este calendario representa edades entre 0 y 79 años.");
      return;
    }

    saveBirthDate(birthDateInput);
    setBirthDate(birthDateInput);
    setError("");
    setIsEditing(false);
  }

  function beginEditing() {
    if (!birthDate || !snapshot) return;
    setAgeInput(String(snapshot.age));
    setBirthDateInput(birthDate);
    setOnboardingStep("birth-date");
    setError("");
    setResetArmed(false);
    setIsEditing(true);
  }

  function resetCalendar() {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }

    clearBirthDate();
    setBirthDate(null);
    setAgeInput("");
    setBirthDateInput("");
    setOnboardingStep("age");
    setError("");
    setIsEditing(false);
    setResetArmed(false);
  }

  function moveTooltip(event: ReactPointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-week]");
    const tooltip = tooltipRef.current;
    if (!target || !tooltip) return;

    tooltip.textContent = target.dataset.tooltip ?? "";
    tooltip.dataset.visible = "true";

    const tooltipBox = tooltip.getBoundingClientRect();
    const gap = 14;
    const left = Math.min(event.clientX + gap, window.innerWidth - tooltipBox.width - 12);
    const top = Math.min(event.clientY + gap, window.innerHeight - tooltipBox.height - 12);
    tooltip.style.transform = `translate(${Math.max(12, left)}px, ${Math.max(12, top)}px)`;
  }

  function hideTooltip() {
    if (tooltipRef.current) tooltipRef.current.dataset.visible = "false";
  }

  if (!hasLoaded || !birthDate || !snapshot || isEditing) {
    return (
      <main className={`onboarding${hasLoaded ? " onboarding--ready" : ""}`}>
        <section className="onboarding__content" aria-labelledby="onboarding-title">
          <p className="eyebrow">80 años · 4.160 semanas</p>
          <h1 id="onboarding-title">Memento Mori</h1>
          <p className="onboarding__intro">Cada cuadrado representa una semana.</p>

          {onboardingStep === "age" && !isEditing ? (
            <form className="onboarding__form" onSubmit={continueToBirthDate}>
              <p className="step-label">01 / 02</p>
              <label htmlFor="age">¿Cuántos años tenés?</label>
              <input
                autoComplete="off"
                id="age"
                inputMode="numeric"
                max="79"
                min="0"
                onChange={(event) => {
                  setAgeInput(event.target.value);
                  setError("");
                }}
                placeholder="37"
                ref={ageInputRef}
                required
                type="number"
                value={ageInput}
              />
              <p className="form-message" role="alert">{error}</p>
              <button className="primary-button" type="submit">Continuar</button>
            </form>
          ) : (
            <form className="onboarding__form" onSubmit={submitBirthDate}>
              <p className="step-label">02 / 02</p>
              <label htmlFor="birth-date">¿Cuándo naciste?</label>
              <input
                id="birth-date"
                max={todayInput}
                onChange={(event) => {
                  setBirthDateInput(event.target.value);
                  setError("");
                }}
                ref={birthDateInputRef}
                required
                type="date"
                value={birthDateInput}
              />
              <div className="form-message" role="status">
                {error || (ageMismatch
                  ? `La fecha corresponde a ${enteredDateSnapshot.age} años. Usaremos la fecha de nacimiento.`
                  : "")}
              </div>
              <button className="primary-button" type="submit">Ver mi vida</button>
              <div className="form-actions">
                {!isEditing ? (
                  <button
                    className="text-button"
                    onClick={() => {
                      setOnboardingStep("age");
                      setError("");
                    }}
                    type="button"
                  >
                    Volver
                  </button>
                ) : (
                  <button
                    className="text-button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                    type="button"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          <p className="privacy-note">Tu fecha queda guardada sólo en este dispositivo.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="poster-shell">
      <article className="poster">
        <header className="poster__header">
          <p className="eyebrow">80 años · 4.160 semanas</p>
          <h1>Memento Mori</h1>
          <p className="poster__subtitle">Una semana a la vez.</p>
          <p className="poster__status" aria-live="polite">
            <span>{snapshot.age} años</span>
            <span aria-hidden="true">·</span>
            <span>{formatNumber(snapshot.weeksAlive)} semanas vividas</span>
          </p>
        </header>

        <section className="calendar-region" aria-label="Calendario de vida">
          <p className="mobile-scroll-hint">Deslizá para recorrer las 52 semanas →</p>
          <div
            aria-label={`Cuadrícula de ${LIFE_YEARS} años por ${WEEKS_PER_YEAR} semanas. ${formatNumber(snapshot.weeksAlive)} semanas completas vividas.`}
            className="calendar-scroll"
          >
            <div className="calendar-canvas">
              <div
                className="life-grid"
                onPointerLeave={hideTooltip}
                onPointerMove={moveTooltip}
                role="img"
              >
                {weekCells}
              </div>
              <div aria-hidden="true" className="age-rail">
                {AGE_MARKERS.map((age) => (
                  <span
                    className="age-marker"
                    key={age}
                    style={{ gridRow: age }}
                  >
                    {age}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="poster__footer">
          <p>Los cálculos se realizan localmente en tu navegador.</p>
          <nav aria-label="Opciones del calendario">
            <button className="text-button" onClick={beginEditing} type="button">
              Cambiar fecha de nacimiento
            </button>
            <span aria-hidden="true">·</span>
            <button className="text-button" onClick={resetCalendar} type="button">
              {resetArmed ? "Confirmar reinicio" : "Reiniciar"}
            </button>
          </nav>
        </footer>
      </article>

      <div aria-hidden="true" className="week-tooltip" ref={tooltipRef} />
    </main>
  );
}
