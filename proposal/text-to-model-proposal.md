# Proposal: Text-to-Model Interface for SysML Canvas (BlockDef)

## 1. Context & Motivation

BlockDef currently offers graphical SysML modeling. To align with SysMLv2's textual notation efforts and enhance user experience, we propose integrating a text-to-model interface. This will allow users to construct and modify diagrams using text, complementing the existing graphical approach.

## 2. Core Goals

*   **Text Modeling:** Enable creation of basic SysML elements and relationships via textual commands.
*   **Two-Way Sync:** Ensure real-time, bidirectional synchronization between the text interface and the graphical canvas.
*   **Guided Input:** Provide structured input (e.g., menus, auto-completion) to assist users with text command construction.

## 3. Proposed UI/UX

*   **Location:** Add a new "Text Model" tab within the existing "SPECIFICATION" pane (the right-most pane).
*   **Input:** A text area for commands, supplemented by interactive menus (dropdowns for commands like `CREATE`, `CONNECT`, element types, relationship types) and auto-completion to guide user input.
*   **Feedback:** A dedicated section for live syntax highlighting, success messages, and error notifications.
*   **Two-Way Sync:** Text input updates the graphical canvas immediately. Graphical changes (create, modify, delete) are simultaneously reflected by updating the text in the "Text Model" pane.

## 4. Key Functionality (Basic Scope)

### 4.1. Element Creation

Users can create fundamental SysML elements:

*   `create Package "MyPackage"`
*   `create Block "MyBlock"`
*   `create Port "MyPort"`
*   `create Action "DoSomething"`

### 4.2. Relationship Creation

Users can establish basic relationships between existing elements:

*   `connect "Source Block" to "Target Block" with Association`
*   `connect "Parent Block" to "Child Block" with Composition`

## 5. Proposed Software Changes (High-Level)

*   **`components/canvas/SpecificationWindow.tsx`:** Modify to include a new "Text Model" tab.
*   **New UI Components:** Develop dedicated React components for the text input area, guided menus, and feedback display within the new tab.
*   **Parsing Logic (New Module):** Implement a parser to interpret user's textual commands into structured data objects. This parser will leverage the guided input.
*   **Canvas State Integration (`lib/canvas/reducer.ts`):** Extend the canvas reducer or introduce an intermediary to accept and process actions originating from the parsed text commands, updating the diagram's state (nodes, connections).
*   **Serialization Logic (New Module):** Implement a serializer to convert the current graphical diagram's state (from `lib/canvas/reducer.ts`) back into the textual notation format for display in the "Text Model" pane.
*   **Error Handling:** Integrate robust validation and error reporting mechanisms for the text-to-model process.

## 6. Prompt for Action

Please review this proposal for integrating a text-to-model interface. Your feedback on the UI/UX approach, scope of initial functionality, and agreement on the proposed software changes is requested. Once approved, I can proceed with creating a more detailed implementation plan.
