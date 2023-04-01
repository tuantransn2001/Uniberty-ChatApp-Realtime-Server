import express from "express";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send("this is default");
});

export default rootRouter;
