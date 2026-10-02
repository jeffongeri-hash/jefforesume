import { useEffect, useMemo, useState } from "react";
import { supabase as sb } from "@/integrations/supabase/client";

/**
 * Family Advance Wishes Questionnaire
 * -------------------------------------------------------------------------
 * A non-legally-binding questionnaire for family members to record their
 * wishes around life-sustaining treatment, quality-of-life thresholds, and
 * emergency-relevant medical info (meds/allergies).
 *
 * SETUP (see README-setup.md for full details):
 * 1. Add this file to your Lovable project, e.g. as src/pages/FamilyDirective.tsx
 * 2. Add a route to it (e.g. /family-directive) in your router.
 * 3. Connect Supabase in Lovable (Lovable's native Supabase integration) and
 *    run supabase_schema.sql in the Supabase SQL editor to create the table.
 * 4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Lovable's Supabase
 *    integration usually sets these for you automatically).
 * 5. Set VITE_FAMILY_DIRECTIVE_PASSWORD to the shared password you want to
 *    use to gate this page. This is a soft, client-side gate only — see the
 *    security note in README-setup.md.
 */

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------
const PW_KEY = "family_directive_pw";
async function api(action: string, body: Record<string, unknown> = {}, password?: string) {
  const { data, error } = await sb.functions.invoke("family-directive", {
    body: { action, password: password ?? sessionStorage.getItem(PW_KEY) ?? "", ...body },
  });
  if (error) return { data: null, error };
  if (data?.error) return { data: null, error: new Error(data.error) };
  return { data: data?.data ?? null, error: null };
}
const SESSION_KEY = "family_directive_unlocked";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Choice = "yes" | "no" | "depends" | "";

interface ScenarioAnswer {
  choice: Choice;
  notes: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface DirectiveEntry {
  id?: string;
  person_name: string;
  relationship: string;
  date_of_birth: string;
  primary_care_physician: string;
  emergency_contacts: EmergencyContact[];
  medications: string;
  allergies: string;
  cpr: ScenarioAnswer;
  ventilation: ScenarioAnswer;
  nutrition_hydration: ScenarioAnswer;
  dialysis: ScenarioAnswer;
  coma_pvs: ScenarioAnswer;
  stroke_paralysis: ScenarioAnswer;
  dementia: ScenarioAnswer;
  pain_vs_alertness: ScenarioAnswer;
  care_setting: ScenarioAnswer;
  financial_burden: ScenarioAnswer;
  organ_donation: ScenarioAnswer;
  surrogate_decision_maker: string;
  additional_notes: string;
  created_at?: string;
  updated_at?: string;
}

const emptyScenario = (): ScenarioAnswer => ({ choice: "", notes: "" });

const emptyEntry = (): DirectiveEntry => ({
  person_name: "",
  relationship: "",
  date_of_birth: "",
  primary_care_physician: "",
  emergency_contacts: [{ name: "", phone: "", relationship: "" }],
  medications: "",
  allergies: "",
  cpr: emptyScenario(),
  ventilation: emptyScenario(),
  nutrition_hydration: emptyScenario(),
  dialysis: emptyScenario(),
  coma_pvs: emptyScenario(),
  stroke_paralysis: emptyScenario(),
  dementia: emptyScenario(),
  pain_vs_alertness: emptyScenario(),
  care_setting: emptyScenario(),
  financial_burden: emptyScenario(),
  organ_donation: emptyScenario(),
  surrogate_decision_maker: "",
  additional_notes: "",
});

// ---------------------------------------------------------------------------
// Scenario copy — question text + helper description per field
// ---------------------------------------------------------------------------
interface ScenarioDef {
  key: keyof Pick<
    DirectiveEntry,
    | "cpr"
    | "ventilation"
    | "nutrition_hydration"
    | "dialysis"
    | "coma_pvs"
    | "stroke_paralysis"
    | "dementia"
    | "pain_vs_alertness"
    | "care_setting"
    | "financial_burden"
    | "organ_donation"
  >;
  title: string;
  question: string;
  helper?: string;
}

const CORE_SCENARIOS: ScenarioDef[] = [
  {
    key: "cpr",
    title: "CPR / Resuscitation",
    question: "If your heart stops, do you want CPR attempted?",
    helper: "Includes chest compressions, defibrillation, and emergency medications.",
  },
  {
    key: "ventilation",
    title: "Mechanical Ventilation",
    question: "If you can't breathe on your own, do you want to be put on a ventilator?",
    helper: "Consider both short-term (likely to recover) and long-term/indefinite use separately in the notes.",
  },
  {
    key: "nutrition_hydration",
    title: "Artificial Nutrition & Hydration",
    question: "If you can't eat or drink on your own, do you want a feeding tube or IV fluids?",
  },
  {
    key: "dialysis",
    title: "Dialysis",
    question: "If your kidneys fail, do you want dialysis?",
  },
  {
    key: "coma_pvs",
    title: "Coma / Persistent Vegetative State",
    question:
      "If doctors believe you are in a coma or permanent vegetative state with little to no chance of meaningful recovery, do you want life-sustaining treatment continued?",
  },
  {
    key: "stroke_paralysis",
    title: "Severe Stroke with Paralysis",
    question:
      "If a stroke leaves you paralyzed (e.g., unable to move one or both sides of your body) but conscious and aware, do you want life-sustaining treatment continued?",
    helper: "Use the notes field to distinguish partial paralysis from full paralysis, or communication ability (e.g., can still speak/blink) from none.",
  },
];

const QOL_SCENARIOS: ScenarioDef[] = [
  {
    key: "dementia",
    title: "Cognitive Decline / Dementia",
    question:
      "If you develop advanced dementia and no longer recognize family or communicate meaningfully, do you want life-sustaining treatment for other conditions (e.g., pneumonia, infections)?",
  },
  {
    key: "pain_vs_alertness",
    title: "Pain Management vs. Alertness",
    question:
      "If pain medication would relieve suffering but significantly reduce your alertness or ability to interact with family, which do you prioritize?",
    helper: "Use notes to describe the tradeoff you'd want (e.g., 'comfort first, even if drowsy' vs. 'stay alert as long as tolerable').",
  },
  {
    key: "care_setting",
    title: "Care Setting",
    question: "If you needed long-term care, would you prefer to be cared for at home or in a facility?",
  },
  {
    key: "financial_burden",
    title: "Financial Burden Considerations",
    question:
      "Should the financial cost or burden on your family factor into decisions about extending treatment?",
  },
  {
    key: "organ_donation",
    title: "Organ & Tissue Donation",
    question: "If applicable, do you want to be an organ/tissue donor?",
  },
];

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------
function ChoicePills({
  value,
  onChange,
}: {
  value: Choice;
  onChange: (v: Choice) => void;
}) {
  const options: { value: Choice; label: string }[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "depends", label: "Depends / It's complicated" },
  ];
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            value === opt.value
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ScenarioBlock({
  def,
  answer,
  onChange,
}: {
  def: ScenarioDef;
  answer: ScenarioAnswer;
  onChange: (a: ScenarioAnswer) => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white">
      <div>
        <h4 className="font-semibold text-slate-900">{def.title}</h4>
        <p className="text-sm text-slate-600 mt-0.5">{def.question}</p>
        {def.helper && <p className="text-xs text-slate-400 mt-1">{def.helper}</p>}
      </div>
      <ChoicePills value={answer.choice} onChange={(choice) => onChange({ ...answer, choice })} />
      <span className="hidden print:inline text-sm font-medium">
        Answer: {answer.choice ? answer.choice.toUpperCase() : "—"}
      </span>
      <textarea
        className="w-full border border-slate-200 rounded-md p-2 text-sm print:border-none print:p-0"
        rows={2}
        placeholder="Notes / conditions / anything you want family to understand about this..."
        value={answer.notes}
        onChange={(e) => onChange({ ...answer, notes: e.target.value })}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password gate
// ---------------------------------------------------------------------------
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await api("check", {}, input);
    if (!err) {
      sessionStorage.setItem(SESSION_KEY, "1");
      sessionStorage.setItem(PW_KEY, input);
      onUnlock();
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="max-w-sm w-full bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Family Advance Wishes</h1>
        <p className="text-sm text-slate-600">
          This page is password-protected. Enter the family password to continue.
        </p>
        <input
          type="password"
          autoFocus
          className="w-full border border-slate-300 rounded-md p-2 text-sm"
          placeholder="Password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-md py-2 text-sm font-medium hover:bg-slate-800"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function FamilyDirective() {
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<DirectiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<DirectiveEntry>(emptyEntry());
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1" && sessionStorage.getItem(PW_KEY)) setUnlocked(true);
  }, []);

  useEffect(() => {
    if (unlocked) fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await api("list");
    if (!error && data) setEntries(data as DirectiveEntry[]);
    setLoading(false);
  };

  const startNew = () => {
    setDraft(emptyEntry());
    setSelectedId("new");
    setSaveMessage("");
  };

  const openEntry = (entry: DirectiveEntry) => {
    setDraft({ ...emptyEntry(), ...entry });
    setSelectedId(entry.id ?? "new");
    setSaveMessage("");
  };

  const updateScenario = (key: ScenarioDef["key"], value: ScenarioAnswer) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setDraft((d) => {
      const contacts = [...d.emergency_contacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...d, emergency_contacts: contacts };
    });
  };

  const addContact = () => {
    setDraft((d) => ({
      ...d,
      emergency_contacts: [...d.emergency_contacts, { name: "", phone: "", relationship: "" }],
    }));
  };

  const removeContact = (index: number) => {
    setDraft((d) => ({
      ...d,
      emergency_contacts: d.emergency_contacts.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    if (!draft.person_name.trim()) {
      setSaveMessage("Please enter a name before saving.");
      return;
    }
    setSaving(true);
    setSaveMessage("");
    const payload = { ...draft };
    delete (payload as any).created_at;
    delete (payload as any).updated_at;

    let result;
    if (selectedId && selectedId !== "new") {
      result = await api("update", { id: selectedId, payload });
    } else {
      const { id, ...withoutId } = payload;
      result = await api("insert", { payload: withoutId });
    }

    setSaving(false);
    if (result.error) {
      setSaveMessage(`Error saving: ${result.error.message}`);
      return;
    }
    setSaveMessage("Saved.");
    setSelectedId(result.data.id);
    setDraft(result.data as DirectiveEntry);
    fetchEntries();
  };

  const deleteEntry = async () => {
    if (!selectedId || selectedId === "new") return;
    if (!confirm(`Delete ${draft.person_name}'s entry? This cannot be undone.`)) return;
    await api("delete", { id: selectedId });
    setSelectedId(null);
    fetchEntries();
  };

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(PW_KEY);
    setUnlocked(false);
    setSelectedId(null);
  };

  const goPrint = () => {
    setPrintMode(true);
    setTimeout(() => window.print(), 100);
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // ---- List view ----
  if (!selectedId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Family Advance Wishes</h1>
              <p className="text-sm text-slate-500 mt-1">
                Not a legal document. This just helps the family understand each other's wishes.
              </p>
            </div>
            <button onClick={lock} className="text-sm text-slate-500 hover:text-slate-800 print:hidden">
              Lock
            </button>
          </div>

          <div className="flex justify-between items-center print:hidden">
            <h2 className="font-semibold text-slate-800">Choose your name</h2>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-slate-500">No entries yet. Add the first one above.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => openEntry(e)}
                  className="w-full text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors"
                >
                  <div className="font-medium text-slate-900">{e.person_name}</div>
                  <div className="text-sm text-slate-500">
                    {e.relationship || "—"}
                    {e.updated_at ? ` · updated ${new Date(e.updated_at).toLocaleDateString()}` : ""}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Detail / edit view ----
  return (
    <div className={`min-h-screen bg-slate-50 px-4 py-10 ${printMode ? "print:bg-white" : ""}`}>
      <div className="max-w-3xl mx-auto space-y-8 print:max-w-full">
        <div className="flex items-center justify-between print:hidden">
          <button onClick={() => setSelectedId(null)} className="text-sm text-slate-500 hover:text-slate-800">
            ← Back to list
          </button>
          <div className="flex gap-2">
            <button onClick={goPrint} className="text-sm border border-slate-300 rounded-md px-3 py-1.5 hover:border-slate-500">
              Print / Save as PDF
            </button>
          </div>
        </div>

        <header className="space-y-1 print:text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {draft.person_name ? `${draft.person_name}'s Wishes` : "New Entry"}
          </h1>
          <p className="text-sm text-slate-500 print:hidden">
            Not a legal document — not a substitute for a formal advance directive, living will, or power of attorney.
          </p>
        </header>

        {/* Identity & emergency info */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-lg">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full name" value={draft.person_name} onChange={(v) => setDraft({ ...draft, person_name: v })} />
            <Field label="Relationship (to Jeff)" value={draft.relationship} onChange={(v) => setDraft({ ...draft, relationship: v })} />
            <Field label="Date of birth" type="date" value={draft.date_of_birth} onChange={(v) => setDraft({ ...draft, date_of_birth: v })} />
            <Field label="Primary care physician" value={draft.primary_care_physician} onChange={(v) => setDraft({ ...draft, primary_care_physician: v })} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Emergency contacts</label>
              <button onClick={addContact} className="text-xs text-slate-500 hover:text-slate-800 print:hidden">
                + Add contact
              </button>
            </div>
            {draft.emergency_contacts.map((c, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <input
                  className="border border-slate-200 rounded-md p-2 text-sm sm:col-span-2"
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => updateContact(i, "name", e.target.value)}
                />
                <input
                  className="border border-slate-200 rounded-md p-2 text-sm"
                  placeholder="Phone"
                  value={c.phone}
                  onChange={(e) => updateContact(i, "phone", e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="border border-slate-200 rounded-md p-2 text-sm flex-1"
                    placeholder="Relationship"
                    value={c.relationship}
                    onChange={(e) => updateContact(i, "relationship", e.target.value)}
                  />
                  {draft.emergency_contacts.length > 1 && (
                    <button onClick={() => removeContact(i)} className="text-xs text-red-500 print:hidden">
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Medical background */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-lg">Medications & Allergies</h2>
          <p className="text-xs text-slate-400">
            This is the info an ER team would want fastest. Keep it current.
          </p>
          <TextArea label="Current medications (name, dose, frequency)" value={draft.medications} onChange={(v) => setDraft({ ...draft, medications: v })} />
          <TextArea label="Allergies (medications, foods, other) and reaction type" value={draft.allergies} onChange={(v) => setDraft({ ...draft, allergies: v })} />
        </section>

        {/* Core scenarios */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-lg">Life-Sustaining Treatment</h2>
          <div className="space-y-3">
            {CORE_SCENARIOS.map((def) => (
              <ScenarioBlock key={def.key} def={def} answer={draft[def.key]} onChange={(a) => updateScenario(def.key, a)} />
            ))}
          </div>
        </section>

        {/* Quality of life scenarios */}
        <section className="space-y-3 break-before-page">
          <h2 className="font-semibold text-slate-800 text-lg">Quality of Life</h2>
          <div className="space-y-3">
            {QOL_SCENARIOS.map((def) => (
              <ScenarioBlock key={def.key} def={def} answer={draft[def.key]} onChange={(a) => updateScenario(def.key, a)} />
            ))}
          </div>
        </section>

        {/* Surrogate + notes */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-lg">Decision-Making & Notes</h2>
          <Field
            label="Who would you want making medical decisions for you if you couldn't?"
            value={draft.surrogate_decision_maker}
            onChange={(v) => setDraft({ ...draft, surrogate_decision_maker: v })}
          />
          <TextArea label="Anything else your family should know" value={draft.additional_notes} onChange={(v) => setDraft({ ...draft, additional_notes: v })} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-lg">Insurance to Look Into</h2>
          <TextArea
            label="Life insurance (company, policy #, beneficiary, through work or private)"
            value={draft.life_insurance}
            onChange={(v) => setDraft({ ...draft, life_insurance: v })}
          />
          <TextArea
            label="Long-term disability insurance (company, policy #, through work or private)"
            value={draft.disability_insurance}
            onChange={(v) => setDraft({ ...draft, disability_insurance: v })}
          />
        </section>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={save}
            disabled={saving}
            className="bg-slate-900 text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {saveMessage && <span className="text-sm text-slate-500">{saveMessage}</span>}
        </div>

        {draft.updated_at && (
          <p className="text-xs text-slate-400 print:mt-4">
            Last updated {new Date(draft.updated_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------
function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-slate-200 rounded-md p-2 text-sm print:border-none print:p-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <textarea
        className="w-full border border-slate-200 rounded-md p-2 text-sm print:border-none print:p-0"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
