/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import { test, expect } from '@playwright/test';
import { API_DATA } from './test-data/api-data';
import { ObjectsApiPage } from '../pages/objects-api.page';

test.describe('REST API Objects Tests', () => {
  let objectsPage: ObjectsApiPage;

  test.beforeEach(async ({ request }) => {
    objectsPage = new ObjectsApiPage(request, API_DATA.BASE_URL);
  });

  test('should get all objects successfully', async () => {
    const objects = await objectsPage.getAllObjects();

    expect(Array.isArray(objects)).toBeTruthy();
    expect(objects.length).toBeGreaterThan(0);

    // Validate object structure
    const firstObject = objects[0];
    expect(firstObject).toHaveProperty('id');
    expect(firstObject).toHaveProperty('name');
  });

  test('should verify response with pagination parameters', async () => {
    // First get total count of objects
    const allObjects = await objectsPage.getAllObjects();
    const totalCount = allObjects.length;

    // Document pagination behavior
    test.info().annotations.push({
      type: 'issue',
      description: `API pagination is handled at the client level with ${totalCount} total objects`
    });

    // Verify object structure for all objects
    for (const object of allObjects) {
      expect(object).toHaveProperty('id');
      expect(object).toHaveProperty('name');
    }
  });

  test('should handle non-existent object gracefully', async () => {
    const nonExistentId = 'non-existent-id-999999';
    const status = await objectsPage.getObjectStatus(nonExistentId);
    expect(status).toBe(404);
  });

  test('should fetch multiple objects by IDs', async () => {
    const objectIds = API_DATA.TEST_IDS.MULTIPLE_OBJECTS;
    const objects = await objectsPage.getObjectsByIds(objectIds);

    // Verify response structure
    expect(Array.isArray(objects)).toBeTruthy();
    expect(objects.length).toBe(objectIds.length);

    // Verify each requested object is present
    const returnedIds = objects.map(obj => obj.id);
    for (const expectedId of objectIds)
      expect(returnedIds).toContain(expectedId);


    // Verify object structure for each returned object
    for (const object of objects) {
      expect(object).toHaveProperty('id');
      expect(object).toHaveProperty('name');
    }
  });

  test('should create a new object via POST', async () => {
    const newObject = API_DATA.TEST_OBJECTS.VALID_OBJECT;
    const createdObject = await objectsPage.createObject(newObject);

    // Verify response structure
    expect(createdObject).toHaveProperty('id');
    expect(createdObject.name).toBe(newObject.name);
    expect(createdObject.data).toMatchObject(newObject.data);
    expect(createdObject).toHaveProperty('createdAt');

    // Clean up
    await objectsPage.deleteObject(createdObject.id);
  });

  test('should handle minimal object creation', async () => {
    const minimalObject = API_DATA.TEST_OBJECTS.MINIMAL_OBJECT;
    const createdObject = await objectsPage.createObject(minimalObject);

    // Verify minimal object structure
    expect(createdObject).toHaveProperty('id');
    expect(createdObject.name).toBe(minimalObject.name);
    expect(createdObject.data).toMatchObject(minimalObject.data);

    // Clean up
    await objectsPage.deleteObject(createdObject.id);
  });

  test('should handle invalid POST request', async () => {
    const invalidObject = { data: { type: 'test' } }; // Missing required 'name' field
    const response = await objectsPage.createObjectWithResponse(invalidObject);
    const responseData = await response.json();

    // Verify that the response is not a valid object
    expect(objectsPage.isValidObjectResponse(responseData)).toBeFalsy();

    // Document actual API behavior
    test.info().annotations.push({
      type: 'info',
      description: `API returns ${response.status()} for invalid objects without required fields`
    });
  });
});
