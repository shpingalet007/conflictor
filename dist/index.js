import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 502:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(174);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 760:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(502);
const file_command_1 = __nccwpck_require__(306);
const utils_1 = __nccwpck_require__(174);
const os = __importStar(__nccwpck_require__(37));
const path = __importStar(__nccwpck_require__(17));
const uuid_1 = __nccwpck_require__(875);
const oidc_utils_1 = __nccwpck_require__(480);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = `ghadelimiter_${uuid_1.v4()}`;
        // These should realistically never happen, but just in case someone finds a way to exploit uuid generation let's not allow keys or values that contain the delimiter.
        if (name.includes(delimiter)) {
            throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
        }
        if (convertedVal.includes(delimiter)) {
            throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
        }
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(114);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(114);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(216);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 306:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(147));
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(174);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 480:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(858);
const auth_1 = __nccwpck_require__(795);
const core_1 = __nccwpck_require__(760);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 216:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(17));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 114:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(37);
const fs_1 = __nccwpck_require__(147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 174:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 795:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 858:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(685));
const https = __importStar(__nccwpck_require__(687));
const pm = __importStar(__nccwpck_require__(320));
const tunnel = __importStar(__nccwpck_require__(749));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 320:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 905:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

const nodePath = __nccwpck_require__(17);
const nodeFs = __nccwpck_require__(147);

(function (global, factory) {
   true
    ? factory(exports)
    : 0;
})(this, function (exports) {
  'use strict';

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var globalNS = new Function('return this;')();
  var _wasmFolder = globalNS.__hpcc_wasmFolder || undefined;
  function wasmFolder(_) {
    if (_ === void 0) return _wasmFolder;
    var retVal = _wasmFolder;
    _wasmFolder = _;
    return retVal;
  }
  function trimEnd(str, charToRemove) {
    while (str.charAt(str.length - 1) === charToRemove) {
      str = str.substring(0, str.length - 1);
    }
    return str;
  }
  function trimStart(str, charToRemove) {
    while (str.charAt(0) === charToRemove) {
      str = str.substring(1);
    }
    return str;
  }
  function loadWasm(_wasmLib, wf) {
    var wasmLib = _wasmLib.default || _wasmLib;
    //  Prevent double load ---
    if (!wasmLib.__hpcc_promise) {
      wasmLib.__hpcc_promise = new Promise(function (resolve) {
        wasmLib({
          locateFile: function (path, prefix) {
            return (
              trimEnd(wf || wasmFolder() || prefix || '.', '/') +
              '/' +
              trimStart(path, '/')
            );
          },
        }).then(function (instance) {
          //  Not a real promise, remove "then" to prevent infinite loop  ---
          delete instance.then;
          resolve(instance);
        });
      });
    }
    return wasmLib.__hpcc_promise;
  }

  var graphvizlib = createCommonjsModule(function (module, exports) {
    var cpp = (function () {
      var _scriptDir = undefined;

      return function (cpp) {
        cpp = cpp || {};

        var Module = typeof cpp !== 'undefined' ? cpp : {};
        var readyPromiseResolve;
        Module['ready'] = new Promise(function (resolve, reject) {
          readyPromiseResolve = resolve;
        });
        var moduleOverrides = {};
        var key;
        for (key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        var arguments_ = [];
        var thisProgram = './this.program';
        var quit_ = function (status, toThrow) {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = true;
        var scriptDirectory = '';
        function locateFile(path) {
          if (Module['locateFile']) {
            return Module['locateFile'](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readBinary;
        {
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf('blob:') !== 0) {
            scriptDirectory = scriptDirectory.substr(
              0,
              scriptDirectory.lastIndexOf('/') + 1
            );
          } else {
            scriptDirectory = '';
          }
          {
            read_ = function shell_read(url) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.send(null);
              return xhr.responseText;
            };
          }
        }
        var out = Module['print'] || console.log.bind(console);
        var err = Module['printErr'] || console.warn.bind(console);
        for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        moduleOverrides = null;
        if (Module['arguments']) arguments_ = Module['arguments'];
        if (Module['thisProgram']) thisProgram = Module['thisProgram'];
        if (Module['quit']) quit_ = Module['quit'];
        var tempRet0 = 0;
        var setTempRet0 = function (value) {
          tempRet0 = value;
        };
        var getTempRet0 = function () {
          return tempRet0;
        };
        var wasmBinary;
        if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
        var noExitRuntime;
        if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
        if (typeof WebAssembly !== 'object') {
          err('no native wasm support detected');
        }
        var wasmMemory;
        var wasmTable = new WebAssembly.Table({
          initial: 928,
          maximum: 928 + 0,
          element: 'anyfunc',
        });
        var ABORT = false;
        function assert(condition, text) {
          if (!condition) {
            abort('Assertion failed: ' + text);
          }
        }
        var UTF8Decoder =
          typeof TextDecoder !== 'undefined'
            ? new TextDecoder('utf8')
            : undefined;
        function UTF8ArrayToString(heap, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
            return UTF8Decoder.decode(heap.subarray(idx, endPtr));
          } else {
            var str = '';
            while (idx < endPtr) {
              var u0 = heap[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = heap[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode(((u0 & 31) << 6) | u1);
                continue;
              }
              var u2 = heap[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
              } else {
                u0 =
                  ((u0 & 7) << 18) |
                  (u1 << 12) |
                  (u2 << 6) |
                  (heap[idx++] & 63);
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(
                  55296 | (ch >> 10),
                  56320 | (ch & 1023)
                );
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | (u >> 6);
              heap[outIdx++] = 128 | (u & 63);
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | (u >> 12);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | (u >> 18);
              heap[outIdx++] = 128 | ((u >> 12) & 63);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343)
              u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
            if (u <= 127) ++len;
            else if (u <= 2047) len += 2;
            else if (u <= 65535) len += 3;
            else len += 4;
          }
          return len;
        }
        function writeArrayToMemory(array, buffer) {
          HEAP8.set(array, buffer);
        }
        function writeAsciiToMemory(str, buffer, dontAddNull) {
          for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++ >> 0] = str.charCodeAt(i);
          }
          if (!dontAddNull) HEAP8[buffer >> 0] = 0;
        }
        var WASM_PAGE_SIZE = 65536;
        function alignUp(x, multiple) {
          if (x % multiple > 0) {
            x += multiple - (x % multiple);
          }
          return x;
        }
        var buffer,
          HEAP8,
          HEAPU8,
          HEAP16,
          HEAPU16,
          HEAP32,
          HEAPU32,
          HEAPF32,
          HEAPF64;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module['HEAP8'] = HEAP8 = new Int8Array(buf);
          Module['HEAP16'] = HEAP16 = new Int16Array(buf);
          Module['HEAP32'] = HEAP32 = new Int32Array(buf);
          Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
          Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
          Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
          Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
          Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
        }
        var DYNAMIC_BASE = 5461776,
          DYNAMICTOP_PTR = 218736;
        var INITIAL_INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
        if (Module['wasmMemory']) {
          wasmMemory = Module['wasmMemory'];
        } else {
          wasmMemory = new WebAssembly.Memory({
            initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
            maximum: 2147483648 / WASM_PAGE_SIZE,
          });
        }
        if (wasmMemory) {
          buffer = wasmMemory.buffer;
        }
        INITIAL_INITIAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == 'function') {
              callback(Module);
              continue;
            }
            var func = callback.func;
            if (typeof func === 'number') {
              if (callback.arg === undefined) {
                Module['dynCall_v'](func);
              } else {
                Module['dynCall_vi'](func, callback.arg);
              }
            } else {
              func(callback.arg === undefined ? null : callback.arg);
            }
          }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        function preRun() {
          if (Module['preRun']) {
            if (typeof Module['preRun'] == 'function')
              Module['preRun'] = [Module['preRun']];
            while (Module['preRun'].length) {
              addOnPreRun(Module['preRun'].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          if (!Module['noFSInit'] && !FS.init.initialized) FS.init();
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          FS.ignorePermissions = false;
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module['postRun']) {
            if (typeof Module['postRun'] == 'function')
              Module['postRun'] = [Module['postRun']];
            while (Module['postRun'].length) {
              addOnPostRun(Module['postRun'].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var Math_abs = Math.abs;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_min = Math.min;
        var runDependencies = 0;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          if (Module['monitorRunDependencies']) {
            Module['monitorRunDependencies'](runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module['monitorRunDependencies']) {
            Module['monitorRunDependencies'](runDependencies);
          }
          if (runDependencies == 0) {
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module['preloadedImages'] = {};
        Module['preloadedAudios'] = {};
        function abort(what) {
          if (Module['onAbort']) {
            Module['onAbort'](what);
          }
          what += '';
          out(what);
          err(what);
          ABORT = true;
          what =
            'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';
          throw new WebAssembly.RuntimeError(what);
        }
        function hasPrefix(str, prefix) {
          return String.prototype.startsWith
            ? str.startsWith(prefix)
            : str.indexOf(prefix) === 0;
        }
        var dataURIPrefix = 'data:application/octet-stream;base64,';
        function isDataURI(filename) {
          return hasPrefix(filename, dataURIPrefix);
        }
        var wasmBinaryFile = 'graphvizlib.wasm';
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinaryPromise() {
          if (wasmBinary) {
            Promise.resolve(wasmBinary);
          }
          return new Promise(function (resolve, reject) {
            const binaryPath = __nccwpck_require__.ab + "graphvizlib.wasm";
            nodeFs.readFile(__nccwpck_require__.ab + "graphvizlib.wasm", function (err, binary) {
              wasmBinary = binary;
              resolve(binary);
            });
          });
        }
        function createWasm() {
          var info = { a: asmLibraryArg };
          function receiveInstance(instance, module) {
            var exports = instance.exports;
            Module['asm'] = exports;
            removeRunDependency();
          }
          addRunDependency();
          function receiveInstantiatedSource(output) {
            receiveInstance(output['instance']);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise()
              .then(function (binary) {
                return WebAssembly.instantiate(binary, info);
              })
              .then(receiver, function (reason) {
                err('failed to asynchronously prepare wasm: ' + reason);
                abort(reason);
              });
          }
          function instantiateAsync() {
            if (
              !wasmBinary &&
              typeof WebAssembly.instantiateStreaming === 'function' &&
              !isDataURI(wasmBinaryFile) &&
              typeof fetch === 'function'
            ) {
              fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(
                function (response) {
                  var result = WebAssembly.instantiateStreaming(response, info);
                  return result.then(receiveInstantiatedSource, function (
                    reason
                  ) {
                    err('wasm streaming compile failed: ' + reason);
                    err('falling back to ArrayBuffer instantiation');
                    instantiateArrayBuffer(receiveInstantiatedSource);
                  });
                }
              );
            } else {
              return instantiateArrayBuffer(receiveInstantiatedSource);
            }
          }
          if (Module['instantiateWasm']) {
            try {
              var exports = Module['instantiateWasm'](info, receiveInstance);
              return exports;
            } catch (e) {
              err('Module.instantiateWasm callback failed with error: ' + e);
              return false;
            }
          }
          instantiateAsync();
          return {};
        }
        var tempDouble;
        var tempI64;
        var ASM_CONSTS = {
          1186: function ($0, $1) {
            var path = UTF8ToString($0);
            var data = UTF8ToString($1);
            FS.createPath('/', PATH.dirname(path));
            FS.writeFile(PATH.join('/', path), data);
          },
        };
        function _emscripten_asm_const_iii(code, sigPtr, argbuf) {
          var args = readAsmConstArgs(sigPtr, argbuf);
          return ASM_CONSTS[code].apply(null, args);
        }
        __ATINIT__.push({
          func: function () {
            ___wasm_call_ctors();
          },
        });
        function demangle(func) {
          return func;
        }
        function demangleAll(text) {
          var regex = /\b_Z[\w\d_]+/g;
          return text.replace(regex, function (x) {
            var y = demangle(x);
            return x === y ? x : y + ' [' + x + ']';
          });
        }
        function jsStackTrace() {
          var err = new Error();
          if (!err.stack) {
            try {
              throw new Error();
            } catch (e) {
              err = e;
            }
            if (!err.stack) {
              return '(no stack trace available)';
            }
          }
          return err.stack.toString();
        }
        function stackTrace() {
          var js = jsStackTrace();
          if (Module['extraStackTrace'])
            js += '\n' + Module['extraStackTrace']();
          return demangleAll(js);
        }
        var _emscripten_get_now;
        _emscripten_get_now = function () {
          return performance.now();
        };
        var _emscripten_get_now_is_monotonic = true;
        function setErrNo(value) {
          HEAP32[___errno_location() >> 2] = value;
          return value;
        }
        function _clock_gettime(clk_id, tp) {
          var now;
          if (clk_id === 0) {
            now = Date.now();
          } else if (
            (clk_id === 1 || clk_id === 4) &&
            _emscripten_get_now_is_monotonic
          ) {
            now = _emscripten_get_now();
          } else {
            setErrNo(28);
            return -1;
          }
          HEAP32[tp >> 2] = (now / 1e3) | 0;
          HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
          return 0;
        }
        function ___clock_gettime(a0, a1) {
          return _clock_gettime(a0, a1);
        }
        function ___cxa_allocate_exception(size) {
          return _malloc(size);
        }
        function ___cxa_throw(ptr, type, destructor) {
          throw ptr;
        }
        function ___map_file(pathname, size) {
          setErrNo(63);
          return -1;
        }
        var PATH = {
          splitPath: function (filename) {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: function (parts, allowAboveRoot) {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === '.') {
                parts.splice(i, 1);
              } else if (last === '..') {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift('..');
              }
            }
            return parts;
          },
          normalize: function (path) {
            var isAbsolute = path.charAt(0) === '/',
              trailingSlash = path.substr(-1) === '/';
            path = PATH.normalizeArray(
              path.split('/').filter(function (p) {
                return !!p;
              }),
              !isAbsolute
            ).join('/');
            if (!path && !isAbsolute) {
              path = '.';
            }
            if (path && trailingSlash) {
              path += '/';
            }
            return (isAbsolute ? '/' : '') + path;
          },
          dirname: function (path) {
            var result = PATH.splitPath(path),
              root = result[0],
              dir = result[1];
            if (!root && !dir) {
              return '.';
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: function (path) {
            if (path === '/') return '/';
            var lastSlash = path.lastIndexOf('/');
            if (lastSlash === -1) return path;
            return path.substr(lastSlash + 1);
          },
          extname: function (path) {
            return PATH.splitPath(path)[3];
          },
          join: function () {
            var paths = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(paths.join('/'));
          },
          join2: function (l, r) {
            return PATH.normalize(l + '/' + r);
          },
        };
        var PATH_FS = {
          resolve: function () {
            var resolvedPath = '',
              resolvedAbsolute = false;
            for (
              var i = arguments.length - 1;
              i >= -1 && !resolvedAbsolute;
              i--
            ) {
              var path = i >= 0 ? arguments[i] : FS.cwd();
              if (typeof path !== 'string') {
                throw new TypeError(
                  'Arguments to path.resolve must be strings'
                );
              } else if (!path) {
                return '';
              }
              resolvedPath = path + '/' + resolvedPath;
              resolvedAbsolute = path.charAt(0) === '/';
            }
            resolvedPath = PATH.normalizeArray(
              resolvedPath.split('/').filter(function (p) {
                return !!p;
              }),
              !resolvedAbsolute
            ).join('/');
            return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
          },
          relative: function (from, to) {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== '') break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== '') break;
              }
              if (start > end) return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split('/'));
            var toParts = trim(to.split('/'));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push('..');
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join('/');
          },
        };
        var TTY = {
          ttys: [],
          init: function () {},
          shutdown: function () {},
          register: function (dev, ops) {
            TTY.ttys[dev] = { input: [], output: [], ops: ops };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open: function (stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close: function (stream) {
              stream.tty.ops.flush(stream.tty);
            },
            flush: function (stream) {
              stream.tty.ops.flush(stream.tty);
            },
            read: function (stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write: function (stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i = 0; i < length; i++) {
                  stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            },
          },
          default_tty_ops: {
            get_char: function (tty) {
              if (!tty.input.length) {
                var result = null;
                if (
                  typeof window != 'undefined' &&
                  typeof window.prompt == 'function'
                ) {
                  result = window.prompt('Input: ');
                  if (result !== null) {
                    result += '\n';
                  }
                } else if (typeof readline == 'function') {
                  result = readline();
                  if (result !== null) {
                    result += '\n';
                  }
                }
                if (!result) {
                  return null;
                }
                tty.input = intArrayFromString(result, true);
              }
              return tty.input.shift();
            },
            put_char: function (tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0) tty.output.push(val);
              }
            },
            flush: function (tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
          },
          default_tty1_ops: {
            put_char: function (tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0) tty.output.push(val);
              }
            },
            flush: function (tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
          },
        };
        var MEMFS = {
          ops_table: null,
          mount: function (mount) {
            return MEMFS.createNode(null, '/', 16384 | 511, 0);
          },
          createNode: function (parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            if (!MEMFS.ops_table) {
              MEMFS.ops_table = {
                dir: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    lookup: MEMFS.node_ops.lookup,
                    mknod: MEMFS.node_ops.mknod,
                    rename: MEMFS.node_ops.rename,
                    unlink: MEMFS.node_ops.unlink,
                    rmdir: MEMFS.node_ops.rmdir,
                    readdir: MEMFS.node_ops.readdir,
                    symlink: MEMFS.node_ops.symlink,
                  },
                  stream: { llseek: MEMFS.stream_ops.llseek },
                },
                file: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek,
                    read: MEMFS.stream_ops.read,
                    write: MEMFS.stream_ops.write,
                    allocate: MEMFS.stream_ops.allocate,
                    mmap: MEMFS.stream_ops.mmap,
                    msync: MEMFS.stream_ops.msync,
                  },
                },
                link: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    readlink: MEMFS.node_ops.readlink,
                  },
                  stream: {},
                },
                chrdev: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                  },
                  stream: FS.chrdev_stream_ops,
                },
              };
            }
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
            }
            return node;
          },
          getFileDataAsRegularArray: function (node) {
            if (node.contents && node.contents.subarray) {
              var arr = [];
              for (var i = 0; i < node.usedBytes; ++i)
                arr.push(node.contents[i]);
              return arr;
            }
            return node.contents;
          },
          getFileDataAsTypedArray: function (node) {
            if (!node.contents) return new Uint8Array(0);
            if (node.contents.subarray)
              return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage: function (node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity) return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(
              newCapacity,
              (prevCapacity *
                (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
                0
            );
            if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0)
              node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
            return;
          },
          resizeFileStorage: function (node, newSize) {
            if (node.usedBytes == newSize) return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
              return;
            }
            if (!node.contents || node.contents.subarray) {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(
                  oldContents.subarray(0, Math.min(newSize, node.usedBytes))
                );
              }
              node.usedBytes = newSize;
              return;
            }
            if (!node.contents) node.contents = [];
            if (node.contents.length > newSize) node.contents.length = newSize;
            else while (node.contents.length < newSize) node.contents.push(0);
            node.usedBytes = newSize;
          },
          node_ops: {
            getattr: function (node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr: function (node, attr) {
              if (attr.mode !== undefined) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup: function (parent, name) {
              throw FS.genericErrors[44];
            },
            mknod: function (parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename: function (old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (new_node) {
                  for (var i in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              old_node.parent = new_dir;
            },
            unlink: function (parent, name) {
              delete parent.contents[name];
            },
            rmdir: function (parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
            },
            readdir: function (node) {
              var entries = ['.', '..'];
              for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                  continue;
                }
                entries.push(key);
              }
              return entries;
            },
            symlink: function (parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink: function (node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            },
          },
          stream_ops: {
            read: function (stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes) return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              if (size > 8 && contents.subarray) {
                buffer.set(
                  contents.subarray(position, position + size),
                  offset
                );
              } else {
                for (var i = 0; i < size; i++)
                  buffer[offset + i] = contents[position + i];
              }
              return size;
            },
            write: function (stream, buffer, offset, length, position, canOwn) {
              if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length) return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (
                buffer.subarray &&
                (!node.contents || node.contents.subarray)
              ) {
                if (canOwn) {
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(
                    buffer.subarray(offset, offset + length),
                    position
                  );
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer.subarray)
                node.contents.set(
                  buffer.subarray(offset, offset + length),
                  position
                );
              else {
                for (var i = 0; i < length; i++) {
                  node.contents[position + i] = buffer[offset + i];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek: function (stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate: function (stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(
                stream.node.usedBytes,
                offset + length
              );
            },
            mmap: function (
              stream,
              buffer,
              offset,
              length,
              position,
              prot,
              flags
            ) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === buffer.buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(
                      contents,
                      position,
                      position + length
                    );
                  }
                }
                allocated = true;
                var fromHeap = buffer.buffer == HEAP8.buffer;
                ptr = _malloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                (fromHeap ? HEAP8 : buffer).set(contents, ptr);
              }
              return { ptr: ptr, allocated: allocated };
            },
            msync: function (stream, buffer, offset, length, mmapFlags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              if (mmapFlags & 2) {
                return 0;
              }
              var bytesWritten = MEMFS.stream_ops.write(
                stream,
                buffer,
                0,
                length,
                offset,
                false
              );
              return 0;
            },
          },
        };
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: '/',
          initialized: false,
          ignorePermissions: true,
          trackingDelegate: {},
          tracking: { openFlags: { READ: 1, WRITE: 2 } },
          ErrnoError: null,
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          handleFSError: function (e) {
            if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
            return setErrNo(e.errno);
          },
          lookupPath: function (path, opts) {
            path = PATH_FS.resolve(FS.cwd(), path);
            opts = opts || {};
            if (!path) return { path: '', node: null };
            var defaults = { follow_mount: true, recurse_count: 0 };
            for (var key in defaults) {
              if (opts[key] === undefined) {
                opts[key] = defaults[key];
              }
            }
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = PATH.normalizeArray(
              path.split('/').filter(function (p) {
                return !!p;
              }),
              false
            );
            var current = FS.root;
            var current_path = '/';
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i]);
              current_path = PATH.join2(current_path, parts[i]);
              if (FS.isMountpoint(current)) {
                if (!islast || (islast && opts.follow_mount)) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(
                    PATH.dirname(current_path),
                    link
                  );
                  var lookup = FS.lookupPath(current_path, {
                    recurse_count: opts.recurse_count,
                  });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return { path: current_path, node: current };
          },
          getPath: function (node) {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== '/'
                  ? mount + '/' + path
                  : mount + path;
              }
              path = path ? node.name + '/' + path : node.name;
              node = node.parent;
            }
          },
          hashName: function (parentid, name) {
            var hash = 0;
            for (var i = 0; i < name.length; i++) {
              hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
            }
            return ((parentid + hash) >>> 0) % FS.nameTable.length;
          },
          hashAddNode: function (node) {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode: function (node) {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode: function (parent, name) {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode, parent);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode: function (parent, name, mode, rdev) {
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode: function (node) {
            FS.hashRemoveNode(node);
          },
          isRoot: function (node) {
            return node === node.parent;
          },
          isMountpoint: function (node) {
            return !!node.mounted;
          },
          isFile: function (mode) {
            return (mode & 61440) === 32768;
          },
          isDir: function (mode) {
            return (mode & 61440) === 16384;
          },
          isLink: function (mode) {
            return (mode & 61440) === 40960;
          },
          isChrdev: function (mode) {
            return (mode & 61440) === 8192;
          },
          isBlkdev: function (mode) {
            return (mode & 61440) === 24576;
          },
          isFIFO: function (mode) {
            return (mode & 61440) === 4096;
          },
          isSocket: function (mode) {
            return (mode & 49152) === 49152;
          },
          flagModes: {
            r: 0,
            rs: 1052672,
            'r+': 2,
            w: 577,
            wx: 705,
            xw: 705,
            'w+': 578,
            'wx+': 706,
            'xw+': 706,
            a: 1089,
            ax: 1217,
            xa: 1217,
            'a+': 1090,
            'ax+': 1218,
            'xa+': 1218,
          },
          modeStringToFlags: function (str) {
            var flags = FS.flagModes[str];
            if (typeof flags === 'undefined') {
              throw new Error('Unknown file open mode: ' + str);
            }
            return flags;
          },
          flagsToPermissionString: function (flag) {
            var perms = ['r', 'w', 'rw'][flag & 3];
            if (flag & 512) {
              perms += 'w';
            }
            return perms;
          },
          nodePermissions: function (node, perms) {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
              return 2;
            } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
              return 2;
            } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup: function (dir) {
            var errCode = FS.nodePermissions(dir, 'x');
            if (errCode) return errCode;
            if (!dir.node_ops.lookup) return 2;
            return 0;
          },
          mayCreate: function (dir, name) {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {}
            return FS.nodePermissions(dir, 'wx');
          },
          mayDelete: function (dir, name, isdir) {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, 'wx');
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen: function (node, flags) {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== 'r' || flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd: function (fd_start, fd_end) {
            fd_start = fd_start || 0;
            fd_end = fd_end || FS.MAX_OPEN_FDS;
            for (var fd = fd_start; fd <= fd_end; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStream: function (fd) {
            return FS.streams[fd];
          },
          createStream: function (stream, fd_start, fd_end) {
            if (!FS.FSStream) {
              FS.FSStream = function () {};
              FS.FSStream.prototype = {
                object: {
                  get: function () {
                    return this.node;
                  },
                  set: function (val) {
                    this.node = val;
                  },
                },
                isRead: {
                  get: function () {
                    return (this.flags & 2097155) !== 1;
                  },
                },
                isWrite: {
                  get: function () {
                    return (this.flags & 2097155) !== 0;
                  },
                },
                isAppend: {
                  get: function () {
                    return this.flags & 1024;
                  },
                },
              };
            }
            var newStream = new FS.FSStream();
            for (var p in stream) {
              newStream[p] = stream[p];
            }
            stream = newStream;
            var fd = FS.nextfd(fd_start, fd_end);
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream: function (fd) {
            FS.streams[fd] = null;
          },
          chrdev_stream_ops: {
            open: function (stream) {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
              }
            },
            llseek: function () {
              throw new FS.ErrnoError(70);
            },
          },
          major: function (dev) {
            return dev >> 8;
          },
          minor: function (dev) {
            return dev & 255;
          },
          makedev: function (ma, mi) {
            return (ma << 8) | mi;
          },
          registerDevice: function (dev, ops) {
            FS.devices[dev] = { stream_ops: ops };
          },
          getDevice: function (dev) {
            return FS.devices[dev];
          },
          getMounts: function (mount) {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push.apply(check, m.mounts);
            }
            return mounts;
          },
          syncfs: function (populate, callback) {
            if (typeof populate === 'function') {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err(
                'warning: ' +
                  FS.syncFSRequests +
                  ' FS.syncfs operations in flight at once, probably just doing extra work'
              );
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            mounts.forEach(function (mount) {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount: function (type, opts, mountpoint) {
            var root = mountpoint === '/';
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type: type,
              opts: opts,
              mountpoint: mountpoint,
              mounts: [],
            };
            var mountRoot = type.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount: function (mountpoint) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach(function (hash) {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            node.mount.mounts.splice(idx, 1);
          },
          lookup: function (parent, name) {
            return parent.node_ops.lookup(parent, name);
          },
          mknod: function (path, mode, dev) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === '.' || name === '..') {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create: function (path, mode) {
            mode = mode !== undefined ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir: function (path, mode) {
            mode = mode !== undefined ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree: function (path, mode) {
            var dirs = path.split('/');
            var d = '';
            for (var i = 0; i < dirs.length; ++i) {
              if (!dirs[i]) continue;
              d += '/' + dirs[i];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20) throw e;
              }
            }
          },
          mkdev: function (path, mode, dev) {
            if (typeof dev === 'undefined') {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink: function (oldpath, newpath) {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, { parent: true });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename: function (old_path, new_path) {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            try {
              lookup = FS.lookupPath(old_path, { parent: true });
              old_dir = lookup.node;
              lookup = FS.lookupPath(new_path, { parent: true });
              new_dir = lookup.node;
            } catch (e) {
              throw new FS.ErrnoError(10);
            }
            if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== '.') {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== '.') {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {}
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node
              ? FS.mayDelete(new_dir, new_name, isdir)
              : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (
              FS.isMountpoint(old_node) ||
              (new_node && FS.isMountpoint(new_node))
            ) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, 'w');
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            try {
              if (FS.trackingDelegate['willMovePath']) {
                FS.trackingDelegate['willMovePath'](old_path, new_path);
              }
            } catch (e) {
              err(
                "FS.trackingDelegate['willMovePath']('" +
                  old_path +
                  "', '" +
                  new_path +
                  "') threw an exception: " +
                  e.message
              );
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
            try {
              if (FS.trackingDelegate['onMovePath'])
                FS.trackingDelegate['onMovePath'](old_path, new_path);
            } catch (e) {
              err(
                "FS.trackingDelegate['onMovePath']('" +
                  old_path +
                  "', '" +
                  new_path +
                  "') threw an exception: " +
                  e.message
              );
            }
          },
          rmdir: function (path) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            try {
              if (FS.trackingDelegate['willDeletePath']) {
                FS.trackingDelegate['willDeletePath'](path);
              }
            } catch (e) {
              err(
                "FS.trackingDelegate['willDeletePath']('" +
                  path +
                  "') threw an exception: " +
                  e.message
              );
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
            try {
              if (FS.trackingDelegate['onDeletePath'])
                FS.trackingDelegate['onDeletePath'](path);
            } catch (e) {
              err(
                "FS.trackingDelegate['onDeletePath']('" +
                  path +
                  "') threw an exception: " +
                  e.message
              );
            }
          },
          readdir: function (path) {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink: function (path) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            try {
              if (FS.trackingDelegate['willDeletePath']) {
                FS.trackingDelegate['willDeletePath'](path);
              }
            } catch (e) {
              err(
                "FS.trackingDelegate['willDeletePath']('" +
                  path +
                  "') threw an exception: " +
                  e.message
              );
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
            try {
              if (FS.trackingDelegate['onDeletePath'])
                FS.trackingDelegate['onDeletePath'](path);
            } catch (e) {
              err(
                "FS.trackingDelegate['onDeletePath']('" +
                  path +
                  "') threw an exception: " +
                  e.message
              );
            }
          },
          readlink: function (path) {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(
              FS.getPath(link.parent),
              link.node_ops.readlink(link)
            );
          },
          stat: function (path, dontFollow) {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat: function (path) {
            return FS.stat(path, true);
          },
          chmod: function (path, mode, dontFollow) {
            var node;
            if (typeof path === 'string') {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: (mode & 4095) | (node.mode & ~4095),
              timestamp: Date.now(),
            });
          },
          lchmod: function (path, mode) {
            FS.chmod(path, mode, true);
          },
          fchmod: function (fd, mode) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            FS.chmod(stream.node, mode);
          },
          chown: function (path, uid, gid, dontFollow) {
            var node;
            if (typeof path === 'string') {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, { timestamp: Date.now() });
          },
          lchown: function (path, uid, gid) {
            FS.chown(path, uid, gid, true);
          },
          fchown: function (fd, uid, gid) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            FS.chown(stream.node, uid, gid);
          },
          truncate: function (path, len) {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path === 'string') {
              var lookup = FS.lookupPath(path, { follow: true });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, 'w');
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
          },
          ftruncate: function (fd, len) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime: function (path, atime, mtime) {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
          },
          open: function (path, flags, mode, fd_start, fd_end) {
            if (path === '') {
              throw new FS.ErrnoError(44);
            }
            flags =
              typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
            mode = typeof mode === 'undefined' ? 438 : mode;
            if (flags & 64) {
              mode = (mode & 4095) | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path === 'object') {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
                node = lookup.node;
              } catch (e) {}
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream(
              {
                node: node,
                path: FS.getPath(node),
                flags: flags,
                seekable: true,
                position: 0,
                stream_ops: node.stream_ops,
                ungotten: [],
                error: false,
              },
              fd_start,
              fd_end
            );
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module['logReadFiles'] && !(flags & 1)) {
              if (!FS.readFiles) FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                err('FS.trackingDelegate error on read file: ' + path);
              }
            }
            try {
              if (FS.trackingDelegate['onOpenFile']) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                  trackingFlags |= FS.tracking.openFlags.READ;
                }
                if ((flags & 2097155) !== 0) {
                  trackingFlags |= FS.tracking.openFlags.WRITE;
                }
                FS.trackingDelegate['onOpenFile'](path, trackingFlags);
              }
            } catch (e) {
              err(
                "FS.trackingDelegate['onOpenFile']('" +
                  path +
                  "', flags) threw an exception: " +
                  e.message
              );
            }
            return stream;
          },
          close: function (stream) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents) stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed: function (stream) {
            return stream.fd === null;
          },
          llseek: function (stream, offset, whence) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read: function (stream, buffer, offset, length, position) {
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position !== 'undefined';
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(
              stream,
              buffer,
              offset,
              length,
              position
            );
            if (!seeking) stream.position += bytesRead;
            return bytesRead;
          },
          write: function (stream, buffer, offset, length, position, canOwn) {
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position !== 'undefined';
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(
              stream,
              buffer,
              offset,
              length,
              position,
              canOwn
            );
            if (!seeking) stream.position += bytesWritten;
            try {
              if (stream.path && FS.trackingDelegate['onWriteToFile'])
                FS.trackingDelegate['onWriteToFile'](stream.path);
            } catch (e) {
              err(
                "FS.trackingDelegate['onWriteToFile']('" +
                  stream.path +
                  "') threw an exception: " +
                  e.message
              );
            }
            return bytesWritten;
          },
          allocate: function (stream, offset, length) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap: function (
            stream,
            buffer,
            offset,
            length,
            position,
            prot,
            flags
          ) {
            if (
              (prot & 2) !== 0 &&
              (flags & 2) === 0 &&
              (stream.flags & 2097155) !== 2
            ) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(
              stream,
              buffer,
              offset,
              length,
              position,
              prot,
              flags
            );
          },
          msync: function (stream, buffer, offset, length, mmapFlags) {
            if (!stream || !stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(
              stream,
              buffer,
              offset,
              length,
              mmapFlags
            );
          },
          munmap: function (stream) {
            return 0;
          },
          ioctl: function (stream, cmd, arg) {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile: function (path, opts) {
            opts = opts || {};
            opts.flags = opts.flags || 'r';
            opts.encoding = opts.encoding || 'binary';
            if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
              throw new Error('Invalid encoding type "' + opts.encoding + '"');
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === 'utf8') {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === 'binary') {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile: function (path, data, opts) {
            opts = opts || {};
            opts.flags = opts.flags || 'w';
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data === 'string') {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(
                stream,
                data,
                0,
                data.byteLength,
                undefined,
                opts.canOwn
              );
            } else {
              throw new Error('Unsupported data type');
            }
            FS.close(stream);
          },
          cwd: function () {
            return FS.currentPath;
          },
          chdir: function (path) {
            var lookup = FS.lookupPath(path, { follow: true });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, 'x');
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories: function () {
            FS.mkdir('/tmp');
            FS.mkdir('/home');
            FS.mkdir('/home/web_user');
          },
          createDefaultDevices: function () {
            FS.mkdir('/dev');
            FS.registerDevice(FS.makedev(1, 3), {
              read: function () {
                return 0;
              },
              write: function (stream, buffer, offset, length, pos) {
                return length;
              },
            });
            FS.mkdev('/dev/null', FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev('/dev/tty', FS.makedev(5, 0));
            FS.mkdev('/dev/tty1', FS.makedev(6, 0));
            var random_device;
            if (
              typeof crypto === 'object' &&
              typeof crypto['getRandomValues'] === 'function'
            ) {
              var randomBuffer = new Uint8Array(1);
              random_device = function () {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0];
              };
            }
            if (!random_device) {
              random_device = function () {
                abort('random_device');
              };
            }
            FS.createDevice('/dev', 'random', random_device);
            FS.createDevice('/dev', 'urandom', random_device);
            FS.mkdir('/dev/shm');
            FS.mkdir('/dev/shm/tmp');
          },
          createSpecialDirectories: function () {
            FS.mkdir('/proc');
            FS.mkdir('/proc/self');
            FS.mkdir('/proc/self/fd');
            FS.mount(
              {
                mount: function () {
                  var node = FS.createNode('/proc/self', 'fd', 16384 | 511, 73);
                  node.node_ops = {
                    lookup: function (parent, name) {
                      var fd = +name;
                      var stream = FS.getStream(fd);
                      if (!stream) throw new FS.ErrnoError(8);
                      var ret = {
                        parent: null,
                        mount: { mountpoint: 'fake' },
                        node_ops: {
                          readlink: function () {
                            return stream.path;
                          },
                        },
                      };
                      ret.parent = ret;
                      return ret;
                    },
                  };
                  return node;
                },
              },
              {},
              '/proc/self/fd'
            );
          },
          createStandardStreams: function () {
            if (Module['stdin']) {
              FS.createDevice('/dev', 'stdin', Module['stdin']);
            } else {
              FS.symlink('/dev/tty', '/dev/stdin');
            }
            if (Module['stdout']) {
              FS.createDevice('/dev', 'stdout', null, Module['stdout']);
            } else {
              FS.symlink('/dev/tty', '/dev/stdout');
            }
            if (Module['stderr']) {
              FS.createDevice('/dev', 'stderr', null, Module['stderr']);
            } else {
              FS.symlink('/dev/tty1', '/dev/stderr');
            }
            var stdin = FS.open('/dev/stdin', 'r');
            var stdout = FS.open('/dev/stdout', 'w');
            var stderr = FS.open('/dev/stderr', 'w');
          },
          ensureErrnoError: function () {
            if (FS.ErrnoError) return;
            FS.ErrnoError = function ErrnoError(errno, node) {
              this.node = node;
              this.setErrno = function (errno) {
                this.errno = errno;
              };
              this.setErrno(errno);
              this.message = 'FS error';
            };
            FS.ErrnoError.prototype = new Error();
            FS.ErrnoError.prototype.constructor = FS.ErrnoError;
            [44].forEach(function (code) {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = '<generic error, no stack>';
            });
          },
          staticInit: function () {
            FS.ensureErrnoError();
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, '/');
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = { MEMFS: MEMFS };
          },
          init: function (input, output, error) {
            FS.init.initialized = true;
            FS.ensureErrnoError();
            Module['stdin'] = input || Module['stdin'];
            Module['stdout'] = output || Module['stdout'];
            Module['stderr'] = error || Module['stderr'];
            FS.createStandardStreams();
          },
          quit: function () {
            FS.init.initialized = false;
            var fflush = Module['_fflush'];
            if (fflush) fflush(0);
            for (var i = 0; i < FS.streams.length; i++) {
              var stream = FS.streams[i];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          getMode: function (canRead, canWrite) {
            var mode = 0;
            if (canRead) mode |= 292 | 73;
            if (canWrite) mode |= 146;
            return mode;
          },
          joinPath: function (parts, forceRelative) {
            var path = PATH.join.apply(null, parts);
            if (forceRelative && path[0] == '/') path = path.substr(1);
            return path;
          },
          absolutePath: function (relative, base) {
            return PATH_FS.resolve(base, relative);
          },
          standardizePath: function (path) {
            return PATH.normalize(path);
          },
          findObject: function (path, dontResolveLastLink) {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (ret.exists) {
              return ret.object;
            } else {
              setErrNo(ret.error);
              return null;
            }
          },
          analyzePath: function (path, dontResolveLastLink) {
            try {
              var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink,
              });
              path = lookup.path;
            } catch (e) {}
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null,
            };
            try {
              var lookup = FS.lookupPath(path, { parent: true });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === '/';
            } catch (e) {
              ret.error = e.errno;
            }
            return ret;
          },
          createFolder: function (parent, name, canRead, canWrite) {
            var path = PATH.join2(
              typeof parent === 'string' ? parent : FS.getPath(parent),
              name
            );
            var mode = FS.getMode(canRead, canWrite);
            return FS.mkdir(path, mode);
          },
          createPath: function (parent, path, canRead, canWrite) {
            parent = typeof parent === 'string' ? parent : FS.getPath(parent);
            var parts = path.split('/').reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part) continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {}
              parent = current;
            }
            return current;
          },
          createFile: function (parent, name, properties, canRead, canWrite) {
            var path = PATH.join2(
              typeof parent === 'string' ? parent : FS.getPath(parent),
              name
            );
            var mode = FS.getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile: function (
            parent,
            name,
            data,
            canRead,
            canWrite,
            canOwn
          ) {
            var path = name
              ? PATH.join2(
                  typeof parent === 'string' ? parent : FS.getPath(parent),
                  name
                )
              : parent;
            var mode = FS.getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data === 'string') {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                  arr[i] = data.charCodeAt(i);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 'w');
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
            return node;
          },
          createDevice: function (parent, name, input, output) {
            var path = PATH.join2(
              typeof parent === 'string' ? parent : FS.getPath(parent),
              name
            );
            var mode = FS.getMode(!!input, !!output);
            if (!FS.createDevice.major) FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open: function (stream) {
                stream.seekable = false;
              },
              close: function (stream) {
                if (output && output.buffer && output.buffer.length) {
                  output(10);
                }
              },
              read: function (stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === undefined) break;
                  bytesRead++;
                  buffer[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write: function (stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                  try {
                    output(buffer[offset + i]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i;
              },
            });
            return FS.mkdev(path, mode, dev);
          },
          createLink: function (parent, name, target, canRead, canWrite) {
            var path = PATH.join2(
              typeof parent === 'string' ? parent : FS.getPath(parent),
              name
            );
            return FS.symlink(target, path);
          },
          forceLoadFile: function (obj) {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
              return true;
            var success = true;
            if (typeof XMLHttpRequest !== 'undefined') {
              throw new Error(
                'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
              );
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                success = false;
              }
            } else {
              throw new Error('Cannot load without read() or XMLHttpRequest.');
            }
            if (!success) setErrNo(29);
            return success;
          },
          createLazyFile: function (parent, name, url, canRead, canWrite) {
            function LazyUint8Array() {
              this.lengthKnown = false;
              this.chunks = [];
            }
            LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
              if (idx > this.length - 1 || idx < 0) {
                return undefined;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = (idx / this.chunkSize) | 0;
              return this.getter(chunkNum)[chunkOffset];
            };
            LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(
              getter
            ) {
              this.getter = getter;
            };
            LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (
                !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
              )
                throw new Error(
                  "Couldn't load " + url + '. Status: ' + xhr.status
                );
              var datalength = Number(xhr.getResponseHeader('Content-length'));
              var header;
              var hasByteServing =
                (header = xhr.getResponseHeader('Accept-Ranges')) &&
                header === 'bytes';
              var usesGzip =
                (header = xhr.getResponseHeader('Content-Encoding')) &&
                header === 'gzip';
              var chunkSize = 1024 * 1024;
              if (!hasByteServing) chunkSize = datalength;
              var doXHR = function (from, to) {
                if (from > to)
                  throw new Error(
                    'invalid range (' +
                      from +
                      ', ' +
                      to +
                      ') or no bytes requested!'
                  );
                if (to > datalength - 1)
                  throw new Error(
                    'only ' + datalength + ' bytes available! programmer error!'
                  );
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize)
                  xhr.setRequestHeader('Range', 'bytes=' + from + '-' + to);
                if (typeof Uint8Array != 'undefined')
                  xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (
                  !(
                    (xhr.status >= 200 && xhr.status < 300) ||
                    xhr.status === 304
                  )
                )
                  throw new Error(
                    "Couldn't load " + url + '. Status: ' + xhr.status
                  );
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              };
              var lazyArray = this;
              lazyArray.setDataGetter(function (chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === 'undefined') {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof lazyArray.chunks[chunkNum] === 'undefined')
                  throw new Error('doXHR failed!');
                return lazyArray.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out(
                  'LazyFiles on gzip forces download of the whole file when length is accessed'
                );
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            };
            if (typeof XMLHttpRequest !== 'undefined') {
              throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
              var lazyArray = new LazyUint8Array();
              var properties = { isDevice: false, contents: lazyArray };
            } else {
              var properties = { isDevice: false, url: url };
            }
            var node = FS.createFile(
              parent,
              name,
              properties,
              canRead,
              canWrite
            );
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: function () {
                  return this.contents.length;
                },
              },
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach(function (key) {
              var fn = node.stream_ops[key];
              stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                  throw new FS.ErrnoError(29);
                }
                return fn.apply(null, arguments);
              };
            });
            stream_ops.read = function stream_ops_read(
              stream,
              buffer,
              offset,
              length,
              position
            ) {
              if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(29);
              }
              var contents = stream.node.contents;
              if (position >= contents.length) return 0;
              var size = Math.min(contents.length - position, length);
              if (contents.slice) {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents[position + i];
                }
              } else {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents.get(position + i);
                }
              }
              return size;
            };
            node.stream_ops = stream_ops;
            return node;
          },
          createPreloadedFile: function (
            parent,
            name,
            url,
            canRead,
            canWrite,
            onload,
            onerror,
            dontCreateFile,
            canOwn,
            preFinish
          ) {
            Browser.init();
            var fullname = name
              ? PATH_FS.resolve(PATH.join2(parent, name))
              : parent;
            function processData(byteArray) {
              function finish(byteArray) {
                if (preFinish) preFinish();
                if (!dontCreateFile) {
                  FS.createDataFile(
                    parent,
                    name,
                    byteArray,
                    canRead,
                    canWrite,
                    canOwn
                  );
                }
                if (onload) onload();
                removeRunDependency();
              }
              var handled = false;
              Module['preloadPlugins'].forEach(function (plugin) {
                if (handled) return;
                if (plugin['canHandle'](fullname)) {
                  plugin['handle'](byteArray, fullname, finish, function () {
                    if (onerror) onerror();
                    removeRunDependency();
                  });
                  handled = true;
                }
              });
              if (!handled) finish(byteArray);
            }
            addRunDependency();
            if (typeof url == 'string') {
              Browser.asyncLoad(
                url,
                function (byteArray) {
                  processData(byteArray);
                },
                onerror
              );
            } else {
              processData(url);
            }
          },
          indexedDB: function () {
            return (
              window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB
            );
          },
          DB_NAME: function () {
            return 'EM_FS_' + window.location.pathname;
          },
          DB_VERSION: 20,
          DB_STORE_NAME: 'FILE_DATA',
          saveFilesToDB: function (paths, onload, onerror) {
            onload = onload || function () {};
            onerror = onerror || function () {};
            var indexedDB = FS.indexedDB();
            try {
              var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
            } catch (e) {
              return onerror(e);
            }
            openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
              out('creating db');
              var db = openRequest.result;
              db.createObjectStore(FS.DB_STORE_NAME);
            };
            openRequest.onsuccess = function openRequest_onsuccess() {
              var db = openRequest.result;
              var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
              var files = transaction.objectStore(FS.DB_STORE_NAME);
              var ok = 0,
                fail = 0,
                total = paths.length;
              function finish() {
                if (fail == 0) onload();
                else onerror();
              }
              paths.forEach(function (path) {
                var putRequest = files.put(
                  FS.analyzePath(path).object.contents,
                  path
                );
                putRequest.onsuccess = function putRequest_onsuccess() {
                  ok++;
                  if (ok + fail == total) finish();
                };
                putRequest.onerror = function putRequest_onerror() {
                  fail++;
                  if (ok + fail == total) finish();
                };
              });
              transaction.onerror = onerror;
            };
            openRequest.onerror = onerror;
          },
          loadFilesFromDB: function (paths, onload, onerror) {
            onload = onload || function () {};
            onerror = onerror || function () {};
            var indexedDB = FS.indexedDB();
            try {
              var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
            } catch (e) {
              return onerror(e);
            }
            openRequest.onupgradeneeded = onerror;
            openRequest.onsuccess = function openRequest_onsuccess() {
              var db = openRequest.result;
              try {
                var transaction = db.transaction(
                  [FS.DB_STORE_NAME],
                  'readonly'
                );
              } catch (e) {
                onerror(e);
                return;
              }
              var files = transaction.objectStore(FS.DB_STORE_NAME);
              var ok = 0,
                fail = 0,
                total = paths.length;
              function finish() {
                if (fail == 0) onload();
                else onerror();
              }
              paths.forEach(function (path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                  if (FS.analyzePath(path).exists) {
                    FS.unlink(path);
                  }
                  FS.createDataFile(
                    PATH.dirname(path),
                    PATH.basename(path),
                    getRequest.result,
                    true,
                    true,
                    true
                  );
                  ok++;
                  if (ok + fail == total) finish();
                };
                getRequest.onerror = function getRequest_onerror() {
                  fail++;
                  if (ok + fail == total) finish();
                };
              });
              transaction.onerror = onerror;
            };
            openRequest.onerror = onerror;
          },
        };
        var SYSCALLS = {
          mappings: {},
          DEFAULT_POLLMASK: 5,
          umask: 511,
          calculateAt: function (dirfd, path) {
            if (path[0] !== '/') {
              var dir;
              if (dirfd === -100) {
                dir = FS.cwd();
              } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream) throw new FS.ErrnoError(8);
                dir = dirstream.path;
              }
              path = PATH.join2(dir, path);
            }
            return path;
          },
          doStat: function (func, path, buf) {
            try {
              var stat = func(path);
            } catch (e) {
              if (
                e &&
                e.node &&
                PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
              ) {
                return -54;
              }
              throw e;
            }
            HEAP32[buf >> 2] = stat.dev;
            HEAP32[(buf + 4) >> 2] = 0;
            HEAP32[(buf + 8) >> 2] = stat.ino;
            HEAP32[(buf + 12) >> 2] = stat.mode;
            HEAP32[(buf + 16) >> 2] = stat.nlink;
            HEAP32[(buf + 20) >> 2] = stat.uid;
            HEAP32[(buf + 24) >> 2] = stat.gid;
            HEAP32[(buf + 28) >> 2] = stat.rdev;
            HEAP32[(buf + 32) >> 2] = 0;
            (tempI64 = [
              stat.size >>> 0,
              ((tempDouble = stat.size),
              +Math_abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? (Math_min(
                      +Math_floor(tempDouble / 4294967296),
                      4294967295
                    ) |
                      0) >>>
                    0
                  : ~~+Math_ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                    ) >>> 0
                : 0),
            ]),
              (HEAP32[(buf + 40) >> 2] = tempI64[0]),
              (HEAP32[(buf + 44) >> 2] = tempI64[1]);
            HEAP32[(buf + 48) >> 2] = 4096;
            HEAP32[(buf + 52) >> 2] = stat.blocks;
            HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
            HEAP32[(buf + 60) >> 2] = 0;
            HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
            HEAP32[(buf + 68) >> 2] = 0;
            HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
            HEAP32[(buf + 76) >> 2] = 0;
            (tempI64 = [
              stat.ino >>> 0,
              ((tempDouble = stat.ino),
              +Math_abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? (Math_min(
                      +Math_floor(tempDouble / 4294967296),
                      4294967295
                    ) |
                      0) >>>
                    0
                  : ~~+Math_ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                    ) >>> 0
                : 0),
            ]),
              (HEAP32[(buf + 80) >> 2] = tempI64[0]),
              (HEAP32[(buf + 84) >> 2] = tempI64[1]);
            return 0;
          },
          doMsync: function (addr, stream, len, flags, offset) {
            var buffer = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer, offset, len, flags);
          },
          doMkdir: function (path, mode) {
            path = PATH.normalize(path);
            if (path[path.length - 1] === '/')
              path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
          },
          doMknod: function (path, mode, dev) {
            switch (mode & 61440) {
              case 32768:
              case 8192:
              case 24576:
              case 4096:
              case 49152:
                break;
              default:
                return -28;
            }
            FS.mknod(path, mode, dev);
            return 0;
          },
          doReadlink: function (path, buf, bufsize) {
            if (bufsize <= 0) return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len] = endChar;
            return len;
          },
          doAccess: function (path, amode) {
            if (amode & ~7) {
              return -28;
            }
            var node;
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
            if (!node) {
              return -44;
            }
            var perms = '';
            if (amode & 4) perms += 'r';
            if (amode & 2) perms += 'w';
            if (amode & 1) perms += 'x';
            if (perms && FS.nodePermissions(node, perms)) {
              return -2;
            }
            return 0;
          },
          doDup: function (path, flags, suggestFD) {
            var suggest = FS.getStream(suggestFD);
            if (suggest) FS.close(suggest);
            return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
          },
          doReadv: function (stream, iov, iovcnt, offset) {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAP32[(iov + i * 8) >> 2];
              var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
              var curr = FS.read(stream, HEAP8, ptr, len, offset);
              if (curr < 0) return -1;
              ret += curr;
              if (curr < len) break;
            }
            return ret;
          },
          doWritev: function (stream, iov, iovcnt, offset) {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAP32[(iov + i * 8) >> 2];
              var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
              var curr = FS.write(stream, HEAP8, ptr, len, offset);
              if (curr < 0) return -1;
              ret += curr;
            }
            return ret;
          },
          varargs: undefined,
          get: function () {
            SYSCALLS.varargs += 4;
            var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
            return ret;
          },
          getStr: function (ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          },
          getStreamFromFD: function (fd) {
            var stream = FS.getStream(fd);
            if (!stream) throw new FS.ErrnoError(8);
            return stream;
          },
          get64: function (low, high) {
            return low;
          },
        };
        function ___sys_access(path, amode) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doAccess(path, amode);
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                  return -28;
                }
                var newStream;
                newStream = FS.open(stream.path, stream.flags, 0, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0;
              }
              case 12: {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[(arg + offset) >> 1] = 2;
                return 0;
              }
              case 13:
              case 14:
                return 0;
              case 16:
              case 8:
                return -28;
              case 9:
                setErrNo(28);
                return -1;
              default: {
                return -28;
              }
            }
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_fstat64(fd, buf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_getpid() {
          return 42;
        }
        function ___sys_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509:
              case 21505: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21510:
              case 21511:
              case 21512:
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty) return -59;
                return -28;
              }
              case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21524: {
                if (!stream.tty) return -59;
                return 0;
              }
              default:
                abort('bad ioctl syscall ' + op);
            }
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function syscallMmap2(addr, len, prot, flags, fd, off) {
          off <<= 12;
          var ptr;
          var allocated = false;
          if ((flags & 16) !== 0 && addr % 16384 !== 0) {
            return -28;
          }
          if ((flags & 32) !== 0) {
            ptr = _memalign(16384, len);
            if (!ptr) return -48;
            _memset(ptr, 0, len);
            allocated = true;
          } else {
            var info = FS.getStream(fd);
            if (!info) return -8;
            var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
            ptr = res.ptr;
            allocated = res.allocated;
          }
          SYSCALLS.mappings[ptr] = {
            malloc: ptr,
            len: len,
            allocated: allocated,
            fd: fd,
            prot: prot,
            flags: flags,
            offset: off,
          };
          return ptr;
        }
        function ___sys_mmap2(addr, len, prot, flags, fd, off) {
          try {
            return syscallMmap2(addr, len, prot, flags, fd, off);
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function syscallMunmap(addr, len) {
          if ((addr | 0) === -1 || len === 0) {
            return -28;
          }
          var info = SYSCALLS.mappings[addr];
          if (!info) return 0;
          if (len === info.len) {
            var stream = FS.getStream(info.fd);
            if (info.prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
            }
            FS.munmap(stream);
            SYSCALLS.mappings[addr] = null;
            if (info.allocated) {
              _free(info.malloc);
            }
          }
          return 0;
        }
        function ___sys_munmap(addr, len) {
          try {
            return syscallMunmap(addr, len);
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_open(path, flags, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var pathname = SYSCALLS.getStr(path);
            var mode = SYSCALLS.get();
            var stream = FS.open(pathname, flags, mode);
            return stream.fd;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_stat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___sys_unlink(path) {
          try {
            path = SYSCALLS.getStr(path);
            FS.unlink(path);
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function _abort() {
          abort();
        }
        var setjmpId = 0;
        function _saveSetjmp(env, label, table, size) {
          env = env | 0;
          label = label | 0;
          table = table | 0;
          size = size | 0;
          var i = 0;
          setjmpId = (setjmpId + 1) | 0;
          HEAP32[env >> 2] = setjmpId;
          while ((i | 0) < (size | 0)) {
            if ((HEAP32[(table + (i << 3)) >> 2] | 0) == 0) {
              HEAP32[(table + (i << 3)) >> 2] = setjmpId;
              HEAP32[(table + ((i << 3) + 4)) >> 2] = label;
              HEAP32[(table + ((i << 3) + 8)) >> 2] = 0;
              setTempRet0(size | 0);
              return table | 0;
            }
            i = (i + 1) | 0;
          }
          size = (size * 2) | 0;
          table = _realloc(table | 0, (8 * ((size + 1) | 0)) | 0) | 0;
          table = _saveSetjmp(env | 0, label | 0, table | 0, size | 0) | 0;
          setTempRet0(size | 0);
          return table | 0;
        }
        function _testSetjmp(id, table, size) {
          id = id | 0;
          table = table | 0;
          size = size | 0;
          var i = 0,
            curr = 0;
          while ((i | 0) < (size | 0)) {
            curr = HEAP32[(table + (i << 3)) >> 2] | 0;
            if ((curr | 0) == 0) break;
            if ((curr | 0) == (id | 0)) {
              return HEAP32[(table + ((i << 3) + 4)) >> 2] | 0;
            }
            i = (i + 1) | 0;
          }
          return 0;
        }
        function _longjmp(env, value) {
          _setThrew(env, value || 1);
          throw 'longjmp';
        }
        function _emscripten_longjmp(env, value) {
          _longjmp(env, value);
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.copyWithin(dest, src, src + num);
        }
        function _emscripten_get_heap_size() {
          return HEAPU8.length;
        }
        function emscripten_realloc_buffer(size) {
          try {
            wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e) {}
        }
        function _emscripten_resize_heap(requestedSize) {
          requestedSize = requestedSize >>> 0;
          var oldSize = _emscripten_get_heap_size();
          var PAGE_MULTIPLE = 65536;
          var maxHeapSize = 2147483648;
          if (requestedSize > maxHeapSize) {
            return false;
          }
          var minHeapSize = 16777216;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(
              overGrownHeapSize,
              requestedSize + 100663296
            );
            var newSize = Math.min(
              maxHeapSize,
              alignUp(
                Math.max(minHeapSize, requestedSize, overGrownHeapSize),
                PAGE_MULTIPLE
              )
            );
            var replacement = emscripten_realloc_buffer(newSize);
            if (replacement) {
              return true;
            }
          }
          return false;
        }
        var ENV = {};
        function __getExecutableName() {
          return thisProgram || './this.program';
        }
        function getEnvStrings() {
          if (!getEnvStrings.strings) {
            var env = {
              USER: 'web_user',
              LOGNAME: 'web_user',
              PATH: '/',
              PWD: '/',
              HOME: '/home/web_user',
              LANG:
                (
                  (typeof navigator === 'object' &&
                    navigator.languages &&
                    navigator.languages[0]) ||
                  'C'
                ).replace('-', '_') + '.UTF-8',
              _: __getExecutableName(),
            };
            for (var x in ENV) {
              env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(x + '=' + env[x]);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        }
        function _environ_get(__environ, environ_buf) {
          var bufSize = 0;
          getEnvStrings().forEach(function (string, i) {
            var ptr = environ_buf + bufSize;
            HEAP32[(__environ + i * 4) >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
          var strings = getEnvStrings();
          HEAP32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach(function (string) {
            bufSize += string.length + 1;
          });
          HEAP32[penviron_buf_size >> 2] = bufSize;
          return 0;
        }
        function _exit(status) {
          exit(status);
        }
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var type = stream.tty
              ? 2
              : FS.isDir(stream.mode)
              ? 3
              : FS.isLink(stream.mode)
              ? 7
              : 4;
            HEAP8[pbuf >> 0] = type;
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return e.errno;
          }
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = SYSCALLS.doReadv(stream, iov, iovcnt);
            HEAP32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return e.errno;
          }
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var HIGH_OFFSET = 4294967296;
            var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
            var DOUBLE_LIMIT = 9007199254740992;
            if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
              return -61;
            }
            FS.llseek(stream, offset, whence);
            (tempI64 = [
              stream.position >>> 0,
              ((tempDouble = stream.position),
              +Math_abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? (Math_min(
                      +Math_floor(tempDouble / 4294967296),
                      4294967295
                    ) |
                      0) >>>
                    0
                  : ~~+Math_ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                    ) >>> 0
                : 0),
            ]),
              (HEAP32[newOffset >> 2] = tempI64[0]),
              (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
            if (stream.getdents && offset === 0 && whence === 0)
              stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return e.errno;
          }
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = SYSCALLS.doWritev(stream, iov, iovcnt);
            HEAP32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError))
              abort(e);
            return e.errno;
          }
        }
        function _getTempRet0() {
          return getTempRet0() | 0;
        }
        function _gettimeofday(ptr) {
          var now = Date.now();
          HEAP32[ptr >> 2] = (now / 1e3) | 0;
          HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0;
          return 0;
        }
        function _setTempRet0($i) {
          setTempRet0($i | 0);
        }
        function __isLeapYear(year) {
          return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {}
          return sum;
        }
        var __MONTH_DAYS_LEAP = [
          31,
          29,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        var __MONTH_DAYS_REGULAR = [
          31,
          28,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        function __addDays(date, days) {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = __isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        }
        function _strftime(s, maxsize, format, tm) {
          var tm_zone = HEAP32[(tm + 40) >> 2];
          var date = {
            tm_sec: HEAP32[tm >> 2],
            tm_min: HEAP32[(tm + 4) >> 2],
            tm_hour: HEAP32[(tm + 8) >> 2],
            tm_mday: HEAP32[(tm + 12) >> 2],
            tm_mon: HEAP32[(tm + 16) >> 2],
            tm_year: HEAP32[(tm + 20) >> 2],
            tm_wday: HEAP32[(tm + 24) >> 2],
            tm_yday: HEAP32[(tm + 28) >> 2],
            tm_isdst: HEAP32[(tm + 32) >> 2],
            tm_gmtoff: HEAP32[(tm + 36) >> 2],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : '',
          };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = {
            '%c': '%a %b %d %H:%M:%S %Y',
            '%D': '%m/%d/%y',
            '%F': '%Y-%m-%d',
            '%h': '%b',
            '%r': '%I:%M:%S %p',
            '%R': '%H:%M',
            '%T': '%H:%M:%S',
            '%x': '%m/%d/%y',
            '%X': '%H:%M:%S',
            '%Ec': '%c',
            '%EC': '%C',
            '%Ex': '%m/%d/%y',
            '%EX': '%H:%M:%S',
            '%Ey': '%y',
            '%EY': '%Y',
            '%Od': '%d',
            '%Oe': '%e',
            '%OH': '%H',
            '%OI': '%I',
            '%Om': '%m',
            '%OM': '%M',
            '%OS': '%S',
            '%Ou': '%u',
            '%OU': '%U',
            '%OV': '%V',
            '%Ow': '%w',
            '%OW': '%W',
            '%Oy': '%y',
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(
              new RegExp(rule, 'g'),
              EXPANSION_RULES_1[rule]
            );
          }
          var WEEKDAYS = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];
          var MONTHS = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          function leadingSomething(value, digits, character) {
            var str =
              typeof value === 'number' ? value.toString() : value || '';
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, '0');
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if (
              (compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0
            ) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date) {
            var thisDate = __addDays(
              new Date(date.tm_year + 1900, 0, 1),
              date.tm_yday
            );
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(
              janFourthThisYear
            );
            var firstWeekStartNextYear = getFirstWeekStartDate(
              janFourthNextYear
            );
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear() - 1;
            }
          }
          var EXPANSION_RULES_2 = {
            '%a': function (date) {
              return WEEKDAYS[date.tm_wday].substring(0, 3);
            },
            '%A': function (date) {
              return WEEKDAYS[date.tm_wday];
            },
            '%b': function (date) {
              return MONTHS[date.tm_mon].substring(0, 3);
            },
            '%B': function (date) {
              return MONTHS[date.tm_mon];
            },
            '%C': function (date) {
              var year = date.tm_year + 1900;
              return leadingNulls((year / 100) | 0, 2);
            },
            '%d': function (date) {
              return leadingNulls(date.tm_mday, 2);
            },
            '%e': function (date) {
              return leadingSomething(date.tm_mday, 2, ' ');
            },
            '%g': function (date) {
              return getWeekBasedYear(date).toString().substring(2);
            },
            '%G': function (date) {
              return getWeekBasedYear(date);
            },
            '%H': function (date) {
              return leadingNulls(date.tm_hour, 2);
            },
            '%I': function (date) {
              var twelveHour = date.tm_hour;
              if (twelveHour == 0) twelveHour = 12;
              else if (twelveHour > 12) twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            '%j': function (date) {
              return leadingNulls(
                date.tm_mday +
                  __arraySum(
                    __isLeapYear(date.tm_year + 1900)
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    date.tm_mon - 1
                  ),
                3
              );
            },
            '%m': function (date) {
              return leadingNulls(date.tm_mon + 1, 2);
            },
            '%M': function (date) {
              return leadingNulls(date.tm_min, 2);
            },
            '%n': function () {
              return '\n';
            },
            '%p': function (date) {
              if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return 'AM';
              } else {
                return 'PM';
              }
            },
            '%S': function (date) {
              return leadingNulls(date.tm_sec, 2);
            },
            '%t': function () {
              return '\t';
            },
            '%u': function (date) {
              return date.tm_wday || 7;
            },
            '%U': function (date) {
              var janFirst = new Date(date.tm_year + 1900, 0, 1);
              var firstSunday =
                janFirst.getDay() === 0
                  ? janFirst
                  : __addDays(janFirst, 7 - janFirst.getDay());
              var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday
              );
              if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                  __arraySum(
                    __isLeapYear(endDate.getFullYear())
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    endDate.getMonth() - 1
                  ) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days =
                  firstSundayUntilEndJanuary +
                  februaryFirstUntilEndMonth +
                  endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
              }
              return compareByDay(firstSunday, janFirst) === 0 ? '01' : '00';
            },
            '%V': function (date) {
              var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
              var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
              var firstWeekStartThisYear = getFirstWeekStartDate(
                janFourthThisYear
              );
              var firstWeekStartNextYear = getFirstWeekStartDate(
                janFourthNextYear
              );
              var endDate = __addDays(
                new Date(date.tm_year + 1900, 0, 1),
                date.tm_yday
              );
              if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return '53';
              }
              if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return '01';
              }
              var daysDifference;
              if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference =
                  date.tm_yday + 32 - firstWeekStartThisYear.getDate();
              } else {
                daysDifference =
                  date.tm_yday + 1 - firstWeekStartThisYear.getDate();
              }
              return leadingNulls(Math.ceil(daysDifference / 7), 2);
            },
            '%w': function (date) {
              return date.tm_wday;
            },
            '%W': function (date) {
              var janFirst = new Date(date.tm_year, 0, 1);
              var firstMonday =
                janFirst.getDay() === 1
                  ? janFirst
                  : __addDays(
                      janFirst,
                      janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1
                    );
              var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday
              );
              if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                  __arraySum(
                    __isLeapYear(endDate.getFullYear())
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    endDate.getMonth() - 1
                  ) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days =
                  firstMondayUntilEndJanuary +
                  februaryFirstUntilEndMonth +
                  endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
              }
              return compareByDay(firstMonday, janFirst) === 0 ? '01' : '00';
            },
            '%y': function (date) {
              return (date.tm_year + 1900).toString().substring(2);
            },
            '%Y': function (date) {
              return date.tm_year + 1900;
            },
            '%z': function (date) {
              var off = date.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = (off / 60) * 100 + (off % 60);
              return (ahead ? '+' : '-') + String('0000' + off).slice(-4);
            },
            '%Z': function (date) {
              return date.tm_zone;
            },
            '%%': function () {
              return '%';
            },
          };
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.indexOf(rule) >= 0) {
              pattern = pattern.replace(
                new RegExp(rule, 'g'),
                EXPANSION_RULES_2[rule](date)
              );
            }
          }
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm) {
          return _strftime(s, maxsize, format, tm);
        }
        function _time(ptr) {
          var ret = (Date.now() / 1e3) | 0;
          if (ptr) {
            HEAP32[ptr >> 2] = ret;
          }
          return ret;
        }
        function _times(buffer) {
          if (buffer !== 0) {
            _memset(buffer, 0, 16);
          }
          return 0;
        }
        function readAsmConstArgs(sigPtr, buf) {
          if (!readAsmConstArgs.array) {
            readAsmConstArgs.array = [];
          }
          var args = readAsmConstArgs.array;
          args.length = 0;
          var ch;
          while ((ch = HEAPU8[sigPtr++])) {
            if (ch === 100 || ch === 102) {
              buf = (buf + 7) & ~7;
              args.push(HEAPF64[buf >> 3]);
              buf += 8;
            } else {
              buf = (buf + 3) & ~3;
              args.push(HEAP32[buf >> 2]);
              buf += 4;
            }
          }
          return args;
        }
        var FSNode = function (parent, name, mode, rdev) {
          if (!parent) {
            parent = this;
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.mounted = null;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.node_ops = {};
          this.stream_ops = {};
          this.rdev = rdev;
        };
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, {
          read: {
            get: function () {
              return (this.mode & readMode) === readMode;
            },
            set: function (val) {
              val ? (this.mode |= readMode) : (this.mode &= ~readMode);
            },
          },
          write: {
            get: function () {
              return (this.mode & writeMode) === writeMode;
            },
            set: function (val) {
              val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
            },
          },
          isFolder: {
            get: function () {
              return FS.isDir(this.mode);
            },
          },
          isDevice: {
            get: function () {
              return FS.isChrdev(this.mode);
            },
          },
        });
        FS.FSNode = FSNode;
        FS.staticInit();
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(
            stringy,
            u8array,
            0,
            u8array.length
          );
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        }
        var asmLibraryArg = {
          L: ___clock_gettime,
          k: ___cxa_allocate_exception,
          j: ___cxa_throw,
          J: ___map_file,
          Q: ___sys_access,
          x: ___sys_fcntl64,
          S: ___sys_fstat64,
          p: ___sys_getpid,
          N: ___sys_ioctl,
          O: ___sys_mmap2,
          P: ___sys_munmap,
          y: ___sys_open,
          R: ___sys_stat64,
          K: ___sys_unlink,
          v: _abort,
          B: _emscripten_asm_const_iii,
          d: _emscripten_longjmp,
          D: _emscripten_memcpy_big,
          E: _emscripten_resize_heap,
          H: _environ_get,
          I: _environ_sizes_get,
          l: _exit,
          o: _fd_close,
          G: _fd_fdstat_get,
          M: _fd_read,
          C: _fd_seek,
          w: _fd_write,
          a: _getTempRet0,
          V: _gettimeofday,
          W: invoke_d,
          T: invoke_di,
          u: invoke_i,
          f: invoke_ii,
          e: invoke_iii,
          g: invoke_iiii,
          m: invoke_iiiii,
          U: invoke_iiiiiii,
          r: invoke_v,
          h: invoke_vi,
          n: invoke_vii,
          t: invoke_viii,
          s: invoke_viiii,
          q: invoke_viiiii,
          memory: wasmMemory,
          i: _saveSetjmp,
          b: _setTempRet0,
          F: _strftime_l,
          table: wasmTable,
          c: _testSetjmp,
          z: _time,
          A: _times,
        };
        var asm = createWasm();
        Module['asm'] = asm;
        var ___wasm_call_ctors = (Module['___wasm_call_ctors'] = function () {
          return (___wasm_call_ctors = Module['___wasm_call_ctors'] =
            Module['asm']['X']).apply(null, arguments);
        });
        var ___em_js__array_bounds_check_error = (Module[
          '___em_js__array_bounds_check_error'
        ] = function () {
          return (___em_js__array_bounds_check_error = Module[
            '___em_js__array_bounds_check_error'
          ] = Module['asm']['Y']).apply(null, arguments);
        });
        var _emscripten_bind_VoidPtr___destroy___0 = (Module[
          '_emscripten_bind_VoidPtr___destroy___0'
        ] = function () {
          return (_emscripten_bind_VoidPtr___destroy___0 = Module[
            '_emscripten_bind_VoidPtr___destroy___0'
          ] = Module['asm']['Z']).apply(null, arguments);
        });
        var _emscripten_bind_Main_layout_3 = (Module[
          '_emscripten_bind_Main_layout_3'
        ] = function () {
          return (_emscripten_bind_Main_layout_3 = Module[
            '_emscripten_bind_Main_layout_3'
          ] = Module['asm']['_']).apply(null, arguments);
        });
        var _emscripten_bind_Main_lastError_0 = (Module[
          '_emscripten_bind_Main_lastError_0'
        ] = function () {
          return (_emscripten_bind_Main_lastError_0 = Module[
            '_emscripten_bind_Main_lastError_0'
          ] = Module['asm']['$']).apply(null, arguments);
        });
        var _emscripten_bind_Main_createFile_2 = (Module[
          '_emscripten_bind_Main_createFile_2'
        ] = function () {
          return (_emscripten_bind_Main_createFile_2 = Module[
            '_emscripten_bind_Main_createFile_2'
          ] = Module['asm']['aa']).apply(null, arguments);
        });
        var _emscripten_bind_Main___destroy___0 = (Module[
          '_emscripten_bind_Main___destroy___0'
        ] = function () {
          return (_emscripten_bind_Main___destroy___0 = Module[
            '_emscripten_bind_Main___destroy___0'
          ] = Module['asm']['ba']).apply(null, arguments);
        });
        var _malloc = (Module['_malloc'] = function () {
          return (_malloc = Module['_malloc'] = Module['asm']['ca']).apply(
            null,
            arguments
          );
        });
        var _free = (Module['_free'] = function () {
          return (_free = Module['_free'] = Module['asm']['da']).apply(
            null,
            arguments
          );
        });
        var _realloc = (Module['_realloc'] = function () {
          return (_realloc = Module['_realloc'] = Module['asm']['ea']).apply(
            null,
            arguments
          );
        });
        var ___errno_location = (Module['___errno_location'] = function () {
          return (___errno_location = Module['___errno_location'] =
            Module['asm']['fa']).apply(null, arguments);
        });
        var _memset = (Module['_memset'] = function () {
          return (_memset = Module['_memset'] = Module['asm']['ga']).apply(
            null,
            arguments
          );
        });
        var _setThrew = (Module['_setThrew'] = function () {
          return (_setThrew = Module['_setThrew'] = Module['asm']['ha']).apply(
            null,
            arguments
          );
        });
        var _memalign = (Module['_memalign'] = function () {
          return (_memalign = Module['_memalign'] = Module['asm']['ia']).apply(
            null,
            arguments
          );
        });
        var dynCall_v = (Module['dynCall_v'] = function () {
          return (dynCall_v = Module['dynCall_v'] = Module['asm']['ja']).apply(
            null,
            arguments
          );
        });
        var dynCall_vi = (Module['dynCall_vi'] = function () {
          return (dynCall_vi = Module['dynCall_vi'] =
            Module['asm']['ka']).apply(null, arguments);
        });
        var dynCall_vii = (Module['dynCall_vii'] = function () {
          return (dynCall_vii = Module['dynCall_vii'] =
            Module['asm']['la']).apply(null, arguments);
        });
        var dynCall_viii = (Module['dynCall_viii'] = function () {
          return (dynCall_viii = Module['dynCall_viii'] =
            Module['asm']['ma']).apply(null, arguments);
        });
        var dynCall_viiii = (Module['dynCall_viiii'] = function () {
          return (dynCall_viiii = Module['dynCall_viiii'] =
            Module['asm']['na']).apply(null, arguments);
        });
        var dynCall_viiiii = (Module['dynCall_viiiii'] = function () {
          return (dynCall_viiiii = Module['dynCall_viiiii'] =
            Module['asm']['oa']).apply(null, arguments);
        });
        var dynCall_i = (Module['dynCall_i'] = function () {
          return (dynCall_i = Module['dynCall_i'] = Module['asm']['pa']).apply(
            null,
            arguments
          );
        });
        var dynCall_ii = (Module['dynCall_ii'] = function () {
          return (dynCall_ii = Module['dynCall_ii'] =
            Module['asm']['qa']).apply(null, arguments);
        });
        var dynCall_iii = (Module['dynCall_iii'] = function () {
          return (dynCall_iii = Module['dynCall_iii'] =
            Module['asm']['ra']).apply(null, arguments);
        });
        var dynCall_iiii = (Module['dynCall_iiii'] = function () {
          return (dynCall_iiii = Module['dynCall_iiii'] =
            Module['asm']['sa']).apply(null, arguments);
        });
        var dynCall_iiiii = (Module['dynCall_iiiii'] = function () {
          return (dynCall_iiiii = Module['dynCall_iiiii'] =
            Module['asm']['ta']).apply(null, arguments);
        });
        var dynCall_iiiiiii = (Module['dynCall_iiiiiii'] = function () {
          return (dynCall_iiiiiii = Module['dynCall_iiiiiii'] =
            Module['asm']['ua']).apply(null, arguments);
        });
        var dynCall_d = (Module['dynCall_d'] = function () {
          return (dynCall_d = Module['dynCall_d'] = Module['asm']['va']).apply(
            null,
            arguments
          );
        });
        var dynCall_di = (Module['dynCall_di'] = function () {
          return (dynCall_di = Module['dynCall_di'] =
            Module['asm']['wa']).apply(null, arguments);
        });
        var stackSave = (Module['stackSave'] = function () {
          return (stackSave = Module['stackSave'] = Module['asm']['xa']).apply(
            null,
            arguments
          );
        });
        var stackRestore = (Module['stackRestore'] = function () {
          return (stackRestore = Module['stackRestore'] =
            Module['asm']['ya']).apply(null, arguments);
        });
        function invoke_ii(index, a1) {
          var sp = stackSave();
          try {
            return dynCall_ii(index, a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_i(index) {
          var sp = stackSave();
          try {
            return dynCall_i(index);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iii(index, a1, a2) {
          var sp = stackSave();
          try {
            return dynCall_iii(index, a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiii(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            return dynCall_iiii(index, a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_vii(index, a1, a2) {
          var sp = stackSave();
          try {
            dynCall_vii(index, a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viii(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            dynCall_viii(index, a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
          var sp = stackSave();
          try {
            dynCall_viiii(index, a1, a2, a3, a4);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_vi(index, a1) {
          var sp = stackSave();
          try {
            dynCall_vi(index, a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_v(index) {
          var sp = stackSave();
          try {
            dynCall_v(index);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
          var sp = stackSave();
          try {
            dynCall_viiiii(index, a1, a2, a3, a4, a5);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_d(index) {
          var sp = stackSave();
          try {
            return dynCall_d(index);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
          var sp = stackSave();
          try {
            return dynCall_iiiii(index, a1, a2, a3, a4);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
          var sp = stackSave();
          try {
            return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_di(index, a1) {
          var sp = stackSave();
          try {
            return dynCall_di(index, a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0 && e !== 'longjmp') throw e;
            _setThrew(1, 0);
          }
        }
        Module['asm'] = asm;
        var calledRun;
        function ExitStatus(status) {
          this.name = 'ExitStatus';
          this.message = 'Program terminated with exit(' + status + ')';
          this.status = status;
        }
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run(args) {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) return;
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module['calledRun'] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module);
            if (Module['onRuntimeInitialized'])
              Module['onRuntimeInitialized']();
            postRun();
          }
          if (Module['setStatus']) {
            Module['setStatus']('Running...');
            setTimeout(function () {
              setTimeout(function () {
                Module['setStatus']('');
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module['run'] = run;
        function exit(status, implicit) {
          if (implicit && noExitRuntime && status === 0) {
            return;
          }
          if (noExitRuntime);
          else {
            ABORT = true;
            if (Module['onExit']) Module['onExit'](status);
          }
          quit_(status, new ExitStatus(status));
        }
        if (Module['preInit']) {
          if (typeof Module['preInit'] == 'function')
            Module['preInit'] = [Module['preInit']];
          while (Module['preInit'].length > 0) {
            Module['preInit'].pop()();
          }
        }
        noExitRuntime = true;
        run();
        function WrapperObject() {}
        WrapperObject.prototype = Object.create(WrapperObject.prototype);
        WrapperObject.prototype.constructor = WrapperObject;
        WrapperObject.prototype.__class__ = WrapperObject;
        WrapperObject.__cache__ = {};
        Module['WrapperObject'] = WrapperObject;
        function getCache(__class__) {
          return (__class__ || WrapperObject).__cache__;
        }
        Module['getCache'] = getCache;
        function wrapPointer(ptr, __class__) {
          var cache = getCache(__class__);
          var ret = cache[ptr];
          if (ret) return ret;
          ret = Object.create((__class__ || WrapperObject).prototype);
          ret.ptr = ptr;
          return (cache[ptr] = ret);
        }
        Module['wrapPointer'] = wrapPointer;
        function castObject(obj, __class__) {
          return wrapPointer(obj.ptr, __class__);
        }
        Module['castObject'] = castObject;
        Module['NULL'] = wrapPointer(0);
        function destroy(obj) {
          if (!obj['__destroy__'])
            throw 'Error: Cannot destroy object. (Did you create it yourself?)';
          obj['__destroy__']();
          delete getCache(obj.__class__)[obj.ptr];
        }
        Module['destroy'] = destroy;
        function compare(obj1, obj2) {
          return obj1.ptr === obj2.ptr;
        }
        Module['compare'] = compare;
        function getPointer(obj) {
          return obj.ptr;
        }
        Module['getPointer'] = getPointer;
        function getClass(obj) {
          return obj.__class__;
        }
        Module['getClass'] = getClass;
        var ensureCache = {
          buffer: 0,
          size: 0,
          pos: 0,
          temps: [],
          needed: 0,
          prepare: function () {
            if (ensureCache.needed) {
              for (var i = 0; i < ensureCache.temps.length; i++) {
                Module['_free'](ensureCache.temps[i]);
              }
              ensureCache.temps.length = 0;
              Module['_free'](ensureCache.buffer);
              ensureCache.buffer = 0;
              ensureCache.size += ensureCache.needed;
              ensureCache.needed = 0;
            }
            if (!ensureCache.buffer) {
              ensureCache.size += 128;
              ensureCache.buffer = Module['_malloc'](ensureCache.size);
              assert(ensureCache.buffer);
            }
            ensureCache.pos = 0;
          },
          alloc: function (array, view) {
            assert(ensureCache.buffer);
            var bytes = view.BYTES_PER_ELEMENT;
            var len = array.length * bytes;
            len = (len + 7) & -8;
            var ret;
            if (ensureCache.pos + len >= ensureCache.size) {
              assert(len > 0);
              ensureCache.needed += len;
              ret = Module['_malloc'](len);
              ensureCache.temps.push(ret);
            } else {
              ret = ensureCache.buffer + ensureCache.pos;
              ensureCache.pos += len;
            }
            return ret;
          },
          copy: function (array, view, offset) {
            offset >>>= 0;
            var bytes = view.BYTES_PER_ELEMENT;
            switch (bytes) {
              case 2:
                offset >>>= 1;
                break;
              case 4:
                offset >>>= 2;
                break;
              case 8:
                offset >>>= 3;
                break;
            }
            for (var i = 0; i < array.length; i++) {
              view[offset + i] = array[i];
            }
          },
        };
        function ensureString(value) {
          if (typeof value === 'string') {
            var intArray = intArrayFromString(value);
            var offset = ensureCache.alloc(intArray, HEAP8);
            ensureCache.copy(intArray, HEAP8, offset);
            return offset;
          }
          return value;
        }
        function VoidPtr() {
          throw 'cannot construct a VoidPtr, no constructor in IDL';
        }
        VoidPtr.prototype = Object.create(WrapperObject.prototype);
        VoidPtr.prototype.constructor = VoidPtr;
        VoidPtr.prototype.__class__ = VoidPtr;
        VoidPtr.__cache__ = {};
        Module['VoidPtr'] = VoidPtr;
        VoidPtr.prototype[
          '__destroy__'
        ] = VoidPtr.prototype.__destroy__ = function () {
          var self = this.ptr;
          _emscripten_bind_VoidPtr___destroy___0(self);
        };
        function Main() {
          throw 'cannot construct a Main, no constructor in IDL';
        }
        Main.prototype = Object.create(WrapperObject.prototype);
        Main.prototype.constructor = Main;
        Main.prototype.__class__ = Main;
        Main.__cache__ = {};
        Module['Main'] = Main;
        Main.prototype['layout'] = Main.prototype.layout = function (
          dot,
          format,
          engine
        ) {
          var self = this.ptr;
          ensureCache.prepare();
          if (dot && typeof dot === 'object') dot = dot.ptr;
          else dot = ensureString(dot);
          if (format && typeof format === 'object') format = format.ptr;
          else format = ensureString(format);
          if (engine && typeof engine === 'object') engine = engine.ptr;
          else engine = ensureString(engine);
          return UTF8ToString(
            _emscripten_bind_Main_layout_3(self, dot, format, engine)
          );
        };
        Main.prototype['lastError'] = Main.prototype.lastError = function () {
          var self = this.ptr;
          return UTF8ToString(_emscripten_bind_Main_lastError_0(self));
        };
        Main.prototype['createFile'] = Main.prototype.createFile = function (
          file,
          data
        ) {
          var self = this.ptr;
          ensureCache.prepare();
          if (file && typeof file === 'object') file = file.ptr;
          else file = ensureString(file);
          if (data && typeof data === 'object') data = data.ptr;
          else data = ensureString(data);
          _emscripten_bind_Main_createFile_2(self, file, data);
        };
        Main.prototype[
          '__destroy__'
        ] = Main.prototype.__destroy__ = function () {
          var self = this.ptr;
          _emscripten_bind_Main___destroy___0(self);
        };

        return cpp.ready;
      };
    })();
    module.exports = cpp;
  });

  var graphvizlib$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: graphvizlib,
    __moduleExports: graphvizlib,
  });

  var __assign =
    (undefined && undefined.__assign) ||
    function () {
      __assign =
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      return __assign.apply(this, arguments);
    };
  var __spreadArrays =
    (undefined && undefined.__spreadArrays) ||
    function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  function imageToFile(image) {
    return {
      path: image.path,
      data:
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg width="' +
        image.width +
        '" height="' +
        image.height +
        '"></svg>',
    };
  }
  function imagesToFiles(images) {
    return images.map(imageToFile);
  }
  function createFiles(wasm, _ext) {
    var ext = __assign({ images: [], files: [] }, _ext);
    __spreadArrays(ext.files, imagesToFiles(ext.images)).forEach(function (
      file
    ) {
      return wasm.Main.prototype.createFile(file.path, file.data);
    });
  }
  var graphviz = {
    layout: function (dotSource, outputFormat, layoutEngine, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      if (layoutEngine === void 0) {
        layoutEngine = 'dot';
      }
      if (!dotSource) return Promise.resolve('');
      return loadWasm(
        graphvizlib$1,
        ext === null || ext === void 0 ? void 0 : ext.wasmFolder
      ).then(function (wasm) {
        createFiles(wasm, ext);
        var retVal = wasm.Main.prototype.layout(
          dotSource,
          outputFormat,
          layoutEngine
        );
        if (!retVal) {
          throw new Error(wasm.Main.prototype.lastError());
        }
        return retVal;
      });
    },
    circo: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'circo', ext);
    },
    dot: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'dot', ext);
    },
    fdp: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'fdp', ext);
    },
    neato: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'neato', ext);
    },
    osage: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'osage', ext);
    },
    patchwork: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'patchwork', ext);
    },
    twopi: function (dotSource, outputFormat, ext) {
      if (outputFormat === void 0) {
        outputFormat = 'svg';
      }
      return this.layout(dotSource, outputFormat, 'twopi', ext);
    },
  };

  exports.graphviz = graphviz;

  Object.defineProperty(exports, '__esModule', { value: true });
});


/***/ }),

/***/ 749:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(152);


/***/ }),

/***/ 152:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(808);
var tls = __nccwpck_require__(404);
var http = __nccwpck_require__(685);
var https = __nccwpck_require__(687);
var events = __nccwpck_require__(361);
var assert = __nccwpck_require__(491);
var util = __nccwpck_require__(837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 875:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(411));

var _v2 = _interopRequireDefault(__nccwpck_require__(482));

var _v3 = _interopRequireDefault(__nccwpck_require__(590));

var _v4 = _interopRequireDefault(__nccwpck_require__(120));

var _nil = _interopRequireDefault(__nccwpck_require__(70));

var _version = _interopRequireDefault(__nccwpck_require__(554));

var _validate = _interopRequireDefault(__nccwpck_require__(849));

var _stringify = _interopRequireDefault(__nccwpck_require__(176));

var _parse = _interopRequireDefault(__nccwpck_require__(672));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 575:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 70:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 672:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(849));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 588:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 195:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 484:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 176:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(849));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 411:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(195));

var _stringify = _interopRequireDefault(__nccwpck_require__(176));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 482:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(298));

var _md = _interopRequireDefault(__nccwpck_require__(575));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 298:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(176));

var _parse = _interopRequireDefault(__nccwpck_require__(672));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 590:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(195));

var _stringify = _interopRequireDefault(__nccwpck_require__(176));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(298));

var _sha = _interopRequireDefault(__nccwpck_require__(484));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 849:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(588));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 554:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(849));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 113:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ }),

/***/ 446:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {


// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ args)
});

// EXTERNAL MODULE: external "assert"
var external_assert_ = __nccwpck_require__(491);
;// CONCATENATED MODULE: ./node_modules/cliui/build/lib/index.js

const align = {
    right: alignRight,
    center: alignCenter
};
const lib_top = 0;
const right = 1;
const bottom = 2;
const left = 3;
class UI {
    constructor(opts) {
        var _a;
        this.width = opts.width;
        this.wrap = (_a = opts.wrap) !== null && _a !== void 0 ? _a : true;
        this.rows = [];
    }
    span(...args) {
        const cols = this.div(...args);
        cols.span = true;
    }
    resetOutput() {
        this.rows = [];
    }
    div(...args) {
        if (args.length === 0) {
            this.div('');
        }
        if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === 'string') {
            return this.applyLayoutDSL(args[0]);
        }
        const cols = args.map(arg => {
            if (typeof arg === 'string') {
                return this.colFromString(arg);
            }
            return arg;
        });
        this.rows.push(cols);
        return cols;
    }
    shouldApplyLayoutDSL(...args) {
        return args.length === 1 && typeof args[0] === 'string' &&
            /[\t\n]/.test(args[0]);
    }
    applyLayoutDSL(str) {
        const rows = str.split('\n').map(row => row.split('\t'));
        let leftColumnWidth = 0;
        // simple heuristic for layout, make sure the
        // second column lines up along the left-hand.
        // don't allow the first column to take up more
        // than 50% of the screen.
        rows.forEach(columns => {
            if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
                leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
            }
        });
        // generate a table:
        //  replacing ' ' with padding calculations.
        //  using the algorithmically generated width.
        rows.forEach(columns => {
            this.div(...columns.map((r, i) => {
                return {
                    text: r.trim(),
                    padding: this.measurePadding(r),
                    width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
                };
            }));
        });
        return this.rows[this.rows.length - 1];
    }
    colFromString(text) {
        return {
            text,
            padding: this.measurePadding(text)
        };
    }
    measurePadding(str) {
        // measure padding without ansi escape codes
        const noAnsi = mixin.stripAnsi(str);
        return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
    }
    toString() {
        const lines = [];
        this.rows.forEach(row => {
            this.rowToString(row, lines);
        });
        // don't display any lines with the
        // hidden flag set.
        return lines
            .filter(line => !line.hidden)
            .map(line => line.text)
            .join('\n');
    }
    rowToString(row, lines) {
        this.rasterize(row).forEach((rrow, r) => {
            let str = '';
            rrow.forEach((col, c) => {
                const { width } = row[c]; // the width with padding.
                const wrapWidth = this.negatePadding(row[c]); // the width without padding.
                let ts = col; // temporary string used during alignment/padding.
                if (wrapWidth > mixin.stringWidth(col)) {
                    ts += ' '.repeat(wrapWidth - mixin.stringWidth(col));
                }
                // align the string within its column.
                if (row[c].align && row[c].align !== 'left' && this.wrap) {
                    const fn = align[row[c].align];
                    ts = fn(ts, wrapWidth);
                    if (mixin.stringWidth(ts) < wrapWidth) {
                        ts += ' '.repeat((width || 0) - mixin.stringWidth(ts) - 1);
                    }
                }
                // apply border and padding to string.
                const padding = row[c].padding || [0, 0, 0, 0];
                if (padding[left]) {
                    str += ' '.repeat(padding[left]);
                }
                str += addBorder(row[c], ts, '| ');
                str += ts;
                str += addBorder(row[c], ts, ' |');
                if (padding[right]) {
                    str += ' '.repeat(padding[right]);
                }
                // if prior row is span, try to render the
                // current row on the prior line.
                if (r === 0 && lines.length > 0) {
                    str = this.renderInline(str, lines[lines.length - 1]);
                }
            });
            // remove trailing whitespace.
            lines.push({
                text: str.replace(/ +$/, ''),
                span: row.span
            });
        });
        return lines;
    }
    // if the full 'source' can render in
    // the target line, do so.
    renderInline(source, previousLine) {
        const match = source.match(/^ */);
        const leadingWhitespace = match ? match[0].length : 0;
        const target = previousLine.text;
        const targetTextWidth = mixin.stringWidth(target.trimRight());
        if (!previousLine.span) {
            return source;
        }
        // if we're not applying wrapping logic,
        // just always append to the span.
        if (!this.wrap) {
            previousLine.hidden = true;
            return target + source;
        }
        if (leadingWhitespace < targetTextWidth) {
            return source;
        }
        previousLine.hidden = true;
        return target.trimRight() + ' '.repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
    }
    rasterize(row) {
        const rrows = [];
        const widths = this.columnWidths(row);
        let wrapped;
        // word wrap all columns, and create
        // a data-structure that is easy to rasterize.
        row.forEach((col, c) => {
            // leave room for left and right padding.
            col.width = widths[c];
            if (this.wrap) {
                wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split('\n');
            }
            else {
                wrapped = col.text.split('\n');
            }
            if (col.border) {
                wrapped.unshift('.' + '-'.repeat(this.negatePadding(col) + 2) + '.');
                wrapped.push("'" + '-'.repeat(this.negatePadding(col) + 2) + "'");
            }
            // add top and bottom padding.
            if (col.padding) {
                wrapped.unshift(...new Array(col.padding[lib_top] || 0).fill(''));
                wrapped.push(...new Array(col.padding[bottom] || 0).fill(''));
            }
            wrapped.forEach((str, r) => {
                if (!rrows[r]) {
                    rrows.push([]);
                }
                const rrow = rrows[r];
                for (let i = 0; i < c; i++) {
                    if (rrow[i] === undefined) {
                        rrow.push('');
                    }
                }
                rrow.push(str);
            });
        });
        return rrows;
    }
    negatePadding(col) {
        let wrapWidth = col.width || 0;
        if (col.padding) {
            wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
        }
        if (col.border) {
            wrapWidth -= 4;
        }
        return wrapWidth;
    }
    columnWidths(row) {
        if (!this.wrap) {
            return row.map(col => {
                return col.width || mixin.stringWidth(col.text);
            });
        }
        let unset = row.length;
        let remainingWidth = this.width;
        // column widths can be set in config.
        const widths = row.map(col => {
            if (col.width) {
                unset--;
                remainingWidth -= col.width;
                return col.width;
            }
            return undefined;
        });
        // any unset widths should be calculated.
        const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
        return widths.map((w, i) => {
            if (w === undefined) {
                return Math.max(unsetWidth, _minWidth(row[i]));
            }
            return w;
        });
    }
}
function addBorder(col, ts, style) {
    if (col.border) {
        if (/[.']-+[.']/.test(ts)) {
            return '';
        }
        if (ts.trim().length !== 0) {
            return style;
        }
        return '  ';
    }
    return '';
}
// calculates the minimum width of
// a column, based on padding preferences.
function _minWidth(col) {
    const padding = col.padding || [];
    const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
    if (col.border) {
        return minWidth + 4;
    }
    return minWidth;
}
function getWindowWidth() {
    /* istanbul ignore next: depends on terminal */
    if (typeof process === 'object' && process.stdout && process.stdout.columns) {
        return process.stdout.columns;
    }
    return 80;
}
function alignRight(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    if (strWidth < width) {
        return ' '.repeat(width - strWidth) + str;
    }
    return str;
}
function alignCenter(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    /* istanbul ignore next */
    if (strWidth >= width) {
        return str;
    }
    return ' '.repeat((width - strWidth) >> 1) + str;
}
let mixin;
function cliui(opts, _mixin) {
    mixin = _mixin;
    return new UI({
        width: (opts === null || opts === void 0 ? void 0 : opts.width) || getWindowWidth(),
        wrap: opts === null || opts === void 0 ? void 0 : opts.wrap
    });
}

;// CONCATENATED MODULE: ./node_modules/cliui/build/lib/string-utils.js
// Minimal replacement for ansi string helpers "wrap-ansi" and "strip-ansi".
// to facilitate ESM and Deno modules.
// TODO: look at porting https://www.npmjs.com/package/wrap-ansi to ESM.
// The npm application
// Copyright (c) npm, Inc. and Contributors
// Licensed on the terms of The Artistic License 2.0
// See: https://github.com/npm/cli/blob/4c65cd952bc8627811735bea76b9b110cc4fc80e/lib/utils/ansi-trim.js
const ansi = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
    '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g');
function stripAnsi(str) {
    return str.replace(ansi, '');
}
function wrap(str, width) {
    const [start, end] = str.match(ansi) || ['', ''];
    str = stripAnsi(str);
    let wrapped = '';
    for (let i = 0; i < str.length; i++) {
        if (i !== 0 && (i % width) === 0) {
            wrapped += '\n';
        }
        wrapped += str.charAt(i);
    }
    if (start && end) {
        wrapped = `${start}${wrapped}${end}`;
    }
    return wrapped;
}

;// CONCATENATED MODULE: ./node_modules/cliui/index.mjs
// Bootstrap cliui with CommonJS dependencies:



function ui (opts) {
  return cliui(opts, {
    stringWidth: (str) => {
      return [...str].length
    },
    stripAnsi: stripAnsi,
    wrap: wrap
  })
}

// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(17);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(147);
;// CONCATENATED MODULE: ./node_modules/escalade/sync/index.mjs



/* harmony default export */ function sync(start, callback) {
	let dir = (0,external_path_.resolve)('.', start);
	let tmp, stats = (0,external_fs_.statSync)(dir);

	if (!stats.isDirectory()) {
		dir = (0,external_path_.dirname)(dir);
	}

	while (true) {
		tmp = callback(dir, (0,external_fs_.readdirSync)(dir));
		if (tmp) return (0,external_path_.resolve)(dir, tmp);
		dir = (0,external_path_.dirname)(tmp = dir);
		if (tmp === dir) break;
	}
}

// EXTERNAL MODULE: external "util"
var external_util_ = __nccwpck_require__(837);
;// CONCATENATED MODULE: external "url"
const external_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");
;// CONCATENATED MODULE: ./node_modules/yargs-parser/build/lib/string-utils.js
/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */
function camelCase(str) {
    // Handle the case where an argument is provided as camel case, e.g., fooBar.
    // by ensuring that the string isn't already mixed case:
    const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
    if (!isCamelCase) {
        str = str.toLowerCase();
    }
    if (str.indexOf('-') === -1 && str.indexOf('_') === -1) {
        return str;
    }
    else {
        let camelcase = '';
        let nextChrUpper = false;
        const leadingHyphens = str.match(/^-+/);
        for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
            let chr = str.charAt(i);
            if (nextChrUpper) {
                nextChrUpper = false;
                chr = chr.toUpperCase();
            }
            if (i !== 0 && (chr === '-' || chr === '_')) {
                nextChrUpper = true;
            }
            else if (chr !== '-' && chr !== '_') {
                camelcase += chr;
            }
        }
        return camelcase;
    }
}
function decamelize(str, joinString) {
    const lowercase = str.toLowerCase();
    joinString = joinString || '-';
    let notCamelcase = '';
    for (let i = 0; i < str.length; i++) {
        const chrLower = lowercase.charAt(i);
        const chrString = str.charAt(i);
        if (chrLower !== chrString && i > 0) {
            notCamelcase += `${joinString}${lowercase.charAt(i)}`;
        }
        else {
            notCamelcase += chrString;
        }
    }
    return notCamelcase;
}
function looksLikeNumber(x) {
    if (x === null || x === undefined)
        return false;
    // if loaded from config, may already be a number.
    if (typeof x === 'number')
        return true;
    // hexadecimal.
    if (/^0x[0-9a-f]+$/i.test(x))
        return true;
    // don't treat 0123 as a number; as it drops the leading '0'.
    if (/^0[^.]/.test(x))
        return false;
    return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

;// CONCATENATED MODULE: ./node_modules/yargs-parser/build/lib/tokenize-arg-string.js
/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */
// take an un-split argv string and tokenize it.
function tokenizeArgString(argString) {
    if (Array.isArray(argString)) {
        return argString.map(e => typeof e !== 'string' ? e + '' : e);
    }
    argString = argString.trim();
    let i = 0;
    let prevC = null;
    let c = null;
    let opening = null;
    const args = [];
    for (let ii = 0; ii < argString.length; ii++) {
        prevC = c;
        c = argString.charAt(ii);
        // split on spaces unless we're in quotes.
        if (c === ' ' && !opening) {
            if (!(prevC === ' ')) {
                i++;
            }
            continue;
        }
        // don't split the string if we're in matching
        // opening or closing single and double quotes.
        if (c === opening) {
            opening = null;
        }
        else if ((c === "'" || c === '"') && !opening) {
            opening = c;
        }
        if (!args[i])
            args[i] = '';
        args[i] += c;
    }
    return args;
}

;// CONCATENATED MODULE: ./node_modules/yargs-parser/build/lib/yargs-parser-types.js
/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */
var DefaultValuesForTypeKey;
(function (DefaultValuesForTypeKey) {
    DefaultValuesForTypeKey["BOOLEAN"] = "boolean";
    DefaultValuesForTypeKey["STRING"] = "string";
    DefaultValuesForTypeKey["NUMBER"] = "number";
    DefaultValuesForTypeKey["ARRAY"] = "array";
})(DefaultValuesForTypeKey || (DefaultValuesForTypeKey = {}));

;// CONCATENATED MODULE: ./node_modules/yargs-parser/build/lib/yargs-parser.js
/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */



let yargs_parser_mixin;
class YargsParser {
    constructor(_mixin) {
        yargs_parser_mixin = _mixin;
    }
    parse(argsInput, options) {
        const opts = Object.assign({
            alias: undefined,
            array: undefined,
            boolean: undefined,
            config: undefined,
            configObjects: undefined,
            configuration: undefined,
            coerce: undefined,
            count: undefined,
            default: undefined,
            envPrefix: undefined,
            narg: undefined,
            normalize: undefined,
            string: undefined,
            number: undefined,
            __: undefined,
            key: undefined
        }, options);
        // allow a string argument to be passed in rather
        // than an argv array.
        const args = tokenizeArgString(argsInput);
        // tokenizeArgString adds extra quotes to args if argsInput is a string
        // only strip those extra quotes in processValue if argsInput is a string
        const inputIsString = typeof argsInput === 'string';
        // aliases might have transitive relationships, normalize this.
        const aliases = combineAliases(Object.assign(Object.create(null), opts.alias));
        const configuration = Object.assign({
            'boolean-negation': true,
            'camel-case-expansion': true,
            'combine-arrays': false,
            'dot-notation': true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays': true,
            'greedy-arrays': true,
            'halt-at-non-option': false,
            'nargs-eats-options': false,
            'negation-prefix': 'no-',
            'parse-numbers': true,
            'parse-positional-numbers': true,
            'populate--': false,
            'set-placeholder-key': false,
            'short-option-groups': true,
            'strip-aliased': false,
            'strip-dashed': false,
            'unknown-options-as-args': false
        }, opts.configuration);
        const defaults = Object.assign(Object.create(null), opts.default);
        const configObjects = opts.configObjects || [];
        const envPrefix = opts.envPrefix;
        const notFlagsOption = configuration['populate--'];
        const notFlagsArgv = notFlagsOption ? '--' : '_';
        const newAliases = Object.create(null);
        const defaulted = Object.create(null);
        // allow a i18n handler to be passed in, default to a fake one (util.format).
        const __ = opts.__ || yargs_parser_mixin.format;
        const flags = {
            aliases: Object.create(null),
            arrays: Object.create(null),
            bools: Object.create(null),
            strings: Object.create(null),
            numbers: Object.create(null),
            counts: Object.create(null),
            normalize: Object.create(null),
            configs: Object.create(null),
            nargs: Object.create(null),
            coercions: Object.create(null),
            keys: []
        };
        const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
        const negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)');
        [].concat(opts.array || []).filter(Boolean).forEach(function (opt) {
            const key = typeof opt === 'object' ? opt.key : opt;
            // assign to flags[bools|strings|numbers]
            const assignment = Object.keys(opt).map(function (key) {
                const arrayFlagKeys = {
                    boolean: 'bools',
                    string: 'strings',
                    number: 'numbers'
                };
                return arrayFlagKeys[key];
            }).filter(Boolean).pop();
            // assign key to be coerced
            if (assignment) {
                flags[assignment][key] = true;
            }
            flags.arrays[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.boolean || []).filter(Boolean).forEach(function (key) {
            flags.bools[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.string || []).filter(Boolean).forEach(function (key) {
            flags.strings[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.number || []).filter(Boolean).forEach(function (key) {
            flags.numbers[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.count || []).filter(Boolean).forEach(function (key) {
            flags.counts[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.normalize || []).filter(Boolean).forEach(function (key) {
            flags.normalize[key] = true;
            flags.keys.push(key);
        });
        if (typeof opts.narg === 'object') {
            Object.entries(opts.narg).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    flags.nargs[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.coerce === 'object') {
            Object.entries(opts.coerce).forEach(([key, value]) => {
                if (typeof value === 'function') {
                    flags.coercions[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.config !== 'undefined') {
            if (Array.isArray(opts.config) || typeof opts.config === 'string') {
                ;
                [].concat(opts.config).filter(Boolean).forEach(function (key) {
                    flags.configs[key] = true;
                });
            }
            else if (typeof opts.config === 'object') {
                Object.entries(opts.config).forEach(([key, value]) => {
                    if (typeof value === 'boolean' || typeof value === 'function') {
                        flags.configs[key] = value;
                    }
                });
            }
        }
        // create a lookup table that takes into account all
        // combinations of aliases: {f: ['foo'], foo: ['f']}
        extendAliases(opts.key, aliases, opts.default, flags.arrays);
        // apply default values to all aliases.
        Object.keys(defaults).forEach(function (key) {
            (flags.aliases[key] || []).forEach(function (alias) {
                defaults[alias] = defaults[key];
            });
        });
        let error = null;
        checkConfiguration();
        let notFlags = [];
        const argv = Object.assign(Object.create(null), { _: [] });
        // TODO(bcoe): for the first pass at removing object prototype  we didn't
        // remove all prototypes from objects returned by this API, we might want
        // to gradually move towards doing so.
        const argvReturn = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const truncatedArg = arg.replace(/^-{3,}/, '---');
            let broken;
            let key;
            let letters;
            let m;
            let next;
            let value;
            // any unknown option (except for end-of-options, "--")
            if (arg !== '--' && /^-/.test(arg) && isUnknownOptionAsArg(arg)) {
                pushPositional(arg);
                // ---, ---=, ----, etc,
            }
            else if (truncatedArg.match(/^---+(=|$)/)) {
                // options without key name are invalid.
                pushPositional(arg);
                continue;
                // -- separated by =
            }
            else if (arg.match(/^--.+=/) || (!configuration['short-option-groups'] && arg.match(/^-.+=/))) {
                // Using [\s\S] instead of . because js doesn't support the
                // 'dotall' regex modifier. See:
                // http://stackoverflow.com/a/1068308/13216
                m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
                // arrays format = '--f=a b c'
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    if (checkAllAliases(m[1], flags.arrays)) {
                        i = eatArray(i, m[1], args, m[2]);
                    }
                    else if (checkAllAliases(m[1], flags.nargs) !== false) {
                        // nargs format = '--f=monkey washing cat'
                        i = eatNargs(i, m[1], args, m[2]);
                    }
                    else {
                        setArg(m[1], m[2], true);
                    }
                }
            }
            else if (arg.match(negatedBoolean) && configuration['boolean-negation']) {
                m = arg.match(negatedBoolean);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
                }
                // -- separated by space.
            }
            else if (arg.match(/^--.+/) || (!configuration['short-option-groups'] && arg.match(/^-[^-]+/))) {
                m = arg.match(/^--?(.+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (checkAllAliases(key, flags.arrays)) {
                        // array format = '--foo a b c'
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        // nargs format = '--foo a b c'
                        // should be truthy even if: flags.nargs[key] === 0
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!next.match(/^-/) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
                // dot-notation flag separated by '='.
            }
            else if (arg.match(/^-.\..+=/)) {
                m = arg.match(/^-([^=]+)=([\s\S]*)$/);
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    setArg(m[1], m[2]);
                }
                // dot-notation flag separated by space.
            }
            else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
                next = args[i + 1];
                m = arg.match(/^-(.\..+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (next !== undefined && !next.match(/^-/) &&
                        !checkAllAliases(key, flags.bools) &&
                        !checkAllAliases(key, flags.counts)) {
                        setArg(key, next);
                        i++;
                    }
                    else {
                        setArg(key, defaultValue(key));
                    }
                }
            }
            else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
                letters = arg.slice(1, -1).split('');
                broken = false;
                for (let j = 0; j < letters.length; j++) {
                    next = arg.slice(j + 2);
                    if (letters[j + 1] && letters[j + 1] === '=') {
                        value = arg.slice(j + 3);
                        key = letters[j];
                        if (checkAllAliases(key, flags.arrays)) {
                            // array format = '-f=a b c'
                            i = eatArray(i, key, args, value);
                        }
                        else if (checkAllAliases(key, flags.nargs) !== false) {
                            // nargs format = '-f=monkey washing cat'
                            i = eatNargs(i, key, args, value);
                        }
                        else {
                            setArg(key, value);
                        }
                        broken = true;
                        break;
                    }
                    if (next === '-') {
                        setArg(letters[j], next);
                        continue;
                    }
                    // current letter is an alphabetic character and next value is a number
                    if (/[A-Za-z]/.test(letters[j]) &&
                        /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) &&
                        checkAllAliases(next, flags.bools) === false) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    else {
                        setArg(letters[j], defaultValue(letters[j]));
                    }
                }
                key = arg.slice(-1)[0];
                if (!broken && key !== '-') {
                    if (checkAllAliases(key, flags.arrays)) {
                        // array format = '-f a b c'
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        // nargs format = '-f a b c'
                        // should be truthy even if: flags.nargs[key] === 0
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!/^(-|--)[^-]/.test(next) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
            }
            else if (arg.match(/^-[0-9]$/) &&
                arg.match(negative) &&
                checkAllAliases(arg.slice(1), flags.bools)) {
                // single-digit boolean alias, e.g: xargs -0
                key = arg.slice(1);
                setArg(key, defaultValue(key));
            }
            else if (arg === '--') {
                notFlags = args.slice(i + 1);
                break;
            }
            else if (configuration['halt-at-non-option']) {
                notFlags = args.slice(i);
                break;
            }
            else {
                pushPositional(arg);
            }
        }
        // order of precedence:
        // 1. command line arg
        // 2. value from env var
        // 3. value from config file
        // 4. value from config objects
        // 5. configured default value
        applyEnvVars(argv, true); // special case: check env vars that point to config file
        applyEnvVars(argv, false);
        setConfig(argv);
        setConfigObjects();
        applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
        applyCoercions(argv);
        if (configuration['set-placeholder-key'])
            setPlaceholderKeys(argv);
        // for any counts either not in args or without an explicit default, set to 0
        Object.keys(flags.counts).forEach(function (key) {
            if (!hasKey(argv, key.split('.')))
                setArg(key, 0);
        });
        // '--' defaults to undefined.
        if (notFlagsOption && notFlags.length)
            argv[notFlagsArgv] = [];
        notFlags.forEach(function (key) {
            argv[notFlagsArgv].push(key);
        });
        if (configuration['camel-case-expansion'] && configuration['strip-dashed']) {
            Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
                delete argv[key];
            });
        }
        if (configuration['strip-aliased']) {
            ;
            [].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
                if (configuration['camel-case-expansion'] && alias.includes('-')) {
                    delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')];
                }
                delete argv[alias];
            });
        }
        // Push argument into positional array, applying numeric coercion:
        function pushPositional(arg) {
            const maybeCoercedNumber = maybeCoerceNumber('_', arg);
            if (typeof maybeCoercedNumber === 'string' || typeof maybeCoercedNumber === 'number') {
                argv._.push(maybeCoercedNumber);
            }
        }
        // how many arguments should we consume, based
        // on the nargs option?
        function eatNargs(i, key, args, argAfterEqualSign) {
            let ii;
            let toEat = checkAllAliases(key, flags.nargs);
            // NaN has a special meaning for the array type, indicating that one or
            // more values are expected.
            toEat = typeof toEat !== 'number' || isNaN(toEat) ? 1 : toEat;
            if (toEat === 0) {
                if (!isUndefined(argAfterEqualSign)) {
                    error = Error(__('Argument unexpected for: %s', key));
                }
                setArg(key, defaultValue(key));
                return i;
            }
            let available = isUndefined(argAfterEqualSign) ? 0 : 1;
            if (configuration['nargs-eats-options']) {
                // classic behavior, yargs eats positional and dash arguments.
                if (args.length - (i + 1) + available < toEat) {
                    error = Error(__('Not enough arguments following: %s', key));
                }
                available = toEat;
            }
            else {
                // nargs will not consume flag arguments, e.g., -abc, --foo,
                // and terminates when one is observed.
                for (ii = i + 1; ii < args.length; ii++) {
                    if (!args[ii].match(/^-[^0-9]/) || args[ii].match(negative) || isUnknownOptionAsArg(args[ii]))
                        available++;
                    else
                        break;
                }
                if (available < toEat)
                    error = Error(__('Not enough arguments following: %s', key));
            }
            let consumed = Math.min(available, toEat);
            if (!isUndefined(argAfterEqualSign) && consumed > 0) {
                setArg(key, argAfterEqualSign);
                consumed--;
            }
            for (ii = i + 1; ii < (consumed + i + 1); ii++) {
                setArg(key, args[ii]);
            }
            return (i + consumed);
        }
        // if an option is an array, eat all non-hyphenated arguments
        // following it... YUM!
        // e.g., --foo apple banana cat becomes ["apple", "banana", "cat"]
        function eatArray(i, key, args, argAfterEqualSign) {
            let argsToSet = [];
            let next = argAfterEqualSign || args[i + 1];
            // If both array and nargs are configured, enforce the nargs count:
            const nargsCount = checkAllAliases(key, flags.nargs);
            if (checkAllAliases(key, flags.bools) && !(/^(true|false)$/.test(next))) {
                argsToSet.push(true);
            }
            else if (isUndefined(next) ||
                (isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))) {
                // for keys without value ==> argsToSet remains an empty []
                // set user default value, if available
                if (defaults[key] !== undefined) {
                    const defVal = defaults[key];
                    argsToSet = Array.isArray(defVal) ? defVal : [defVal];
                }
            }
            else {
                // value in --option=value is eaten as is
                if (!isUndefined(argAfterEqualSign)) {
                    argsToSet.push(processValue(key, argAfterEqualSign, true));
                }
                for (let ii = i + 1; ii < args.length; ii++) {
                    if ((!configuration['greedy-arrays'] && argsToSet.length > 0) ||
                        (nargsCount && typeof nargsCount === 'number' && argsToSet.length >= nargsCount))
                        break;
                    next = args[ii];
                    if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
                        break;
                    i = ii;
                    argsToSet.push(processValue(key, next, inputIsString));
                }
            }
            // If both array and nargs are configured, create an error if less than
            // nargs positionals were found. NaN has special meaning, indicating
            // that at least one value is required (more are okay).
            if (typeof nargsCount === 'number' && ((nargsCount && argsToSet.length < nargsCount) ||
                (isNaN(nargsCount) && argsToSet.length === 0))) {
                error = Error(__('Not enough arguments following: %s', key));
            }
            setArg(key, argsToSet);
            return i;
        }
        function setArg(key, val, shouldStripQuotes = inputIsString) {
            if (/-/.test(key) && configuration['camel-case-expansion']) {
                const alias = key.split('.').map(function (prop) {
                    return camelCase(prop);
                }).join('.');
                addNewAlias(key, alias);
            }
            const value = processValue(key, val, shouldStripQuotes);
            const splitKey = key.split('.');
            setKey(argv, splitKey, value);
            // handle populating aliases of the full key
            if (flags.aliases[key]) {
                flags.aliases[key].forEach(function (x) {
                    const keyProperties = x.split('.');
                    setKey(argv, keyProperties, value);
                });
            }
            // handle populating aliases of the first element of the dot-notation key
            if (splitKey.length > 1 && configuration['dot-notation']) {
                ;
                (flags.aliases[splitKey[0]] || []).forEach(function (x) {
                    let keyProperties = x.split('.');
                    // expand alias with nested objects in key
                    const a = [].concat(splitKey);
                    a.shift(); // nuke the old key.
                    keyProperties = keyProperties.concat(a);
                    // populate alias only if is not already an alias of the full key
                    // (already populated above)
                    if (!(flags.aliases[key] || []).includes(keyProperties.join('.'))) {
                        setKey(argv, keyProperties, value);
                    }
                });
            }
            // Set normalize getter and setter when key is in 'normalize' but isn't an array
            if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
                const keys = [key].concat(flags.aliases[key] || []);
                keys.forEach(function (key) {
                    Object.defineProperty(argvReturn, key, {
                        enumerable: true,
                        get() {
                            return val;
                        },
                        set(value) {
                            val = typeof value === 'string' ? yargs_parser_mixin.normalize(value) : value;
                        }
                    });
                });
            }
        }
        function addNewAlias(key, alias) {
            if (!(flags.aliases[key] && flags.aliases[key].length)) {
                flags.aliases[key] = [alias];
                newAliases[alias] = true;
            }
            if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
                addNewAlias(alias, key);
            }
        }
        function processValue(key, val, shouldStripQuotes) {
            // strings may be quoted, clean this up as we assign values.
            if (shouldStripQuotes) {
                val = stripQuotes(val);
            }
            // handle parsing boolean arguments --foo=true --bar false.
            if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
                if (typeof val === 'string')
                    val = val === 'true';
            }
            let value = Array.isArray(val)
                ? val.map(function (v) { return maybeCoerceNumber(key, v); })
                : maybeCoerceNumber(key, val);
            // increment a count given as arg (either no value or value parsed as boolean)
            if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === 'boolean')) {
                value = increment();
            }
            // Set normalized value when key is in 'normalize' and in 'arrays'
            if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
                if (Array.isArray(val))
                    value = val.map((val) => { return yargs_parser_mixin.normalize(val); });
                else
                    value = yargs_parser_mixin.normalize(val);
            }
            return value;
        }
        function maybeCoerceNumber(key, value) {
            if (!configuration['parse-positional-numbers'] && key === '_')
                return value;
            if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
                const shouldCoerceNumber = looksLikeNumber(value) && configuration['parse-numbers'] && (Number.isSafeInteger(Math.floor(parseFloat(`${value}`))));
                if (shouldCoerceNumber || (!isUndefined(value) && checkAllAliases(key, flags.numbers))) {
                    value = Number(value);
                }
            }
            return value;
        }
        // set args from config.json file, this should be
        // applied last so that defaults can be applied.
        function setConfig(argv) {
            const configLookup = Object.create(null);
            // expand defaults/aliases, in-case any happen to reference
            // the config.json file.
            applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
            Object.keys(flags.configs).forEach(function (configKey) {
                const configPath = argv[configKey] || configLookup[configKey];
                if (configPath) {
                    try {
                        let config = null;
                        const resolvedConfigPath = yargs_parser_mixin.resolve(yargs_parser_mixin.cwd(), configPath);
                        const resolveConfig = flags.configs[configKey];
                        if (typeof resolveConfig === 'function') {
                            try {
                                config = resolveConfig(resolvedConfigPath);
                            }
                            catch (e) {
                                config = e;
                            }
                            if (config instanceof Error) {
                                error = config;
                                return;
                            }
                        }
                        else {
                            config = yargs_parser_mixin.require(resolvedConfigPath);
                        }
                        setConfigObject(config);
                    }
                    catch (ex) {
                        // Deno will receive a PermissionDenied error if an attempt is
                        // made to load config without the --allow-read flag:
                        if (ex.name === 'PermissionDenied')
                            error = ex;
                        else if (argv[configKey])
                            error = Error(__('Invalid JSON config file: %s', configPath));
                    }
                }
            });
        }
        // set args from config object.
        // it recursively checks nested objects.
        function setConfigObject(config, prev) {
            Object.keys(config).forEach(function (key) {
                const value = config[key];
                const fullKey = prev ? prev + '.' + key : key;
                // if the value is an inner object and we have dot-notation
                // enabled, treat inner objects in config the same as
                // heavily nested dot notations (foo.bar.apple).
                if (typeof value === 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']) {
                    // if the value is an object but not an array, check nested object
                    setConfigObject(value, fullKey);
                }
                else {
                    // setting arguments via CLI takes precedence over
                    // values within the config file.
                    if (!hasKey(argv, fullKey.split('.')) || (checkAllAliases(fullKey, flags.arrays) && configuration['combine-arrays'])) {
                        setArg(fullKey, value);
                    }
                }
            });
        }
        // set all config objects passed in opts
        function setConfigObjects() {
            if (typeof configObjects !== 'undefined') {
                configObjects.forEach(function (configObject) {
                    setConfigObject(configObject);
                });
            }
        }
        function applyEnvVars(argv, configOnly) {
            if (typeof envPrefix === 'undefined')
                return;
            const prefix = typeof envPrefix === 'string' ? envPrefix : '';
            const env = yargs_parser_mixin.env();
            Object.keys(env).forEach(function (envVar) {
                if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
                    // get array of nested keys and convert them to camel case
                    const keys = envVar.split('__').map(function (key, i) {
                        if (i === 0) {
                            key = key.substring(prefix.length);
                        }
                        return camelCase(key);
                    });
                    if (((configOnly && flags.configs[keys.join('.')]) || !configOnly) && !hasKey(argv, keys)) {
                        setArg(keys.join('.'), env[envVar]);
                    }
                }
            });
        }
        function applyCoercions(argv) {
            let coerce;
            const applied = new Set();
            Object.keys(argv).forEach(function (key) {
                if (!applied.has(key)) { // If we haven't already coerced this option via one of its aliases
                    coerce = checkAllAliases(key, flags.coercions);
                    if (typeof coerce === 'function') {
                        try {
                            const value = maybeCoerceNumber(key, coerce(argv[key]));
                            ([].concat(flags.aliases[key] || [], key)).forEach(ali => {
                                applied.add(ali);
                                argv[ali] = value;
                            });
                        }
                        catch (err) {
                            error = err;
                        }
                    }
                }
            });
        }
        function setPlaceholderKeys(argv) {
            flags.keys.forEach((key) => {
                // don't set placeholder keys for dot notation options 'foo.bar'.
                if (~key.indexOf('.'))
                    return;
                if (typeof argv[key] === 'undefined')
                    argv[key] = undefined;
            });
            return argv;
        }
        function applyDefaultsAndAliases(obj, aliases, defaults, canLog = false) {
            Object.keys(defaults).forEach(function (key) {
                if (!hasKey(obj, key.split('.'))) {
                    setKey(obj, key.split('.'), defaults[key]);
                    if (canLog)
                        defaulted[key] = true;
                    (aliases[key] || []).forEach(function (x) {
                        if (hasKey(obj, x.split('.')))
                            return;
                        setKey(obj, x.split('.'), defaults[key]);
                    });
                }
            });
        }
        function hasKey(obj, keys) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                o = (o[key] || {});
            });
            const key = keys[keys.length - 1];
            if (typeof o !== 'object')
                return false;
            else
                return key in o;
        }
        function setKey(obj, keys, value) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                // TODO(bcoe): in the next major version of yargs, switch to
                // Object.create(null) for dot notation:
                key = sanitizeKey(key);
                if (typeof o === 'object' && o[key] === undefined) {
                    o[key] = {};
                }
                if (typeof o[key] !== 'object' || Array.isArray(o[key])) {
                    // ensure that o[key] is an array, and that the last item is an empty object.
                    if (Array.isArray(o[key])) {
                        o[key].push({});
                    }
                    else {
                        o[key] = [o[key], {}];
                    }
                    // we want to update the empty object at the end of the o[key] array, so set o to that object
                    o = o[key][o[key].length - 1];
                }
                else {
                    o = o[key];
                }
            });
            // TODO(bcoe): in the next major version of yargs, switch to
            // Object.create(null) for dot notation:
            const key = sanitizeKey(keys[keys.length - 1]);
            const isTypeArray = checkAllAliases(keys.join('.'), flags.arrays);
            const isValueArray = Array.isArray(value);
            let duplicate = configuration['duplicate-arguments-array'];
            // nargs has higher priority than duplicate
            if (!duplicate && checkAllAliases(key, flags.nargs)) {
                duplicate = true;
                if ((!isUndefined(o[key]) && flags.nargs[key] === 1) || (Array.isArray(o[key]) && o[key].length === flags.nargs[key])) {
                    o[key] = undefined;
                }
            }
            if (value === increment()) {
                o[key] = increment(o[key]);
            }
            else if (Array.isArray(o[key])) {
                if (duplicate && isTypeArray && isValueArray) {
                    o[key] = configuration['flatten-duplicate-arrays'] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
                }
                else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
                    o[key] = value;
                }
                else {
                    o[key] = o[key].concat([value]);
                }
            }
            else if (o[key] === undefined && isTypeArray) {
                o[key] = isValueArray ? value : [value];
            }
            else if (duplicate && !(o[key] === undefined ||
                checkAllAliases(key, flags.counts) ||
                checkAllAliases(key, flags.bools))) {
                o[key] = [o[key], value];
            }
            else {
                o[key] = value;
            }
        }
        // extend the aliases list with inferred aliases.
        function extendAliases(...args) {
            args.forEach(function (obj) {
                Object.keys(obj || {}).forEach(function (key) {
                    // short-circuit if we've already added a key
                    // to the aliases array, for example it might
                    // exist in both 'opts.default' and 'opts.key'.
                    if (flags.aliases[key])
                        return;
                    flags.aliases[key] = [].concat(aliases[key] || []);
                    // For "--option-name", also set argv.optionName
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (/-/.test(x) && configuration['camel-case-expansion']) {
                            const c = camelCase(x);
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    // For "--optionName", also set argv['option-name']
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
                            const c = decamelize(x, '-');
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].forEach(function (x) {
                        flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
                            return x !== y;
                        }));
                    });
                });
            });
        }
        function checkAllAliases(key, flag) {
            const toCheck = [].concat(flags.aliases[key] || [], key);
            const keys = Object.keys(flag);
            const setAlias = toCheck.find(key => keys.includes(key));
            return setAlias ? flag[setAlias] : false;
        }
        function hasAnyFlag(key) {
            const flagsKeys = Object.keys(flags);
            const toCheck = [].concat(flagsKeys.map(k => flags[k]));
            return toCheck.some(function (flag) {
                return Array.isArray(flag) ? flag.includes(key) : flag[key];
            });
        }
        function hasFlagsMatching(arg, ...patterns) {
            const toCheck = [].concat(...patterns);
            return toCheck.some(function (pattern) {
                const match = arg.match(pattern);
                return match && hasAnyFlag(match[1]);
            });
        }
        // based on a simplified version of the short flag group parsing logic
        function hasAllShortFlags(arg) {
            // if this is a negative number, or doesn't start with a single hyphen, it's not a short flag group
            if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
                return false;
            }
            let hasAllFlags = true;
            let next;
            const letters = arg.slice(1).split('');
            for (let j = 0; j < letters.length; j++) {
                next = arg.slice(j + 2);
                if (!hasAnyFlag(letters[j])) {
                    hasAllFlags = false;
                    break;
                }
                if ((letters[j + 1] && letters[j + 1] === '=') ||
                    next === '-' ||
                    (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
                    (letters[j + 1] && letters[j + 1].match(/\W/))) {
                    break;
                }
            }
            return hasAllFlags;
        }
        function isUnknownOptionAsArg(arg) {
            return configuration['unknown-options-as-args'] && isUnknownOption(arg);
        }
        function isUnknownOption(arg) {
            arg = arg.replace(/^-{3,}/, '--');
            // ignore negative numbers
            if (arg.match(negative)) {
                return false;
            }
            // if this is a short option group and all of them are configured, it isn't unknown
            if (hasAllShortFlags(arg)) {
                return false;
            }
            // e.g. '--count=2'
            const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
            // e.g. '-a' or '--arg'
            const normalFlag = /^-+([^=]+?)$/;
            // e.g. '-a-'
            const flagEndingInHyphen = /^-+([^=]+?)-$/;
            // e.g. '-abc123'
            const flagEndingInDigits = /^-+([^=]+?\d+)$/;
            // e.g. '-a/usr/local'
            const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
            // check the different types of flag styles, including negatedBoolean, a pattern defined near the start of the parse method
            return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
        }
        // make a best effort to pick a default value
        // for an option based on name and type.
        function defaultValue(key) {
            if (!checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts) &&
                `${key}` in defaults) {
                return defaults[key];
            }
            else {
                return defaultForType(guessType(key));
            }
        }
        // return a default value, given the type of a flag.,
        function defaultForType(type) {
            const def = {
                [DefaultValuesForTypeKey.BOOLEAN]: true,
                [DefaultValuesForTypeKey.STRING]: '',
                [DefaultValuesForTypeKey.NUMBER]: undefined,
                [DefaultValuesForTypeKey.ARRAY]: []
            };
            return def[type];
        }
        // given a flag, enforce a default type.
        function guessType(key) {
            let type = DefaultValuesForTypeKey.BOOLEAN;
            if (checkAllAliases(key, flags.strings))
                type = DefaultValuesForTypeKey.STRING;
            else if (checkAllAliases(key, flags.numbers))
                type = DefaultValuesForTypeKey.NUMBER;
            else if (checkAllAliases(key, flags.bools))
                type = DefaultValuesForTypeKey.BOOLEAN;
            else if (checkAllAliases(key, flags.arrays))
                type = DefaultValuesForTypeKey.ARRAY;
            return type;
        }
        function isUndefined(num) {
            return num === undefined;
        }
        // check user configuration settings for inconsistencies
        function checkConfiguration() {
            // count keys should not be set as array/narg
            Object.keys(flags.counts).find(key => {
                if (checkAllAliases(key, flags.arrays)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key));
                    return true;
                }
                else if (checkAllAliases(key, flags.nargs)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key));
                    return true;
                }
                return false;
            });
        }
        return {
            aliases: Object.assign({}, flags.aliases),
            argv: Object.assign(argvReturn, argv),
            configuration: configuration,
            defaulted: Object.assign({}, defaulted),
            error: error,
            newAliases: Object.assign({}, newAliases)
        };
    }
}
// if any aliases reference each other, we should
// merge them together.
function combineAliases(aliases) {
    const aliasArrays = [];
    const combined = Object.create(null);
    let change = true;
    // turn alias lookup hash {key: ['alias1', 'alias2']} into
    // a simple array ['key', 'alias1', 'alias2']
    Object.keys(aliases).forEach(function (key) {
        aliasArrays.push([].concat(aliases[key], key));
    });
    // combine arrays until zero changes are
    // made in an iteration.
    while (change) {
        change = false;
        for (let i = 0; i < aliasArrays.length; i++) {
            for (let ii = i + 1; ii < aliasArrays.length; ii++) {
                const intersect = aliasArrays[i].filter(function (v) {
                    return aliasArrays[ii].indexOf(v) !== -1;
                });
                if (intersect.length) {
                    aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
                    aliasArrays.splice(ii, 1);
                    change = true;
                    break;
                }
            }
        }
    }
    // map arrays back to the hash-lookup (de-dupe while
    // we're at it).
    aliasArrays.forEach(function (aliasArray) {
        aliasArray = aliasArray.filter(function (v, i, self) {
            return self.indexOf(v) === i;
        });
        const lastAlias = aliasArray.pop();
        if (lastAlias !== undefined && typeof lastAlias === 'string') {
            combined[lastAlias] = aliasArray;
        }
    });
    return combined;
}
// this function should only be called when a count is given as an arg
// it is NOT called to set a default value
// thus we can start the count at 1 instead of 0
function increment(orig) {
    return orig !== undefined ? orig + 1 : 1;
}
// TODO(bcoe): in the next major version of yargs, switch to
// Object.create(null) for dot notation:
function sanitizeKey(key) {
    if (key === '__proto__')
        return '___proto___';
    return key;
}
function stripQuotes(val) {
    return (typeof val === 'string' &&
        (val[0] === "'" || val[0] === '"') &&
        val[val.length - 1] === val[0])
        ? val.substring(1, val.length - 1)
        : val;
}

;// CONCATENATED MODULE: ./node_modules/yargs-parser/build/lib/index.js
/**
 * @fileoverview Main entrypoint for libraries using yargs-parser in Node.js
 * CJS and ESM environments.
 *
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */
var _a, _b, _c;





// See https://github.com/yargs/yargs-parser#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 12;
const nodeVersion = (_b = (_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) !== null && _b !== void 0 ? _b : (_c = process === null || process === void 0 ? void 0 : process.version) === null || _c === void 0 ? void 0 : _c.slice(1);
if (nodeVersion) {
    const major = Number(nodeVersion.match(/^([^.]+)/)[1]);
    if (major < minNodeVersion) {
        throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
    }
}
// Creates a yargs-parser instance using Node.js standard libraries:
const env = process ? process.env : {};
const parser = new YargsParser({
    cwd: process.cwd,
    env: () => {
        return env;
    },
    format: external_util_.format,
    normalize: external_path_.normalize,
    resolve: external_path_.resolve,
    // TODO: figure  out a  way to combine ESM and CJS coverage, such  that
    // we can exercise all the lines below:
    require: (path) => {
        if (typeof require !== 'undefined') {
            return require(path);
        }
        else if (path.match(/\.json$/)) {
            // Addresses: https://github.com/yargs/yargs/issues/2040
            return JSON.parse((0,external_fs_.readFileSync)(path, 'utf8'));
        }
        else {
            throw Error('only .json config files are supported in ESM');
        }
    }
});
const yargsParser = function Parser(args, opts) {
    const result = parser.parse(args.slice(), opts);
    return result.argv;
};
yargsParser.detailed = function (args, opts) {
    return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;
/* harmony default export */ const lib = (yargsParser);

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/process-argv.js
function getProcessArgvBinIndex() {
    if (isBundledElectronApp())
        return 0;
    return 1;
}
function isBundledElectronApp() {
    return isElectronApp() && !process.defaultApp;
}
function isElectronApp() {
    return !!process.versions.electron;
}
function hideBin(argv) {
    return argv.slice(getProcessArgvBinIndex() + 1);
}
function getProcessArgvBin() {
    return process.argv[getProcessArgvBinIndex()];
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/yerror.js
class YError extends Error {
    constructor(msg) {
        super(msg || 'yargs error');
        this.name = 'YError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, YError);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/y18n/build/lib/platform-shims/node.js



/* harmony default export */ const node = ({
    fs: {
        readFileSync: external_fs_.readFileSync,
        writeFile: external_fs_.writeFile
    },
    format: external_util_.format,
    resolve: external_path_.resolve,
    exists: (file) => {
        try {
            return (0,external_fs_.statSync)(file).isFile();
        }
        catch (err) {
            return false;
        }
    }
});

;// CONCATENATED MODULE: ./node_modules/y18n/build/lib/index.js
let shim;
class Y18N {
    constructor(opts) {
        // configurable options.
        opts = opts || {};
        this.directory = opts.directory || './locales';
        this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true;
        this.locale = opts.locale || 'en';
        this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true;
        // internal stuff.
        this.cache = Object.create(null);
        this.writeQueue = [];
    }
    __(...args) {
        if (typeof arguments[0] !== 'string') {
            return this._taggedLiteral(arguments[0], ...arguments);
        }
        const str = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        cb = cb || function () { }; // noop.
        if (!this.cache[this.locale])
            this._readLocaleFile();
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][str] && this.updateFiles) {
            this.cache[this.locale][str] = str;
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
    }
    __n() {
        const args = Array.prototype.slice.call(arguments);
        const singular = args.shift();
        const plural = args.shift();
        const quantity = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        if (!this.cache[this.locale])
            this._readLocaleFile();
        let str = quantity === 1 ? singular : plural;
        if (this.cache[this.locale][singular]) {
            const entry = this.cache[this.locale][singular];
            str = entry[quantity === 1 ? 'one' : 'other'];
        }
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][singular] && this.updateFiles) {
            this.cache[this.locale][singular] = {
                one: singular,
                other: plural
            };
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        // if a %d placeholder is provided, add quantity
        // to the arguments expanded by util.format.
        const values = [str];
        if (~str.indexOf('%d'))
            values.push(quantity);
        return shim.format.apply(shim.format, values.concat(args));
    }
    setLocale(locale) {
        this.locale = locale;
    }
    getLocale() {
        return this.locale;
    }
    updateLocale(obj) {
        if (!this.cache[this.locale])
            this._readLocaleFile();
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                this.cache[this.locale][key] = obj[key];
            }
        }
    }
    _taggedLiteral(parts, ...args) {
        let str = '';
        parts.forEach(function (part, i) {
            const arg = args[i + 1];
            str += part;
            if (typeof arg !== 'undefined') {
                str += '%s';
            }
        });
        return this.__.apply(this, [str].concat([].slice.call(args, 1)));
    }
    _enqueueWrite(work) {
        this.writeQueue.push(work);
        if (this.writeQueue.length === 1)
            this._processWriteQueue();
    }
    _processWriteQueue() {
        const _this = this;
        const work = this.writeQueue[0];
        // destructure the enqueued work.
        const directory = work.directory;
        const locale = work.locale;
        const cb = work.cb;
        const languageFile = this._resolveLocaleFile(directory, locale);
        const serializedLocale = JSON.stringify(this.cache[locale], null, 2);
        shim.fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
            _this.writeQueue.shift();
            if (_this.writeQueue.length > 0)
                _this._processWriteQueue();
            cb(err);
        });
    }
    _readLocaleFile() {
        let localeLookup = {};
        const languageFile = this._resolveLocaleFile(this.directory, this.locale);
        try {
            // When using a bundler such as webpack, readFileSync may not be defined:
            if (shim.fs.readFileSync) {
                localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, 'utf-8'));
            }
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                err.message = 'syntax error in ' + languageFile;
            }
            if (err.code === 'ENOENT')
                localeLookup = {};
            else
                throw err;
        }
        this.cache[this.locale] = localeLookup;
    }
    _resolveLocaleFile(directory, locale) {
        let file = shim.resolve(directory, './', locale + '.json');
        if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
            // attempt fallback to language only
            const languageFile = shim.resolve(directory, './', locale.split('_')[0] + '.json');
            if (this._fileExistsSync(languageFile))
                file = languageFile;
        }
        return file;
    }
    _fileExistsSync(file) {
        return shim.exists(file);
    }
}
function y18n(opts, _shim) {
    shim = _shim;
    const y18n = new Y18N(opts);
    return {
        __: y18n.__.bind(y18n),
        __n: y18n.__n.bind(y18n),
        setLocale: y18n.setLocale.bind(y18n),
        getLocale: y18n.getLocale.bind(y18n),
        updateLocale: y18n.updateLocale.bind(y18n),
        locale: y18n.locale
    };
}

;// CONCATENATED MODULE: ./node_modules/y18n/index.mjs



const y18n_y18n = (opts) => {
  return y18n(opts, node)
}

/* harmony default export */ const node_modules_y18n = (y18n_y18n);

;// CONCATENATED MODULE: ./node_modules/yargs/lib/platform-shims/esm.mjs


;











const REQUIRE_ERROR = 'require is not supported by ESM'
const REQUIRE_DIRECTORY_ERROR = 'loading a directory of commands is not supported yet for ESM'

let esm_dirname;
try {
  esm_dirname = (0,external_url_namespaceObject.fileURLToPath)("file:///Users/developer/Documents/GitHub/conflictor/Conflictor/node_modules/yargs/lib/platform-shims/esm.mjs");
} catch (e) {
  esm_dirname = process.cwd();
}
const mainFilename = esm_dirname.substring(0, esm_dirname.lastIndexOf('node_modules'));

/* harmony default export */ const esm = ({
  assert: {
    notStrictEqual: external_assert_.notStrictEqual,
    strictEqual: external_assert_.strictEqual
  },
  cliui: ui,
  findUp: sync,
  getEnv: (key) => {
    return process.env[key]
  },
  inspect: external_util_.inspect,
  getCallerFile: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR)
  },
  getProcessArgvBin: getProcessArgvBin,
  mainFilename: mainFilename || process.cwd(),
  Parser: lib,
  path: {
    basename: external_path_.basename,
    dirname: external_path_.dirname,
    extname: external_path_.extname,
    relative: external_path_.relative,
    resolve: external_path_.resolve
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning, type) => process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: process.exit,
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null
  },
  readFileSync: external_fs_.readFileSync,
  require: () => {
    throw new YError(REQUIRE_ERROR)
  },
  requireDirectory: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR)
  },
  stringWidth: (str) => {
    return [...str].length
  },
  y18n: node_modules_y18n({
    directory: (0,external_path_.resolve)(esm_dirname, '../../../locales'),
    updateFiles: false
  })
});

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/typings/common-types.js
function assertNotStrictEqual(actual, expected, shim, message) {
    shim.assert.notStrictEqual(actual, expected, message);
}
function assertSingleKey(actual, shim) {
    shim.assert.strictEqual(typeof actual, 'string');
}
function objectKeys(object) {
    return Object.keys(object);
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/is-promise.js
function isPromise(maybePromise) {
    return (!!maybePromise &&
        !!maybePromise.then &&
        typeof maybePromise.then === 'function');
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/parse-command.js
function parseCommand(cmd) {
    const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
    const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
    const bregex = /\.*[\][<>]/g;
    const firstCommand = splitCommand.shift();
    if (!firstCommand)
        throw new Error(`No command found in: ${cmd}`);
    const parsedCommand = {
        cmd: firstCommand.replace(bregex, ''),
        demanded: [],
        optional: [],
    };
    splitCommand.forEach((cmd, i) => {
        let variadic = false;
        cmd = cmd.replace(/\s/g, '');
        if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1)
            variadic = true;
        if (/^\[/.test(cmd)) {
            parsedCommand.optional.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic,
            });
        }
        else {
            parsedCommand.demanded.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic,
            });
        }
    });
    return parsedCommand;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/argsert.js


const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
function argsert(arg1, arg2, arg3) {
    function parseArgs() {
        return typeof arg1 === 'object'
            ? [{ demanded: [], optional: [] }, arg1, arg2]
            : [
                parseCommand(`cmd ${arg1}`),
                arg2,
                arg3,
            ];
    }
    try {
        let position = 0;
        const [parsed, callerArguments, _length] = parseArgs();
        const args = [].slice.call(callerArguments);
        while (args.length && args[args.length - 1] === undefined)
            args.pop();
        const length = _length || args.length;
        if (length < parsed.demanded.length) {
            throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
        }
        const totalCommands = parsed.demanded.length + parsed.optional.length;
        if (length > totalCommands) {
            throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
        }
        parsed.demanded.forEach(demanded => {
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = demanded.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, demanded.cmd, position);
            position += 1;
        });
        parsed.optional.forEach(optional => {
            if (args.length === 0)
                return;
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = optional.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, optional.cmd, position);
            position += 1;
        });
    }
    catch (err) {
        console.warn(err.stack);
    }
}
function guessType(arg) {
    if (Array.isArray(arg)) {
        return 'array';
    }
    else if (arg === null) {
        return 'null';
    }
    return typeof arg;
}
function argumentTypeError(observedType, allowedTypes, position) {
    throw new YError(`Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`);
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/middleware.js


class GlobalMiddleware {
    constructor(yargs) {
        this.globalMiddleware = [];
        this.frozens = [];
        this.yargs = yargs;
    }
    addMiddleware(callback, applyBeforeValidation, global = true, mutates = false) {
        argsert('<array|function> [boolean] [boolean] [boolean]', [callback, applyBeforeValidation, global], arguments.length);
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length; i++) {
                if (typeof callback[i] !== 'function') {
                    throw Error('middleware must be a function');
                }
                const m = callback[i];
                m.applyBeforeValidation = applyBeforeValidation;
                m.global = global;
            }
            Array.prototype.push.apply(this.globalMiddleware, callback);
        }
        else if (typeof callback === 'function') {
            const m = callback;
            m.applyBeforeValidation = applyBeforeValidation;
            m.global = global;
            m.mutates = mutates;
            this.globalMiddleware.push(callback);
        }
        return this.yargs;
    }
    addCoerceMiddleware(callback, option) {
        const aliases = this.yargs.getAliases();
        this.globalMiddleware = this.globalMiddleware.filter(m => {
            const toCheck = [...(aliases[option] || []), option];
            if (!m.option)
                return true;
            else
                return !toCheck.includes(m.option);
        });
        callback.option = option;
        return this.addMiddleware(callback, true, true, true);
    }
    getMiddleware() {
        return this.globalMiddleware;
    }
    freeze() {
        this.frozens.push([...this.globalMiddleware]);
    }
    unfreeze() {
        const frozen = this.frozens.pop();
        if (frozen !== undefined)
            this.globalMiddleware = frozen;
    }
    reset() {
        this.globalMiddleware = this.globalMiddleware.filter(m => m.global);
    }
}
function commandMiddlewareFactory(commandMiddleware) {
    if (!commandMiddleware)
        return [];
    return commandMiddleware.map(middleware => {
        middleware.applyBeforeValidation = false;
        return middleware;
    });
}
function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
    return middlewares.reduce((acc, middleware) => {
        if (middleware.applyBeforeValidation !== beforeValidation) {
            return acc;
        }
        if (middleware.mutates) {
            if (middleware.applied)
                return acc;
            middleware.applied = true;
        }
        if (isPromise(acc)) {
            return acc
                .then(initialObj => Promise.all([initialObj, middleware(initialObj, yargs)]))
                .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
        }
        else {
            const result = middleware(acc, yargs);
            return isPromise(result)
                ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
                : Object.assign(acc, result);
        }
    }, argv);
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/maybe-async-result.js

function maybeAsyncResult(getResult, resultHandler, errorHandler = (err) => {
    throw err;
}) {
    try {
        const result = isFunction(getResult) ? getResult() : getResult;
        return isPromise(result)
            ? result.then((result) => resultHandler(result))
            : resultHandler(result);
    }
    catch (err) {
        return errorHandler(err);
    }
}
function isFunction(arg) {
    return typeof arg === 'function';
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/which-module.js
function whichModule(exported) {
    if (typeof require === 'undefined')
        return null;
    for (let i = 0, files = Object.keys(require.cache), mod; i < files.length; i++) {
        mod = require.cache[files[i]];
        if (mod.exports === exported)
            return mod;
    }
    return null;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/command.js







const DEFAULT_MARKER = /(^\*)|(^\$0)/;
class CommandInstance {
    constructor(usage, validation, globalMiddleware, shim) {
        this.requireCache = new Set();
        this.handlers = {};
        this.aliasMap = {};
        this.frozens = [];
        this.shim = shim;
        this.usage = usage;
        this.globalMiddleware = globalMiddleware;
        this.validation = validation;
    }
    addDirectory(dir, req, callerFile, opts) {
        opts = opts || {};
        if (typeof opts.recurse !== 'boolean')
            opts.recurse = false;
        if (!Array.isArray(opts.extensions))
            opts.extensions = ['js'];
        const parentVisit = typeof opts.visit === 'function' ? opts.visit : (o) => o;
        opts.visit = (obj, joined, filename) => {
            const visited = parentVisit(obj, joined, filename);
            if (visited) {
                if (this.requireCache.has(joined))
                    return visited;
                else
                    this.requireCache.add(joined);
                this.addHandler(visited);
            }
            return visited;
        };
        this.shim.requireDirectory({ require: req, filename: callerFile }, dir, opts);
    }
    addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
        let aliases = [];
        const middlewares = commandMiddlewareFactory(commandMiddleware);
        handler = handler || (() => { });
        if (Array.isArray(cmd)) {
            if (isCommandAndAliases(cmd)) {
                [cmd, ...aliases] = cmd;
            }
            else {
                for (const command of cmd) {
                    this.addHandler(command);
                }
            }
        }
        else if (isCommandHandlerDefinition(cmd)) {
            let command = Array.isArray(cmd.command) || typeof cmd.command === 'string'
                ? cmd.command
                : this.moduleName(cmd);
            if (cmd.aliases)
                command = [].concat(command).concat(cmd.aliases);
            this.addHandler(command, this.extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
            return;
        }
        else if (isCommandBuilderDefinition(builder)) {
            this.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
            return;
        }
        if (typeof cmd === 'string') {
            const parsedCommand = parseCommand(cmd);
            aliases = aliases.map(alias => parseCommand(alias).cmd);
            let isDefault = false;
            const parsedAliases = [parsedCommand.cmd].concat(aliases).filter(c => {
                if (DEFAULT_MARKER.test(c)) {
                    isDefault = true;
                    return false;
                }
                return true;
            });
            if (parsedAliases.length === 0 && isDefault)
                parsedAliases.push('$0');
            if (isDefault) {
                parsedCommand.cmd = parsedAliases[0];
                aliases = parsedAliases.slice(1);
                cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
            }
            aliases.forEach(alias => {
                this.aliasMap[alias] = parsedCommand.cmd;
            });
            if (description !== false) {
                this.usage.command(cmd, description, isDefault, aliases, deprecated);
            }
            this.handlers[parsedCommand.cmd] = {
                original: cmd,
                description,
                handler,
                builder: builder || {},
                middlewares,
                deprecated,
                demanded: parsedCommand.demanded,
                optional: parsedCommand.optional,
            };
            if (isDefault)
                this.defaultCommand = this.handlers[parsedCommand.cmd];
        }
    }
    getCommandHandlers() {
        return this.handlers;
    }
    getCommands() {
        return Object.keys(this.handlers).concat(Object.keys(this.aliasMap));
    }
    hasDefaultCommand() {
        return !!this.defaultCommand;
    }
    runCommand(command, yargs, parsed, commandIndex, helpOnly, helpOrVersionSet) {
        const commandHandler = this.handlers[command] ||
            this.handlers[this.aliasMap[command]] ||
            this.defaultCommand;
        const currentContext = yargs.getInternalMethods().getContext();
        const parentCommands = currentContext.commands.slice();
        const isDefaultCommand = !command;
        if (command) {
            currentContext.commands.push(command);
            currentContext.fullCommands.push(commandHandler.original);
        }
        const builderResult = this.applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, parsed.aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet);
        return isPromise(builderResult)
            ? builderResult.then(result => this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, result.innerArgv, currentContext, helpOnly, result.aliases, yargs))
            : this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, builderResult.innerArgv, currentContext, helpOnly, builderResult.aliases, yargs);
    }
    applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet) {
        const builder = commandHandler.builder;
        let innerYargs = yargs;
        if (isCommandBuilderCallback(builder)) {
            const builderOutput = builder(yargs.getInternalMethods().reset(aliases), helpOrVersionSet);
            if (isPromise(builderOutput)) {
                return builderOutput.then(output => {
                    innerYargs = isYargsInstance(output) ? output : yargs;
                    return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
                });
            }
        }
        else if (isCommandBuilderOptionDefinitions(builder)) {
            innerYargs = yargs.getInternalMethods().reset(aliases);
            Object.keys(commandHandler.builder).forEach(key => {
                innerYargs.option(key, builder[key]);
            });
        }
        return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
    }
    parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly) {
        if (isDefaultCommand)
            innerYargs.getInternalMethods().getUsageInstance().unfreeze(true);
        if (this.shouldUpdateUsage(innerYargs)) {
            innerYargs
                .getInternalMethods()
                .getUsageInstance()
                .usage(this.usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
        }
        const innerArgv = innerYargs
            .getInternalMethods()
            .runYargsParserAndExecuteCommands(null, undefined, true, commandIndex, helpOnly);
        return isPromise(innerArgv)
            ? innerArgv.then(argv => ({
                aliases: innerYargs.parsed.aliases,
                innerArgv: argv,
            }))
            : {
                aliases: innerYargs.parsed.aliases,
                innerArgv: innerArgv,
            };
    }
    shouldUpdateUsage(yargs) {
        return (!yargs.getInternalMethods().getUsageInstance().getUsageDisabled() &&
            yargs.getInternalMethods().getUsageInstance().getUsage().length === 0);
    }
    usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
        const c = DEFAULT_MARKER.test(commandHandler.original)
            ? commandHandler.original.replace(DEFAULT_MARKER, '').trim()
            : commandHandler.original;
        const pc = parentCommands.filter(c => {
            return !DEFAULT_MARKER.test(c);
        });
        pc.push(c);
        return `$0 ${pc.join(' ')}`;
    }
    handleValidationAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, aliases, yargs, middlewares, positionalMap) {
        if (!yargs.getInternalMethods().getHasOutput()) {
            const validation = yargs
                .getInternalMethods()
                .runValidation(aliases, positionalMap, yargs.parsed.error, isDefaultCommand);
            innerArgv = maybeAsyncResult(innerArgv, result => {
                validation(result);
                return result;
            });
        }
        if (commandHandler.handler && !yargs.getInternalMethods().getHasOutput()) {
            yargs.getInternalMethods().setHasOutput();
            const populateDoubleDash = !!yargs.getOptions().configuration['populate--'];
            yargs
                .getInternalMethods()
                .postProcess(innerArgv, populateDoubleDash, false, false);
            innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
            innerArgv = maybeAsyncResult(innerArgv, result => {
                const handlerResult = commandHandler.handler(result);
                return isPromise(handlerResult)
                    ? handlerResult.then(() => result)
                    : result;
            });
            if (!isDefaultCommand) {
                yargs.getInternalMethods().getUsageInstance().cacheHelpMessage();
            }
            if (isPromise(innerArgv) &&
                !yargs.getInternalMethods().hasParseCallback()) {
                innerArgv.catch(error => {
                    try {
                        yargs.getInternalMethods().getUsageInstance().fail(null, error);
                    }
                    catch (_err) {
                    }
                });
            }
        }
        if (!isDefaultCommand) {
            currentContext.commands.pop();
            currentContext.fullCommands.pop();
        }
        return innerArgv;
    }
    applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, helpOnly, aliases, yargs) {
        let positionalMap = {};
        if (helpOnly)
            return innerArgv;
        if (!yargs.getInternalMethods().getHasOutput()) {
            positionalMap = this.populatePositionals(commandHandler, innerArgv, currentContext, yargs);
        }
        const middlewares = this.globalMiddleware
            .getMiddleware()
            .slice(0)
            .concat(commandHandler.middlewares);
        const maybePromiseArgv = applyMiddleware(innerArgv, yargs, middlewares, true);
        return isPromise(maybePromiseArgv)
            ? maybePromiseArgv.then(resolvedInnerArgv => this.handleValidationAndGetResult(isDefaultCommand, commandHandler, resolvedInnerArgv, currentContext, aliases, yargs, middlewares, positionalMap))
            : this.handleValidationAndGetResult(isDefaultCommand, commandHandler, maybePromiseArgv, currentContext, aliases, yargs, middlewares, positionalMap);
    }
    populatePositionals(commandHandler, argv, context, yargs) {
        argv._ = argv._.slice(context.commands.length);
        const demanded = commandHandler.demanded.slice(0);
        const optional = commandHandler.optional.slice(0);
        const positionalMap = {};
        this.validation.positionalCount(demanded.length, argv._.length);
        while (demanded.length) {
            const demand = demanded.shift();
            this.populatePositional(demand, argv, positionalMap);
        }
        while (optional.length) {
            const maybe = optional.shift();
            this.populatePositional(maybe, argv, positionalMap);
        }
        argv._ = context.commands.concat(argv._.map(a => '' + a));
        this.postProcessPositionals(argv, positionalMap, this.cmdToParseOptions(commandHandler.original), yargs);
        return positionalMap;
    }
    populatePositional(positional, argv, positionalMap) {
        const cmd = positional.cmd[0];
        if (positional.variadic) {
            positionalMap[cmd] = argv._.splice(0).map(String);
        }
        else {
            if (argv._.length)
                positionalMap[cmd] = [String(argv._.shift())];
        }
    }
    cmdToParseOptions(cmdString) {
        const parseOptions = {
            array: [],
            default: {},
            alias: {},
            demand: {},
        };
        const parsed = parseCommand(cmdString);
        parsed.demanded.forEach(d => {
            const [cmd, ...aliases] = d.cmd;
            if (d.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
            parseOptions.demand[cmd] = true;
        });
        parsed.optional.forEach(o => {
            const [cmd, ...aliases] = o.cmd;
            if (o.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
        });
        return parseOptions;
    }
    postProcessPositionals(argv, positionalMap, parseOptions, yargs) {
        const options = Object.assign({}, yargs.getOptions());
        options.default = Object.assign(parseOptions.default, options.default);
        for (const key of Object.keys(parseOptions.alias)) {
            options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
        }
        options.array = options.array.concat(parseOptions.array);
        options.config = {};
        const unparsed = [];
        Object.keys(positionalMap).forEach(key => {
            positionalMap[key].map(value => {
                if (options.configuration['unknown-options-as-args'])
                    options.key[key] = true;
                unparsed.push(`--${key}`);
                unparsed.push(value);
            });
        });
        if (!unparsed.length)
            return;
        const config = Object.assign({}, options.configuration, {
            'populate--': false,
        });
        const parsed = this.shim.Parser.detailed(unparsed, Object.assign({}, options, {
            configuration: config,
        }));
        if (parsed.error) {
            yargs
                .getInternalMethods()
                .getUsageInstance()
                .fail(parsed.error.message, parsed.error);
        }
        else {
            const positionalKeys = Object.keys(positionalMap);
            Object.keys(positionalMap).forEach(key => {
                positionalKeys.push(...parsed.aliases[key]);
            });
            Object.keys(parsed.argv).forEach(key => {
                if (positionalKeys.includes(key)) {
                    if (!positionalMap[key])
                        positionalMap[key] = parsed.argv[key];
                    if (!this.isInConfigs(yargs, key) &&
                        !this.isDefaulted(yargs, key) &&
                        Object.prototype.hasOwnProperty.call(argv, key) &&
                        Object.prototype.hasOwnProperty.call(parsed.argv, key) &&
                        (Array.isArray(argv[key]) || Array.isArray(parsed.argv[key]))) {
                        argv[key] = [].concat(argv[key], parsed.argv[key]);
                    }
                    else {
                        argv[key] = parsed.argv[key];
                    }
                }
            });
        }
    }
    isDefaulted(yargs, key) {
        const { default: defaults } = yargs.getOptions();
        return (Object.prototype.hasOwnProperty.call(defaults, key) ||
            Object.prototype.hasOwnProperty.call(defaults, this.shim.Parser.camelCase(key)));
    }
    isInConfigs(yargs, key) {
        const { configObjects } = yargs.getOptions();
        return (configObjects.some(c => Object.prototype.hasOwnProperty.call(c, key)) ||
            configObjects.some(c => Object.prototype.hasOwnProperty.call(c, this.shim.Parser.camelCase(key))));
    }
    runDefaultBuilderOn(yargs) {
        if (!this.defaultCommand)
            return;
        if (this.shouldUpdateUsage(yargs)) {
            const commandString = DEFAULT_MARKER.test(this.defaultCommand.original)
                ? this.defaultCommand.original
                : this.defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ');
            yargs
                .getInternalMethods()
                .getUsageInstance()
                .usage(commandString, this.defaultCommand.description);
        }
        const builder = this.defaultCommand.builder;
        if (isCommandBuilderCallback(builder)) {
            return builder(yargs, true);
        }
        else if (!isCommandBuilderDefinition(builder)) {
            Object.keys(builder).forEach(key => {
                yargs.option(key, builder[key]);
            });
        }
        return undefined;
    }
    moduleName(obj) {
        const mod = whichModule(obj);
        if (!mod)
            throw new Error(`No command name given for module: ${this.shim.inspect(obj)}`);
        return this.commandFromFilename(mod.filename);
    }
    commandFromFilename(filename) {
        return this.shim.path.basename(filename, this.shim.path.extname(filename));
    }
    extractDesc({ describe, description, desc }) {
        for (const test of [describe, description, desc]) {
            if (typeof test === 'string' || test === false)
                return test;
            assertNotStrictEqual(test, true, this.shim);
        }
        return false;
    }
    freeze() {
        this.frozens.push({
            handlers: this.handlers,
            aliasMap: this.aliasMap,
            defaultCommand: this.defaultCommand,
        });
    }
    unfreeze() {
        const frozen = this.frozens.pop();
        assertNotStrictEqual(frozen, undefined, this.shim);
        ({
            handlers: this.handlers,
            aliasMap: this.aliasMap,
            defaultCommand: this.defaultCommand,
        } = frozen);
    }
    reset() {
        this.handlers = {};
        this.aliasMap = {};
        this.defaultCommand = undefined;
        this.requireCache = new Set();
        return this;
    }
}
function command(usage, validation, globalMiddleware, shim) {
    return new CommandInstance(usage, validation, globalMiddleware, shim);
}
function isCommandBuilderDefinition(builder) {
    return (typeof builder === 'object' &&
        !!builder.builder &&
        typeof builder.handler === 'function');
}
function isCommandAndAliases(cmd) {
    return cmd.every(c => typeof c === 'string');
}
function isCommandBuilderCallback(builder) {
    return typeof builder === 'function';
}
function isCommandBuilderOptionDefinitions(builder) {
    return typeof builder === 'object';
}
function isCommandHandlerDefinition(cmd) {
    return typeof cmd === 'object' && !Array.isArray(cmd);
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/obj-filter.js

function objFilter(original = {}, filter = () => true) {
    const obj = {};
    objectKeys(original).forEach(key => {
        if (filter(key, original[key])) {
            obj[key] = original[key];
        }
    });
    return obj;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/set-blocking.js
function setBlocking(blocking) {
    if (typeof process === 'undefined')
        return;
    [process.stdout, process.stderr].forEach(_stream => {
        const stream = _stream;
        if (stream._handle &&
            stream.isTTY &&
            typeof stream._handle.setBlocking === 'function') {
            stream._handle.setBlocking(blocking);
        }
    });
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/usage.js



function isBoolean(fail) {
    return typeof fail === 'boolean';
}
function usage(yargs, shim) {
    const __ = shim.y18n.__;
    const self = {};
    const fails = [];
    self.failFn = function failFn(f) {
        fails.push(f);
    };
    let failMessage = null;
    let globalFailMessage = null;
    let showHelpOnFail = true;
    self.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
        const [enabled, message] = typeof arg1 === 'string' ? [true, arg1] : [arg1, arg2];
        if (yargs.getInternalMethods().isGlobalContext()) {
            globalFailMessage = message;
        }
        failMessage = message;
        showHelpOnFail = enabled;
        return self;
    };
    let failureOutput = false;
    self.fail = function fail(msg, err) {
        const logger = yargs.getInternalMethods().getLoggerInstance();
        if (fails.length) {
            for (let i = fails.length - 1; i >= 0; --i) {
                const fail = fails[i];
                if (isBoolean(fail)) {
                    if (err)
                        throw err;
                    else if (msg)
                        throw Error(msg);
                }
                else {
                    fail(msg, err, self);
                }
            }
        }
        else {
            if (yargs.getExitProcess())
                setBlocking(true);
            if (!failureOutput) {
                failureOutput = true;
                if (showHelpOnFail) {
                    yargs.showHelp('error');
                    logger.error();
                }
                if (msg || err)
                    logger.error(msg || err);
                const globalOrCommandFailMessage = failMessage || globalFailMessage;
                if (globalOrCommandFailMessage) {
                    if (msg || err)
                        logger.error('');
                    logger.error(globalOrCommandFailMessage);
                }
            }
            err = err || new YError(msg);
            if (yargs.getExitProcess()) {
                return yargs.exit(1);
            }
            else if (yargs.getInternalMethods().hasParseCallback()) {
                return yargs.exit(1, err);
            }
            else {
                throw err;
            }
        }
    };
    let usages = [];
    let usageDisabled = false;
    self.usage = (msg, description) => {
        if (msg === null) {
            usageDisabled = true;
            usages = [];
            return self;
        }
        usageDisabled = false;
        usages.push([msg, description || '']);
        return self;
    };
    self.getUsage = () => {
        return usages;
    };
    self.getUsageDisabled = () => {
        return usageDisabled;
    };
    self.getPositionalGroupName = () => {
        return __('Positionals:');
    };
    let examples = [];
    self.example = (cmd, description) => {
        examples.push([cmd, description || '']);
    };
    let commands = [];
    self.command = function command(cmd, description, isDefault, aliases, deprecated = false) {
        if (isDefault) {
            commands = commands.map(cmdArray => {
                cmdArray[2] = false;
                return cmdArray;
            });
        }
        commands.push([cmd, description || '', isDefault, aliases, deprecated]);
    };
    self.getCommands = () => commands;
    let descriptions = {};
    self.describe = function describe(keyOrKeys, desc) {
        if (Array.isArray(keyOrKeys)) {
            keyOrKeys.forEach(k => {
                self.describe(k, desc);
            });
        }
        else if (typeof keyOrKeys === 'object') {
            Object.keys(keyOrKeys).forEach(k => {
                self.describe(k, keyOrKeys[k]);
            });
        }
        else {
            descriptions[keyOrKeys] = desc;
        }
    };
    self.getDescriptions = () => descriptions;
    let epilogs = [];
    self.epilog = msg => {
        epilogs.push(msg);
    };
    let wrapSet = false;
    let wrap;
    self.wrap = cols => {
        wrapSet = true;
        wrap = cols;
    };
    function getWrap() {
        if (!wrapSet) {
            wrap = windowWidth();
            wrapSet = true;
        }
        return wrap;
    }
    const deferY18nLookupPrefix = '__yargsString__:';
    self.deferY18nLookup = str => deferY18nLookupPrefix + str;
    self.help = function help() {
        if (cachedHelpMessage)
            return cachedHelpMessage;
        normalizeAliases();
        const base$0 = yargs.customScriptName
            ? yargs.$0
            : shim.path.basename(yargs.$0);
        const demandedOptions = yargs.getDemandedOptions();
        const demandedCommands = yargs.getDemandedCommands();
        const deprecatedOptions = yargs.getDeprecatedOptions();
        const groups = yargs.getGroups();
        const options = yargs.getOptions();
        let keys = [];
        keys = keys.concat(Object.keys(descriptions));
        keys = keys.concat(Object.keys(demandedOptions));
        keys = keys.concat(Object.keys(demandedCommands));
        keys = keys.concat(Object.keys(options.default));
        keys = keys.filter(filterHiddenOptions);
        keys = Object.keys(keys.reduce((acc, key) => {
            if (key !== '_')
                acc[key] = true;
            return acc;
        }, {}));
        const theWrap = getWrap();
        const ui = shim.cliui({
            width: theWrap,
            wrap: !!theWrap,
        });
        if (!usageDisabled) {
            if (usages.length) {
                usages.forEach(usage => {
                    ui.div({ text: `${usage[0].replace(/\$0/g, base$0)}` });
                    if (usage[1]) {
                        ui.div({ text: `${usage[1]}`, padding: [1, 0, 0, 0] });
                    }
                });
                ui.div();
            }
            else if (commands.length) {
                let u = null;
                if (demandedCommands._) {
                    u = `${base$0} <${__('command')}>\n`;
                }
                else {
                    u = `${base$0} [${__('command')}]\n`;
                }
                ui.div(`${u}`);
            }
        }
        if (commands.length > 1 || (commands.length === 1 && !commands[0][2])) {
            ui.div(__('Commands:'));
            const context = yargs.getInternalMethods().getContext();
            const parentCommands = context.commands.length
                ? `${context.commands.join(' ')} `
                : '';
            if (yargs.getInternalMethods().getParserConfiguration()['sort-commands'] ===
                true) {
                commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
            }
            const prefix = base$0 ? `${base$0} ` : '';
            commands.forEach(command => {
                const commandString = `${prefix}${parentCommands}${command[0].replace(/^\$0 ?/, '')}`;
                ui.span({
                    text: commandString,
                    padding: [0, 2, 0, 2],
                    width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4,
                }, { text: command[1] });
                const hints = [];
                if (command[2])
                    hints.push(`[${__('default')}]`);
                if (command[3] && command[3].length) {
                    hints.push(`[${__('aliases:')} ${command[3].join(', ')}]`);
                }
                if (command[4]) {
                    if (typeof command[4] === 'string') {
                        hints.push(`[${__('deprecated: %s', command[4])}]`);
                    }
                    else {
                        hints.push(`[${__('deprecated')}]`);
                    }
                }
                if (hints.length) {
                    ui.div({
                        text: hints.join(' '),
                        padding: [0, 0, 0, 2],
                        align: 'right',
                    });
                }
                else {
                    ui.div();
                }
            });
            ui.div();
        }
        const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || []);
        keys = keys.filter(key => !yargs.parsed.newAliases[key] &&
            aliasKeys.every(alias => (options.alias[alias] || []).indexOf(key) === -1));
        const defaultGroup = __('Options:');
        if (!groups[defaultGroup])
            groups[defaultGroup] = [];
        addUngroupedKeys(keys, options.alias, groups, defaultGroup);
        const isLongSwitch = (sw) => /^--/.test(getText(sw));
        const displayedGroups = Object.keys(groups)
            .filter(groupName => groups[groupName].length > 0)
            .map(groupName => {
            const normalizedKeys = groups[groupName]
                .filter(filterHiddenOptions)
                .map(key => {
                if (aliasKeys.includes(key))
                    return key;
                for (let i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== undefined; i++) {
                    if ((options.alias[aliasKey] || []).includes(key))
                        return aliasKey;
                }
                return key;
            });
            return { groupName, normalizedKeys };
        })
            .filter(({ normalizedKeys }) => normalizedKeys.length > 0)
            .map(({ groupName, normalizedKeys }) => {
            const switches = normalizedKeys.reduce((acc, key) => {
                acc[key] = [key]
                    .concat(options.alias[key] || [])
                    .map(sw => {
                    if (groupName === self.getPositionalGroupName())
                        return sw;
                    else {
                        return ((/^[0-9]$/.test(sw)
                            ? options.boolean.includes(key)
                                ? '-'
                                : '--'
                            : sw.length > 1
                                ? '--'
                                : '-') + sw);
                    }
                })
                    .sort((sw1, sw2) => isLongSwitch(sw1) === isLongSwitch(sw2)
                    ? 0
                    : isLongSwitch(sw1)
                        ? 1
                        : -1)
                    .join(', ');
                return acc;
            }, {});
            return { groupName, normalizedKeys, switches };
        });
        const shortSwitchesUsed = displayedGroups
            .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
            .some(({ normalizedKeys, switches }) => !normalizedKeys.every(key => isLongSwitch(switches[key])));
        if (shortSwitchesUsed) {
            displayedGroups
                .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
                .forEach(({ normalizedKeys, switches }) => {
                normalizedKeys.forEach(key => {
                    if (isLongSwitch(switches[key])) {
                        switches[key] = addIndentation(switches[key], '-x, '.length);
                    }
                });
            });
        }
        displayedGroups.forEach(({ groupName, normalizedKeys, switches }) => {
            ui.div(groupName);
            normalizedKeys.forEach(key => {
                const kswitch = switches[key];
                let desc = descriptions[key] || '';
                let type = null;
                if (desc.includes(deferY18nLookupPrefix))
                    desc = __(desc.substring(deferY18nLookupPrefix.length));
                if (options.boolean.includes(key))
                    type = `[${__('boolean')}]`;
                if (options.count.includes(key))
                    type = `[${__('count')}]`;
                if (options.string.includes(key))
                    type = `[${__('string')}]`;
                if (options.normalize.includes(key))
                    type = `[${__('string')}]`;
                if (options.array.includes(key))
                    type = `[${__('array')}]`;
                if (options.number.includes(key))
                    type = `[${__('number')}]`;
                const deprecatedExtra = (deprecated) => typeof deprecated === 'string'
                    ? `[${__('deprecated: %s', deprecated)}]`
                    : `[${__('deprecated')}]`;
                const extra = [
                    key in deprecatedOptions
                        ? deprecatedExtra(deprecatedOptions[key])
                        : null,
                    type,
                    key in demandedOptions ? `[${__('required')}]` : null,
                    options.choices && options.choices[key]
                        ? `[${__('choices:')} ${self.stringifiedValues(options.choices[key])}]`
                        : null,
                    defaultString(options.default[key], options.defaultDescription[key]),
                ]
                    .filter(Boolean)
                    .join(' ');
                ui.span({
                    text: getText(kswitch),
                    padding: [0, 2, 0, 2 + getIndentation(kswitch)],
                    width: maxWidth(switches, theWrap) + 4,
                }, desc);
                if (extra)
                    ui.div({ text: extra, padding: [0, 0, 0, 2], align: 'right' });
                else
                    ui.div();
            });
            ui.div();
        });
        if (examples.length) {
            ui.div(__('Examples:'));
            examples.forEach(example => {
                example[0] = example[0].replace(/\$0/g, base$0);
            });
            examples.forEach(example => {
                if (example[1] === '') {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2],
                    });
                }
                else {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2],
                        width: maxWidth(examples, theWrap) + 4,
                    }, {
                        text: example[1],
                    });
                }
            });
            ui.div();
        }
        if (epilogs.length > 0) {
            const e = epilogs
                .map(epilog => epilog.replace(/\$0/g, base$0))
                .join('\n');
            ui.div(`${e}\n`);
        }
        return ui.toString().replace(/\s*$/, '');
    };
    function maxWidth(table, theWrap, modifier) {
        let width = 0;
        if (!Array.isArray(table)) {
            table = Object.values(table).map(v => [v]);
        }
        table.forEach(v => {
            width = Math.max(shim.stringWidth(modifier ? `${modifier} ${getText(v[0])}` : getText(v[0])) + getIndentation(v[0]), width);
        });
        if (theWrap)
            width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
        return width;
    }
    function normalizeAliases() {
        const demandedOptions = yargs.getDemandedOptions();
        const options = yargs.getOptions();
        (Object.keys(options.alias) || []).forEach(key => {
            options.alias[key].forEach(alias => {
                if (descriptions[alias])
                    self.describe(key, descriptions[alias]);
                if (alias in demandedOptions)
                    yargs.demandOption(key, demandedOptions[alias]);
                if (options.boolean.includes(alias))
                    yargs.boolean(key);
                if (options.count.includes(alias))
                    yargs.count(key);
                if (options.string.includes(alias))
                    yargs.string(key);
                if (options.normalize.includes(alias))
                    yargs.normalize(key);
                if (options.array.includes(alias))
                    yargs.array(key);
                if (options.number.includes(alias))
                    yargs.number(key);
            });
        });
    }
    let cachedHelpMessage;
    self.cacheHelpMessage = function () {
        cachedHelpMessage = this.help();
    };
    self.clearCachedHelpMessage = function () {
        cachedHelpMessage = undefined;
    };
    self.hasCachedHelpMessage = function () {
        return !!cachedHelpMessage;
    };
    function addUngroupedKeys(keys, aliases, groups, defaultGroup) {
        let groupedKeys = [];
        let toCheck = null;
        Object.keys(groups).forEach(group => {
            groupedKeys = groupedKeys.concat(groups[group]);
        });
        keys.forEach(key => {
            toCheck = [key].concat(aliases[key]);
            if (!toCheck.some(k => groupedKeys.indexOf(k) !== -1)) {
                groups[defaultGroup].push(key);
            }
        });
        return groupedKeys;
    }
    function filterHiddenOptions(key) {
        return (yargs.getOptions().hiddenOptions.indexOf(key) < 0 ||
            yargs.parsed.argv[yargs.getOptions().showHiddenOpt]);
    }
    self.showHelp = (level) => {
        const logger = yargs.getInternalMethods().getLoggerInstance();
        if (!level)
            level = 'error';
        const emit = typeof level === 'function' ? level : logger[level];
        emit(self.help());
    };
    self.functionDescription = fn => {
        const description = fn.name
            ? shim.Parser.decamelize(fn.name, '-')
            : __('generated-value');
        return ['(', description, ')'].join('');
    };
    self.stringifiedValues = function stringifiedValues(values, separator) {
        let string = '';
        const sep = separator || ', ';
        const array = [].concat(values);
        if (!values || !array.length)
            return string;
        array.forEach(value => {
            if (string.length)
                string += sep;
            string += JSON.stringify(value);
        });
        return string;
    };
    function defaultString(value, defaultDescription) {
        let string = `[${__('default:')} `;
        if (value === undefined && !defaultDescription)
            return null;
        if (defaultDescription) {
            string += defaultDescription;
        }
        else {
            switch (typeof value) {
                case 'string':
                    string += `"${value}"`;
                    break;
                case 'object':
                    string += JSON.stringify(value);
                    break;
                default:
                    string += value;
            }
        }
        return `${string}]`;
    }
    function windowWidth() {
        const maxWidth = 80;
        if (shim.process.stdColumns) {
            return Math.min(maxWidth, shim.process.stdColumns);
        }
        else {
            return maxWidth;
        }
    }
    let version = null;
    self.version = ver => {
        version = ver;
    };
    self.showVersion = level => {
        const logger = yargs.getInternalMethods().getLoggerInstance();
        if (!level)
            level = 'error';
        const emit = typeof level === 'function' ? level : logger[level];
        emit(version);
    };
    self.reset = function reset(localLookup) {
        failMessage = null;
        failureOutput = false;
        usages = [];
        usageDisabled = false;
        epilogs = [];
        examples = [];
        commands = [];
        descriptions = objFilter(descriptions, k => !localLookup[k]);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            failMessage,
            failureOutput,
            usages,
            usageDisabled,
            epilogs,
            examples,
            commands,
            descriptions,
        });
    };
    self.unfreeze = function unfreeze(defaultCommand = false) {
        const frozen = frozens.pop();
        if (!frozen)
            return;
        if (defaultCommand) {
            descriptions = { ...frozen.descriptions, ...descriptions };
            commands = [...frozen.commands, ...commands];
            usages = [...frozen.usages, ...usages];
            examples = [...frozen.examples, ...examples];
            epilogs = [...frozen.epilogs, ...epilogs];
        }
        else {
            ({
                failMessage,
                failureOutput,
                usages,
                usageDisabled,
                epilogs,
                examples,
                commands,
                descriptions,
            } = frozen);
        }
    };
    return self;
}
function isIndentedText(text) {
    return typeof text === 'object';
}
function addIndentation(text, indent) {
    return isIndentedText(text)
        ? { text: text.text, indentation: text.indentation + indent }
        : { text, indentation: indent };
}
function getIndentation(text) {
    return isIndentedText(text) ? text.indentation : 0;
}
function getText(text) {
    return isIndentedText(text) ? text.text : text;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/completion-templates.js
const completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
const completionZshTemplate = `#compdef {{app_name}}
###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zprofile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/completion.js





class Completion {
    constructor(yargs, usage, command, shim) {
        var _a, _b, _c;
        this.yargs = yargs;
        this.usage = usage;
        this.command = command;
        this.shim = shim;
        this.completionKey = 'get-yargs-completions';
        this.aliases = null;
        this.customCompletionFunction = null;
        this.indexAfterLastReset = 0;
        this.zshShell =
            (_c = (((_a = this.shim.getEnv('SHELL')) === null || _a === void 0 ? void 0 : _a.includes('zsh')) ||
                ((_b = this.shim.getEnv('ZSH_NAME')) === null || _b === void 0 ? void 0 : _b.includes('zsh')))) !== null && _c !== void 0 ? _c : false;
    }
    defaultCompletion(args, argv, current, done) {
        const handlers = this.command.getCommandHandlers();
        for (let i = 0, ii = args.length; i < ii; ++i) {
            if (handlers[args[i]] && handlers[args[i]].builder) {
                const builder = handlers[args[i]].builder;
                if (isCommandBuilderCallback(builder)) {
                    this.indexAfterLastReset = i + 1;
                    const y = this.yargs.getInternalMethods().reset();
                    builder(y, true);
                    return y.argv;
                }
            }
        }
        const completions = [];
        this.commandCompletions(completions, args, current);
        this.optionCompletions(completions, args, argv, current);
        this.choicesFromOptionsCompletions(completions, args, argv, current);
        this.choicesFromPositionalsCompletions(completions, args, argv, current);
        done(null, completions);
    }
    commandCompletions(completions, args, current) {
        const parentCommands = this.yargs
            .getInternalMethods()
            .getContext().commands;
        if (!current.match(/^-/) &&
            parentCommands[parentCommands.length - 1] !== current &&
            !this.previousArgHasChoices(args)) {
            this.usage.getCommands().forEach(usageCommand => {
                const commandName = parseCommand(usageCommand[0]).cmd;
                if (args.indexOf(commandName) === -1) {
                    if (!this.zshShell) {
                        completions.push(commandName);
                    }
                    else {
                        const desc = usageCommand[1] || '';
                        completions.push(commandName.replace(/:/g, '\\:') + ':' + desc);
                    }
                }
            });
        }
    }
    optionCompletions(completions, args, argv, current) {
        if ((current.match(/^-/) || (current === '' && completions.length === 0)) &&
            !this.previousArgHasChoices(args)) {
            const options = this.yargs.getOptions();
            const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
            Object.keys(options.key).forEach(key => {
                const negable = !!options.configuration['boolean-negation'] &&
                    options.boolean.includes(key);
                const isPositionalKey = positionalKeys.includes(key);
                if (!isPositionalKey &&
                    !options.hiddenOptions.includes(key) &&
                    !this.argsContainKey(args, key, negable)) {
                    this.completeOptionKey(key, completions, current);
                    if (negable && !!options.default[key])
                        this.completeOptionKey(`no-${key}`, completions, current);
                }
            });
        }
    }
    choicesFromOptionsCompletions(completions, args, argv, current) {
        if (this.previousArgHasChoices(args)) {
            const choices = this.getPreviousArgChoices(args);
            if (choices && choices.length > 0) {
                completions.push(...choices.map(c => c.replace(/:/g, '\\:')));
            }
        }
    }
    choicesFromPositionalsCompletions(completions, args, argv, current) {
        if (current === '' &&
            completions.length > 0 &&
            this.previousArgHasChoices(args)) {
            return;
        }
        const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
        const offset = Math.max(this.indexAfterLastReset, this.yargs.getInternalMethods().getContext().commands.length +
            1);
        const positionalKey = positionalKeys[argv._.length - offset - 1];
        if (!positionalKey) {
            return;
        }
        const choices = this.yargs.getOptions().choices[positionalKey] || [];
        for (const choice of choices) {
            if (choice.startsWith(current)) {
                completions.push(choice.replace(/:/g, '\\:'));
            }
        }
    }
    getPreviousArgChoices(args) {
        if (args.length < 1)
            return;
        let previousArg = args[args.length - 1];
        let filter = '';
        if (!previousArg.startsWith('-') && args.length > 1) {
            filter = previousArg;
            previousArg = args[args.length - 2];
        }
        if (!previousArg.startsWith('-'))
            return;
        const previousArgKey = previousArg.replace(/^-+/, '');
        const options = this.yargs.getOptions();
        const possibleAliases = [
            previousArgKey,
            ...(this.yargs.getAliases()[previousArgKey] || []),
        ];
        let choices;
        for (const possibleAlias of possibleAliases) {
            if (Object.prototype.hasOwnProperty.call(options.key, possibleAlias) &&
                Array.isArray(options.choices[possibleAlias])) {
                choices = options.choices[possibleAlias];
                break;
            }
        }
        if (choices) {
            return choices.filter(choice => !filter || choice.startsWith(filter));
        }
    }
    previousArgHasChoices(args) {
        const choices = this.getPreviousArgChoices(args);
        return choices !== undefined && choices.length > 0;
    }
    argsContainKey(args, key, negable) {
        const argsContains = (s) => args.indexOf((/^[^0-9]$/.test(s) ? '-' : '--') + s) !== -1;
        if (argsContains(key))
            return true;
        if (negable && argsContains(`no-${key}`))
            return true;
        if (this.aliases) {
            for (const alias of this.aliases[key]) {
                if (argsContains(alias))
                    return true;
            }
        }
        return false;
    }
    completeOptionKey(key, completions, current) {
        const descs = this.usage.getDescriptions();
        const startsByTwoDashes = (s) => /^--/.test(s);
        const isShortOption = (s) => /^[^0-9]$/.test(s);
        const dashes = !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';
        if (!this.zshShell) {
            completions.push(dashes + key);
        }
        else {
            const desc = descs[key] || '';
            completions.push(dashes +
                `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`);
        }
    }
    customCompletion(args, argv, current, done) {
        assertNotStrictEqual(this.customCompletionFunction, null, this.shim);
        if (isSyncCompletionFunction(this.customCompletionFunction)) {
            const result = this.customCompletionFunction(current, argv);
            if (isPromise(result)) {
                return result
                    .then(list => {
                    this.shim.process.nextTick(() => {
                        done(null, list);
                    });
                })
                    .catch(err => {
                    this.shim.process.nextTick(() => {
                        done(err, undefined);
                    });
                });
            }
            return done(null, result);
        }
        else if (isFallbackCompletionFunction(this.customCompletionFunction)) {
            return this.customCompletionFunction(current, argv, (onCompleted = done) => this.defaultCompletion(args, argv, current, onCompleted), completions => {
                done(null, completions);
            });
        }
        else {
            return this.customCompletionFunction(current, argv, completions => {
                done(null, completions);
            });
        }
    }
    getCompletion(args, done) {
        const current = args.length ? args[args.length - 1] : '';
        const argv = this.yargs.parse(args, true);
        const completionFunction = this.customCompletionFunction
            ? (argv) => this.customCompletion(args, argv, current, done)
            : (argv) => this.defaultCompletion(args, argv, current, done);
        return isPromise(argv)
            ? argv.then(completionFunction)
            : completionFunction(argv);
    }
    generateCompletionScript($0, cmd) {
        let script = this.zshShell
            ? completionZshTemplate
            : completionShTemplate;
        const name = this.shim.path.basename($0);
        if ($0.match(/\.js$/))
            $0 = `./${$0}`;
        script = script.replace(/{{app_name}}/g, name);
        script = script.replace(/{{completion_command}}/g, cmd);
        return script.replace(/{{app_path}}/g, $0);
    }
    registerFunction(fn) {
        this.customCompletionFunction = fn;
    }
    setParsed(parsed) {
        this.aliases = parsed.aliases;
    }
}
function completion(yargs, usage, command, shim) {
    return new Completion(yargs, usage, command, shim);
}
function isSyncCompletionFunction(completionFunction) {
    return completionFunction.length < 3;
}
function isFallbackCompletionFunction(completionFunction) {
    return completionFunction.length > 3;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/levenshtein.js
function levenshtein(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                if (i > 1 &&
                    j > 1 &&
                    b.charAt(i - 2) === a.charAt(j - 1) &&
                    b.charAt(i - 1) === a.charAt(j - 2)) {
                    matrix[i][j] = matrix[i - 2][j - 2] + 1;
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
    }
    return matrix[b.length][a.length];
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/validation.js




const specialKeys = ['$0', '--', '_'];
function validation(yargs, usage, shim) {
    const __ = shim.y18n.__;
    const __n = shim.y18n.__n;
    const self = {};
    self.nonOptionCount = function nonOptionCount(argv) {
        const demandedCommands = yargs.getDemandedCommands();
        const positionalCount = argv._.length + (argv['--'] ? argv['--'].length : 0);
        const _s = positionalCount - yargs.getInternalMethods().getContext().commands.length;
        if (demandedCommands._ &&
            (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
            if (_s < demandedCommands._.min) {
                if (demandedCommands._.minMsg !== undefined) {
                    usage.fail(demandedCommands._.minMsg
                        ? demandedCommands._.minMsg
                            .replace(/\$0/g, _s.toString())
                            .replace(/\$1/, demandedCommands._.min.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', _s, _s.toString(), demandedCommands._.min.toString()));
                }
            }
            else if (_s > demandedCommands._.max) {
                if (demandedCommands._.maxMsg !== undefined) {
                    usage.fail(demandedCommands._.maxMsg
                        ? demandedCommands._.maxMsg
                            .replace(/\$0/g, _s.toString())
                            .replace(/\$1/, demandedCommands._.max.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Too many non-option arguments: got %s, maximum of %s', 'Too many non-option arguments: got %s, maximum of %s', _s, _s.toString(), demandedCommands._.max.toString()));
                }
            }
        }
    };
    self.positionalCount = function positionalCount(required, observed) {
        if (observed < required) {
            usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', observed, observed + '', required + ''));
        }
    };
    self.requiredArguments = function requiredArguments(argv, demandedOptions) {
        let missing = null;
        for (const key of Object.keys(demandedOptions)) {
            if (!Object.prototype.hasOwnProperty.call(argv, key) ||
                typeof argv[key] === 'undefined') {
                missing = missing || {};
                missing[key] = demandedOptions[key];
            }
        }
        if (missing) {
            const customMsgs = [];
            for (const key of Object.keys(missing)) {
                const msg = missing[key];
                if (msg && customMsgs.indexOf(msg) < 0) {
                    customMsgs.push(msg);
                }
            }
            const customMsg = customMsgs.length ? `\n${customMsgs.join('\n')}` : '';
            usage.fail(__n('Missing required argument: %s', 'Missing required arguments: %s', Object.keys(missing).length, Object.keys(missing).join(', ') + customMsg));
        }
    };
    self.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand, checkPositionals = true) {
        var _a;
        const commandKeys = yargs
            .getInternalMethods()
            .getCommandInstance()
            .getCommands();
        const unknown = [];
        const currentContext = yargs.getInternalMethods().getContext();
        Object.keys(argv).forEach(key => {
            if (!specialKeys.includes(key) &&
                !Object.prototype.hasOwnProperty.call(positionalMap, key) &&
                !Object.prototype.hasOwnProperty.call(yargs.getInternalMethods().getParseContext(), key) &&
                !self.isValidAndSomeAliasIsNotNew(key, aliases)) {
                unknown.push(key);
            }
        });
        if (checkPositionals &&
            (currentContext.commands.length > 0 ||
                commandKeys.length > 0 ||
                isDefaultCommand)) {
            argv._.slice(currentContext.commands.length).forEach(key => {
                if (!commandKeys.includes('' + key)) {
                    unknown.push('' + key);
                }
            });
        }
        if (checkPositionals) {
            const demandedCommands = yargs.getDemandedCommands();
            const maxNonOptDemanded = ((_a = demandedCommands._) === null || _a === void 0 ? void 0 : _a.max) || 0;
            const expected = currentContext.commands.length + maxNonOptDemanded;
            if (expected < argv._.length) {
                argv._.slice(expected).forEach(key => {
                    key = String(key);
                    if (!currentContext.commands.includes(key) &&
                        !unknown.includes(key)) {
                        unknown.push(key);
                    }
                });
            }
        }
        if (unknown.length) {
            usage.fail(__n('Unknown argument: %s', 'Unknown arguments: %s', unknown.length, unknown.map(s => (s.trim() ? s : `"${s}"`)).join(', ')));
        }
    };
    self.unknownCommands = function unknownCommands(argv) {
        const commandKeys = yargs
            .getInternalMethods()
            .getCommandInstance()
            .getCommands();
        const unknown = [];
        const currentContext = yargs.getInternalMethods().getContext();
        if (currentContext.commands.length > 0 || commandKeys.length > 0) {
            argv._.slice(currentContext.commands.length).forEach(key => {
                if (!commandKeys.includes('' + key)) {
                    unknown.push('' + key);
                }
            });
        }
        if (unknown.length > 0) {
            usage.fail(__n('Unknown command: %s', 'Unknown commands: %s', unknown.length, unknown.join(', ')));
            return true;
        }
        else {
            return false;
        }
    };
    self.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
        if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
            return false;
        }
        const newAliases = yargs.parsed.newAliases;
        return [key, ...aliases[key]].some(a => !Object.prototype.hasOwnProperty.call(newAliases, a) || !newAliases[key]);
    };
    self.limitedChoices = function limitedChoices(argv) {
        const options = yargs.getOptions();
        const invalid = {};
        if (!Object.keys(options.choices).length)
            return;
        Object.keys(argv).forEach(key => {
            if (specialKeys.indexOf(key) === -1 &&
                Object.prototype.hasOwnProperty.call(options.choices, key)) {
                [].concat(argv[key]).forEach(value => {
                    if (options.choices[key].indexOf(value) === -1 &&
                        value !== undefined) {
                        invalid[key] = (invalid[key] || []).concat(value);
                    }
                });
            }
        });
        const invalidKeys = Object.keys(invalid);
        if (!invalidKeys.length)
            return;
        let msg = __('Invalid values:');
        invalidKeys.forEach(key => {
            msg += `\n  ${__('Argument: %s, Given: %s, Choices: %s', key, usage.stringifiedValues(invalid[key]), usage.stringifiedValues(options.choices[key]))}`;
        });
        usage.fail(msg);
    };
    let implied = {};
    self.implies = function implies(key, value) {
        argsert('<string|object> [array|number|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                self.implies(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!implied[key]) {
                implied[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach(i => self.implies(key, i));
            }
            else {
                assertNotStrictEqual(value, undefined, shim);
                implied[key].push(value);
            }
        }
    };
    self.getImplied = function getImplied() {
        return implied;
    };
    function keyExists(argv, val) {
        const num = Number(val);
        val = isNaN(num) ? val : num;
        if (typeof val === 'number') {
            val = argv._.length >= val;
        }
        else if (val.match(/^--no-.+/)) {
            val = val.match(/^--no-(.+)/)[1];
            val = !Object.prototype.hasOwnProperty.call(argv, val);
        }
        else {
            val = Object.prototype.hasOwnProperty.call(argv, val);
        }
        return val;
    }
    self.implications = function implications(argv) {
        const implyFail = [];
        Object.keys(implied).forEach(key => {
            const origKey = key;
            (implied[key] || []).forEach(value => {
                let key = origKey;
                const origValue = value;
                key = keyExists(argv, key);
                value = keyExists(argv, value);
                if (key && !value) {
                    implyFail.push(` ${origKey} -> ${origValue}`);
                }
            });
        });
        if (implyFail.length) {
            let msg = `${__('Implications failed:')}\n`;
            implyFail.forEach(value => {
                msg += value;
            });
            usage.fail(msg);
        }
    };
    let conflicting = {};
    self.conflicts = function conflicts(key, value) {
        argsert('<string|object> [array|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                self.conflicts(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!conflicting[key]) {
                conflicting[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach(i => self.conflicts(key, i));
            }
            else {
                conflicting[key].push(value);
            }
        }
    };
    self.getConflicting = () => conflicting;
    self.conflicting = function conflictingFn(argv) {
        Object.keys(argv).forEach(key => {
            if (conflicting[key]) {
                conflicting[key].forEach(value => {
                    if (value && argv[key] !== undefined && argv[value] !== undefined) {
                        usage.fail(__('Arguments %s and %s are mutually exclusive', key, value));
                    }
                });
            }
        });
        if (yargs.getInternalMethods().getParserConfiguration()['strip-dashed']) {
            Object.keys(conflicting).forEach(key => {
                conflicting[key].forEach(value => {
                    if (value &&
                        argv[shim.Parser.camelCase(key)] !== undefined &&
                        argv[shim.Parser.camelCase(value)] !== undefined) {
                        usage.fail(__('Arguments %s and %s are mutually exclusive', key, value));
                    }
                });
            });
        }
    };
    self.recommendCommands = function recommendCommands(cmd, potentialCommands) {
        const threshold = 3;
        potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
        let recommended = null;
        let bestDistance = Infinity;
        for (let i = 0, candidate; (candidate = potentialCommands[i]) !== undefined; i++) {
            const d = levenshtein(cmd, candidate);
            if (d <= threshold && d < bestDistance) {
                bestDistance = d;
                recommended = candidate;
            }
        }
        if (recommended)
            usage.fail(__('Did you mean %s?', recommended));
    };
    self.reset = function reset(localLookup) {
        implied = objFilter(implied, k => !localLookup[k]);
        conflicting = objFilter(conflicting, k => !localLookup[k]);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            implied,
            conflicting,
        });
    };
    self.unfreeze = function unfreeze() {
        const frozen = frozens.pop();
        assertNotStrictEqual(frozen, undefined, shim);
        ({ implied, conflicting } = frozen);
    };
    return self;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/utils/apply-extends.js

let previouslyVisitedConfigs = [];
let apply_extends_shim;
function applyExtends(config, cwd, mergeExtends, _shim) {
    apply_extends_shim = _shim;
    let defaultConfig = {};
    if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
        if (typeof config.extends !== 'string')
            return defaultConfig;
        const isPath = /\.json|\..*rc$/.test(config.extends);
        let pathToDefault = null;
        if (!isPath) {
            try {
                pathToDefault = require.resolve(config.extends);
            }
            catch (_err) {
                return config;
            }
        }
        else {
            pathToDefault = getPathToDefaultConfig(cwd, config.extends);
        }
        checkForCircularExtends(pathToDefault);
        previouslyVisitedConfigs.push(pathToDefault);
        defaultConfig = isPath
            ? JSON.parse(apply_extends_shim.readFileSync(pathToDefault, 'utf8'))
            : require(config.extends);
        delete config.extends;
        defaultConfig = applyExtends(defaultConfig, apply_extends_shim.path.dirname(pathToDefault), mergeExtends, apply_extends_shim);
    }
    previouslyVisitedConfigs = [];
    return mergeExtends
        ? mergeDeep(defaultConfig, config)
        : Object.assign({}, defaultConfig, config);
}
function checkForCircularExtends(cfgPath) {
    if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
        throw new YError(`Circular extended configurations: '${cfgPath}'.`);
    }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
    return apply_extends_shim.path.resolve(cwd, pathToExtend);
}
function mergeDeep(config1, config2) {
    const target = {};
    function isObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
    Object.assign(target, config1);
    for (const key of Object.keys(config2)) {
        if (isObject(config2[key]) && isObject(target[key])) {
            target[key] = mergeDeep(config1[key], config2[key]);
        }
        else {
            target[key] = config2[key];
        }
    }
    return target;
}

;// CONCATENATED MODULE: ./node_modules/yargs/build/lib/yargs-factory.js
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _YargsInstance_command, _YargsInstance_cwd, _YargsInstance_context, _YargsInstance_completion, _YargsInstance_completionCommand, _YargsInstance_defaultShowHiddenOpt, _YargsInstance_exitError, _YargsInstance_detectLocale, _YargsInstance_emittedWarnings, _YargsInstance_exitProcess, _YargsInstance_frozens, _YargsInstance_globalMiddleware, _YargsInstance_groups, _YargsInstance_hasOutput, _YargsInstance_helpOpt, _YargsInstance_isGlobalContext, _YargsInstance_logger, _YargsInstance_output, _YargsInstance_options, _YargsInstance_parentRequire, _YargsInstance_parserConfig, _YargsInstance_parseFn, _YargsInstance_parseContext, _YargsInstance_pkgs, _YargsInstance_preservedGroups, _YargsInstance_processArgs, _YargsInstance_recommendCommands, _YargsInstance_shim, _YargsInstance_strict, _YargsInstance_strictCommands, _YargsInstance_strictOptions, _YargsInstance_usage, _YargsInstance_versionOpt, _YargsInstance_validation;













function YargsFactory(_shim) {
    return (processArgs = [], cwd = _shim.process.cwd(), parentRequire) => {
        const yargs = new YargsInstance(processArgs, cwd, parentRequire, _shim);
        Object.defineProperty(yargs, 'argv', {
            get: () => {
                return yargs.parse();
            },
            enumerable: true,
        });
        yargs.help();
        yargs.version();
        return yargs;
    };
}
const kCopyDoubleDash = Symbol('copyDoubleDash');
const kCreateLogger = Symbol('copyDoubleDash');
const kDeleteFromParserHintObject = Symbol('deleteFromParserHintObject');
const kEmitWarning = Symbol('emitWarning');
const kFreeze = Symbol('freeze');
const kGetDollarZero = Symbol('getDollarZero');
const kGetParserConfiguration = Symbol('getParserConfiguration');
const kGuessLocale = Symbol('guessLocale');
const kGuessVersion = Symbol('guessVersion');
const kParsePositionalNumbers = Symbol('parsePositionalNumbers');
const kPkgUp = Symbol('pkgUp');
const kPopulateParserHintArray = Symbol('populateParserHintArray');
const kPopulateParserHintSingleValueDictionary = Symbol('populateParserHintSingleValueDictionary');
const kPopulateParserHintArrayDictionary = Symbol('populateParserHintArrayDictionary');
const kPopulateParserHintDictionary = Symbol('populateParserHintDictionary');
const kSanitizeKey = Symbol('sanitizeKey');
const kSetKey = Symbol('setKey');
const kUnfreeze = Symbol('unfreeze');
const kValidateAsync = Symbol('validateAsync');
const kGetCommandInstance = Symbol('getCommandInstance');
const kGetContext = Symbol('getContext');
const kGetHasOutput = Symbol('getHasOutput');
const kGetLoggerInstance = Symbol('getLoggerInstance');
const kGetParseContext = Symbol('getParseContext');
const kGetUsageInstance = Symbol('getUsageInstance');
const kGetValidationInstance = Symbol('getValidationInstance');
const kHasParseCallback = Symbol('hasParseCallback');
const kIsGlobalContext = Symbol('isGlobalContext');
const kPostProcess = Symbol('postProcess');
const kRebase = Symbol('rebase');
const kReset = Symbol('reset');
const kRunYargsParserAndExecuteCommands = Symbol('runYargsParserAndExecuteCommands');
const kRunValidation = Symbol('runValidation');
const kSetHasOutput = Symbol('setHasOutput');
const kTrackManuallySetKeys = Symbol('kTrackManuallySetKeys');
class YargsInstance {
    constructor(processArgs = [], cwd, parentRequire, shim) {
        this.customScriptName = false;
        this.parsed = false;
        _YargsInstance_command.set(this, void 0);
        _YargsInstance_cwd.set(this, void 0);
        _YargsInstance_context.set(this, { commands: [], fullCommands: [] });
        _YargsInstance_completion.set(this, null);
        _YargsInstance_completionCommand.set(this, null);
        _YargsInstance_defaultShowHiddenOpt.set(this, 'show-hidden');
        _YargsInstance_exitError.set(this, null);
        _YargsInstance_detectLocale.set(this, true);
        _YargsInstance_emittedWarnings.set(this, {});
        _YargsInstance_exitProcess.set(this, true);
        _YargsInstance_frozens.set(this, []);
        _YargsInstance_globalMiddleware.set(this, void 0);
        _YargsInstance_groups.set(this, {});
        _YargsInstance_hasOutput.set(this, false);
        _YargsInstance_helpOpt.set(this, null);
        _YargsInstance_isGlobalContext.set(this, true);
        _YargsInstance_logger.set(this, void 0);
        _YargsInstance_output.set(this, '');
        _YargsInstance_options.set(this, void 0);
        _YargsInstance_parentRequire.set(this, void 0);
        _YargsInstance_parserConfig.set(this, {});
        _YargsInstance_parseFn.set(this, null);
        _YargsInstance_parseContext.set(this, null);
        _YargsInstance_pkgs.set(this, {});
        _YargsInstance_preservedGroups.set(this, {});
        _YargsInstance_processArgs.set(this, void 0);
        _YargsInstance_recommendCommands.set(this, false);
        _YargsInstance_shim.set(this, void 0);
        _YargsInstance_strict.set(this, false);
        _YargsInstance_strictCommands.set(this, false);
        _YargsInstance_strictOptions.set(this, false);
        _YargsInstance_usage.set(this, void 0);
        _YargsInstance_versionOpt.set(this, null);
        _YargsInstance_validation.set(this, void 0);
        __classPrivateFieldSet(this, _YargsInstance_shim, shim, "f");
        __classPrivateFieldSet(this, _YargsInstance_processArgs, processArgs, "f");
        __classPrivateFieldSet(this, _YargsInstance_cwd, cwd, "f");
        __classPrivateFieldSet(this, _YargsInstance_parentRequire, parentRequire, "f");
        __classPrivateFieldSet(this, _YargsInstance_globalMiddleware, new GlobalMiddleware(this), "f");
        this.$0 = this[kGetDollarZero]();
        this[kReset]();
        __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f"), "f");
        __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), "f");
        __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f"), "f");
        __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f"), "f");
        __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
        __classPrivateFieldSet(this, _YargsInstance_logger, this[kCreateLogger](), "f");
    }
    addHelpOpt(opt, msg) {
        const defaultHelpOpt = 'help';
        argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
            this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
            __classPrivateFieldSet(this, _YargsInstance_helpOpt, null, "f");
        }
        if (opt === false && msg === undefined)
            return this;
        __classPrivateFieldSet(this, _YargsInstance_helpOpt, typeof opt === 'string' ? opt : defaultHelpOpt, "f");
        this.boolean(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
        this.describe(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"), msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup('Show help'));
        return this;
    }
    help(opt, msg) {
        return this.addHelpOpt(opt, msg);
    }
    addShowHiddenOpt(opt, msg) {
        argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        if (opt === false && msg === undefined)
            return this;
        const showHiddenOpt = typeof opt === 'string' ? opt : __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
        this.boolean(showHiddenOpt);
        this.describe(showHiddenOpt, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup('Show hidden options'));
        __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = showHiddenOpt;
        return this;
    }
    showHidden(opt, msg) {
        return this.addShowHiddenOpt(opt, msg);
    }
    alias(key, value) {
        argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        this[kPopulateParserHintArrayDictionary](this.alias.bind(this), 'alias', key, value);
        return this;
    }
    array(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('array', keys);
        this[kTrackManuallySetKeys](keys);
        return this;
    }
    boolean(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('boolean', keys);
        this[kTrackManuallySetKeys](keys);
        return this;
    }
    check(f, global) {
        argsert('<function> [boolean]', [f, global], arguments.length);
        this.middleware((argv, _yargs) => {
            return maybeAsyncResult(() => {
                return f(argv, _yargs.getOptions());
            }, (result) => {
                if (!result) {
                    __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(__classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__('Argument check failed: %s', f.toString()));
                }
                else if (typeof result === 'string' || result instanceof Error) {
                    __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(result.toString(), result);
                }
                return argv;
            }, (err) => {
                __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message ? err.message : err.toString(), err);
                return argv;
            });
        }, false, global);
        return this;
    }
    choices(key, value) {
        argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        this[kPopulateParserHintArrayDictionary](this.choices.bind(this), 'choices', key, value);
        return this;
    }
    coerce(keys, value) {
        argsert('<object|string|array> [function]', [keys, value], arguments.length);
        if (Array.isArray(keys)) {
            if (!value) {
                throw new YError('coerce callback must be provided');
            }
            for (const key of keys) {
                this.coerce(key, value);
            }
            return this;
        }
        else if (typeof keys === 'object') {
            for (const key of Object.keys(keys)) {
                this.coerce(key, keys[key]);
            }
            return this;
        }
        if (!value) {
            throw new YError('coerce callback must be provided');
        }
        __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys] = true;
        __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addCoerceMiddleware((argv, yargs) => {
            let aliases;
            const shouldCoerce = Object.prototype.hasOwnProperty.call(argv, keys);
            if (!shouldCoerce) {
                return argv;
            }
            return maybeAsyncResult(() => {
                aliases = yargs.getAliases();
                return value(argv[keys]);
            }, (result) => {
                argv[keys] = result;
                const stripAliased = yargs
                    .getInternalMethods()
                    .getParserConfiguration()['strip-aliased'];
                if (aliases[keys] && stripAliased !== true) {
                    for (const alias of aliases[keys]) {
                        argv[alias] = result;
                    }
                }
                return argv;
            }, (err) => {
                throw new YError(err.message);
            });
        }, keys);
        return this;
    }
    conflicts(key1, key2) {
        argsert('<string|object> [string|array]', [key1, key2], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicts(key1, key2);
        return this;
    }
    config(key = 'config', msg, parseFn) {
        argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length);
        if (typeof key === 'object' && !Array.isArray(key)) {
            key = applyExtends(key, __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()['deep-merge-config'] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(key);
            return this;
        }
        if (typeof msg === 'function') {
            parseFn = msg;
            msg = undefined;
        }
        this.describe(key, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup('Path to JSON config file'));
        (Array.isArray(key) ? key : [key]).forEach(k => {
            __classPrivateFieldGet(this, _YargsInstance_options, "f").config[k] = parseFn || true;
        });
        return this;
    }
    completion(cmd, desc, fn) {
        argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length);
        if (typeof desc === 'function') {
            fn = desc;
            desc = undefined;
        }
        __classPrivateFieldSet(this, _YargsInstance_completionCommand, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || 'completion', "f");
        if (!desc && desc !== false) {
            desc = 'generate completion script';
        }
        this.command(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"), desc);
        if (fn)
            __classPrivateFieldGet(this, _YargsInstance_completion, "f").registerFunction(fn);
        return this;
    }
    command(cmd, description, builder, handler, middlewares, deprecated) {
        argsert('<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]', [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_command, "f").addHandler(cmd, description, builder, handler, middlewares, deprecated);
        return this;
    }
    commands(cmd, description, builder, handler, middlewares, deprecated) {
        return this.command(cmd, description, builder, handler, middlewares, deprecated);
    }
    commandDir(dir, opts) {
        argsert('<string> [object]', [dir, opts], arguments.length);
        const req = __classPrivateFieldGet(this, _YargsInstance_parentRequire, "f") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").require;
        __classPrivateFieldGet(this, _YargsInstance_command, "f").addDirectory(dir, req, __classPrivateFieldGet(this, _YargsInstance_shim, "f").getCallerFile(), opts);
        return this;
    }
    count(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('count', keys);
        this[kTrackManuallySetKeys](keys);
        return this;
    }
    default(key, value, defaultDescription) {
        argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length);
        if (defaultDescription) {
            assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = defaultDescription;
        }
        if (typeof value === 'function') {
            assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key])
                __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] =
                    __classPrivateFieldGet(this, _YargsInstance_usage, "f").functionDescription(value);
            value = value.call();
        }
        this[kPopulateParserHintSingleValueDictionary](this.default.bind(this), 'default', key, value);
        return this;
    }
    defaults(key, value, defaultDescription) {
        return this.default(key, value, defaultDescription);
    }
    demandCommand(min = 1, max, minMsg, maxMsg) {
        argsert('[number] [number|string] [string|null|undefined] [string|null|undefined]', [min, max, minMsg, maxMsg], arguments.length);
        if (typeof max !== 'number') {
            minMsg = max;
            max = Infinity;
        }
        this.global('_', false);
        __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands._ = {
            min,
            max,
            minMsg,
            maxMsg,
        };
        return this;
    }
    demand(keys, max, msg) {
        if (Array.isArray(max)) {
            max.forEach(key => {
                assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
                this.demandOption(key, msg);
            });
            max = Infinity;
        }
        else if (typeof max !== 'number') {
            msg = max;
            max = Infinity;
        }
        if (typeof keys === 'number') {
            assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            this.demandCommand(keys, max, msg, msg);
        }
        else if (Array.isArray(keys)) {
            keys.forEach(key => {
                assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
                this.demandOption(key, msg);
            });
        }
        else {
            if (typeof msg === 'string') {
                this.demandOption(keys, msg);
            }
            else if (msg === true || typeof msg === 'undefined') {
                this.demandOption(keys);
            }
        }
        return this;
    }
    demandOption(keys, msg) {
        argsert('<object|string|array> [string]', [keys, msg], arguments.length);
        this[kPopulateParserHintSingleValueDictionary](this.demandOption.bind(this), 'demandedOptions', keys, msg);
        return this;
    }
    deprecateOption(option, message) {
        argsert('<string> [string|boolean]', [option, message], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions[option] = message;
        return this;
    }
    describe(keys, description) {
        argsert('<object|string|array> [string]', [keys, description], arguments.length);
        this[kSetKey](keys, true);
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").describe(keys, description);
        return this;
    }
    detectLocale(detect) {
        argsert('<boolean>', [detect], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_detectLocale, detect, "f");
        return this;
    }
    env(prefix) {
        argsert('[string|boolean]', [prefix], arguments.length);
        if (prefix === false)
            delete __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
        else
            __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix = prefix || '';
        return this;
    }
    epilogue(msg) {
        argsert('<string>', [msg], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").epilog(msg);
        return this;
    }
    epilog(msg) {
        return this.epilogue(msg);
    }
    example(cmd, description) {
        argsert('<string|array> [string]', [cmd, description], arguments.length);
        if (Array.isArray(cmd)) {
            cmd.forEach(exampleParams => this.example(...exampleParams));
        }
        else {
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").example(cmd, description);
        }
        return this;
    }
    exit(code, err) {
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        __classPrivateFieldSet(this, _YargsInstance_exitError, err, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.exit(code);
    }
    exitProcess(enabled = true) {
        argsert('[boolean]', [enabled], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_exitProcess, enabled, "f");
        return this;
    }
    fail(f) {
        argsert('<function|boolean>', [f], arguments.length);
        if (typeof f === 'boolean' && f !== false) {
            throw new YError("Invalid first argument. Expected function or boolean 'false'");
        }
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").failFn(f);
        return this;
    }
    getAliases() {
        return this.parsed ? this.parsed.aliases : {};
    }
    async getCompletion(args, done) {
        argsert('<array> [function]', [args, done], arguments.length);
        if (!done) {
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, (err, completions) => {
                    if (err)
                        reject(err);
                    else
                        resolve(completions);
                });
            });
        }
        else {
            return __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, done);
        }
    }
    getDemandedOptions() {
        argsert([], 0);
        return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedOptions;
    }
    getDemandedCommands() {
        argsert([], 0);
        return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands;
    }
    getDeprecatedOptions() {
        argsert([], 0);
        return __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions;
    }
    getDetectLocale() {
        return __classPrivateFieldGet(this, _YargsInstance_detectLocale, "f");
    }
    getExitProcess() {
        return __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f");
    }
    getGroups() {
        return Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_groups, "f"), __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"));
    }
    getHelp() {
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
            if (!this.parsed) {
                const parse = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), undefined, undefined, 0, true);
                if (isPromise(parse)) {
                    return parse.then(() => {
                        return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
                    });
                }
            }
            const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
            if (isPromise(builderResponse)) {
                return builderResponse.then(() => {
                    return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
                });
            }
        }
        return Promise.resolve(__classPrivateFieldGet(this, _YargsInstance_usage, "f").help());
    }
    getOptions() {
        return __classPrivateFieldGet(this, _YargsInstance_options, "f");
    }
    getStrict() {
        return __classPrivateFieldGet(this, _YargsInstance_strict, "f");
    }
    getStrictCommands() {
        return __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f");
    }
    getStrictOptions() {
        return __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f");
    }
    global(globals, global) {
        argsert('<string|array> [boolean]', [globals, global], arguments.length);
        globals = [].concat(globals);
        if (global !== false) {
            __classPrivateFieldGet(this, _YargsInstance_options, "f").local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local.filter(l => globals.indexOf(l) === -1);
        }
        else {
            globals.forEach(g => {
                if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").local.includes(g))
                    __classPrivateFieldGet(this, _YargsInstance_options, "f").local.push(g);
            });
        }
        return this;
    }
    group(opts, groupName) {
        argsert('<string|array> <string>', [opts, groupName], arguments.length);
        const existing = __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName] || __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName];
        if (__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName]) {
            delete __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName];
        }
        const seen = {};
        __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName] = (existing || []).concat(opts).filter(key => {
            if (seen[key])
                return false;
            return (seen[key] = true);
        });
        return this;
    }
    hide(key) {
        argsert('<string>', [key], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_options, "f").hiddenOptions.push(key);
        return this;
    }
    implies(key, value) {
        argsert('<string|object> [number|string|array]', [key, value], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").implies(key, value);
        return this;
    }
    locale(locale) {
        argsert('[string]', [locale], arguments.length);
        if (locale === undefined) {
            this[kGuessLocale]();
            return __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.getLocale();
        }
        __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
        __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.setLocale(locale);
        return this;
    }
    middleware(callback, applyBeforeValidation, global) {
        return __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addMiddleware(callback, !!applyBeforeValidation, global);
    }
    nargs(key, value) {
        argsert('<string|object|array> [number]', [key, value], arguments.length);
        this[kPopulateParserHintSingleValueDictionary](this.nargs.bind(this), 'narg', key, value);
        return this;
    }
    normalize(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('normalize', keys);
        return this;
    }
    number(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('number', keys);
        this[kTrackManuallySetKeys](keys);
        return this;
    }
    option(key, opt) {
        argsert('<string|object> [object]', [key, opt], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                this.options(k, key[k]);
            });
        }
        else {
            if (typeof opt !== 'object') {
                opt = {};
            }
            this[kTrackManuallySetKeys](key);
            if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && (key === 'version' || (opt === null || opt === void 0 ? void 0 : opt.alias) === 'version')) {
                this[kEmitWarning]([
                    '"version" is a reserved word.',
                    'Please do one of the following:',
                    '- Disable version with `yargs.version(false)` if using "version" as an option',
                    '- Use the built-in `yargs.version` method instead (if applicable)',
                    '- Use a different option key',
                    'https://yargs.js.org/docs/#api-reference-version',
                ].join('\n'), undefined, 'versionWarning');
            }
            __classPrivateFieldGet(this, _YargsInstance_options, "f").key[key] = true;
            if (opt.alias)
                this.alias(key, opt.alias);
            const deprecate = opt.deprecate || opt.deprecated;
            if (deprecate) {
                this.deprecateOption(key, deprecate);
            }
            const demand = opt.demand || opt.required || opt.require;
            if (demand) {
                this.demand(key, demand);
            }
            if (opt.demandOption) {
                this.demandOption(key, typeof opt.demandOption === 'string' ? opt.demandOption : undefined);
            }
            if (opt.conflicts) {
                this.conflicts(key, opt.conflicts);
            }
            if ('default' in opt) {
                this.default(key, opt.default);
            }
            if (opt.implies !== undefined) {
                this.implies(key, opt.implies);
            }
            if (opt.nargs !== undefined) {
                this.nargs(key, opt.nargs);
            }
            if (opt.config) {
                this.config(key, opt.configParser);
            }
            if (opt.normalize) {
                this.normalize(key);
            }
            if (opt.choices) {
                this.choices(key, opt.choices);
            }
            if (opt.coerce) {
                this.coerce(key, opt.coerce);
            }
            if (opt.group) {
                this.group(key, opt.group);
            }
            if (opt.boolean || opt.type === 'boolean') {
                this.boolean(key);
                if (opt.alias)
                    this.boolean(opt.alias);
            }
            if (opt.array || opt.type === 'array') {
                this.array(key);
                if (opt.alias)
                    this.array(opt.alias);
            }
            if (opt.number || opt.type === 'number') {
                this.number(key);
                if (opt.alias)
                    this.number(opt.alias);
            }
            if (opt.string || opt.type === 'string') {
                this.string(key);
                if (opt.alias)
                    this.string(opt.alias);
            }
            if (opt.count || opt.type === 'count') {
                this.count(key);
            }
            if (typeof opt.global === 'boolean') {
                this.global(key, opt.global);
            }
            if (opt.defaultDescription) {
                __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = opt.defaultDescription;
            }
            if (opt.skipValidation) {
                this.skipValidation(key);
            }
            const desc = opt.describe || opt.description || opt.desc;
            this.describe(key, desc);
            if (opt.hidden) {
                this.hide(key);
            }
            if (opt.requiresArg) {
                this.requiresArg(key);
            }
        }
        return this;
    }
    options(key, opt) {
        return this.option(key, opt);
    }
    parse(args, shortCircuit, _parseFn) {
        argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length);
        this[kFreeze]();
        if (typeof args === 'undefined') {
            args = __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
        }
        if (typeof shortCircuit === 'object') {
            __classPrivateFieldSet(this, _YargsInstance_parseContext, shortCircuit, "f");
            shortCircuit = _parseFn;
        }
        if (typeof shortCircuit === 'function') {
            __classPrivateFieldSet(this, _YargsInstance_parseFn, shortCircuit, "f");
            shortCircuit = false;
        }
        if (!shortCircuit)
            __classPrivateFieldSet(this, _YargsInstance_processArgs, args, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
            __classPrivateFieldSet(this, _YargsInstance_exitProcess, false, "f");
        const parsed = this[kRunYargsParserAndExecuteCommands](args, !!shortCircuit);
        const tmpParsed = this.parsed;
        __classPrivateFieldGet(this, _YargsInstance_completion, "f").setParsed(this.parsed);
        if (isPromise(parsed)) {
            return parsed
                .then(argv => {
                if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
                    __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
                return argv;
            })
                .catch(err => {
                if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f")) {
                    __classPrivateFieldGet(this, _YargsInstance_parseFn, "f")(err, this.parsed.argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
                }
                throw err;
            })
                .finally(() => {
                this[kUnfreeze]();
                this.parsed = tmpParsed;
            });
        }
        else {
            if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
                __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), parsed, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
            this[kUnfreeze]();
            this.parsed = tmpParsed;
        }
        return parsed;
    }
    parseAsync(args, shortCircuit, _parseFn) {
        const maybePromise = this.parse(args, shortCircuit, _parseFn);
        return !isPromise(maybePromise)
            ? Promise.resolve(maybePromise)
            : maybePromise;
    }
    parseSync(args, shortCircuit, _parseFn) {
        const maybePromise = this.parse(args, shortCircuit, _parseFn);
        if (isPromise(maybePromise)) {
            throw new YError('.parseSync() must not be used with asynchronous builders, handlers, or middleware');
        }
        return maybePromise;
    }
    parserConfiguration(config) {
        argsert('<object>', [config], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_parserConfig, config, "f");
        return this;
    }
    pkgConf(key, rootPath) {
        argsert('<string> [string]', [key, rootPath], arguments.length);
        let conf = null;
        const obj = this[kPkgUp](rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"));
        if (obj[key] && typeof obj[key] === 'object') {
            conf = applyExtends(obj[key], rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()['deep-merge-config'] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(conf);
        }
        return this;
    }
    positional(key, opts) {
        argsert('<string> <object>', [key, opts], arguments.length);
        const supportedOpts = [
            'default',
            'defaultDescription',
            'implies',
            'normalize',
            'choices',
            'conflicts',
            'coerce',
            'type',
            'describe',
            'desc',
            'description',
            'alias',
        ];
        opts = objFilter(opts, (k, v) => {
            if (k === 'type' && !['string', 'number', 'boolean'].includes(v))
                return false;
            return supportedOpts.includes(k);
        });
        const fullCommand = __classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands[__classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands.length - 1];
        const parseOptions = fullCommand
            ? __classPrivateFieldGet(this, _YargsInstance_command, "f").cmdToParseOptions(fullCommand)
            : {
                array: [],
                alias: {},
                default: {},
                demand: {},
            };
        objectKeys(parseOptions).forEach(pk => {
            const parseOption = parseOptions[pk];
            if (Array.isArray(parseOption)) {
                if (parseOption.indexOf(key) !== -1)
                    opts[pk] = true;
            }
            else {
                if (parseOption[key] && !(pk in opts))
                    opts[pk] = parseOption[key];
            }
        });
        this.group(key, __classPrivateFieldGet(this, _YargsInstance_usage, "f").getPositionalGroupName());
        return this.option(key, opts);
    }
    recommendCommands(recommend = true) {
        argsert('[boolean]', [recommend], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_recommendCommands, recommend, "f");
        return this;
    }
    required(keys, max, msg) {
        return this.demand(keys, max, msg);
    }
    require(keys, max, msg) {
        return this.demand(keys, max, msg);
    }
    requiresArg(keys) {
        argsert('<array|string|object> [number]', [keys], arguments.length);
        if (typeof keys === 'string' && __classPrivateFieldGet(this, _YargsInstance_options, "f").narg[keys]) {
            return this;
        }
        else {
            this[kPopulateParserHintSingleValueDictionary](this.requiresArg.bind(this), 'narg', keys, NaN);
        }
        return this;
    }
    showCompletionScript($0, cmd) {
        argsert('[string] [string]', [$0, cmd], arguments.length);
        $0 = $0 || this.$0;
        __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(__classPrivateFieldGet(this, _YargsInstance_completion, "f").generateCompletionScript($0, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || 'completion'));
        return this;
    }
    showHelp(level) {
        argsert('[string|function]', [level], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
            if (!this.parsed) {
                const parse = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), undefined, undefined, 0, true);
                if (isPromise(parse)) {
                    parse.then(() => {
                        __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
                    });
                    return this;
                }
            }
            const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
            if (isPromise(builderResponse)) {
                builderResponse.then(() => {
                    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
                });
                return this;
            }
        }
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
        return this;
    }
    scriptName(scriptName) {
        this.customScriptName = true;
        this.$0 = scriptName;
        return this;
    }
    showHelpOnFail(enabled, message) {
        argsert('[boolean|string] [string]', [enabled, message], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelpOnFail(enabled, message);
        return this;
    }
    showVersion(level) {
        argsert('[string|function]', [level], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion(level);
        return this;
    }
    skipValidation(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('skipValidation', keys);
        return this;
    }
    strict(enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_strict, enabled !== false, "f");
        return this;
    }
    strictCommands(enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_strictCommands, enabled !== false, "f");
        return this;
    }
    strictOptions(enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_strictOptions, enabled !== false, "f");
        return this;
    }
    string(keys) {
        argsert('<array|string>', [keys], arguments.length);
        this[kPopulateParserHintArray]('string', keys);
        this[kTrackManuallySetKeys](keys);
        return this;
    }
    terminalWidth() {
        argsert([], 0);
        return __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.stdColumns;
    }
    updateLocale(obj) {
        return this.updateStrings(obj);
    }
    updateStrings(obj) {
        argsert('<object>', [obj], arguments.length);
        __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
        __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.updateLocale(obj);
        return this;
    }
    usage(msg, description, builder, handler) {
        argsert('<string|null|undefined> [string|boolean] [function|object] [function]', [msg, description, builder, handler], arguments.length);
        if (description !== undefined) {
            assertNotStrictEqual(msg, null, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            if ((msg || '').match(/^\$0( |$)/)) {
                return this.command(msg, description, builder, handler);
            }
            else {
                throw new YError('.usage() description must start with $0 if being used as alias for .command()');
            }
        }
        else {
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").usage(msg);
            return this;
        }
    }
    version(opt, msg, ver) {
        const defaultVersionOpt = 'version';
        argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length);
        if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f")) {
            this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(undefined);
            __classPrivateFieldSet(this, _YargsInstance_versionOpt, null, "f");
        }
        if (arguments.length === 0) {
            ver = this[kGuessVersion]();
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 1) {
            if (opt === false) {
                return this;
            }
            ver = opt;
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 2) {
            ver = msg;
            msg = undefined;
        }
        __classPrivateFieldSet(this, _YargsInstance_versionOpt, typeof opt === 'string' ? opt : defaultVersionOpt, "f");
        msg = msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup('Show version number');
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(ver || undefined);
        this.boolean(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
        this.describe(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"), msg);
        return this;
    }
    wrap(cols) {
        argsert('<number|null|undefined>', [cols], arguments.length);
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").wrap(cols);
        return this;
    }
    [(_YargsInstance_command = new WeakMap(), _YargsInstance_cwd = new WeakMap(), _YargsInstance_context = new WeakMap(), _YargsInstance_completion = new WeakMap(), _YargsInstance_completionCommand = new WeakMap(), _YargsInstance_defaultShowHiddenOpt = new WeakMap(), _YargsInstance_exitError = new WeakMap(), _YargsInstance_detectLocale = new WeakMap(), _YargsInstance_emittedWarnings = new WeakMap(), _YargsInstance_exitProcess = new WeakMap(), _YargsInstance_frozens = new WeakMap(), _YargsInstance_globalMiddleware = new WeakMap(), _YargsInstance_groups = new WeakMap(), _YargsInstance_hasOutput = new WeakMap(), _YargsInstance_helpOpt = new WeakMap(), _YargsInstance_isGlobalContext = new WeakMap(), _YargsInstance_logger = new WeakMap(), _YargsInstance_output = new WeakMap(), _YargsInstance_options = new WeakMap(), _YargsInstance_parentRequire = new WeakMap(), _YargsInstance_parserConfig = new WeakMap(), _YargsInstance_parseFn = new WeakMap(), _YargsInstance_parseContext = new WeakMap(), _YargsInstance_pkgs = new WeakMap(), _YargsInstance_preservedGroups = new WeakMap(), _YargsInstance_processArgs = new WeakMap(), _YargsInstance_recommendCommands = new WeakMap(), _YargsInstance_shim = new WeakMap(), _YargsInstance_strict = new WeakMap(), _YargsInstance_strictCommands = new WeakMap(), _YargsInstance_strictOptions = new WeakMap(), _YargsInstance_usage = new WeakMap(), _YargsInstance_versionOpt = new WeakMap(), _YargsInstance_validation = new WeakMap(), kCopyDoubleDash)](argv) {
        if (!argv._ || !argv['--'])
            return argv;
        argv._.push.apply(argv._, argv['--']);
        try {
            delete argv['--'];
        }
        catch (_err) { }
        return argv;
    }
    [kCreateLogger]() {
        return {
            log: (...args) => {
                if (!this[kHasParseCallback]())
                    console.log(...args);
                __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
                if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
                    __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + '\n', "f");
                __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(' '), "f");
            },
            error: (...args) => {
                if (!this[kHasParseCallback]())
                    console.error(...args);
                __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
                if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
                    __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + '\n', "f");
                __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(' '), "f");
            },
        };
    }
    [kDeleteFromParserHintObject](optionKey) {
        objectKeys(__classPrivateFieldGet(this, _YargsInstance_options, "f")).forEach((hintKey) => {
            if (((key) => key === 'configObjects')(hintKey))
                return;
            const hint = __classPrivateFieldGet(this, _YargsInstance_options, "f")[hintKey];
            if (Array.isArray(hint)) {
                if (hint.includes(optionKey))
                    hint.splice(hint.indexOf(optionKey), 1);
            }
            else if (typeof hint === 'object') {
                delete hint[optionKey];
            }
        });
        delete __classPrivateFieldGet(this, _YargsInstance_usage, "f").getDescriptions()[optionKey];
    }
    [kEmitWarning](warning, type, deduplicationId) {
        if (!__classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId]) {
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.emitWarning(warning, type);
            __classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId] = true;
        }
    }
    [kFreeze]() {
        __classPrivateFieldGet(this, _YargsInstance_frozens, "f").push({
            options: __classPrivateFieldGet(this, _YargsInstance_options, "f"),
            configObjects: __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects.slice(0),
            exitProcess: __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"),
            groups: __classPrivateFieldGet(this, _YargsInstance_groups, "f"),
            strict: __classPrivateFieldGet(this, _YargsInstance_strict, "f"),
            strictCommands: __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f"),
            strictOptions: __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f"),
            completionCommand: __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"),
            output: __classPrivateFieldGet(this, _YargsInstance_output, "f"),
            exitError: __classPrivateFieldGet(this, _YargsInstance_exitError, "f"),
            hasOutput: __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f"),
            parsed: this.parsed,
            parseFn: __classPrivateFieldGet(this, _YargsInstance_parseFn, "f"),
            parseContext: __classPrivateFieldGet(this, _YargsInstance_parseContext, "f"),
        });
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").freeze();
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").freeze();
        __classPrivateFieldGet(this, _YargsInstance_command, "f").freeze();
        __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").freeze();
    }
    [kGetDollarZero]() {
        let $0 = '';
        let default$0;
        if (/\b(node|iojs|electron)(\.exe)?$/.test(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv()[0])) {
            default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(1, 2);
        }
        else {
            default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(0, 1);
        }
        $0 = default$0
            .map(x => {
            const b = this[kRebase](__classPrivateFieldGet(this, _YargsInstance_cwd, "f"), x);
            return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
        })
            .join(' ')
            .trim();
        if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('_') &&
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").getProcessArgvBin() === __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('_')) {
            $0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f")
                .getEnv('_')
                .replace(`${__classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.execPath())}/`, '');
        }
        return $0;
    }
    [kGetParserConfiguration]() {
        return __classPrivateFieldGet(this, _YargsInstance_parserConfig, "f");
    }
    [kGuessLocale]() {
        if (!__classPrivateFieldGet(this, _YargsInstance_detectLocale, "f"))
            return;
        const locale = __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('LC_ALL') ||
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('LC_MESSAGES') ||
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('LANG') ||
            __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv('LANGUAGE') ||
            'en_US';
        this.locale(locale.replace(/[.:].*/, ''));
    }
    [kGuessVersion]() {
        const obj = this[kPkgUp]();
        return obj.version || 'unknown';
    }
    [kParsePositionalNumbers](argv) {
        const args = argv['--'] ? argv['--'] : argv._;
        for (let i = 0, arg; (arg = args[i]) !== undefined; i++) {
            if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.looksLikeNumber(arg) &&
                Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))) {
                args[i] = Number(arg);
            }
        }
        return argv;
    }
    [kPkgUp](rootPath) {
        const npath = rootPath || '*';
        if (__classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath])
            return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
        let obj = {};
        try {
            let startDir = rootPath || __classPrivateFieldGet(this, _YargsInstance_shim, "f").mainFilename;
            if (!rootPath && __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.extname(startDir)) {
                startDir = __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(startDir);
            }
            const pkgJsonPath = __classPrivateFieldGet(this, _YargsInstance_shim, "f").findUp(startDir, (dir, names) => {
                if (names.includes('package.json')) {
                    return 'package.json';
                }
                else {
                    return undefined;
                }
            });
            assertNotStrictEqual(pkgJsonPath, undefined, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
            obj = JSON.parse(__classPrivateFieldGet(this, _YargsInstance_shim, "f").readFileSync(pkgJsonPath, 'utf8'));
        }
        catch (_noop) { }
        __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath] = obj || {};
        return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
    }
    [kPopulateParserHintArray](type, keys) {
        keys = [].concat(keys);
        keys.forEach(key => {
            key = this[kSanitizeKey](key);
            __classPrivateFieldGet(this, _YargsInstance_options, "f")[type].push(key);
        });
    }
    [kPopulateParserHintSingleValueDictionary](builder, type, key, value) {
        this[kPopulateParserHintDictionary](builder, type, key, value, (type, key, value) => {
            __classPrivateFieldGet(this, _YargsInstance_options, "f")[type][key] = value;
        });
    }
    [kPopulateParserHintArrayDictionary](builder, type, key, value) {
        this[kPopulateParserHintDictionary](builder, type, key, value, (type, key, value) => {
            __classPrivateFieldGet(this, _YargsInstance_options, "f")[type][key] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[type][key] || []).concat(value);
        });
    }
    [kPopulateParserHintDictionary](builder, type, key, value, singleKeyHandler) {
        if (Array.isArray(key)) {
            key.forEach(k => {
                builder(k, value);
            });
        }
        else if (((key) => typeof key === 'object')(key)) {
            for (const k of objectKeys(key)) {
                builder(k, key[k]);
            }
        }
        else {
            singleKeyHandler(type, this[kSanitizeKey](key), value);
        }
    }
    [kSanitizeKey](key) {
        if (key === '__proto__')
            return '___proto___';
        return key;
    }
    [kSetKey](key, set) {
        this[kPopulateParserHintSingleValueDictionary](this[kSetKey].bind(this), 'key', key, set);
        return this;
    }
    [kUnfreeze]() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const frozen = __classPrivateFieldGet(this, _YargsInstance_frozens, "f").pop();
        assertNotStrictEqual(frozen, undefined, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
        let configObjects;
        (_a = this, _b = this, _c = this, _d = this, _e = this, _f = this, _g = this, _h = this, _j = this, _k = this, _l = this, _m = this, {
            options: ({ set value(_o) { __classPrivateFieldSet(_a, _YargsInstance_options, _o, "f"); } }).value,
            configObjects,
            exitProcess: ({ set value(_o) { __classPrivateFieldSet(_b, _YargsInstance_exitProcess, _o, "f"); } }).value,
            groups: ({ set value(_o) { __classPrivateFieldSet(_c, _YargsInstance_groups, _o, "f"); } }).value,
            output: ({ set value(_o) { __classPrivateFieldSet(_d, _YargsInstance_output, _o, "f"); } }).value,
            exitError: ({ set value(_o) { __classPrivateFieldSet(_e, _YargsInstance_exitError, _o, "f"); } }).value,
            hasOutput: ({ set value(_o) { __classPrivateFieldSet(_f, _YargsInstance_hasOutput, _o, "f"); } }).value,
            parsed: this.parsed,
            strict: ({ set value(_o) { __classPrivateFieldSet(_g, _YargsInstance_strict, _o, "f"); } }).value,
            strictCommands: ({ set value(_o) { __classPrivateFieldSet(_h, _YargsInstance_strictCommands, _o, "f"); } }).value,
            strictOptions: ({ set value(_o) { __classPrivateFieldSet(_j, _YargsInstance_strictOptions, _o, "f"); } }).value,
            completionCommand: ({ set value(_o) { __classPrivateFieldSet(_k, _YargsInstance_completionCommand, _o, "f"); } }).value,
            parseFn: ({ set value(_o) { __classPrivateFieldSet(_l, _YargsInstance_parseFn, _o, "f"); } }).value,
            parseContext: ({ set value(_o) { __classPrivateFieldSet(_m, _YargsInstance_parseContext, _o, "f"); } }).value,
        } = frozen);
        __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = configObjects;
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").unfreeze();
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").unfreeze();
        __classPrivateFieldGet(this, _YargsInstance_command, "f").unfreeze();
        __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").unfreeze();
    }
    [kValidateAsync](validation, argv) {
        return maybeAsyncResult(argv, result => {
            validation(result);
            return result;
        });
    }
    getInternalMethods() {
        return {
            getCommandInstance: this[kGetCommandInstance].bind(this),
            getContext: this[kGetContext].bind(this),
            getHasOutput: this[kGetHasOutput].bind(this),
            getLoggerInstance: this[kGetLoggerInstance].bind(this),
            getParseContext: this[kGetParseContext].bind(this),
            getParserConfiguration: this[kGetParserConfiguration].bind(this),
            getUsageInstance: this[kGetUsageInstance].bind(this),
            getValidationInstance: this[kGetValidationInstance].bind(this),
            hasParseCallback: this[kHasParseCallback].bind(this),
            isGlobalContext: this[kIsGlobalContext].bind(this),
            postProcess: this[kPostProcess].bind(this),
            reset: this[kReset].bind(this),
            runValidation: this[kRunValidation].bind(this),
            runYargsParserAndExecuteCommands: this[kRunYargsParserAndExecuteCommands].bind(this),
            setHasOutput: this[kSetHasOutput].bind(this),
        };
    }
    [kGetCommandInstance]() {
        return __classPrivateFieldGet(this, _YargsInstance_command, "f");
    }
    [kGetContext]() {
        return __classPrivateFieldGet(this, _YargsInstance_context, "f");
    }
    [kGetHasOutput]() {
        return __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f");
    }
    [kGetLoggerInstance]() {
        return __classPrivateFieldGet(this, _YargsInstance_logger, "f");
    }
    [kGetParseContext]() {
        return __classPrivateFieldGet(this, _YargsInstance_parseContext, "f") || {};
    }
    [kGetUsageInstance]() {
        return __classPrivateFieldGet(this, _YargsInstance_usage, "f");
    }
    [kGetValidationInstance]() {
        return __classPrivateFieldGet(this, _YargsInstance_validation, "f");
    }
    [kHasParseCallback]() {
        return !!__classPrivateFieldGet(this, _YargsInstance_parseFn, "f");
    }
    [kIsGlobalContext]() {
        return __classPrivateFieldGet(this, _YargsInstance_isGlobalContext, "f");
    }
    [kPostProcess](argv, populateDoubleDash, calledFromCommand, runGlobalMiddleware) {
        if (calledFromCommand)
            return argv;
        if (isPromise(argv))
            return argv;
        if (!populateDoubleDash) {
            argv = this[kCopyDoubleDash](argv);
        }
        const parsePositionalNumbers = this[kGetParserConfiguration]()['parse-positional-numbers'] ||
            this[kGetParserConfiguration]()['parse-positional-numbers'] === undefined;
        if (parsePositionalNumbers) {
            argv = this[kParsePositionalNumbers](argv);
        }
        if (runGlobalMiddleware) {
            argv = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
        }
        return argv;
    }
    [kReset](aliases = {}) {
        __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f") || {}, "f");
        const tmpOptions = {};
        tmpOptions.local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local || [];
        tmpOptions.configObjects = __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || [];
        const localLookup = {};
        tmpOptions.local.forEach(l => {
            localLookup[l] = true;
            (aliases[l] || []).forEach(a => {
                localLookup[a] = true;
            });
        });
        Object.assign(__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"), Object.keys(__classPrivateFieldGet(this, _YargsInstance_groups, "f")).reduce((acc, groupName) => {
            const keys = __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName].filter(key => !(key in localLookup));
            if (keys.length > 0) {
                acc[groupName] = keys;
            }
            return acc;
        }, {}));
        __classPrivateFieldSet(this, _YargsInstance_groups, {}, "f");
        const arrayOptions = [
            'array',
            'boolean',
            'string',
            'skipValidation',
            'count',
            'normalize',
            'number',
            'hiddenOptions',
        ];
        const objectOptions = [
            'narg',
            'key',
            'alias',
            'default',
            'defaultDescription',
            'config',
            'choices',
            'demandedOptions',
            'demandedCommands',
            'deprecatedOptions',
        ];
        arrayOptions.forEach(k => {
            tmpOptions[k] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[k] || []).filter((k) => !localLookup[k]);
        });
        objectOptions.forEach((k) => {
            tmpOptions[k] = objFilter(__classPrivateFieldGet(this, _YargsInstance_options, "f")[k], k => !localLookup[k]);
        });
        tmpOptions.envPrefix = __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
        __classPrivateFieldSet(this, _YargsInstance_options, tmpOptions, "f");
        __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f")
            ? __classPrivateFieldGet(this, _YargsInstance_usage, "f").reset(localLookup)
            : usage(this, __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
        __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f")
            ? __classPrivateFieldGet(this, _YargsInstance_validation, "f").reset(localLookup)
            : validation(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
        __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f")
            ? __classPrivateFieldGet(this, _YargsInstance_command, "f").reset()
            : command(__classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_validation, "f"), __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
        if (!__classPrivateFieldGet(this, _YargsInstance_completion, "f"))
            __classPrivateFieldSet(this, _YargsInstance_completion, completion(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_command, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
        __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").reset();
        __classPrivateFieldSet(this, _YargsInstance_completionCommand, null, "f");
        __classPrivateFieldSet(this, _YargsInstance_output, '', "f");
        __classPrivateFieldSet(this, _YargsInstance_exitError, null, "f");
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, false, "f");
        this.parsed = false;
        return this;
    }
    [kRebase](base, dir) {
        return __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.relative(base, dir);
    }
    [kRunYargsParserAndExecuteCommands](args, shortCircuit, calledFromCommand, commandIndex = 0, helpOnly = false) {
        let skipValidation = !!calledFromCommand || helpOnly;
        args = args || __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
        __classPrivateFieldGet(this, _YargsInstance_options, "f").__ = __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__;
        __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration = this[kGetParserConfiguration]();
        const populateDoubleDash = !!__classPrivateFieldGet(this, _YargsInstance_options, "f").configuration['populate--'];
        const config = Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration, {
            'populate--': true,
        });
        const parsed = __classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.detailed(args, Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f"), {
            configuration: { 'parse-positional-numbers': false, ...config },
        }));
        const argv = Object.assign(parsed.argv, __classPrivateFieldGet(this, _YargsInstance_parseContext, "f"));
        let argvPromise = undefined;
        const aliases = parsed.aliases;
        let helpOptSet = false;
        let versionOptSet = false;
        Object.keys(argv).forEach(key => {
            if (key === __classPrivateFieldGet(this, _YargsInstance_helpOpt, "f") && argv[key]) {
                helpOptSet = true;
            }
            else if (key === __classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && argv[key]) {
                versionOptSet = true;
            }
        });
        argv.$0 = this.$0;
        this.parsed = parsed;
        if (commandIndex === 0) {
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").clearCachedHelpMessage();
        }
        try {
            this[kGuessLocale]();
            if (shortCircuit) {
                return this[kPostProcess](argv, populateDoubleDash, !!calledFromCommand, false);
            }
            if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
                const helpCmds = [__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")]
                    .concat(aliases[__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")] || [])
                    .filter(k => k.length > 1);
                if (helpCmds.includes('' + argv._[argv._.length - 1])) {
                    argv._.pop();
                    helpOptSet = true;
                }
            }
            __classPrivateFieldSet(this, _YargsInstance_isGlobalContext, false, "f");
            const handlerKeys = __classPrivateFieldGet(this, _YargsInstance_command, "f").getCommands();
            const requestCompletions = __classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey in argv;
            const skipRecommendation = helpOptSet || requestCompletions || helpOnly;
            if (argv._.length) {
                if (handlerKeys.length) {
                    let firstUnknownCommand;
                    for (let i = commandIndex || 0, cmd; argv._[i] !== undefined; i++) {
                        cmd = String(argv._[i]);
                        if (handlerKeys.includes(cmd) && cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
                            const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(cmd, this, parsed, i + 1, helpOnly, helpOptSet || versionOptSet || helpOnly);
                            return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
                        }
                        else if (!firstUnknownCommand &&
                            cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
                            firstUnknownCommand = cmd;
                            break;
                        }
                    }
                    if (!__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() &&
                        __classPrivateFieldGet(this, _YargsInstance_recommendCommands, "f") &&
                        firstUnknownCommand &&
                        !skipRecommendation) {
                        __classPrivateFieldGet(this, _YargsInstance_validation, "f").recommendCommands(firstUnknownCommand, handlerKeys);
                    }
                }
                if (__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") &&
                    argv._.includes(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) &&
                    !requestCompletions) {
                    if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
                        setBlocking(true);
                    this.showCompletionScript();
                    this.exit(0);
                }
            }
            if (__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() && !skipRecommendation) {
                const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(null, this, parsed, 0, helpOnly, helpOptSet || versionOptSet || helpOnly);
                return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
            }
            if (requestCompletions) {
                if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
                    setBlocking(true);
                args = [].concat(args);
                const completionArgs = args.slice(args.indexOf(`--${__classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey}`) + 1);
                __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(completionArgs, (err, completions) => {
                    if (err)
                        throw new YError(err.message);
                    (completions || []).forEach(completion => {
                        __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(completion);
                    });
                    this.exit(0);
                });
                return this[kPostProcess](argv, !populateDoubleDash, !!calledFromCommand, false);
            }
            if (!__classPrivateFieldGet(this, _YargsInstance_hasOutput, "f")) {
                if (helpOptSet) {
                    if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
                        setBlocking(true);
                    skipValidation = true;
                    this.showHelp('log');
                    this.exit(0);
                }
                else if (versionOptSet) {
                    if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
                        setBlocking(true);
                    skipValidation = true;
                    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion('log');
                    this.exit(0);
                }
            }
            if (!skipValidation && __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.length > 0) {
                skipValidation = Object.keys(argv).some(key => __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.indexOf(key) >= 0 && argv[key] === true);
            }
            if (!skipValidation) {
                if (parsed.error)
                    throw new YError(parsed.error.message);
                if (!requestCompletions) {
                    const validation = this[kRunValidation](aliases, {}, parsed.error);
                    if (!calledFromCommand) {
                        argvPromise = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), true);
                    }
                    argvPromise = this[kValidateAsync](validation, argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv);
                    if (isPromise(argvPromise) && !calledFromCommand) {
                        argvPromise = argvPromise.then(() => {
                            return applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
                        });
                    }
                }
            }
        }
        catch (err) {
            if (err instanceof YError)
                __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message, err);
            else
                throw err;
        }
        return this[kPostProcess](argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv, populateDoubleDash, !!calledFromCommand, true);
    }
    [kRunValidation](aliases, positionalMap, parseErrors, isDefaultCommand) {
        const demandedOptions = { ...this.getDemandedOptions() };
        return (argv) => {
            if (parseErrors)
                throw new YError(parseErrors.message);
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").nonOptionCount(argv);
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").requiredArguments(argv, demandedOptions);
            let failedStrictCommands = false;
            if (__classPrivateFieldGet(this, _YargsInstance_strictCommands, "f")) {
                failedStrictCommands = __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownCommands(argv);
            }
            if (__classPrivateFieldGet(this, _YargsInstance_strict, "f") && !failedStrictCommands) {
                __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, positionalMap, !!isDefaultCommand);
            }
            else if (__classPrivateFieldGet(this, _YargsInstance_strictOptions, "f")) {
                __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, {}, false, false);
            }
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").limitedChoices(argv);
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").implications(argv);
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicting(argv);
        };
    }
    [kSetHasOutput]() {
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    }
    [kTrackManuallySetKeys](keys) {
        if (typeof keys === 'string') {
            __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys] = true;
        }
        else {
            for (const k of keys) {
                __classPrivateFieldGet(this, _YargsInstance_options, "f").key[k] = true;
            }
        }
    }
}
function isYargsInstance(y) {
    return !!y && typeof y.getInternalMethods === 'function';
}

;// CONCATENATED MODULE: ./node_modules/yargs/index.mjs


// Bootstraps yargs for ESM:



const Yargs = YargsFactory(esm);
/* harmony default export */ const yargs = (Yargs);

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(760);
;// CONCATENATED MODULE: ./args.js



let argv = {};

const isActions = (core.getInput('isActions') === 'true');

if (isActions) {
  const repo = core.getInput('repository');
  const marker = core.getInput('deploy-label');
  const mainBranch = core.getInput('main-branch');
  const project = '.';

  argv = { repo, marker, mainBranch, project };
} else {
  argv = yargs(process.argv)
    .option('project', {
      alias: 'p',
      describe: 'Provide GIT project path',
      default: '.',
      type: 'string',
    })
    .option('repo', {
      alias: 'r',
      describe: 'Repository name',
      type: 'string',
    })
    .option('marker', {
      alias: 'm',
      description: 'Deploy label',
      type: 'string',
    })
    .option('mainBranch', {
      alias: 'mb',
      description: 'Provide main repository branch',
      default: 'main',
      type: 'string',
    })
    .option('base', {
      alias: 'b',
      description: 'Provide manually which base is used',
      describe: 'merge_commit_1',
      type: 'string',
    })
    .option('analyze', {
      alias: 'a',
      description: 'Provide manually which pull requests must be checked',
      describe: '[merge_commit_1, merge_commit_2, ..., merge_commit_N]',
      type: 'string',
    })
    .option('graph', {
      alias: 'g',
      description: 'Output merge variants graph (PNG image)',
      type: 'boolean',
    })
    .option('debug', {
      description: 'Set to see some extra logs',
      type: 'boolean',
    })
    .demandOption(['repo', 'marker'])
    .help()
    .version()
    .alias('help', 'h').argv;
}

/* harmony default export */ const args = (argv);


/***/ }),

/***/ 997:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__) => {
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(760);
/* harmony import */ var _args_js__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(446);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(541);




async function actionConflictor() {
  try {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Repository set to: ${_args_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].repo */ .Z.repo}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Main branch name: ${_args_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].mainBranch */ .Z.mainBranch}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Using deploy label: ${_args_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].marker */ .Z.marker}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Using current folder as git project');

    const pullStats = await (0,_index_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(_args_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);

    console.log('----- PULL REQUESTS STATS ------');
    console.log(pullStats);

    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput('stats', pullStats);
  } catch (error) {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error);
  }
}

await actionConflictor();

__webpack_handle_async_dependencies__();
}, 1);

/***/ }),

/***/ 541:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {


// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ conflictor)
});

;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");
// EXTERNAL MODULE: external "https"
var external_https_ = __nccwpck_require__(687);
;// CONCATENATED MODULE: ./fetch-pulls.js


// query, path, authToken
function httpRequest(params) {
  const options = {
    method: 'GET',
    hostname: 'api.github.com',
    path: `${params.path}?${params.query}`,
    port: 443,
    headers: {
      'User-Agent': 'Conflictor Utility',
      'Accept': 'application/vnd.github+json',
    },
  };

  if (params.authToken) {
    options.headers['Authorization'] = params.authToken;
  }

  return new Promise((resolve, reject) => {
    const req = external_https_.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk.toString();
      });

      res.on('end', (data) => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function fetchPullsByLabel(repo, label) {
  const q = {
    repo: repo,
    is: 'pr',
    label: `"${label.replaceAll(/\s/g, '+')}"`,
  };

  const qString = Object.keys(q)
    .map((key) => `${key}:${q[key]}`)
    .join('+');

  const pulls = await httpRequest({
    path: '/search/issues',
    query: `q=${encodeURI(qString)}+is:open`,
  });

  return pulls.items;
}
async function fetchPullMergeCommit(pull) {
  const pullData = await httpRequest({
    path: (new URL(pull.pull_request.url)).pathname,
  });

  return pullData.head.sha;
}

async function fetchPulls(repo, label) {
  const labeledPulls = await fetchPullsByLabel(repo, label);

  const mergeCommits = [];

  for (let i = 0; i < labeledPulls.length; i++) {
    mergeCommits.push({
      pullNumber: labeledPulls[i].number,
      title: labeledPulls[i].title,
      sha: await fetchPullMergeCommit(labeledPulls[i]),
    });
  }

  return mergeCommits;
}

// EXTERNAL MODULE: ./node_modules/node-graphviz/index.js
var node_graphviz = __nccwpck_require__(905);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(147);
;// CONCATENATED MODULE: ./visualizer.js



function getAlphabet() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  return alphabet;
}

/* harmony default export */ function visualizer(pullsData, mainBranchSha) {
  const ab = getAlphabet();

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

  /*const nodes = [
    {node: 'master', label: 'master', impacts: [], path: [], base: true},
    {node: 'f', label: 'f', impacts: ['i'], path: []},
    {node: 'b', label: 'b', impacts: [], path: []},
    {node: 'd', label: 'd', impacts: [], path: []},
    {node: 'c', label: 'c', impacts: [], path: []},
    {node: 'e', label: 'e', impacts: ['a', 'aa'], path: []},
    {node: 'a', label: 'a', impacts: [], path: []},
    {node: 'aa', label: 'aa', impacts: [], path: []},
    {node: 'i', label: 'i', impacts: ['f', 'g', 'h'], path: []},
    {node: 'g', label: 'g', impacts: ['i'], path: []},
    {node: 'h', label: 'h', impacts: ['i'], path: []},
  ];*/

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

    // levels.pop();
    // levels.push([n]);

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

    // levels.push([n]);

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

            const fNodes = nodes.filter((n, i) => {
              const nParent = n.path.at(-1);

              if (nParent === 'f') {
                return true;
              }
            });
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

  node_graphviz.graphviz.layout(graph, 'svg').then((svg) => {
    // Write the SVG to file
    external_fs_.writeFileSync('graph.svg', svg);
  });
}

;// CONCATENATED MODULE: ./index.js





async function conflictor(args) {
  let directImpactsRegex = />>> DIRECT IMPACT.*$\n(.*\n)*?>>> END/gm;
  let sideImpactsRegex = />>> SIDE IMPACT.*$\n(.*\n)*?>>> END/gm;
  let masterShaRegex = />>> MASTER BRANCH SHA \[(.+)\]$/m;
  let errorRegex = />>> ERROR \[(.+)\]$/m;

  let changes = {};
  let conflicts = {};
  let intersected = {};
  let mergeOrder = [];

  let optionalCommands = '';
  const projectFolder = `cd ${args.project}`;
  const runScript = __nccwpck_require__.ab + "conflicts.sh";

  if (args.base) {
    optionalCommands += `export CONFLICTOR_MASTER_SHA=${args.base} &&`;
  }

  if (args.mainBranch) {
    optionalCommands += `export CONFLICTOR_MAIN_BRANCH=${args.mainBranch} &&`
  }

  const pullsData = await fetchPulls(args.repo, args.marker);

  if (!pullsData.length) {
    return Promise.resolve(Error('NO PULLS TO MERGE'));
  }

  const shaList = pullsData.map(p => p.sha);
  const titlesList = pullsData.map(p => p.title);

  if (args.debug) {
    console.log('Pulls to analyze:', pullsData);
  }

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

  return new Promise((resolve, reject) => {
    (0,external_child_process_namespaceObject.exec)(`${optionalCommands}${projectFolder} && ${runScript} ${shaList.join(' ')}`, (error, stdout, stderr) => {
      if (args.debug) {
        console.log('BASH Debug information:', error, stdout, stderr);
      }

      const errorReceived = stdout.match(errorRegex)?.[1];

      if (errorReceived) {
        throw Error(errorReceived);
      }

      const mainBranchSha = stdout.match(masterShaRegex)[1];

      shaList.push(mainBranchSha);
      titlesList.push(args.mainBranch);

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

      resolve(pullStats);

      if (args.graph) {
        visualizer(pullStats, mainBranchSha);
      }
    });
  });
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var completeQueue = (queue) => {
/******/ 		if(queue) {
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var completeFunction = (fn) => (!--fn.r && fn());
/******/ 	var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackThen]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					completeQueue(queue);
/******/ 					queue = 0;
/******/ 				});
/******/ 				var obj = {};
/******/ 											obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep['catch'](reject));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 							ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 							ret[webpackExports] = dep;
/******/ 							return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue = hasAwait && [];
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var isEvaluating = true;
/******/ 		var nested = false;
/******/ 		var whenAll = (deps, onResolve, onReject) => {
/******/ 			if (nested) return;
/******/ 			nested = true;
/******/ 			onResolve.r += deps.length;
/******/ 			deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 			nested = false;
/******/ 		};
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackThen] = (fn, rejectFn) => {
/******/ 			if (isEvaluating) { return completeFunction(fn); }
/******/ 			if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 			queueFunction(queue, fn);
/******/ 			promise['catch'](rejectFn);
/******/ 		};
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			if(!deps) return outerResolve();
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn, result;
/******/ 			var promise = new Promise((resolve, reject) => {
/******/ 				fn = () => (resolve(result = currentDeps.map((d) => (d[webpackExports]))));
/******/ 				fn.r = 0;
/******/ 				whenAll(currentDeps, fn, reject);
/******/ 			});
/******/ 			return fn.r ? promise : result;
/******/ 		}).then(outerResolve, reject);
/******/ 		isEvaluating = false;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(997);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
