/**
 * Custom tracking code configuration — constants only.
 *
 * This file has NO "use server" directive, so it can be imported by both
 * server and client code, and it can export objects/interfaces.
 *
 * The actual database read/write functions live in `custom-code.ts`.
 */

export interface CustomCode {
  head: string;
  body_top: string;
  body_bottom: string;
}

export const DEFAULT_CUSTOM_CODE: CustomCode = {
  head: "",
  body_top: "",
  body_bottom: "",
};

export const CODE_KEYS = {
  head: "custom_head_code",
  body_top: "custom_body_top_code",
  body_bottom: "custom_body_bottom_code",
} as const;
