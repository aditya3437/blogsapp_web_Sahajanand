const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

test("users require a name, email, and password", async () => {
  const user = new User();
  await assert.rejects(user.validate(), (error) => {
    assert.ok(error.errors.name);
    assert.ok(error.errors.email);
    assert.ok(error.errors.password);
    return true;
  });
});

test("user email is normalized and role defaults to user", async () => {
  const user = new User({
    name: "  Ada Lovelace  ",
    email: " ADA@EXAMPLE.COM ",
    password: "hashed-password",
  });

  await user.validate();
  assert.equal(user.name, "Ada Lovelace");
  assert.equal(user.email, "ada@example.com");
  assert.equal(user.role, "user");
});

test("users cannot have roles outside user and admin", async () => {
  const user = new User({
    name: "Ada",
    email: "ada@example.com",
    password: "hashed-password",
    role: "owner",
  });

  await assert.rejects(user.validate(), (error) => Boolean(error.errors.role));
});

test("posts require title, content, and an author", async () => {
  const post = new Post();
  await assert.rejects(post.validate(), (error) => {
    assert.ok(error.errors.title);
    assert.ok(error.errors.content);
    assert.ok(error.errors.author);
    return true;
  });
});

test("posts trim their content and accept a valid author reference", async () => {
  const post = new Post({
    title: "  A first story  ",
    content: "  A story worth sharing.  ",
    author: new mongoose.Types.ObjectId(),
  });

  await post.validate();
  assert.equal(post.title, "A first story");
  assert.equal(post.content, "A story worth sharing.");
});
