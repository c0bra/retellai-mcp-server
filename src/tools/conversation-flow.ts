import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type Retell from "retell-sdk";
import type { z } from "zod";

import {
	ConversationFlowOutputSchema,
	CreateConversationFlowInputSchema,
	GetConversationFlowInputSchema,
	UpdateConversationFlowInputSchema,
} from "../schemas/index.js";
import { createToolHandler, createZeroArgToolHandler } from "./utils.js";

const parseConversationFlow = (data: unknown) => ConversationFlowOutputSchema.parse(data);

export const registerConversationFlowTools = (server: McpServer, retellClient: Retell) => {
	server.registerTool(
		"list_conversation_flows",
		{ description: "Lists all Retell conversation flows" },
		createZeroArgToolHandler(async () => {
			const flows = await retellClient.get<undefined, unknown>("/list-conversation-flows");
			if (Array.isArray(flows)) {
				return flows.map(parseConversationFlow);
			}

			return flows;
		})
	);

	server.registerTool(
		"create_conversation_flow",
		{
			description: "Creates a new Retell conversation flow",
			inputSchema: CreateConversationFlowInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof CreateConversationFlowInputSchema>) => {
			const flow = await retellClient.post<typeof data, unknown>("/create-conversation-flow", {
				body: data,
			});

			return parseConversationFlow(flow);
		})
	);

	server.registerTool(
		"get_conversation_flow",
		{
			description: "Gets a Retell conversation flow by ID",
			inputSchema: GetConversationFlowInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof GetConversationFlowInputSchema>) => {
			const flow = await retellClient.get<{ version?: number }, unknown>(
				`/get-conversation-flow/${data.conversationFlowId}`,
				{ query: data.version === undefined ? undefined : { version: data.version } }
			);

			return parseConversationFlow(flow);
		})
	);

	server.registerTool(
		"update_conversation_flow",
		{
			description: "Updates an existing Retell conversation flow",
			inputSchema: UpdateConversationFlowInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof UpdateConversationFlowInputSchema>) => {
			const { conversationFlowId, version, ...body } = data;
			const flow = await retellClient.patch<typeof body, unknown>(
				`/update-conversation-flow/${conversationFlowId}`,
				{
					query: version === undefined ? undefined : { version },
					body,
				}
			);

			return parseConversationFlow(flow);
		})
	);

	server.registerTool(
		"delete_conversation_flow",
		{
			description: "Deletes a Retell conversation flow",
			inputSchema: GetConversationFlowInputSchema,
		},
		createToolHandler(async (data: z.infer<typeof GetConversationFlowInputSchema>) => {
			await retellClient.delete(`/delete-conversation-flow/${data.conversationFlowId}`);
			return {
				success: true,
				message: `Conversation flow ${data.conversationFlowId} deleted successfully`,
			};
		})
	);
};
