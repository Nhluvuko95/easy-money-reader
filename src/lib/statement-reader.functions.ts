import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const Input = z.object({
  fileName: z.string(),
  mediaType: z.string(),
  base64: z.string().min(1),
});

const ResultSchema = z.object({
  isBankStatement: z.boolean(),
  bank: z.string().nullable(),
  accountLast4: z.string().nullable(),
  holder: z.string().nullable(),
  periodStart: z.string().nullable(),
  periodEnd: z.string().nullable(),
  transactions: z.array(
    z.object({
      date: z.string(),
      time: z.string().nullable(),
      description: z.string(),
      amount: z.number(),
    }),
  ),
});

export type ReadStatementResult = z.infer<typeof ResultSchema>;

const PROMPT = `You are reading a South African bank statement (PDF or photo).
Extract EVERY transaction exactly as printed. Do not invent anything.
- date: YYYY-MM-DD. If the year is not shown on a line, use the statement year.
- time: HH:MM if printed, otherwise null.
- description: the transaction description as printed (tidy spacing only).
- amount: number in Rand. Money OUT (debits, fees, purchases, withdrawals) is NEGATIVE. Money IN (deposits, credits, grants, salary, refunds, interest) is POSITIVE. Ignore running balance columns and opening/closing balance lines.
- bank: bank name, e.g. "Capitec Bank", "FNB", "Standard Bank", "Nedbank", "Absa", "TymeBank".
- accountLast4: only the last 4 digits of the account number, or null.
- holder: account holder name as printed, or null.
- periodStart / periodEnd: statement period as YYYY-MM-DD, or null.
If the document is not a bank statement, set isBankStatement to false and return no transactions.`;

export const readStatement = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<ReadStatementResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("The statement reader is not set up yet.");

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const isImage = data.mediaType.startsWith("image/");
    const filePart = isImage
      ? ({ type: "image", image: data.base64, mediaType: data.mediaType } as const)
      : ({
          type: "file",
          data: data.base64,
          mediaType: data.mediaType,
          filename: data.fileName,
        } as const);

    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        output: Output.object({ schema: ResultSchema }),
        messages: [{ role: "user", content: [{ type: "text", text: PROMPT }, filePart] }],
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      return await result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("We could not read this statement. Please try a clearer copy.");
      }
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === 402) throw new Error("The reading service has run out of credits. Please try later.");
      if (status === 429) throw new Error("Too many statements at once. Please wait a minute and try again.");
      throw error;
    }
  });
