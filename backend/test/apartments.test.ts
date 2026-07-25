import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db";

const request = supertest(app);

const uniqueSuffix = Date.now().toString();
const testApartment = {
  unitName: `Test Unit ${uniqueSuffix}`,
  unitNumber: `T-${uniqueSuffix}`,
  project: `Test Project ${uniqueSuffix}`,
  price: 1_000_000,
  bedrooms: 2,
  bathrooms: 1,
  area: 100,
  address: "Test Address",
  description: "Created by the automated test suite.",
  imageUrls: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
};

describe("apartments API", () => {
  let createdId: string;

  after(async () => {
    if (createdId) await prisma.apartment.delete({ where: { id: createdId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("rejects an apartment payload missing required fields", async () => {
    const res = await request.post("/api/apartments").send({ unitName: "Incomplete" });
    assert.equal(res.status, 400);
  });

  it("rejects out-of-range field values", async () => {
    const res = await request.post("/api/apartments").send({
      ...testApartment,
      price: -100,
      bedrooms: 50,
    });
    assert.equal(res.status, 400);
  });

  it("rejects a non-URL image", async () => {
    const res = await request.post("/api/apartments").send({
      ...testApartment,
      imageUrls: ["not-a-url"],
    });
    assert.equal(res.status, 400);
  });

  it("rejects more than 6 images", async () => {
    const res = await request.post("/api/apartments").send({
      ...testApartment,
      imageUrls: Array(7).fill(testApartment.imageUrls[0]),
    });
    assert.equal(res.status, 400);
  });

  it("creates an apartment with a valid payload", async () => {
    const res = await request.post("/api/apartments").send(testApartment);
    assert.equal(res.status, 201);
    assert.equal(res.body.unitName, testApartment.unitName);
    assert.deepEqual(res.body.imageUrls, testApartment.imageUrls);
    createdId = res.body.id;
  });

  it("fetches the created apartment by id", async () => {
    const res = await request.get(`/api/apartments/${createdId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, createdId);
  });

  it("returns 404 for an unknown id", async () => {
    const res = await request.get("/api/apartments/00000000-0000-0000-0000-000000000000");
    assert.equal(res.status, 404);
  });

  it("finds the created apartment via search by project", async () => {
    const res = await request.get("/api/apartments").query({ search: testApartment.project });
    assert.equal(res.status, 200);
    assert.ok(res.body.data.some((a: { id: string }) => a.id === createdId));
  });

  it("filters by minPrice/maxPrice", async () => {
    const res = await request
      .get("/api/apartments")
      .query({ search: testApartment.project, minPrice: 2_000_000 });
    assert.equal(res.status, 200);
    assert.ok(!res.body.data.some((a: { id: string }) => a.id === createdId));
  });

  it("filters by minimum bedrooms", async () => {
    const res = await request
      .get("/api/apartments")
      .query({ search: testApartment.project, bedrooms: 3 });
    assert.equal(res.status, 200);
    assert.ok(!res.body.data.some((a: { id: string }) => a.id === createdId));
  });

  it("sorts by price ascending", async () => {
    const res = await request.get("/api/apartments").query({ sort: "price_asc", limit: 100 });
    assert.equal(res.status, 200);
    const prices = res.body.data.map((a: { price: number }) => a.price);
    const sorted = [...prices].sort((a, b) => a - b);
    assert.deepEqual(prices, sorted);
  });
});
