import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type Retell from "retell-sdk";
import type { z } from "zod";

import {
	CreatePhoneCallInputSchema,
	CreateWebCallInputSchema,
	DeleteCallInputSchema,
	GetCallInputSchema,
	ListCallsInputSchema,
	UpdateCallInputSchema,
} from "../schemas/index.js";
import {
	transformCallOutput,
	transformListCallsInput,
	transformPhoneCallInput,
	transformUpdateCallInput,
	transformWebCallInput,
} from "../transformers/index.js";
import { createToolHandler } from "./utils.js";

export const registerCallTools = (server: McpServer, retellClient: Retell) => {
	server.registerTool(
		"create_phone_call",
		{
			description: "Creates a new phone call",
			inputSchema: CreatePhoneCallInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof CreatePhoneCallInputSchema>) => {
			const createCallDto = transformPhoneCallInput(data);
			const call = await retellClient.call.createPhoneCall(createCallDto);
			return transformCallOutput(call);
		})
	);

	server.registerTool(
		"create_web_call",
		{
			description: "Creates a new web call",
			inputSchema: CreateWebCallInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof CreateWebCallInputSchema>) => {
			const createCallDto = transformWebCallInput(data);
			const call = await retellClient.call.createWebCall(createCallDto);
			return transformCallOutput(call);
		})
	);

	server.registerTool(
		"get_call",
		{
			description: "Gets a call by ID",
			inputSchema: GetCallInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof GetCallInputSchema>) => {
			try {
				const call = await retellClient.call.retrieve(data.callId);
				if (!call) {
					throw new Error(`Call with ID ${data.callId} not found`);
				}

				return transformCallOutput(call);
			} catch (error: any) {
				console.error(`Error getting call: ${error.message}`);
				throw error;
			}
		})
	);

	server.registerTool(
		"list_calls",
		{
			description: "Lists all calls",
			inputSchema: ListCallsInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof ListCallsInputSchema>) => {
			try {
				const listCallsDto = transformListCallsInput(data);
				const calls = await retellClient.call.list(listCallsDto);
				return calls.map(transformCallOutput);
			} catch (error: any) {
				console.error(`Error listing calls: ${error.message}`);
				throw error;
			}
		})
	);

	server.registerTool(
		"update_call",
		{
			description: "Updates an existing call",
			inputSchema: UpdateCallInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof UpdateCallInputSchema>) => {
			try {
				const callId = data.callId;
				const updateCallDto = transformUpdateCallInput(data);
				const updatedCall = await retellClient.call.update(callId, updateCallDto);
				return transformCallOutput(updatedCall);
			} catch (error: any) {
				console.error(`Error updating call: ${error.message}`);
				throw error;
			}
		})
	);

	server.registerTool(
		"delete_call",
		{
			description: "Deletes a call",
			inputSchema: DeleteCallInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof DeleteCallInputSchema>) => {
			try {
				await retellClient.call.delete(data.callId);
				return {
					success: true,
					message: `Call ${data.callId} deleted successfully`,
				};
			} catch (error: any) {
				console.error(`Error deleting call: ${error.message}`);
				throw error;
			}
		})
	);
};
