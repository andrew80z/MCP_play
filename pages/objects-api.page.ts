/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import { BaseApiPage } from './base-api.page';
import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiObject {
  id: string;
  name: string;
  data?: {
    color?: string;
    capacity?: string;
    [key: string]: any;
  };
  createdAt?: string;
}

export interface CreateObjectRequest {
  name: string;
  data?: {
    [key: string]: any;
  };
}

export interface ApiError {
  error?: string;
  message?: string;
}

export class ObjectsApiPage extends BaseApiPage {
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    super(request);
    this.baseUrl = baseUrl;
  }

  async getAllObjects(): Promise<ApiObject[]> {
    return await this.get<ApiObject[]>(this.baseUrl);
  }

  async getObjectsByIds(ids: string[]): Promise<ApiObject[]> {
    const queryParams = ids.map(id => `id=${id}`).join('&');
    return await this.get<ApiObject[]>(`${this.baseUrl}?${queryParams}`);
  }

  async getObjectById(id: string): Promise<ApiObject> {
    return await this.get<ApiObject>(`${this.baseUrl}/${id}`);
  }

  async createObject(object: CreateObjectRequest): Promise<ApiObject> {
    return await this.post<ApiObject>(this.baseUrl, object);
  }

  async updateObject(id: string, object: Partial<CreateObjectRequest>): Promise<ApiObject> {
    return await this.put<ApiObject>(`${this.baseUrl}/${id}`, object);
  }

  async deleteObject(id: string): Promise<boolean> {
    return await this.delete(`${this.baseUrl}/${id}`);
  }

  async getObjectStatus(id: string): Promise<number> {
    return await this.getResponseStatus(`${this.baseUrl}/${id}`);
  }

  async createObjectWithResponse(object: any): Promise<APIResponse> {
    const response = await this.request.post(this.baseUrl, {
      data: object
    });
    return response;
  }

  async updateObjectWithResponse(id: string, object: any): Promise<APIResponse> {
    const response = await this.request.put(`${this.baseUrl}/${id}`, {
      data: object
    });
    return response;
  }

  async updateByPatchObjectWithResponse(id: string, object: any): Promise<APIResponse> {
    console.log((`URL: ${this.baseUrl}/${id}`));
    const response = await this.request.patch(`${this.baseUrl}/${id}`, {
      data: object
    });
    return response;
  }

  isValidObjectResponse(obj: any): obj is ApiObject {
    return typeof obj === 'object'
      && obj !== null
      && typeof obj.id === 'string'
      && typeof obj.name === 'string';
  }
}
