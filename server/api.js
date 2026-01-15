/** Core backend router / API */

const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send({ message: "Example API endpoint" });
});

// implement GET /api/ratings endpoint

const review1 = {
  _id: "id1",
  user_name: "Grace Choi",
  rating_value: "6/10",
  product: "toner",
  brand: "A",
  image: "/images/duckg.png",
  content: "Was okay"
};

const review2 = {
  _id: "id2",
  user_name: "Ellie Slaughter",
  rating_value: "7/10",
  product: "serum",
  brand: "B",
  image: "/images/ducke.png",
  content: "Was good"
};

const review3 = {
  _id: "id3",
  user_name: "Sophia Song",
  rating_value: "8/10",
  product: "moisturizer",
  brand: "C",
  image: "/images/ducks.png",
  content: "Was great"
};

const ratings = [review1, review2, review3];

router.get("/ratings", (req, res) => {
  res.send(ratings);
});

// implement POST /api/ratings endpoint

router.post("/review", (req, res) => {
  const newReview = req.body;
  ratings.push(newReview);
  res.send(newReview);
})

// implement GET /api/comments endpoint

const comment1 = {
  _id: "commentid1",
  creator_name: "XYZ",
  parent: "id1",
  content: "Insightful",
};
const comment2 = {
  _id: "commentid2",
  creator_name: "LMNOP",
  parent: "id2",
  content: "Wonderful",
};
const comment3 = {
  _id: "commentid3",
  creator_name: "ABCDE",
  parent: "id1",
  content: "Amazing",
};
const comments = [comment1, comment2, comment3];

router.get("/comments", (req, res) => {
  res.send(comments.filter((comment) => comment.parent === req.query.parent));
});

// implement POST /api/comment endpoint

router.post("/comment", (req, res) => {
  const newComment = req.body;
  comments.push(newComment);
  res.send(newComment);
});

module.exports = router;
