/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

export const API_DATA = {
  BASE_URL: 'https://api.restful-api.dev/objects',
  TEST_IDS: {
    MULTIPLE_OBJECTS: ['3', '5', '10']
  },
  TEST_OBJECTS: {
    VALID_OBJECT: {
      name: 'Apple MacBook Pro 16',
      data: {
        year: 2023,
        price: 1999.99,
        color: 'Space Grey',
        capacity: '1TB'
      }
    },
    MINIMAL_OBJECT: {
      name: 'Test Device',
      data: {
        type: 'testing'
      }
    },
    PARTIAL_UPDATES: {
      valid: [
        {
          name: 'Only Name Update Valid'  // Only name update is valid
        }
      ],
      invalid: [
        {
          data: {  // Update only data - should fail
            updatedAt: new Date().toISOString(),
            status: 'modified'
          },
          expectedStatus: 405
        },
        {
          data: {  // Update nested data - should fail
            specs: {
              newFeature: 'Added via partial update'
            }
          },
          expectedStatus: 405
        },
        {
          name: 'Valid Name',
          data: {  // Combined update with data - should fail
            status: 'modified'
          },
          expectedStatus: 405
        }
      ]
    }
  },
  INVALID_UPDATES: [
    { 
      data: { name: '' },  // Empty name
      expectedStatus: 400  // Bad Request
    },
    { 
      data: {},  // Missing required name field
      expectedStatus: 400  // Bad Request
    },
    {
      data: { name: { invalid: 'object' } },  // Invalid name type
      expectedStatus: 400  // Bad Request
    }
  ]
};
