/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

export const TEST_DATA = {
  FULL_FORM: {
    username: 'testUser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '1234567890',
    address: '123 Test St',
    terms: true
  },
  MINIMAL_FORM: {
    username: 'minimalUser',
    password: 'pass123',
    terms: true
  }
};

export const EXPECTED_RESULTS = {
  SUCCESS_MESSAGE: 'Processed form data'
};
