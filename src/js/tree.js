const data = [
	{ name: "start here", parent: undefined, child: "a" },
	{ name: "fetch data a", parent: "a", child: "b" },
	{ name: "fetch data b", parent: "a", child: "b" },
	{ name: "make snow flake", parent: "b", child: "c" },
	{ name: "publish to s3", parent: "c", child: "y" },
	{ name: "publish to s4", parent: "c", child: undefined },
	{ name: "do quality check", parent: "b", child: "d" },
	{ name: "on s3", parent: "d", child: "z" },
];

let consoleLogText = "";

// Step 1: Build a tree structure from the array and combine nodes with the same parent-child relation
function buildTree(arr) {
	const map = {};
	const roots = [];

	arr.forEach(({ parent, child, name }) => {
		if (child !== undefined && !map[child]) {
			map[child] = {
				name: child,
				description: name || child,
				children: [],
			};
		} else if (child !== undefined && map[child]) {
			if (name && !map[child].description.includes(name)) {
				map[child].description += `, ${name}`;
			}
		}

		if (parent === undefined) {
			if (!map[child]) {
				map[child] = {
					name: child,
					description: name || child,
					children: [],
				};
			}
			roots.push(map[child]);
		} else {
			if (!map[parent]) {
				map[parent] = {
					name: parent,
					description: parent,
					children: [],
				};
			}

			if (child !== undefined) {
				const existingChild = map[parent].children.find(
					(c) => c.name === child
				);
				if (!existingChild) {
					map[parent].children.push(map[child]);
				}
			} else {
				if (!map[parent].children.some((c) => c.description === name)) {
					map[parent].children.push({
						name: "",
						description: name,
						children: [],
					});
				}
			}
		}
	});

	return roots;
}

// Step 2: Collect all terminal nodes (nodes without children)
function collectTerminalNodes(node, terminalNodes = []) {
	if (node.children.length === 0) {
		terminalNodes.push(node);
	}
	node.children.forEach((child) =>
		collectTerminalNodes(child, terminalNodes)
	);
	return terminalNodes;
}

// Step 3: Function to calculate the longest line length (dry run without output)
function calculateMaxLength(
	node,
	prefix = "",
	isLast = true,
	maxLengthObj = { maxLength: 0 }
) {
	const line = `${prefix}${isLast ? "└─" : "├─"} ${node.description}`;

	// Calculate the longest line length during this dry run
	if (line.length > maxLengthObj.maxLength) {
		maxLengthObj.maxLength = line.length;
	}

	const newPrefix = prefix + (isLast ? "   " : "│  ");

	node.children.forEach((child, index) => {
		const isLastChild = index === node.children.length - 1;
		calculateMaxLength(child, newPrefix, isLastChild, maxLengthObj);
	});
}

// Step 4: Function to display the tree and include longest line length at terminal nodes
function displayTreeWithLineLength(
	node,
	prefix = "",
	isLast = true,
	terminalIndex = {},
	maxLength,
	encounteredTerminalRef
) {
	const isTerminal = node.children.length === 0;
	let terminalLabel = "";
	let line = `${prefix}${isLast ? "└─" : "├─"} ${node.description}`;

	if (isTerminal) {
		const index = terminalIndex.current++;
		terminalLabel = index === 0 ? "─┐" : "─┤";

		// Pad terminal lines with '─'
		const paddingNeeded = maxLength - (line.length + terminalLabel.length);
		if (paddingNeeded > 0) {
			line += " " + "─".repeat(paddingNeeded);
		}
		line += terminalLabel;

		encounteredTerminalRef.value = true; // Set the flag to true once a terminal node is encountered
	} else {
		// Pad non-terminal lines with dots and check if it appears after a terminal node
		const paddingNeeded = maxLength - line.length;
		if (paddingNeeded > 0) {
			line += " ".repeat(paddingNeeded);
		}
		if (encounteredTerminalRef.value) {
			line += "│"; // Pad non-terminal nodes that appear after the first terminal node with '│'
		}
	}

	consoleLogText+=(line.trimEnd() + "\r\n" );

	const newPrefix = prefix + (isLast ? "   " : "│  ");

	node.children.forEach((child, index) => {
		const isLastChild = index === node.children.length - 1;
		displayTreeWithLineLength(
			child,
			newPrefix,
			isLastChild,
			terminalIndex,
			maxLength,
			encounteredTerminalRef
		);
	});
}

// Step 5: Get tree structure, run dry run for longest line calculation, and display the tree with updated terminal nodes
const tree = buildTree(data);

// Dry run to calculate the longest line
const maxLengthObj = { maxLength: 0 };
tree.forEach((root) => calculateMaxLength(root, "", true, maxLengthObj));

// Track terminal node indices
const terminalNodes = [];
tree.forEach((root) => collectTerminalNodes(root, terminalNodes));
const terminalIndex = { current: 0, total: terminalNodes.length };

// Track whether we've encountered a terminal node
const encounteredTerminalRef = { value: false };

// Display the tree with the longest line length added to terminal nodes and padded
tree.forEach((root) =>
	displayTreeWithLineLength(
		root,
		"",
		true,
		terminalIndex,
		maxLengthObj.maxLength,
		encounteredTerminalRef
	)
);

consoleLogText+=(" ".repeat(maxLengthObj.maxLength) + "└─ completed");

console.log(consoleLogText);
