import { ApiError } from "./ApiError";
import Config from "./config";
import { GenericError } from "./GenericError";

type SendOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  searchParams?: Record<string, string>;
};
export class APIV1Client {
  private async sendApiV1Request<TData>(
    route: string,
    options: SendOptions
  ): Promise<TData> {
    const url = new URL(`${Config.api.origin}/--/api/v1/${route}`);
    if (options.searchParams) {
      url.search = new URLSearchParams(options?.searchParams).toString();
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: options.method ?? "POST",
        body: options.body ? JSON.stringify(options.body) : null,
        headers: {
          ...options.headers,
          accept: "application/json",
          ...(options.body ? { "content-type": "application/json" } : null),
        },
      });
    } catch (error) {
      throw new GenericError(
        `Something went wrong when connecting to ${Config.api.origin}: ${
          (error as Error).message
        }.`
      );
    }

    let text: string;
    try {
      text = await response.text();
    } catch (error) {
      throw new GenericError(
        `Something went wrong when reading the response (HTTP ${
          response.status
        }) Error: ${(error as Error).message}.`
      );
    }

    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      throw new GenericError(
        `The server responded in an unexpected way: ${text}`
      );
    }

    if (Array.isArray(body.errors) && body.errors.length > 0) {
      const responseError = body.errors[0];
      const errorMessage = responseError.details
        ? responseError.details.message
        : responseError.message;
      const error = new ApiError(errorMessage, responseError.code);
      error.serverStack = responseError.stack;
      error.metadata = responseError.metadata;
      throw error;
    }

    if (!response.ok) {
      throw new GenericError(
        `The server responded with a ${response.status} error.`
      );
    }

    return body.data;
  }

  public async sendUnauthenticatedApiV1Request<TData>(
    route: string,
    options: SendOptions = {}
  ): Promise<TData> {
    return await this.sendApiV1Request(route, options);
  }
}
