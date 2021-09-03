// Write your "projects" router here!
const express = require("express");
const { validateProjectId } = require("../projects/projects-middleware");
const Projects = require("./projects-model");
const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json([]);
    });
});
router.get("/:id", validateProjectId, (req, res) => {
  res.json(req.project);
});
router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res
      .status(400)
      .json({ message: "Please provide a Title AND a Description" });
  } else {
    Projects.insert(req.body)
      .then((project) => {
        res.status(201).json(project);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message:
            "There was an error while saving the project to the database",
        });
      });
  }
});
router.put("/:id", validateProjectId, (req, res, next) => {
  const { name, description, completed } = req.body;
  if (!name || !description || completed == null) {
    res
      .status(400)
      .json({ message: "Please provide a Name AND a Description" });
  } else {
    Projects.update(req.params.id, req.body)
      .then(() => {
        res.status(200).json(req.body);
      })
      .catch((err) => {
        next(err);
      });
  }
});
router.delete("/:id", validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.json(req.project);
  } catch (err) {
    next(err);
  }
});
router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try {
    const result = await Projects.getProjectActions(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Something failed, who knows?",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
