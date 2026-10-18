require("./register-ts.cjs");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { test } = require("node:test");

const jsx = require("react/jsx-runtime").jsx;
let records;
let savedEvaluations = [];
let sessionUserId;
const originalLoad = Module._load;
const componentPath =
  require.resolve("../components/dashboard/organization/EventInterviewRecords.tsx");

Module._load = function (request, parent, isMain) {
  if (parent?.filename === componentPath) {
    if (request === "react") {
      return { useState: (initial) => [initial, () => {}] };
    }
    if (request === "@/components/dashboard/DashboardSessionContext") {
      return { useDashboardSession: () => ({ user: { id: sessionUserId } }) };
    }
    if (request === "@/components/ui/button") {
      return { Button: (props) => jsx("button", props) };
    }
    if (request === "@/lib/api/use-event-interviews") {
      return {
        useEventInterviewRecords: () => ({
          data: records,
          isLoading: false,
          isError: false,
        }),
        useSaveEventInterviewEvaluation: () => ({
          mutate: (input) => savedEvaluations.push(input),
          isError: false,
          isPending: false,
        }),
        useSaveEventInterviewOutcome: () => ({
          mutate: () => {},
          isError: false,
          isPending: false,
        }),
      };
    }
  }
  return originalLoad.call(this, request, parent, isMain);
};

const {
  EventInterviewRecords,
} = require("../components/dashboard/organization/EventInterviewRecords.tsx");
Module._load = originalLoad;

const renderTree = (node, output = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => renderTree(child, output));
    return output;
  }
  if (!node || typeof node !== "object" || !node.type) return output;
  if (typeof node.type === "function") {
    return renderTree(node.type(node.props), output);
  }
  output.push(node);
  renderTree(node.props?.children, output);
  return output;
};

const createRecords = (canEvaluate, viewerRoleId, canDecideOutcome = true) => ({
  rubric: {
    version_id: "rubric-v1",
    stage_name: "Entrevista técnica",
    roles: [
      { id: "role-a", label: "Técnica" },
      { id: "role-b", label: "Cultura" },
    ],
    criteria: [
      { id: "shared", label: "Criterio común", description: null, roleIds: [] },
      {
        id: "only-a",
        label: "Criterio técnico",
        description: null,
        roleIds: ["role-a"],
      },
      {
        id: "only-b",
        label: "Criterio cultural",
        description: null,
        roleIds: ["role-b"],
      },
    ],
  },
  evaluations: [
    {
      id: "evaluation-a",
      event_id: "event-1",
      rubric_version_id: "rubric-v1",
      evaluator_id:
        viewerRoleId === "role-b" ? "interviewer-b" : "interviewer-a",
      evaluator_name: `Evaluador rol ${viewerRoleId === "role-b" ? "B" : "A"}`,
      evaluator_role_id: viewerRoleId,
      evaluator_role_label: viewerRoleId === "role-b" ? "Cultura" : "Técnica",
      rating: "positive",
      notes: null,
      skills_assessment: {},
      criterion_responses: [
        { criterion_id: "shared", score: 4, evidence: null },
        {
          criterion_id: "only-a",
          score: 5,
          evidence: "Evaluación privada del rol técnico",
        },
        { criterion_id: "only-b", score: 2, evidence: null },
      ],
      recommendation: null,
      created_at: "2026-10-12T12:00:00Z",
      updated_at: "2026-10-12T12:00:00Z",
    },
    {
      id: "evaluation-other-role",
      event_id: "event-1",
      rubric_version_id: "rubric-v1",
      evaluator_id:
        viewerRoleId === "role-b" ? "interviewer-a" : "interviewer-b",
      evaluator_name: "Evaluador de otro rol",
      evaluator_role_id: viewerRoleId === "role-b" ? "role-a" : "role-b",
      evaluator_role_label: viewerRoleId === "role-b" ? "Técnica" : "Cultura",
      rating: "negative",
      notes: "Notas privadas del otro rol",
      skills_assessment: {},
      criterion_responses: [
        {
          criterion_id: "only-a",
          score: 1,
          evidence: "Evaluación privada del rol técnico",
        },
      ],
      recommendation: "no_advance",
      created_at: "2026-10-12T12:00:00Z",
      updated_at: "2026-10-12T12:00:00Z",
    },
  ],
  outcome: null,
  audit: [],
  viewerRoleId,
  viewerRoleLabel: viewerRoleId === "role-a" ? "Técnica" : "Cultura",
  canViewHiringRecords: true,
  canEvaluate,
  canViewOutcome: true,
  canDecideOutcome,
});

const render = () => renderTree(EventInterviewRecords({ eventId: "event-1" }));
const buttonNamed = (nodes, label) =>
  nodes.find((node) => node.type === "button" && node.props.children === label);

test("interviewers see only shared and assigned-role score fields and submit only those criteria", () => {
  sessionUserId = "interviewer-a";
  records = createRecords(true, "role-a");
  savedEvaluations = [];
  const nodes = render();
  const scoreLabels = nodes
    .filter(
      (node) =>
        node.type === "select" &&
        node.props["aria-label"]?.startsWith("Puntaje de "),
    )
    .map((node) => node.props["aria-label"]);

  assert.deepEqual(scoreLabels, [
    "Puntaje de Criterio común",
    "Puntaje de Criterio técnico",
  ]);

  const saveButton = buttonNamed(nodes, "Guardar evaluación");
  assert.ok(saveButton);
  saveButton.props.onClick();
  assert.deepEqual(
    savedEvaluations[0].criterionResponses.map(
      (response) => response.criterionId,
    ),
    ["shared", "only-a"],
  );
});

test("users without an interviewer assignment cannot access score fields or save an evaluation", () => {
  sessionUserId = "unassigned-user";
  records = {
    ...createRecords(false, null, false),
    rubric: null,
    evaluations: [],
    outcome: { outcome: "hold" },
    canViewHiringRecords: false,
  };
  const nodes = render();
  const scoreFields = nodes.filter(
    (node) =>
      node.type === "select" &&
      node.props["aria-label"]?.startsWith("Puntaje de "),
  );

  assert.equal(scoreFields.length, 0);
  assert.equal(buttonNamed(nodes, "Guardar evaluación"), undefined);
  assert.equal(buttonNamed(nodes, "Guardar resultado"), undefined);
  assert.ok(JSON.stringify(nodes).includes("Mantener en revisión"));
  assert.equal(JSON.stringify(nodes).includes("Evaluador de otro rol"), false);
  assert.equal(
    JSON.stringify(nodes).includes("Actividad de evaluación"),
    false,
  );
});

test("interviewers in another role cannot see or submit role-specific criteria", () => {
  sessionUserId = "interviewer-b";
  records = createRecords(true, "role-b");
  savedEvaluations = [];
  const nodes = render();
  const scoreLabels = nodes
    .filter(
      (node) =>
        node.type === "select" &&
        node.props["aria-label"]?.startsWith("Puntaje de "),
    )
    .map((node) => node.props["aria-label"]);

  assert.deepEqual(scoreLabels, [
    "Puntaje de Criterio común",
    "Puntaje de Criterio cultural",
  ]);
  assert.equal(JSON.stringify(nodes).includes("Evaluador de otro rol"), false);
  assert.equal(
    JSON.stringify(nodes).includes("Evaluación privada del rol técnico"),
    false,
  );
  buttonNamed(nodes, "Guardar evaluación").props.onClick();
  assert.deepEqual(
    savedEvaluations[0].criterionResponses.map(
      (response) => response.criterionId,
    ),
    ["shared", "only-b"],
  );
});
