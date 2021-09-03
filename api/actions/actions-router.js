// Write your "actions" router here!
const express = require("express");
const { validateActionId } = require("../actions/actions-middlware");
const Action = require("./actions-model");
const router = express.Router();

router.get("/", (req, res) => {
  Action.get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json([]);
    });
});
router.get("/:id", validateActionId, (req, res) => {
  res.json(req.action);
});
router.post("/", (req, res) => {
  const { notes, description, project_id } = req.body;
  if (!notes || !description || !project_id) {
    res
      .status(400)
      .json({ message: "Please provide notes and a description." });
  } else {
    Action.insert(req.body)
      .then((action) => {
        res.status(201).json(action);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error saving the action to the database",
        });
      });
  }
});
router.put("/:id", validateActionId, (req, res, next) => {
  const { notes, description, project_id, completed } = req.body;
  if (!notes || !description || !project_id || completed == null) {
    res.status(400).json({ message: "Please provide notes and a description" });
  } else {
    Action.update(req.params.id, req.body)
      .then(() => {
        res.status(200).json(req.body);
      })
      .catch((err) => {
        next(err);
      });
  }
});
router.delete("/:id", validateActionId, async (req, res, next) => {
  try {
    await Action.remove(req.params.id);
    res.json(req.action);
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
