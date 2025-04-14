/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import { APIRequestContext } from '@playwright/test';

export class BaseApiPage {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get<T>(url: string): Promise<T> {
    const response = await this.request.get(url);
    return await response.json() as T;
  }

  protected async post<T>(url: string, data: unknown): Promise<T> {
    const response = await this.request.post(url, { data });
    return await response.json() as T;
  }

  protected async put<T>(url: string, data: unknown): Promise<T> {
    const response = await this.request.put(url, { data });
    return await response.json() as T;
  }

  protected async delete(url: string): Promise<boolean> {
    const response = await this.request.delete(url);
    return response.ok();
  }

  protected async getResponseStatus(url: string): Promise<number> {
    const response = await this.request.get(url);
    return response.status();
  }
}
