/**
 * MediFlow AI — browser-only clinical note generator.
 * Uses NLP-lite extraction (no API keys, runs entirely client-side).
 */
(function () {
  "use strict";

  const SYMPTOM_PATTERNS = [
    /\b(sore throat|throat pain|painful swallowing|odynophagia)\b/gi,
    /\b(fever|febrile|temperature|chills)\b/gi,
    /\b(cough|coughing)\b/gi,
    /\b(headache|migraine)\b/gi,
    /\b(nausea|vomiting|emesis)\b/gi,
    /\b(fatigue|tired|exhausted|lethargy)\b/gi,
    /\b(shortness of breath|dyspnea|difficulty breathing)\b/gi,
    /\b(chest pain)\b/gi,
    /\b(abdominal pain|stomach ache|belly pain)\b/gi,
    /\b(diarrhea|loose stools)\b/gi,
    /\b(constipation)\b/gi,
    /\b(dizziness|lightheaded)\b/gi,
    /\b(runny nose|rhinorrhea|nasal congestion)\b/gi,
    /\b(rash|itching|pruritus)\b/gi,
    /\b(joint pain|arthralgia)\b/gi,
    /\b(back pain)\b/gi,
    /\b(insomnia|trouble sleeping)\b/gi,
    /\b(anxiety|stress|worried)\b/gi,
    /\b(weight loss|weight gain)\b/gi,
  ];

  const DURATION_RE =
    /\b(?:for|since|about|approximately|around|last|past)\s+(?:the\s+)?(\d+)\s*(day|days|week|weeks|month|months|hour|hours|year|years)\b/gi;

  const VITAL_PATTERNS = [
    {
      label: "Temperature",
      re: /temperature\s*(?:is|of|:)?\s*([\d.]+)\s*°?\s*([fc])/gi,
    },
    { label: "Blood pressure", re: /blood pressure\s*(?:is|of|:)?\s*(\d+)\s*\/\s*(\d+)/gi },
    { label: "Pulse", re: /(?:pulse|heart rate)\s*(?:is|of|:)?\s*(\d+)/gi },
    { label: "Respiratory rate", re: /(?:respiratory rate|respirations?)\s*(?:is|of|:)?\s*(\d+)/gi },
    { label: "SpO2", re: /(?:spo2|oxygen saturation)\s*(?:is|of|:)?\s*(\d+)\s*%?/gi },
    { label: "Weight", re: /weight\s*(?:is|of|:)?\s*([\d.]+)\s*(kg|lb|lbs|pounds?)/gi },
  ];

  const EXAM_PATTERNS = [
    /\b(erythema|swelling|edema|tenderness|tender)\b[^.]{0,80}/gi,
    /\b(normal|unremarkable|clear|no (?:exudate|discharge|wheezes|crackles))\b[^.]{0,80}/gi,
    /\b(lymph nodes?|lymphadenopathy)\b[^.]{0,80}/gi,
    /\b(throat|tonsils?|pharynx|oropharynx)\b[^.]{0,80}/gi,
    /\b(lungs?|cardiac|abdomen|neurologic)\b[^.]{0,80}/gi,
  ];

  const DIAGNOSIS_PATTERNS = [
    /\b(this (?:looks|appears|sounds) like|diagnosis is|likely|consistent with|suggestive of)\s+([^.!?]{5,90})/gi,
    /\b(viral|bacterial|acute|chronic)\s+[\w\s-]{3,40}(?:itis|osis|emia|pathy)?/gi,
    /\b(pharyngitis|sinusitis|bronchitis|pneumonia|uti|gastroenteritis|hypertension|diabetes|migraine|anxiety disorder)\b/gi,
  ];

  const PLAN_PATTERNS = [
    /\b(prescribe|prescribing|start|continue|recommend|advise|ordered?)\s+([^.!?]{8,120})/gi,
    /\b(ibuprofen|acetaminophen|paracetamol|amoxicillin|azithromycin|prednisone|omeprazole|metformin|lisinopril)\s+[^.!?]{0,80}/gi,
    /\b(rest|fluids|follow[- ]?up|return if|call if|refer(?:ral)?|labs?|imaging|x-ray|blood work)\b[^.!?]{0,90}/gi,
  ];

  const NEGATION_RE = /\b(no|not|denies|without|absent|negative for)\b/gi;

  function normalize(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitLines(text) {
    return String(text || "")
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  function unique(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
    return out;
  }

  function cap(s) {
    if (!s) return "";
    const t = s.trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function isPatientLine(line) {
    return /^(patient|pt|client|mother|father|parent)\s*:/i.test(line);
  }

  function isDoctorLine(line) {
    return /^(dr\.?|doctor|physician|provider|clinician|nurse)\s*[\w.]*\s*:/i.test(line);
  }

  function stripSpeaker(line) {
    return line.replace(/^[^:]+:\s*/i, "").trim();
  }

  function extractPatientUtterances(text) {
    const lines = splitLines(text);
    const patient = [];
    for (const line of lines) {
      if (isPatientLine(line)) patient.push(stripSpeaker(line));
    }
    if (patient.length) return patient.join(" ");
    return text;
  }

  function extractDurations(text) {
    const found = [];
    let m;
    const re = new RegExp(DURATION_RE.source, "gi");
    while ((m = re.exec(text))) {
      found.push(`${m[1]} ${m[2]}`);
    }
    return unique(found);
  }

  function extractSymptoms(text) {
    const patientText = extractPatientUtterances(text);
    const symptoms = [];
    for (const re of SYMPTOM_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(patientText))) {
        symptoms.push(m[0].toLowerCase());
      }
    }
    const negations = [];
    const negRe = new RegExp(
      `${NEGATION_RE.source}\\s+([\\w\\s-]{2,40})(?:\\.|,|$)`,
      "gi"
    );
    let nm;
    while ((nm = negRe.exec(patientText))) {
      negations.push(`Denies ${nm[1].trim().toLowerCase()}`);
    }
    return unique([...symptoms.map(cap), ...negations]);
  }

  function extractChiefComplaint(text) {
    const patientText = extractPatientUtterances(text);
    const cc =
      patientText.match(
        /(?:what brings you|chief complaint|presenting with|complaining of|here for|having)\s+([^.!?]{8,100})/i
      ) ||
      patientText.match(
        /(?:i(?:'ve| have) (?:had|been having|got))\s+([^.!?]{8,100})/i
      );
    if (cc) return cap(cc[1]);
    const symptoms = extractSymptoms(text);
    if (symptoms.length) return symptoms.slice(0, 2).join("; ");
    const firstPatient = splitLines(text).find(isPatientLine);
    return firstPatient ? cap(stripSpeaker(firstPatient)) : "Not documented";
  }

  function extractVitals(text) {
    const vitals = [];
    for (const { label, re } of VITAL_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(text))) {
        if (label === "Temperature") {
          vitals.push(`${label}: ${m[1]}°${m[2].toUpperCase()}`);
        } else if (label === "Blood pressure") {
          vitals.push(`${label}: ${m[1]}/${m[2]} mmHg`);
        } else if (label === "Weight") {
          vitals.push(`${label}: ${m[1]} ${m[2]}`);
        } else {
          vitals.push(`${label}: ${m[2] || m[1]}${label === "SpO2" ? "%" : ""}`);
        }
      }
    }
    return unique(vitals);
  }

  function extractExamFindings(text) {
    const doctorChunks = splitLines(text)
      .filter((l) => isDoctorLine(l) || /exam|vitals|temperature|blood pressure/i.test(l))
      .map(stripSpeaker)
      .join(" ");

    const findings = [];
    for (const re of EXAM_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(doctorChunks || text))) {
        findings.push(cap(m[0].replace(/\s+/g, " ").trim()));
      }
    }
    return unique(findings).slice(0, 8);
  }

  function extractAssessment(text) {
    const diagnoses = [];
    for (const re of DIAGNOSIS_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(text))) {
        const val = (m[2] || m[0]).replace(/\s+/g, " ").trim();
        if (val.length > 4) diagnoses.push(cap(val));
      }
    }
    return unique(diagnoses);
  }

  function extractPlan(text) {
    const plans = [];
    for (const re of PLAN_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(text))) {
        const val = (m[2] || m[0]).replace(/\s+/g, " ").trim();
        if (val.length > 5) plans.push(cap(val));
      }
    }
    const returnPrecaution = text.match(
      /(?:return|come back|seek care|call (?:us|the clinic)) if\s+([^.!?]{8,120})/i
    );
    if (returnPrecaution) {
      plans.push(`Return precautions: ${cap(returnPrecaution[1])}`);
    }
    return unique(plans).slice(0, 10);
  }

  function bulletList(items, fallback) {
    if (!items.length) return `• ${fallback}`;
    return items.map((i) => `• ${i}`).join("\n");
  }

  function generateSoapNote(transcript) {
    const text = normalize(transcript);
    if (!text) throw new Error("Paste or upload a consultation transcript first.");

    const chiefComplaint = extractChiefComplaint(text);
    const durations = extractDurations(text);
    const symptoms = extractSymptoms(text);
    const vitals = extractVitals(text);
    const exam = extractExamFindings(text);
    const assessment = extractAssessment(text);
    const plan = extractPlan(text);

    const subjectiveLines = [
      `Chief complaint: ${chiefComplaint}`,
      durations.length ? `Duration: ${durations.join("; ")}` : null,
      symptoms.length ? `Symptoms / HPI:\n${bulletList(symptoms, "Not explicitly stated")}` : null,
    ].filter(Boolean);

    const objectiveLines = [
      vitals.length ? `Vitals:\n${bulletList(vitals, "Not recorded")}` : "Vitals: Not recorded",
      exam.length
        ? `Physical exam:\n${bulletList(exam, "Not documented")}`
        : "Physical exam: Not documented in transcript",
    ];

    const assessmentText = assessment.length
      ? bulletList(assessment, "Clinical impression pending further evaluation")
      : "• Clinical impression pending — review transcript for diagnosis statements";

    const planText = plan.length
      ? bulletList(plan, "Continue routine care and follow up as needed")
      : "• Continue routine care; document treatment plan from encounter";

    const now = new Date().toLocaleString();

    return [
      "CONSULTATION CLINICAL NOTE",
      "Generated by MediFlow AI — browser-only demo",
      `Generated: ${now}`,
      "",
      "PATIENT REPORT",
      subjectiveLines.join("\n"),
      "",
      "EXAM & VITALS",
      objectiveLines.join("\n"),
      "",
      "CLINICAL ASSESSMENT",
      assessmentText,
      "",
      "TREATMENT PLAN",
      planText,
      "",
      "---",
      "Disclaimer: Demo output for administrative workflow illustration only.",
      "Not for clinical decision-making. Requires clinician review before charting.",
    ].join("\n");
  }

  async function simulateProcessing(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function initDemo() {
    const transcript = document.getElementById("transcript");
    const output = document.getElementById("soapOutput");
    const generateBtn = document.getElementById("generateBtn");
    const sampleBtn = document.getElementById("sampleBtn");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const clearBtn = document.getElementById("clearBtn");
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!transcript || !generateBtn) return;

    const SAMPLE = `Dr. Martinez: Good morning, Sarah. What brings you in today?

Patient: I've had a sore throat for about 4 days, and a fever since yesterday. It hurts to swallow. A little dry cough, but no runny nose.

Dr. Martinez: Any nausea or chest pain?

Patient: No nausea. No chest pain.

Dr. Martinez: Let me check your vitals. Temperature is 101.2°F, blood pressure 118/76, pulse 88. Throat exam shows erythema and swelling of the tonsils, no exudate. Cervical lymph nodes slightly tender.

Dr. Martinez: This looks like viral pharyngitis. I'll prescribe ibuprofen 400mg every 6 hours as needed for pain and fever. Rest, warm fluids, and salt water gargles. Return if symptoms worsen or fever persists beyond 48 hours.

Patient: Thank you, doctor.`;

    function setStatus(msg, cls) {
      if (!status) return;
      status.textContent = msg;
      status.className = "labs-status" + (cls ? " " + cls : "");
    }

    generateBtn.addEventListener("click", async () => {
      try {
        setStatus("Analyzing transcript with on-device NLP…", "processing");
        generateBtn.disabled = true;
        await simulateProcessing(650);
        const note = generateSoapNote(transcript.value);
        output.textContent = note;
        output.classList.remove("mf-output-empty");
        setStatus("Clinical note generated — review before use in any EHR.", "done");
      } catch (err) {
        output.textContent = "Your clinical note will appear here after you generate.";
        output.classList.add("mf-output-empty");
        setStatus(err.message || "Could not generate note.", "");
      } finally {
        generateBtn.disabled = false;
      }
    });

    sampleBtn?.addEventListener("click", () => {
      transcript.value = SAMPLE;
      setStatus("Sample consultation loaded. Click Generate Clinical Note.", "");
    });

    copyBtn?.addEventListener("click", async () => {
      const val = output.textContent || "";
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        setStatus("Copied clinical note to clipboard.", "done");
      } catch (e) {
        setStatus("Copy failed — select text manually.", "");
      }
    });

    downloadBtn?.addEventListener("click", () => {
      const val = output.textContent || "";
      if (!val) return;
      const blob = new Blob([val], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mediflow-clinical-note.txt";
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus("Downloaded clinical note.", "done");
    });

    clearBtn?.addEventListener("click", () => {
      transcript.value = "";
      output.textContent = "Your clinical note will appear here after you generate.";
      output.classList.add("mf-output-empty");
      setStatus("Cleared.", "");
    });

    fileInput?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        transcript.value = text;
        setStatus(`Loaded ${file.name} (${Math.round(file.size / 1024)} KB).`, "done");
      } catch (err) {
        setStatus("Could not read file.", "");
      }
      e.target.value = "";
    });
  }

  window.MediFlowSoap = { generateSoapNote };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDemo);
  } else {
    initDemo();
  }
})();
