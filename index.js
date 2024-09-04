// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// Function to validate the course and assignment group data
function validateData(course, ag) {
  if (course.id !== ag.course_id) {
    throw new Error(
      `Assignment Group ${ag.id} does not belong to Course ${course.id}`
    );
  }
  ag.assignments.forEach((assignment) => {
    if (
      typeof assignment.points_possible !== "number" ||
      assignment.points_possible <= 0
    ) {
      throw new Error(
        `Invalid points_possible for Assignment ${assignment.id}`
      );
    }
  });
}

// Function to calculate the learner data based on the provided inputs
function getLearnerData(course, ag, submissions) {
  // Validate the course and assignment group data
  validateData(course, ag);

  const learners = {};

  submissions.forEach((sub) => {
    const assignment = ag.assignments.find((a) => a.id === sub.assignment_id);
    if (!assignment || new Date(assignment.due_at) > new Date()) {
      return; // Skip if the assignment is not yet due
    }

    const isLate =
      new Date(sub.submission.submitted_at) > new Date(assignment.due_at);
    const score = isLate
      ? sub.submission.score - 0.1 * assignment.points_possible
      : sub.submission.score;

    if (!learners[sub.learner_id]) {
      learners[sub.learner_id] = {
        id: sub.learner_id,
        totalScore: 0,
        totalPoints: 0,
        assignments: {},
      };
    }

    learners[sub.learner_id].assignments[assignment.id] =
      score / assignment.points_possible;
    learners[sub.learner_id].totalScore += score;
    learners[sub.learner_id].totalPoints += assignment.points_possible;
  });

  return Object.values(learners).map((learner) => {
    return {
      id: learner.id,
      avg: learner.totalScore / learner.totalPoints,
      ...learner.assignments,
    };
  });
}

// Calculate and log the result
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
