import fs from 'fs';
import { graphviz } from 'node-graphviz';

export default function(pullsData, mainBranchSha) {
  const nodes = pullsData.map((pull) => {
    const nodeData = {};

    nodeData.node = pull.pullNumber;
    nodeData.label = pull.title;
    nodeData.path = [];
    nodeData.impacts = pull.concurrency?.map((concurrency) => {
      return pullsData.find(pull => pull.sha === concurrency.sha || concurrency.sha === mainBranchSha).pullNumber;
    }) || [];

    return nodeData;
  });
  nodes.push({node: 'base', label: 'base', impacts: [], path: [], base: true});

  let levels = [nodes.filter(n => !!n.base)];

  const clearNodes = nodes.filter(n => {
    const isBase = (!!n.base);
    const isImpacting = (n.impacts.length);
    const isAffected = nodes.some((ni) => (
      ni.impacts.some((nil) => (nil === n.label))
    ));

    return !isImpacting && !isBase && !isAffected;
  });

  const clearNodesDeclarations = clearNodes.map(n => `${n.node} [ label="${n.label}" style="filled" fillcolor="green" ]`).join('\n');
  const clearNodesMappings = clearNodes.map(n => {
    const mapBase = levels[0][0];

    n.path = [...mapBase.path, mapBase.label];

    levels.pop()
    levels.push([n]);
    return `${mapBase.node} -> ${n.node}`;
  }).join('\n');

  const affectedNodes = nodes.filter(n => {
    const isBase = (!!n.base);
    const isImpacting = (n.impacts.length);
    const isAffected = nodes.some((ni) => (
      ni.impacts.some((nil) => (nil === n.label))
    ));

    return !isImpacting && !isBase && isAffected;
  });

  const affectedNodesDeclarations = affectedNodes.map(n => `${n.node} [ label="${n.label}" style="filled" color="red" fillcolor="green" ]`).join('\n');
  const affectedNodesMappings = affectedNodes.map(n => {
    const mapBase = levels.at(-1)[0];

    n.path = [...mapBase.path, mapBase.label];

    levels.push([n]);
    return `${mapBase.node} -> ${n.node}`;
  }).join('\n');

  const impactingNodes = nodes.filter(n => {
    const isBase = (!!n.base);
    const isImpacting = (n.impacts.length);

    return !isBase && isImpacting;
  });

  const impactingNodesDeclarations = impactingNodes.map(n => `${n.node} [ label="${n.label}" style="filled" fillcolor="red" ]`).join('\n');
  const impactingNodesMappings = impactingNodes.map(n => {
    let isMapped = false;
    let mappings = [];

    for (let i = levels.length - 1; i >= 0; i--) {
      for (let j = 0; j < levels[i].length; j++) {
        const mapBase = levels[i][j];

        const isBaseConflicting = mapBase.impacts.some(i => i === n.node);
        const isNodeConflicting = n.impacts.some(i => i === mapBase.node);
        const areBaseParentsConflicting = mapBase.path.some(i1 => {
          return n.impacts.some(i2 => i2 === i1);
        });

        if (!isBaseConflicting && !areBaseParentsConflicting && !isNodeConflicting) {
          n.path = [...mapBase.path, mapBase.label];

          if (i < levels.length - 1) {
            levels[i + 1].push(n);

            /*const fNodes = nodes.filter((n, i) => {
              const nParent = n.path.at(-1);

              if (nParent === 'f') {
                return true;
              }
            });*/
          } else {
            levels.push([n]);
          }

          mappings.push(`${mapBase.node} -> ${n.node}`);
          isMapped = true;
        }
      }

      if (isMapped) {
        return mappings.join('\n');
      }
    }
  }).join('\n');

  const graph = `digraph L {
  node [shape=record fontname=Arial penwidth=3 width=5 height=1 fontsize=16 style=filled fillcolor=white];

  ${clearNodesDeclarations}
  ${affectedNodesDeclarations}
  ${impactingNodesDeclarations}
  
  ${clearNodesMappings}
  ${affectedNodesMappings}
  ${impactingNodesMappings}
}`;

  return new Promise((resolve, reject) => {
    graphviz.layout(graph, 'svg').then((svg) => {
      // Write the SVG to file
      fs.writeFileSync('graph.svg', svg);
      resolve();
    });
  });
}
