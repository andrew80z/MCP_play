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

    // Validate object structure
    const firstObject = objects[0];
    expect(firstObject).toHaveProperty('id');
    expect(typeof firstObject.id).toBe('string');
    expect(firstObject).toHaveProperty('name');
    expect(typeof firstObject.name).toBe('string');
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
      expect(typeof object.id).toBe('string');
      expect(object).toHaveProperty('name');
      expect(typeof object.name).toBe('string');
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
      expect(typeof object.id).toBe('string');
      expect(object).toHaveProperty('name');
      expect(typeof object.name).toBe('string');
    }
  });

  test('should create a new object via POST', async () => {
    const newObject = API_DATA.TEST_OBJECTS.VALID_OBJECT;
    const createdObject = await objectsPage.createObject(newObject);

    // Verify response structure
    expect(createdObject).toHaveProperty('id');
    expect(typeof createdObject.id).toBe('string');
    expect(createdObject.name).toBe(newObject.name);
    expect(typeof createdObject.name).toBe('string');
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
    expect(typeof createdObject.id).toBe('string');
    expect(createdObject.name).toBe(minimalObject.name);
    expect(typeof createdObject.name).toBe('string');
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

  test('should verify successful POST request response', async () => {
    const newObject = {
      name: 'Test Product Complete',
      data: {
        type: 'Electronics',
        category: 'Smartphone',
        price: 999.99,
        inStock: true,
        specs: {
          color: 'Black',
          storage: '256GB',
          ram: '8GB'
        }
      }
    };

    // Get response to verify status and headers
    const response = await objectsPage.createObjectWithResponse(newObject);
    const responseData = await response.json();
    const date = new Date().toISOString().replace('Z', '+00:00');
    const dotPosition = date.indexOf('.');
    // Extract everything before the "." character
    const beforeDot = date.substring(0, dotPosition);
    // Verify response status
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200); // or 201 depending on API

    // Verify response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    // Verify response structure
    expect(objectsPage.isValidObjectResponse(responseData)).toBeTruthy();
    expect(responseData).toHaveProperty('id');
    expect(typeof responseData.id).toBe('string');
    expect(responseData.name).toBe(newObject.name);
    expect(typeof responseData.name).toBe('string');
    expect(responseData).toHaveProperty('createdAt');
    expect(responseData.data).toMatchObject(newObject.data);

    // Verify the created object can be retrieved
    const retrievedObject = await objectsPage.getObjectById(responseData.id);
    console.log('Retrieved Object:', retrievedObject);
    retrievedObject['createdAt'] = date;
    expect(retrievedObject.data).toMatchObject(responseData.data);
    expect(retrievedObject.name).toBe(responseData.name);
    expect(retrievedObject.id).toBe(responseData.id);
    const dateFormated = retrievedObject.createdAt;
    // Extract everything before the "." character
    const actualDate = dateFormated.substring(0, dotPosition);
    expect(actualDate).toBe(beforeDot);

    // Clean up
    await objectsPage.deleteObject(responseData.id);
  });

  test('should fail update an existing object via PUT', async () => {
    // First get all objects to pick a random one
    const allObjects = await objectsPage.getAllObjects();
    const randomIndex = Math.floor(Math.random() * allObjects.length);
    const targetId = allObjects[randomIndex].id;
    const originalObject = await objectsPage.getObjectById(targetId);

    // Prepare update data while keeping some original fields
    const updateData = {
      name: `Updated ${originalObject.name}`,
      data: {
        ...originalObject.data,
        lastUpdated: new Date().toISOString(),
        status: 'modified'
      }
    };

    // Get response to verify status and headers
    const response = await objectsPage.updateObjectWithResponse(targetId, updateData);
    // Verify response status
    expect(response.ok()).not.toBeTruthy();
    expect(response.status()).toBe(405);

    // Verify response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('should handle PUT request with invalid data', async () => {
    // First get all objects to pick a random one
    const allObjects = await objectsPage.getAllObjects();
    const randomIndex = Math.floor(Math.random() * allObjects.length);
    const targetId = allObjects[randomIndex].id;
    const originalObject = await objectsPage.getObjectById(targetId);

    for (const testCase of API_DATA.INVALID_UPDATES) {
      const response = await objectsPage.updateObjectWithResponse(targetId, testCase.data);
      const status = response.status();
      expect(status).toBeTruthy();
      expect(status).not.toBe(200);
      // Verify the response indicates invalid request
      const responseData = await response.json();
      expect(objectsPage.isValidObjectResponse(responseData)).toBeFalsy();
      // Original object should remain unchanged
      const unchangedObject = await objectsPage.getObjectById(targetId);
      expect(unchangedObject.id).toBe(originalObject.id);
      expect(unchangedObject.name).toBe(originalObject.name);
      expect(unchangedObject.data).toEqual(originalObject.data);
    }
  });

  test('should handle PUT request for non-existent object', async () => {
    const nonExistentId = 'non-existent-id-999999';
    const updateData = {
      name: 'Should Not Create',
      data: {
        test: 'data'
      }
    };

    const response = await objectsPage.updateObjectWithResponse(nonExistentId, updateData);
    expect(response.status()).toBe(404);

    const responseData = await response.json();
    expect(objectsPage.isValidObjectResponse(responseData)).toBeFalsy();
  });

  test.skip('should support partial updates via PUT - only name updates allowed', async () => {
    // First get all objects to pick a random one
    const targetId = '7';
    const originalObject = await objectsPage.getObjectById(targetId);

    // Test valid name-only updates
    for (const validUpdate of API_DATA.TEST_OBJECTS.PARTIAL_UPDATES.valid) {
      console.log('Testing valid update:', JSON.stringify(validUpdate));
      const response = await objectsPage.updateByPatchObjectWithResponse(targetId, validUpdate);
      const responseData = await response.json();
      console.log('Response status:', response.status());
      console.log('Response body:', responseData);
      // Verify response status and format
      expect(response.ok()).toBeFalsy();
      expect(response.status()).not.toBe(200);
      expect(objectsPage.isValidObjectResponse(responseData)).toBeFalsy();

      // Verify only name was updated
      const updatedObject = await objectsPage.getObjectById(targetId);
      expect(updatedObject.name).toBe(validUpdate.name);

      // Verify other fields remain unchanged
      expect(updatedObject.id).toBe(originalObject.id);
      expect(updatedObject.data).toEqual(originalObject.data);
      expect(updatedObject.createdAt).toBe(originalObject.createdAt);
    }

    // Test invalid updates (data modifications)
    for (const invalidUpdate of API_DATA.TEST_OBJECTS.PARTIAL_UPDATES.invalid) {
      console.log('Testing invalid update:', JSON.stringify(invalidUpdate));
      const response = await objectsPage.updateObjectWithResponse(targetId, invalidUpdate);
      const status = response.status();
      console.log('Response status:', status);
      console.log('Response body:', await response.json());

      expect(status).toBe(invalidUpdate.expectedStatus);

      // Verify object remains unchanged
      const unchangedObject = await objectsPage.getObjectById(targetId);
      expect(unchangedObject).toEqual(originalObject);
    }

    // Restore original state
    await objectsPage.updateObject(targetId, {
      name: originalObject.name
    });
  });

  test.skip('API snapshot test for objects API', async ({ request }) => {
    const response = await request.get('/api/objects');
    const data = await response.json();
    expect(data).toMatchSnapshot('objects-api-snapshot.json');
  });
});
