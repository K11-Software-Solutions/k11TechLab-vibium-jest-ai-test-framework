import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const pageObjectsDir = path.join(repoRoot, 'src', 'k11-platform', 'pageObjects');
const vibiumSetupPath = path.join(repoRoot, 'src', 'k11-platform', 'hooks', 'vibiumSetup.ts');

function loadEnvFile() {
  const envPath = path.join(repoRoot, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split('=');
    const key = rawKey.trim();
    if (!key) {
      continue;
    }

    if (inlineValue !== undefined) {
      args[key] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }

  return args;
}

function toSlug(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toCamel(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function resolvePageObject(inputName) {
  const files = fs.readdirSync(pageObjectsDir).filter((name) => name.endsWith('.ts'));
  const normalizedInput = inputName.toLowerCase().replace(/\.ts$/i, '').replace(/page$/i, '');

  for (const fileName of files) {
    const normalizedFile = fileName.toLowerCase().replace(/\.ts$/i, '').replace(/page$/i, '');
    if (normalizedInput === normalizedFile) {
      return path.join(pageObjectsDir, fileName);
    }
  }

  throw new Error(`Could not find page object "${inputName}". Available files: ${files.join(', ')}`);
}

function parseClassName(pageObjectSource, fallbackFileName) {
  const classMatch = pageObjectSource.match(/export\s+class\s+(\w+)/);
  if (classMatch) {
    return classMatch[1];
  }

  return path.basename(fallbackFileName, '.ts');
}

function parseMethods(pageObjectSource) {
  const methods = [];
  const regex = /^\s*async\s+(\w+)\s*\(/gm;
  let match = regex.exec(pageObjectSource);

  while (match) {
    const methodName = match[1];
    if (!['setInputValue', 'setSelectValue'].includes(methodName)) {
      methods.push(methodName);
    }
    match = regex.exec(pageObjectSource);
  }

  return methods;
}

function resolvePageAlias(className) {
  const setupSource = readText(vibiumSetupPath);
  const aliasMatch = setupSource.match(new RegExp(`let\\s+(\\w+)\\s*:\\s*${className}\\s*;`));
  if (aliasMatch) {
    return aliasMatch[1];
  }

  return toCamel(className.replace(/Page$/, ''));
}

function resolveDefaultOutput(pageObjectName, goal, testType) {
  const safeGoal = toSlug(goal || 'generated-test');
  const safePageObject = toSlug(pageObjectName);
  return path.join(
    repoRoot,
    'src',
    'k11-platform',
    'tests',
    'generated',
    `${safePageObject}.${testType}.${safeGoal}.ai.test.ts`,
  );
}

function findBestMethod(methods, candidates) {
  return methods.find((methodName) =>
    candidates.some((candidate) => methodName.toLowerCase().includes(candidate.toLowerCase())),
  );
}

function inferActionFromGoal(methods, goal) {
  const lowerGoal = goal.toLowerCase();

  const keywordSets = [
    { keywords: ['service', 'services'], candidates: ['clickExploreServices', 'goToServices'] },
    { keywords: ['contact'], candidates: ['clickContact'] },
    { keywords: ['insight'], candidates: ['goToInsights'] },
    { keywords: ['dashboard'], candidates: ['goToDashboard'] },
    { keywords: ['tech lab', 'tech-lab'], candidates: ['goToTechLab'] },
    { keywords: ['submit'], candidates: ['submitForm'] },
    { keywords: ['checkbox'], candidates: ['checkCheckbox'] },
    { keywords: ['radio'], candidates: ['selectRadio'] },
    { keywords: ['dropdown', 'select'], candidates: ['selectDropdown'] },
    { keywords: ['login'], candidates: ['loginWithWait', 'login'] },
  ];

  for (const entry of keywordSets) {
    if (entry.keywords.some((keyword) => lowerGoal.includes(keyword))) {
      const match = findBestMethod(methods, entry.candidates);
      if (match) {
        return match;
      }
    }
  }

  return methods.find((methodName) => !['goto'].includes(methodName) && !methodName.startsWith('verify'));
}

function buildFallbackCode(context) {
  const {
    alias,
    className,
    goal,
    outputPath,
    testType,
    methods,
  } = context;

  const importPath = path.relative(path.dirname(outputPath), vibiumSetupPath).replace(/\\/g, '/').replace(/\.ts$/, '');
  const describeTitle = `AI Generated ${className} ${testType} flow`;
  const testTitle = goal;
  const verifyMethod = findBestMethod(methods, ['verify', 'visible']);
  const actionMethod = inferActionFromGoal(methods, goal);
  const bodyLines = [];

  if (verifyMethod) {
    bodyLines.push(`    await ${alias}.${verifyMethod}();`);
  }

  if (actionMethod === 'loginWithWait') {
    bodyLines.push(`    await ${alias}.loginWithWait('testuser', 'testpass', 15000);`);
    bodyLines.push(`    expect(await page.url()).toContain('dashboard');`);
  } else if (actionMethod === 'login') {
    bodyLines.push(`    await ${alias}.login('wronguser', 'wrongpass');`);
    bodyLines.push(`    expect(await page.url()).toContain('/login');`);
  } else if (actionMethod === 'fillForm') {
    bodyLines.push(`    await ${alias}.fillForm({ text: 'AI Generated User', checked: true, radio: 1, dropdownValue: 'Option 1' });`);
  } else if (actionMethod === 'selectRadio') {
    bodyLines.push(`    await ${alias}.selectRadio(1);`);
  } else if (actionMethod === 'selectDropdown') {
    bodyLines.push(`    await ${alias}.selectDropdown('Option 1');`);
  } else if (actionMethod) {
    bodyLines.push(`    await ${alias}.${actionMethod}();`);
  }

  if (actionMethod === 'submitForm' && verifyMethod) {
    bodyLines.push(`    await ${alias}.${verifyMethod}();`);
  } else if (!actionMethod && verifyMethod) {
    bodyLines.push(`    expect(await page.url()).toBeTruthy();`);
  } else {
    bodyLines.push(`    expect(await page.url()).toBeTruthy();`);
  }

  return `import { setupVibium, teardownVibium, page, ${alias} } from '${importPath}';

jest.setTimeout(120000);

beforeAll(async () => {
  await setupVibium();
}, 30000);

afterAll(async () => {
  await teardownVibium();
}, 30000);

describe('${describeTitle}', () => {
  beforeEach(async () => {
    if (typeof ${alias}.goto === 'function') {
      await ${alias}.goto();
    }
  }, 30000);

  it('${testTitle}', async () => {
${bodyLines.join('\n')}
  }, 30000);
});
`;
}

async function generateWithOpenAI(context) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const endpoint = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/responses';
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const responseSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      summary: { type: 'string' },
      code: { type: 'string' },
    },
    required: ['summary', 'code'],
  };

  const systemPrompt = [
    'You generate TypeScript Jest tests for a Vibium-based automation repo.',
    'Return only valid JSON matching the provided schema.',
    'Use the shared setup import from vibiumSetup.',
    'Prefer stable assertions on URL or existing page-object verify methods.',
    'Do not invent unsupported Vibium APIs.',
  ].join(' ');

  const userPrompt = [
    `Goal: ${context.goal}`,
    `Test type: ${context.testType}`,
    `Page object class: ${context.className}`,
    `Shared alias from setup: ${context.alias}`,
    `Available methods: ${context.methods.join(', ') || 'none'}`,
    'Shared setup file:',
    context.vibiumSetupSource,
    'Target page object file:',
    context.pageObjectSource,
    `Output import path for vibium setup: ${context.importPath}`,
    'Produce a complete Jest test file in TypeScript.',
  ].join('\n\n');

  const apiResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'vibium_test_generation',
          schema: responseSchema,
          strict: true,
        },
      },
    }),
  });

  if (!apiResponse.ok) {
    throw new Error(`OpenAI request failed: ${apiResponse.status} ${await apiResponse.text()}`);
  }

  const payload = await apiResponse.json();
  const raw = payload.output_text;
  if (!raw) {
    throw new Error('OpenAI response did not include output_text.');
  }

  const parsed = JSON.parse(raw);
  return {
    code: parsed.code,
    summary: parsed.summary,
    model,
  };
}

async function main() {
  loadEnvFile();

  const args = parseArgs(process.argv.slice(2));
  const pageObjectName = args['page-object'] || args.pageObject;
  const goal = args.goal || args.prompt || args.scenario;
  const testType = (args.type || 'functional').toLowerCase();
  const shouldRun = args.run === true || args.run === 'true';

  if (!pageObjectName || !goal) {
    console.error('Usage: node scripts/ai/generate-test.mjs --page-object HomePage --goal "Verify hero and navigate to services" [--type functional] [--output path]');
    process.exit(1);
  }

  const pageObjectPath = resolvePageObject(pageObjectName);
  const pageObjectSource = readText(pageObjectPath);
  const className = parseClassName(pageObjectSource, pageObjectPath);
  const alias = resolvePageAlias(className);
  const methods = parseMethods(pageObjectSource);
  const outputPath = path.resolve(args.output || resolveDefaultOutput(className, goal, testType));
  const importPath = path.relative(path.dirname(outputPath), vibiumSetupPath).replace(/\\/g, '/').replace(/\.ts$/, '');

  const context = {
    alias,
    className,
    goal,
    importPath,
    methods,
    outputPath,
    pageObjectPath,
    pageObjectSource,
    testType,
    vibiumSetupSource: readText(vibiumSetupPath),
  };

  let generation;
  let usedFallback = false;

  try {
    generation = await generateWithOpenAI(context);
  } catch (error) {
    console.warn(`[ai-generator] OpenAI generation failed, using local fallback. ${error.message}`);
  }

  if (!generation) {
    usedFallback = true;
    generation = {
      code: buildFallbackCode(context),
      summary: 'Generated from local repo-aware template fallback.',
    };
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generation.code, 'utf8');

  const result = {
    outputPath: path.relative(repoRoot, outputPath).replace(/\\/g, '/'),
    usedFallback,
    summary: generation.summary,
    pageObject: className,
    alias,
    methods,
    model: generation.model || null,
    runRequested: shouldRun,
    runSucceeded: null,
  };

  if (shouldRun) {
    const relativeTestPath = path.relative(repoRoot, outputPath).replace(/\\/g, '/');
    result.runSucceeded = await new Promise((resolve) => {
      const isWindows = process.platform === 'win32';
      const command = isWindows ? 'npx jest' : 'npx';
      const args = isWindows ? [relativeTestPath, '--runInBand'] : ['jest', relativeTestPath, '--runInBand'];
      const child = spawn(command, args, {
        cwd: repoRoot,
        stdio: 'inherit',
        shell: isWindows,
      });

      child.on('exit', (code) => resolve(code === 0));
      child.on('error', () => resolve(false));
    });
  }

  console.log(JSON.stringify(result, null, 2));
}

await main();
