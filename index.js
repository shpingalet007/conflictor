import { exec } from 'child_process';
import { fetchPulls } from './fetch-pulls.js';
import args from './args.js';

import visualize from './visualizer.js';

let directImpactsRegex = />>> DIRECT IMPACT.*$\n(.*\n)*?>>> END/gm;
let sideImpactsRegex = />>> SIDE IMPACT.*$\n(.*\n)*?>>> END/gm;
let masterShaRegex = />>> MASTER BRANCH SHA \[(.+)\]$/m;

let changes = {};
let conflicts = {};
let intersected = {};
let mergeOrder = [];

let optionalCommands = '';
const projectFolder = `cd ${args.project}`;
const runScript = '/Users/developer/Documents/GitHub/conflictor/Conflictor/conflicts.sh';

if (args.base) {
  optionalCommands += `export CONFLICTOR_MASTER_SHA=${args.base}`;
  optionalCommands += ' &&';
}

const pullsData = await fetchPulls(args.repo, args.marker);
const shaList = pullsData.map(p => p.sha);
const titlesList = pullsData.map(p => p.title);

/*const shaList = [
  '3a1c897b27362f1b3edc823f322bd7965069aed7',
  '0035762b7c6d660e85d6ec0c08fc2a12d4758233',
  '820f5a424888bcaaf64fdc852796ca0b907a6eec',
  '22244b00a49f745ff394d8de2c70a79cc2cd114a',
  '863b21ed059af634198d1368036133e64e13a903',
  '68374016a3c9a8d907585deee7aca29bf62d23f8',
  '94021933ee914689c858f704e79d373e101e8482',
];

const titlesList = [
  '3a1c897b27362f1b3edc823f322bd7965069aed7',
  '0035762b7c6d660e85d6ec0c08fc2a12d4758233',
  '820f5a424888bcaaf64fdc852796ca0b907a6eec',
  '22244b00a49f745ff394d8de2c70a79cc2cd114a',
  '863b21ed059af634198d1368036133e64e13a903',
  '68374016a3c9a8d907585deee7aca29bf62d23f8',
  '94021933ee914689c858f704e79d373e101e8482',
];

const stdout = `>>> MASTER BRANCH SHA [f3b42c229b9e7d86d39f2ed48d3bd369bd181c95]
>>> DIRECT IMPACT INSPECTION [0] - START
components/registration/index.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:1] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:2] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:3] - START
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:5] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
package.json
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:7] - START
>>> END
>>> DIRECT IMPACT INSPECTION [1] - START
components/comments/index.js
components/lenta/templates/sharearticle.html
components/post/index.js
css/common.css
css/common.less
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.js
components/comments/index.css
components/comments/index.js
components/comments/index.less
components/comments/templates/post.html
components/lenta/index.js
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.css
components/pkoin/index.js
components/pkoin/index.less
css/common.css
css/common.less
components/pkoin/index.css
components/pkoin/index.js
components/pkoin/index.less
components/pkoin/templates/index.html
components/lenta/index.js
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.js
css/common.css
css/common.less
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:2] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:3] - START
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:5] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
package.json
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:7] - START
>>> END
>>> DIRECT IMPACT INSPECTION [2] - START
css/main.css
css/main.less
css/main.less
css/main.css
css/main.less
components/post/index.css
components/post/index.less
css/main.css
css/main.less
components/share/index.js
components/share/templates/url.html
components/video/index.js
css/main.css
css/main.less
js/functions.js
js/satolist.js
php/og.php
tpls/index.html.tpl
tpls/index.php.tpl
tpls/index_el.html.tpl
tpls/indexcordova.html.tpl
tpls/openapi.html.tpl
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:3] - START
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:5] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
package.json
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
tpls/index.html.tpl
tpls/index.php.tpl
tpls/index_el.html.tpl
tpls/indexcordova.html.tpl
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:7] - START
>>> END
>>> DIRECT IMPACT INSPECTION [3] - START
js/satolist.js
components/comments/index.js
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/en.js
localization/ru.js
js/app.js
js/app.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:4] - START
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:5] - START
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:6] - START
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:7] - START
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/ru.js
>>> END
>>> DIRECT IMPACT INSPECTION [4] - START
components/author/index.js
components/blocking/index.js
components/comments/index.js
components/lenta/templates/share.html
components/lenta/templates/sharevideo.html
js/kit.js
js/satolist.js
localization/en.js
localization/ru.js
components/author/index.js
components/comments/index.js
js/satolist.js
components/blocking/index.js
js/_map.js
js/kit.js
js/satolist.js
proxy16/node/rpc.js
components/blocking/templates/index.html
localization/en.js
localization/ru.js
components/blocking/index.less
components/blocking/templates/index.html
components/author/index.js
components/blocking/index.css
components/blocking/index.js
components/comments/index.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:5] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:7] - START
>>> END
>>> DIRECT IMPACT INSPECTION [5] - START
components/wallet/templates/buy.html
components/userpage/index.js
js/app.js
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
js/_map.js
js/satolist.js
js/vendor/lame.min.js
minimize.js
package.json
tpls/index.html.tpl
tpls/index.php.tpl
tpls/index_el.html.tpl
tpls/indexcordova.html.tpl
tpls/main.js.tpl
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
js/app.js
js/satolist.js
tpls/config.xml.tpl
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/transactionview/index.js
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js
00\tpeertube/538.chunk.js.LICENSE.txt\tpeertube/5.chunk.js.LICENSE.txt
peertube/5.chunk.js.map
peertube/508.chunk.js
peertube/508.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/538.chunk.js
peertube/538.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css.map
chat/img/arrow-down.aa0b84d3.svg
chat/img/arrow-up.a6106c72.svg
chat/img/big-play-button.824d5546.svg
chat/img/code.8287dd2f.svg
chat/img/fullscreen.0f7b5187.svg
chat/img/link-2.09f9bd36.svg
chat/img/list.7da6f7a2.svg
chat/img/logoBastyon.653ff2df.svg
chat/img/next.2d9703ea.svg
chat/img/repeat.6d83c667.svg
chat/img/settings.e342aadb.svg
chat/img/theater.8cf34da1.svg
chat/img/tick-white.169ebc6b.svg
chat/img/volume-mute.ba0a52d8.svg
chat/img/volume.c61c609e.svg
chat/img/x.b0200bf7.svg
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/lenta/index.js
peertube/236.chunk.js
peertube/236.chunk.js.LICENSE.txt
peertube/236.chunk.js.map
peertube/294.chunk.js
peertube/294.chunk.js.LICENSE.txt
51\tpeertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js.map\tpeertube/294.chunk.js.map
peertube/300.chunk.js
peertube/300.chunk.js.map
peertube/470.chunk.js
peertube/508.chunk.js
peertube/508.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/538.chunk.js
peertube/538.chunk.js.LICENSE.txt
peertube/538.chunk.js.map
peertube/636.chunk.js
peertube/636.chunk.js.map
peertube/647.chunk.js
peertube/647.chunk.js.LICENSE.txt
peertube/647.chunk.js.map
peertube/731.chunk.js
peertube/731.chunk.js.LICENSE.txt
peertube/731.chunk.js.map
peertube/819.chunk.js
peertube/819.chunk.js.LICENSE.txt
peertube/819.chunk.js.map
peertube/875.chunk.js
peertube/875.chunk.js.map
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js.map
peertube/embed.html
peertube/src_assets_player_peertube-player-manager_ts.chunk.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js.map
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js.map
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js.map
peertube/test-embed.html
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js.map
peertube/vendors-node_modules_buffer_index_js.chunk.js
peertube/vendors-node_modules_buffer_index_js.chunk.js.map
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js.map
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js.map
peertube/vendors-node_modules_p2p-media-loader-hlsjs-basyton_dist_index_js.chunk.js
peertube/vendors-node_modules_p2p-media-loader-hlsjs-basyton_dist_index_js.chunk.js.map
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js
peertube/vendors-node_modules_sha_js_index_js.chunk.js
peertube/vendors-node_modules_sha_js_index_js.chunk.js.map
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js.map
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.LICENSE.txt
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
components/post/index.js
js/vendor/plyr.js
peertube/236.chunk.js
peertube/236.chunk.js.LICENSE.txt
peertube/236.chunk.js.map
peertube/294.chunk.js
peertube/294.chunk.js.LICENSE.txt
peertube/300.chunk.js
peertube/300.chunk.js.map
peertube/470.chunk.js
peertube/508.chunk.js
peertube/508.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/538.chunk.js
peertube/538.chunk.js.LICENSE.txt
peertube/538.chunk.js.map
peertube/569.chunk.js
peertube/569.chunk.js.LICENSE.txt
peertube/569.chunk.js.map
peertube/636.chunk.js
peertube/636.chunk.js.map
peertube/647.chunk.js
peertube/647.chunk.js.LICENSE.txt
peertube/647.chunk.js.map
peertube/731.chunk.js
peertube/731.chunk.js.LICENSE.txt
peertube/731.chunk.js.map
peertube/875.chunk.js
peertube/875.chunk.js.map
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js.map
peertube/embed.html
peertube/src_assets_player_peertube-player-manager_ts.chunk.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js.map
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js.map
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js.map
peertube/test-embed.html
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js.map
peertube/vendors-node_modules_buffer_index_js.chunk.js
peertube/vendors-node_modules_buffer_index_js.chunk.js.map
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js.map
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js.map
peertube/vendors-node_modules_p2p-media-loader-hlsjs-basyton_dist_index_js.chunk.js
peertube/vendors-node_modules_p2p-media-loader-hlsjs-basyton_dist_index_js.chunk.js.map
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js
51\tpeertube/294.chunk.js.map\tpeertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js.map
peertube/vendors-node_modules_sha_js_index_js.chunk.js
peertube/vendors-node_modules_sha_js_index_js.chunk.js.map
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js.map
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.LICENSE.txt
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
00\tchat/img/arrow-down.ca86e814.svg\tchat/img/arrow-down.aa0b84d3.svg
00\tchat/img/arrow-up.ab97d522.svg\tchat/img/arrow-up.a6106c72.svg
00\tchat/img/big-play-button.e0023a5b.svg\tchat/img/big-play-button.824d5546.svg
00\tchat/img/fullscreen.a59d3d74.svg\tchat/img/fullscreen.0f7b5187.svg
00\tchat/img/next.0472d4b6.svg\tchat/img/next.2d9703ea.svg
00\tchat/img/settings.ea97bb23.svg\tchat/img/settings.e342aadb.svg
00\tchat/img/theater.4902f74b.svg\tchat/img/theater.8cf34da1.svg
00\tchat/img/tick-white.e8f64f8c.svg\tchat/img/tick-white.169ebc6b.svg
00\tchat/img/volume-mute.38ba93b2.svg\tchat/img/volume-mute.ba0a52d8.svg
00\tchat/img/volume.965eb958.svg\tchat/img/volume.c61c609e.svg
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/508.chunk.js.map
peertube/526.chunk.js.map
peertube/538.chunk.js.map
peertube/569.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/875.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css.map
js/_map.js
js/app.js
js/functionsfirst.js
js/lib/client/api.js
js/satolist.js
js/transports/peertube-transport.js
js/transports/peertube-transport.ts
js/vendor/plyr.js
js/videotransport.js
peertube/236.chunk.js
peertube/236.chunk.js.LICENSE.txt
peertube/236.chunk.js.map
peertube/294.chunk.js
peertube/294.chunk.js.LICENSE.txt
peertube/294.chunk.js.map
peertube/300.chunk.js
peertube/300.chunk.js.map
peertube/470.chunk.js
peertube/508.chunk.js
peertube/508.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/538.chunk.js
peertube/538.chunk.js.LICENSE.txt
peertube/538.chunk.js.map
peertube/569.chunk.js
peertube/569.chunk.js.LICENSE.txt
peertube/569.chunk.js.map
peertube/636.chunk.js
peertube/636.chunk.js.map
peertube/647.chunk.js
peertube/647.chunk.js.LICENSE.txt
peertube/647.chunk.js.map
peertube/731.chunk.js
peertube/731.chunk.js.LICENSE.txt
peertube/731.chunk.js.map
peertube/875.chunk.js
peertube/875.chunk.js.map
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js.map
peertube/embed.html
peertube/src_assets_player_peertube-player-manager_ts.chunk.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js.map
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js.map
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js.map
peertube/test-embed.html
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js.map
peertube/vendors-node_modules_buffer_index_js.chunk.js
peertube/vendors-node_modules_buffer_index_js.chunk.js.map
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js.map
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js.map
peertube/vendors-node_modules_peertube_p2p-media-loader-hlsjs_dist_index_js.chunk.js
peertube/vendors-node_modules_peertube_p2p-media-loader-hlsjs_dist_index_js.chunk.js.map
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js.map
peertube/vendors-node_modules_sha_js_index_js.chunk.js
peertube/vendors-node_modules_sha_js_index_js.chunk.js.map
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js.map
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.LICENSE.txt
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
tpls/index_el.html.tpl
tpls/main.js.tpl
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
tpls/embedVideo.php.tpl
components/lenta/index.js
cordova/package-lock.json
js/app.js
js/functions.js
js/functionsfirst.js
js/satolist.js
js/vendor/plyr.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js.map
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
tpls/config.xml.tpl
components/lenta/index.js
css/main.css
css/main.less
js/vendor/plyr.js
peertube/101.chunk.js
peertube/101.chunk.js.LICENSE.txt
peertube/101.chunk.js.map
peertube/118.chunk.js
peertube/118.chunk.js.map
peertube/291.chunk.js
peertube/291.chunk.js.map
peertube/36.chunk.js
peertube/36.chunk.js.map
peertube/462.chunk.js
peertube/462.chunk.js.LICENSE.txt
peertube/462.chunk.js.map
peertube/53.chunk.js
peertube/53.chunk.js.map
peertube/634.chunk.js
peertube/634.chunk.js.LICENSE.txt
peertube/634.chunk.js.map
peertube/680.chunk.js
peertube/680.chunk.js.LICENSE.txt
peertube/680.chunk.js.map
peertube/795.chunk.js
peertube/795.chunk.js.LICENSE.txt
peertube/795.chunk.js.map
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js
peertube/_2d84-_5a06-_ed7a-_5c78-_ed1b-_d17e-_c33b.chunk.js.map
peertube/arrow-down.svg
peertube/arrow-up.svg
peertube/big-play-button.svg
peertube/code.svg
peertube/embed.html
peertube/fullscreen.svg
peertube/link-2.svg
peertube/list.svg
peertube/logo.svg
peertube/logoBastyon.svg
peertube/next.svg
peertube/player.bundle.js
peertube/player.bundle.js.map
peertube/repeat.svg
peertube/settings.svg
peertube/src_assets_player_peertube-player-manager_ts.chunk.js
peertube/src_assets_player_peertube-player-manager_ts.chunk.js.map
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js
peertube/src_assets_player_shared_p2p-media-loader_p2p-media-loader-plugin_ts.chunk.js.map
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js
peertube/src_assets_player_shared_webtorrent_webtorrent-plugin_ts-src_shims_http_ts-src_shims_https_ts-e92bbe.chunk.js.map
peertube/test-embed.bundle.js
peertube/test-embed.bundle.js.map
peertube/test-embed.css
peertube/test-embed.css.map
peertube/test-embed.html
peertube/theater.svg
peertube/tick-white.svg
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js
peertube/vendors-node_modules_bittorrent-tracker_client_js.chunk.js.map
peertube/vendors-node_modules_buffer_index_js.chunk.js
peertube/vendors-node_modules_buffer_index_js.chunk.js.map
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js
peertube/vendors-node_modules_hls_js_dist_hls_light_js.chunk.js.map
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js
peertube/vendors-node_modules_https-browserify_index_js-node_modules_stream-browserify_index_js-node_m-974c59.chunk.js.map
peertube/vendors-node_modules_peertube_p2p-media-loader-hlsjs_dist_index_js.chunk.js
peertube/vendors-node_modules_peertube_p2p-media-loader-hlsjs_dist_index_js.chunk.js.map
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js
peertube/vendors-node_modules_peertube_videojs-contextmenu_dist_videojs-contextmenu_es_js-node_modules-7bc6bc.chunk.js.map
peertube/vendors-node_modules_sha_js_index_js.chunk.js
peertube/vendors-node_modules_sha_js_index_js.chunk.js.map
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js
peertube/vendors-node_modules_socket_io-client_build_esm_index_js.chunk.js.map
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.LICENSE.txt
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
peertube/volume-mute.svg
peertube/volume.svg
peertube/x.svg
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [5:6] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [5:7] - START
chat/matrix-element.0.js
chat/matrix-element.0.js.map
chat/matrix-element.0.min.js
chat/matrix-element.0.min.js.map
chat/matrix-element.1.js
chat/matrix-element.1.js.map
chat/matrix-element.1.min.js
chat/matrix-element.1.min.js.map
chat/matrix-element.10.js
chat/matrix-element.10.js.map
chat/matrix-element.10.min.js.map
chat/matrix-element.11.js
chat/matrix-element.11.js.map
chat/matrix-element.11.min.js
chat/matrix-element.11.min.js.map
chat/matrix-element.12.js
chat/matrix-element.12.js.map
chat/matrix-element.12.min.js
chat/matrix-element.12.min.js.map
chat/matrix-element.13.js
chat/matrix-element.13.js.map
chat/matrix-element.13.min.js
chat/matrix-element.13.min.js.map
chat/matrix-element.14.js
chat/matrix-element.14.js.map
chat/matrix-element.14.min.js
chat/matrix-element.14.min.js.map
chat/matrix-element.15.js
chat/matrix-element.15.js.map
chat/matrix-element.15.min.js
chat/matrix-element.15.min.js.map
chat/matrix-element.16.js
chat/matrix-element.16.js.map
chat/matrix-element.16.min.js
chat/matrix-element.16.min.js.map
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.4.js
chat/matrix-element.4.js.map
chat/matrix-element.4.min.js
chat/matrix-element.4.min.js.map
chat/matrix-element.5.js
chat/matrix-element.5.js.map
chat/matrix-element.5.min.js
chat/matrix-element.5.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.7.js
chat/matrix-element.7.js.map
chat/matrix-element.7.min.js
chat/matrix-element.7.min.js.map
chat/matrix-element.8.js
chat/matrix-element.8.js.map
chat/matrix-element.8.min.js
chat/matrix-element.8.min.js.map
chat/matrix-element.9.js
chat/matrix-element.9.js.map
chat/matrix-element.9.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
components/post/index.js
cordova/package-lock.json
js/_map.js
js/functions.js
js/satolist.js
js/vendor/plyr.js
js/videotransport.js
package.json
peertube/236.chunk.js.map
peertube/294.chunk.js.map
peertube/300.chunk.js.map
peertube/5.chunk.js.map
peertube/526.chunk.js
peertube/526.chunk.js.map
peertube/636.chunk.js.map
peertube/647.chunk.js.map
peertube/731.chunk.js.map
peertube/819.chunk.js
peertube/819.chunk.js.map
peertube/875.chunk.js.map
peertube/910.chunk.js
peertube/910.chunk.js.map
peertube/embed.html
peertube/video-embed.bundle.js
peertube/video-embed.bundle.js.map
peertube/video-embed.css
peertube/video-embed.css.map
>>> END
>>> DIRECT IMPACT INSPECTION [6] - START
js/satolist.js
components/bestposts/index.js
components/leftpanel/templates/menu.html
components/leftpanel/templates/top.html
components/lenta/index.js
components/main/index.js
components/toppanel/index.js
js/satolist.js
localization/de.js
localization/es.js
localization/fr.js
localization/it.js
localization/kr.js
localization/ru.js
localization/zh.js
proxy16/node/manager.js
proxy16/node/rpc.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [6:7] - START
>>> END
`;*/

/*const shaList = [
  "5a67bed469062e4e4249c0985c31f83da6e41432",
  "3a1c897b27362f1b3edc823f322bd7965069aed7",
  "70e29629733a21da6231494bd76313a085bd2c8c",
  "4c728ec3dd39efaaca5ae67747a771df7ed6bec2",
  "51353751736929937933deffee37a8a96c1d72ee",
  "863b21ed059af634198d1368036133e64e13a903",
  "0d78320243c6fcbc2ac149bdf17fc924e81631bf",
  "94021933ee914689c858f704e79d373e101e8482"
];

const titlesList = [
  "5a67bed469062e4e4249c0985c31f83da6e41432",
  "3a1c897b27362f1b3edc823f322bd7965069aed7",
  "70e29629733a21da6231494bd76313a085bd2c8c",
  "4c728ec3dd39efaaca5ae67747a771df7ed6bec2",
  "51353751736929937933deffee37a8a96c1d72ee",
  "863b21ed059af634198d1368036133e64e13a903",
  "0d78320243c6fcbc2ac149bdf17fc924e81631bf",
  "94021933ee914689c858f704e79d373e101e8482"
];

const stdout = `>>> MASTER BRANCH SHA [f3b42c229b9e7d86d39f2ed48d3bd369bd181c95]
>>> DIRECT IMPACT INSPECTION [0] - START
chat/matrix-element.3.js
chat/matrix-element.3.js.map
chat/matrix-element.3.min.js
chat/matrix-element.3.min.js.map
chat/matrix-element.6.js
chat/matrix-element.6.js.map
chat/matrix-element.6.min.js
chat/matrix-element.6.min.js.map
chat/matrix-element.js
chat/matrix-element.js.map
chat/matrix-element.min.js
chat/matrix-element.min.js.map
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:1] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:2] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:3] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:5] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [0:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [1] - START
components/registration/index.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:2] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:3] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:5] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [1:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [2] - START
components/share/index.js
components/share/templates/url.html
components/video/index.js
js/functions.js
js/satolist.js
php/og.php
tpls/index.html.tpl
tpls/index.php.tpl
tpls/index_el.html.tpl
tpls/indexcordova.html.tpl
tpls/openapi.html.tpl
css/main.css
css/main.less
css/main.less
css/main.css
css/main.less
components/post/index.css
components/post/index.less
css/main.css
css/main.less
components/share/index.js
components/share/templates/url.html
components/video/index.js
css/main.css
css/main.less
js/functions.js
js/satolist.js
php/og.php
tpls/index.html.tpl
tpls/index.php.tpl
tpls/index_el.html.tpl
tpls/indexcordova.html.tpl
tpls/openapi.html.tpl
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:3] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:5] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [2:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [3] - START
components/comments/index.css
components/comments/index.less
components/comments/templates/post.html
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
css/common.css
css/common.less
components/comments/index.js
components/lenta/templates/sharearticle.html
components/post/index.js
css/common.css
css/common.less
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.js
components/comments/index.css
components/comments/index.js
components/comments/index.less
components/comments/templates/post.html
components/lenta/index.js
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.css
components/pkoin/index.js
components/pkoin/index.less
css/common.css
css/common.less
components/pkoin/index.css
components/pkoin/index.js
components/pkoin/index.less
components/pkoin/templates/index.html
components/lenta/index.js
components/lenta/templates/share.html
components/lenta/templates/sharearticle.html
components/lenta/templates/sharevideo.html
components/pkoin/index.js
css/common.css
css/common.less
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:4] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:5] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [3:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [4] - START
localization/en.js
js/satolist.js
components/comments/index.js
components/lenta/templates/share.html
js/app.js
js/satolist.js
localization/en.js
localization/ru.js
js/app.js
js/app.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:5] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [4:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [5] - START
components/author/index.js
components/blocking/index.js
components/comments/index.js
components/lenta/templates/share.html
components/lenta/templates/sharevideo.html
js/kit.js
js/satolist.js
localization/en.js
localization/ru.js
components/author/index.js
components/comments/index.js
js/satolist.js
components/blocking/index.js
js/_map.js
js/kit.js
js/satolist.js
proxy16/node/rpc.js
components/blocking/templates/index.html
localization/en.js
localization/ru.js
components/blocking/index.less
components/blocking/templates/index.html
components/author/index.js
components/blocking/index.css
components/blocking/index.js
components/comments/index.js
js/satolist.js
localization/ru.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [5:6] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [5:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [5:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [6] - START
components/wallet/templates/buy.html
components/userpage/index.js
js/app.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [6:7] - START
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [6:8] - START
>>> END
>>> DIRECT IMPACT INSPECTION [7] - START
js/satolist.js
components/bestposts/index.js
components/leftpanel/templates/menu.html
components/leftpanel/templates/top.html
components/lenta/index.js
components/main/index.js
components/toppanel/index.js
js/satolist.js
localization/de.js
localization/es.js
localization/fr.js
localization/it.js
localization/kr.js
localization/ru.js
localization/zh.js
proxy16/node/manager.js
proxy16/node/rpc.js
>>> END
------------------------------------
>>> SIDE IMPACT INSPECTION [7:8] - START
>>> END
`;*/

exec(`${optionalCommands}${projectFolder} && ${runScript} ${shaList.join(' ')}`, (error, stdout, stderr) => {
  shaList.push(stdout.match(masterShaRegex)[1]);
  titlesList.push('master');

  stdout.match(directImpactsRegex).forEach((pull) => {
    const pulls = pull.split('\n');

    const pullId = pulls[0].match(/\d+/g);

    pulls.shift();
    pulls.pop();

    changes[Number.parseInt(pullId)] = [...new Set(pulls)];
  });

  stdout.match(sideImpactsRegex).forEach((pair) => {
    const pairs = pair.split('\n');

    const pairId = pairs[0].match(/\d+:\d+/g);

    pairs.shift();
    pairs.pop();

    conflicts[pairId] = pairs;
  });

  Object.keys(conflicts)
    .forEach((conflictPair) => {
      const conflictsList = conflicts[conflictPair];

      conflictsList.forEach((conflict) => {
        const pairIds = conflictPair.split(':');

        if (typeof intersected[conflictPair] !== 'object') {
          intersected[conflictPair] = {};
          intersected[conflictPair][pairIds[0]] = [];
          intersected[conflictPair][pairIds[1]] = [];
        }

        intersected[conflictPair][Number.parseInt(pairIds[0])] = changes[pairIds[0]].filter(c => c === conflict);

        if (pairIds[1] != Object.keys(changes).length) {
          intersected[conflictPair][Number.parseInt(pairIds[1])] = changes[pairIds[1]].filter(c => c === conflict);
        }
      });
    });

  shaList.forEach((pull, i) => {
    if (i === shaList.length - 1) {
      return;
    }

    const pullConflicts = Object.keys(intersected)
      .filter(c => (c[0] == i || c[2] == i));

    if (!pullConflicts.length) {
      mergeOrder.push({
        title: titlesList[i],
        sha: shaList[i],
        conflictLevel: 0,
        concurrency: [],
      });

      return;
    }

    const conflictedPullsList = [...new Set(pullConflicts.join(':').split(':'))];

    // Pre-population of second order
    conflictedPullsList.forEach((i) => {
      const pullIndex = mergeOrder.findIndex(c => c.sha === shaList[i]);

      if (pullIndex !== -1 || Number.parseInt(i) >= shaList.length - 1) {
        return;
      }

      mergeOrder.push({
        title: titlesList[i],
        sha: shaList[i],
        conflictLevel: 0,
        concurrency: [],
      });
    });

    pullConflicts.forEach((pair) => {
      let concurrent = pair.split(':');

      const pull1Index = mergeOrder.findIndex(c => c.sha === shaList[concurrent[0]]);
      const pull2Index = mergeOrder.findIndex(c => c.sha === shaList[concurrent[1]]);

      const isPull1Affected = (intersected[pair][concurrent[0]].length > 0);
      const isPull2Affected = (intersected[pair][concurrent[1]].length > 0);

      if (isPull1Affected || pull2Index === -1) {
        const alreadyListed = (mergeOrder[pull1Index].concurrency.findIndex(c => (
          c.sha === shaList[concurrent[1]]
        )) !== -1);

        if (!alreadyListed) {
          mergeOrder[pull1Index].conflictLevel++;

          mergeOrder[pull1Index].concurrency.push({
            title: titlesList[concurrent[1]],
            sha: shaList[concurrent[1]],
          });
        }
      }

      if (isPull2Affected) {
        const alreadyListed = (mergeOrder[pull2Index].concurrency.findIndex(c => (
          c.sha === shaList[concurrent[0]]
        )) !== -1);

        if (!alreadyListed) {
          mergeOrder[pull2Index].conflictLevel++;

          mergeOrder[pull2Index].concurrency.push({
            title: titlesList[concurrent[0]],
            sha: shaList[concurrent[0]],
          });
        }
      }
    });
  });

  const sortByConflictLevel = ((b, a) => (a.conflictLevel > b.conflictLevel) ? -1 : 1);

  const pullStats = mergeOrder.sort(sortByConflictLevel)
    .map((m) => {
      let comments = '';

      if (m.conflictLevel === 0) {
        comments = 'No conflicts, can be merged';
      } else if (m.concurrency.some(c => c.title === 'master')) {
        comments = 'Rebase on master or do merge commit';
      } else {
        comments = 'Resolve conflicts between branches';
      }

      if (m.conflictLevel === 0) {
        delete m.conflictLevel;
        delete m.concurrency;
      }

      m.comments = comments;
      m.pullNumber = pullsData.find(p => p.sha === m.sha).pullNumber;

      return m;
    });

  console.log('----- PULL REQUESTS STATS ------');
  console.log(JSON.stringify(pullStats, null, 2));

  if (args.graph) {
    visualize(pullStats);
  }
});
