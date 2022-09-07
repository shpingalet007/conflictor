import fs from 'fs';
import { graphviz } from 'node-graphviz';
import * as path from "path";

function getAlphabet() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  return alphabet;
}

// Define a graph using DOT notation
const graph = `
  digraph L {
    node [shape=record fontname=Arial];
  
    master [label="MASTER\\l"]
    a [label="fix: chat\\l#100\\l" style="filled" fillcolor="green"]
    b [label="feat: separate bloggers for English and Russian sections\\l#200\\l" style="filled" fillcolor="green"]
    c [label="feat: brighteon integration for video links\\l#300\\l" style="filled" fillcolor="orange"]
    d [label="feat: pkoin buttons\\l#400\\l" style="filled" fillcolor="orange"]
    e [label="feat: setting comment order\\l#500\\l" style="filled" fillcolor="orange"]
    f [label="feat: multy blocking\\l#600\\l" style="filled" fillcolor="orange"]
    g [label="fix: hide pocketcoin info for IOS\\l#700\\l" style="filled" fillcolor="red"]
  
    { rank=same; c, d, e }
  
    master -> a -> b
                   b -> c
                   b -> d
                   b -> e
    
    master -> f
  }
`;

const alphabet = getAlphabet();

export default function (branchesData) {
  let deepMap = [];
  let lastUsed = 0;

  let dotGraph = '';
  dotGraph += 'digraph L {\n';
  dotGraph += 'node [shape=record fontname=Arial];\n';
  dotGraph += 'master [label="MASTER\\l"]\n';

  let nodesMap = '';

  const getLabel = () => alphabet[lastUsed++];
  const createNode = (label, title, pullNum, color) => {
    console.log('Created node', label);

    let pullMarker = '';

    if (pullNum !== 'no_pull') {
      pullMarker = `#${pullNum}\\l`;
    }

    return `${label} [label="${title}\\l${pullMarker}" style="filled" fillcolor="${color}"]\n`;
  };
  const mapNode = (label, relations) => {
    console.log('Node', label, 'connected with', relations.join(', '));

    let paths = '';

    relations.forEach((r) => {
      paths += `${label} -> ${r}\n`;
    });

    return paths;
  };

  let currentNode = { label: 'master', sha: 'f3b42c229b9e7d86d39f2ed48d3bd369bd181c95' };
  console.log('Set active node to', currentNode.label);
  deepMap[1] = [currentNode];

  dotGraph += createNode('master', currentNode.label, 'no_pull', 'white');

  branchesData.forEach((branch) => {
    if (!branch.conflictLevel) {
      const label = getLabel();
      console.log('Set active node to', label);
      deepMap[1] = [{ label, sha: branch.sha, chain: [currentNode] }];
      dotGraph += createNode(label, branch.title, branch.pullNumber, 'white');
      nodesMap += mapNode(currentNode.label, [label]);
      currentNode = deepMap[1][0];
      return;
    }

    for (let i = deepMap.length - 1; i >= 0; i--) {
      if (i === 0) {
        const label = getLabel();
        console.log('Set active node to', label);
        deepMap.push([{ label, sha: branch.sha, chain: [] }]);

        const isMasterConflict = branch.concurrency.some(b => b.label === 'master');

        let color = 'white';

        if (isMasterConflict) {
          color = 'red';
        }

        dotGraph += createNode(label, branch.title, branch.pullNumber, 'red');
        return;
      }

      const potentialParents = deepMap[i];

      let mapped = false;

      for (let j = 0; j < potentialParents.length; j++) {
        const parent = potentialParents[j];
        const parentConcurrency = branchesData.find(b => b.sha === parent.sha).concurrency || [];
        const childConcurrency = branchesData.find(b => b.sha === branch.sha).concurrency || [];

        const parentConflicts = parentConcurrency.some(b => b.sha === branch.sha);
        const parentChainConflicts = parent.chain.some((node) => {
          for (let i = 0; i < childConcurrency.length; i++) {
            if (childConcurrency[i].sha === node.sha) {
              return true;
            }
          }
        });
        const childConflicts = childConcurrency.some(b => b.sha === parent.sha);
        const isMasterConflict = childConcurrency.some(b => b.title === 'master');

        let color = 'white';

        if (isMasterConflict) {
          color = 'red';
        } else if (parentConflicts || childConflicts) {
          color = 'orange';
        }

        if (parentChainConflicts) {
          break;
        }

        if (!parentConflicts || !childConflicts) {
          const label = getLabel();
          console.log('Set active node to', label);
          deepMap.push([{ label, sha: branch.sha, chain: [...parent.chain, parent] }]);
          dotGraph += createNode(label, branch.title, branch.pullNumber, color);
          nodesMap += mapNode(parent.label, [label]);

          mapped = true;
          break;
        }
      }

      if (mapped) {
        break;
      }
    }
  });

  nodesMap += '}';

  /*const zeroConflicted = branchesData
    .filter(b => (!b.conflictLevel))
    .map((b) => {
      dotGraph += createNode(alphabet[lastUsed], b.title, 'UNDEFINED', 'red');
      return {
        label: alphabet[lastUsed++],
        sha: b.sha,
      };
    });

  const conflicted = branchesData
    .filter(b => b.conflictLevel)
    .map((b) => {
      dotGraph += createNode(alphabet[lastUsed], b.title, 'UNDEFINED', 'red');
      return {
        label: alphabet[lastUsed++],
        sha: b.sha,
        concurrency: b.concurrency,
      };
    });

  nodesMap += mapNode(currentNode.label, zeroConflicted.map(n => n.label));
  deepMap[2] = zeroConflicted;

  deepMap[2].forEach((b1) => {
    conflicted.forEach((b2) => {
      const isConflictingWithTarget = b2.concurrency.some(c => (c.sha === b1.sha));

      if (!isConflictingWithTarget) {
        nodesMap += mapNode(b1.label, [b2.label]);
      }
    });
  });*/


  /*branchesData.forEach((b) => {
    const levelNodes = [b.sha];

    if (b.concurrency) {
      levelNodes.push(b.concurrency.map(c => c.sha));
    }

    levelNodes.forEach(() => {
      const label = alphabet[lastUsed++];

      dotGraph += createNode(label, b.sha, 100, 'green');
      nodesMap += mapNode(currentNode, [label]);

      console.log(111);
    });


  });*/





  /*const zeroConflicted = branchesData
    .filter(b => (!b.conflictLevel))
    .map((b) => {
      dotGraph += createNode(alphabet[lastUsed], b.title, 'NNN', 'red');
      return alphabet[lastUsed++];
    });

  nodesMap += mapNode('master', zeroConflicted);

  const zeroConflicted = branchesData
    .filter(b => (b.conflictLevel))
    .map((b) => {
      dotGraph += createNode(alphabet[lastUsed], b.title, 'NNN', 'red');
      return alphabet[lastUsed++];
    });

  nodesMap += '}';*/

  // Compile the graph to SVG using the `dot` layout algorithm
  graphviz.layout(dotGraph + nodesMap, 'svg').then((svg) => {
    // Write the SVG to file
    fs.writeFileSync('graph.svg', svg);
  });
}
