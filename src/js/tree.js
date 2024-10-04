const data = [
    { name: 'start here', parent: undefined, child: 'a' },
    { name: 'fetch data a', parent: 'a', child: 'b' },
    { name: 'fetch data b', parent: 'a', child: 'b' },
    { name: 'make star flake', parent: 'b', child: 'c' },
    { name: 'publish to s3', parent: 'c', child: 'd' },
    { name: 'do quality check', parent: 'b', child: undefined }
  ];
  
  // Step 1: Build a tree structure from the array and combine nodes with the same parent-child relation
  function buildTree(arr) {
    const map = {};
    const roots = [];
  
    arr.forEach(({ parent, child, name }) => {
      // Initialize the child node if it doesn't exist and assign the name if available
      if (child !== undefined && !map[child]) {
        map[child] = { name: child, description: name || child, children: [] };
      } else if (child !== undefined && map[child]) {
        // If the node already exists, append the name to the description if it's not a duplicate
        if (name && !map[child].description.includes(name)) {
          map[child].description += `, ${name}`;
        }
      }
  
      // Handle root nodes (those with undefined parents)
      if (parent === undefined) {
        if (!map[child]) {
          map[child] = { name: child, description: name || child, children: [] };
        }
        roots.push(map[child]);
      } else {
        // Initialize the parent node if it doesn't exist
        if (!map[parent]) {
          map[parent] = { name: parent, description: parent, children: [] };
        }
  
        // Avoid duplicate children by checking if the child is already added
        if (child !== undefined) {
          const existingChild = map[parent].children.find(c => c.name === child);
          if (!existingChild) {
            map[parent].children.push(map[child]);
          }
        } else {
          // If the child is undefined, it's a terminal node with a name (e.g., 'do quality check')
          if (!map[parent].children.some(c => c.description === name)) {
            map[parent].children.push({ name: '', description: name, children: [] });
          }
        }
      }
    });
  
    return roots;
  }
  
  // Step 2: Function to display the tree with combined descriptions using ASCII characters
  function displayTree(node, prefix = '', isLast = true) {
    console.log(`${prefix}${isLast ? '└─' : '├─'} ${node.description}`);
    const newPrefix = prefix + (isLast ? '   ' : '│  ');
    node.children.forEach((child, index) => {
      const isLastChild = index === node.children.length - 1;
      displayTree(child, newPrefix, isLastChild);
    });
  }
  
  // Step 3: Get tree structure and display it
  const tree = buildTree(data);
  tree.forEach(root => displayTree(root));
  