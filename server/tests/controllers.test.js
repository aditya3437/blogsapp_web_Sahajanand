const assert = require("node:assert/strict");
const test = require("node:test");
const { register, login } = require("../controllers/authController");
const { createPost, updatePost } = require("../controllers/postController");
const { createUser } = require("../controllers/userController");

const createResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("registration and login return validation errors for missing request bodies", async () => {
  const registerResponse = createResponse();
  const loginResponse = createResponse();

  await register({ body: undefined }, registerResponse);
  await login({ body: undefined }, loginResponse);

  assert.equal(registerResponse.statusCode, 400);
  assert.equal(loginResponse.statusCode, 400);
});

test("post creation and updates return validation errors for missing request bodies", async () => {
  const createResponseValue = createResponse();
  const updateResponseValue = createResponse();
  const request = { body: undefined, user: { id: "user-id" }, params: { id: "post-id" } };

  await createPost(request, createResponseValue);
  await updatePost(request, updateResponseValue);

  assert.equal(createResponseValue.statusCode, 400);
  assert.equal(updateResponseValue.statusCode, 400);
});

test("admin user creation returns a validation error for a missing request body", async () => {
  const response = createResponse();
  await createUser({ body: undefined }, response);
  assert.equal(response.statusCode, 400);
});
