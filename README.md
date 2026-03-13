# RetellAI MCP Server

Maintained fork of `@abhaybabbar/retellai-mcp-server`, updated to work with current MCP SDK releases.

The published npm package is `@c0bra/retellai-mcp-server`, and the source repository is `https://github.com/c0bra/retellai-mcp-server`.

This is a Model Context Protocol (MCP) server for RetellAI. It lets MCP-compatible assistants work with RetellAI calls, agents, phone numbers, voices, and Retell LLM resources.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Client Setup](#client-setup)
  - [OpenCode](#opencode)
  - [Cursor](#cursor)
  - [Claude Desktop](#claude-desktop)
  - [Other MCP Clients](#other-mcp-clients)
- [Example Use Cases](#example-use-cases)
- [Local Development](#local-development)
- [Available Tools](#available-tools)
- [License](#license)

## Features

The RetellAI MCP server provides tools for:

- **Call Management**: Create and manage phone calls and web calls
- **Agent Management**: Create and manage voice agents with different LLM configurations
- **Phone Number Management**: Provision and configure phone numbers
- **Voice Management**: Access and use different voice options
- **Retell LLM Management**: Create and manage Retell response engines

## Requirements

Before adding this server to an MCP client, make sure you have:

- `Node.js` installed so the client can run `npx`
- A RetellAI API key from <https://dashboard.retellai.com/apiKey>

If the npm package is available, install it like this:

```bash
npx -y @c0bra/retellai-mcp-server
```

If you are testing before the npm package is published, use the GitHub fallback:

```bash
npx -y github:c0bra/retellai-mcp-server
```

## Client Setup

### OpenCode

OpenCode supports project-level and global JSON or JSONC config files.

- Project config: `./opencode.json` or `./opencode.jsonc`
- Global config: `~/.config/opencode/opencode.json`

Add this to your OpenCode config:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "retellai-mcp-server": {
      "type": "local",
      "command": ["npx", "-y", "@c0bra/retellai-mcp-server"],
      "environment": {
        "RETELL_API_KEY": "<your_retellai_token>"
      },
      "enabled": true
    }
  }
}
```

After saving the file, restart or reload OpenCode so it picks up the new MCP server.

### Cursor

Cursor can use MCP servers from the UI or from a project config file.

- UI path: `Settings` -> `Tools & MCP`
- Project config: `.cursor/mcp.json`

Add this to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "retellai-mcp-server": {
      "command": "npx",
      "args": ["-y", "@c0bra/retellai-mcp-server"],
      "env": {
        "RETELL_API_KEY": "<your_retellai_token>"
      }
    }
  }
}
```

If you prefer the UI, create a new stdio MCP server with:

- Command: `npx`
- Args: `-y @c0bra/retellai-mcp-server`
- Environment variable: `RETELL_API_KEY=<your_retellai_token>`

Restart Cursor or reload the workspace after saving the config.

### Claude Desktop

Claude Desktop uses the standard `mcpServers` config block.

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "retellai-mcp-server": {
      "command": "npx",
      "args": ["-y", "@c0bra/retellai-mcp-server"],
      "env": {
        "RETELL_API_KEY": "<your_retellai_token>"
      }
    }
  }
}
```

Restart Claude Desktop after editing the config file.

### Other MCP Clients

Most stdio-based MCP clients can use this server with the same launch settings:

- Command: `npx`
- Args: `-y @c0bra/retellai-mcp-server`
- Environment variable: `RETELL_API_KEY=<your_retellai_token>`

If your client expects a single command string instead of separate `command` and `args` fields, use the equivalent one-line command:

```bash
npx -y @c0bra/retellai-mcp-server
```

## Example Use Cases

### 1. List all the phone numbers I have in RetellAI

Prompt:

```text
List all the phone numbers I have in RetellAI.
```

Example output:

```text
I found 2 Retell phone numbers:

- +1 415 555 0100
  nickname: Main outbound line
  inbound_agent_id: agent_123
  outbound_agent_id: agent_456

- +1 628 555 0199
  nickname: After-hours line
  inbound_agent_id: agent_789
  outbound_agent_id: none
```

### 2. List all the agents I have

Prompt:

```text
List all the agents I have in RetellAI.
```

Example output:

```text
I found 3 Retell agents:

- Pizza Delivery Agent
  agent_id: agent_123
  voice_id: elevenlabs-Willa
  response_engine.llm_id: llm_100

- Leasing Follow-up Agent
  agent_id: agent_456
  voice_id: cartesia-Cleo
  response_engine.llm_id: llm_200

- Front Desk Overflow Agent
  agent_id: agent_789
  voice_id: retell-Maren
  response_engine.llm_id: llm_300
```

### 3. Tell me more about the pizza delivery agent

Prompt:

```text
Tell me more about the Pizza Delivery Agent.
```

Example output:

```text
Here is a summary of the Pizza Delivery Agent:

- agent_id: agent_123
- name: Pizza Delivery Agent
- voice_id: elevenlabs-Willa
- language: en-US
- response_engine.type: retell-llm
- response_engine.llm_id: llm_100
- begin_message: "Hi, I'd like to place a delivery order."
```

### 4. Create an agent and use it to place an order

Prompt sequence:

```text
Create an agent that calls my local pizza shop, keep the conversation short and to the point.
Order a margherita pizza.
Payment will be cash on delivery.
Send it to 123 Main Street.
The agent should pretend to be me. My name is Alex.
Make an outbound call to +1 555 123 4567 using my US number.
```

Example output:

```text
Created Retell resources successfully.

Agent:
- agent_id: agent_901
- name: Pizza Order Agent

Retell LLM:
- llm_id: llm_901

Phone call:
- call_id: call_901
- from_number: +1 415 555 0100
- to_number: +1 555 123 4567
- call_status: registered

The outbound call has been created and is ready to run through RetellAI.
```

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with your RetellAI API key:

   ```bash
   RETELL_API_KEY=your_api_key_here
   ```

3. Build the server:

   ```bash
   npm run build
   ```

4. Run the server locally:

   ```bash
   node build/index.js
   ```

5. If you want to inspect it with the MCP Inspector:

   ```bash
   npm run inspector
   ```

## Available Tools

### Call Tools

- `list_calls`: Lists all Retell calls
- `create_phone_call`: Creates a new phone call
- `create_web_call`: Creates a new web call
- `get_call`: Gets details of a specific call
- `update_call`: Updates a specific call
- `delete_call`: Deletes a specific call

### Agent Tools

- `list_agents`: Lists all Retell agents
- `create_agent`: Creates a new Retell agent
- `get_agent`: Gets a Retell agent by ID
- `update_agent`: Updates an existing Retell agent
- `delete_agent`: Deletes a Retell agent
- `get_agent_versions`: Gets all versions of a Retell agent

### Phone Number Tools

- `list_phone_numbers`: Lists all Retell phone numbers
- `create_phone_number`: Creates a new phone number
- `get_phone_number`: Gets details of a specific phone number
- `update_phone_number`: Updates a phone number
- `delete_phone_number`: Deletes a phone number

### Voice Tools

- `list_voices`: Lists all available Retell voices
- `get_voice`: Gets details of a specific voice

### Retell LLM Tools

- `list_retell_llms`: Lists all Retell LLMs
- `create_retell_llm`: Creates a new Retell LLM
- `get_retell_llm`: Gets a Retell LLM by ID
- `update_retell_llm`: Updates an existing Retell LLM
- `delete_retell_llm`: Deletes a Retell LLM

## License

MIT
