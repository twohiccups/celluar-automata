export const tooltips = {
    ruleNumber: `
    Each rule number represents a unique mapping from every possible neighborhood of
    cells to a resulting state, as shown in the rule set below. 
    Increasing the number of states or the rule length greatly increases the number of possible rules.  `,
    ruleLength: `
    Rule length is the number of cells in the neighborhood used to decide a cell's next state. 
    The neighborhood is always centered on the cell being updated.
    For example, a rule length of 3 means the cell considers itself plus its immediate left and right neighbors.
  `,
    numStates: `
    Number of states is how many distinct values each cell can take.
    In binary automata, there are 2 states (e.g., 0 and 1). 
    Higher numbers allow more complex behaviors.

    Each state is represented visually by a color, 
    which you can customize in the Color Theme section.
  `,
    ruleSet: `
    The rule set is the full mapping from every possible neighborhood pattern
    to the resulting state for the center cell.
    Each row shows a neighborhood pattern (input) and the resulting state (output).
    Changing any output changes the encoded rule number.
  `,
    initializationMode: `
    Determines the starting pattern of cells before the automaton runs.
    Examples: single active cell in the center, random distribution, etc.
  `,
    edgeMode: `
    Defines how cells at the edges behave: 
    STATIC (edges stay fixed as 0) or MODULAR (wrap around like a loop).
  `,
    logicalWidth: `
    Logical width is the number of cells displayed across the automaton.

    Increasing this value shows more cells per row, giving a wider view of 
    the evolving pattern. Decreasing it zooms in on a smaller section.

    Changing the logical width resets the automaton to its initial state.

    Note: Large widths may impact performance, especially with high 
    scroll speeds or complex rules.
  `,
    scrollSpeed: `
    Scroll speed controls how quickly new rows are added to the automaton.
    `,
    colorTheme: `
    Each cell state corresponds to a color. You can select one of the existing themes and modify it.
    Also you can drag colors to reorder them. Changes only affect the appearance, not the underlying rule or states.
  `
};
