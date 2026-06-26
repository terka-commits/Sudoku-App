import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const [, , platform, profile, ...noteParts] = process.argv;

if (!platform || !profile) {
  console.error('Usage: node scripts/eas-build.mjs <android|ios> <dev|prod|preview|production> [note]');
  process.exit(1);
}

if (!['android', 'ios'].includes(platform)) {
  console.error(`Unsupported platform "${platform}". Use "android" or "ios".`);
  process.exit(1);
}

const rootDir = process.cwd();
const appConfigPath = path.join(rootDir, 'app.json');
const easConfigPath = path.join(rootDir, 'eas.json');

const appConfig = JSON.parse(readFileSync(appConfigPath, 'utf8'));
const easConfig = JSON.parse(readFileSync(easConfigPath, 'utf8'));
const expoConfig = appConfig.expo ?? {};
const buildProfiles = easConfig.build ?? {};

const appLabel = 'SudokuApp';
const version = expoConfig.version ?? '0.0.0';
const normalizedProfile = profile === 'preview' ? 'dev' : profile === 'production' ? 'prod' : profile;
const profileConfig = buildProfiles[profile] ?? {};
const inheritedProfileName = profileConfig.extends;
const inheritedProfile = inheritedProfileName ? buildProfiles[inheritedProfileName] ?? {} : {};
const autoIncrement = profileConfig.autoIncrement ?? inheritedProfile.autoIncrement ?? false;

const currentBuildNumber =
  platform === 'android'
    ? Number(expoConfig.android?.versionCode ?? 0)
    : Number(expoConfig.ios?.buildNumber ?? 0);

const nextBuildNumber = autoIncrement ? currentBuildNumber + 1 : currentBuildNumber;
const platformLabel = platform === 'android' ? 'Android' : 'iOS';
const note = noteParts.join(' ').trim();

const messageParts = [
  appLabel,
  platformLabel,
  normalizedProfile,
  `v${version}`,
  `build ${nextBuildNumber}`,
];

if (note) {
  messageParts.push(note);
}

const message = messageParts.join(' | ');

console.log(`Starting EAS build with message: ${message}`);

const easArgs = ['eas', 'build', '--platform', platform, '--profile', profile, '--message', message];
const command = process.platform === 'win32' ? 'npx eas' : 'npx';
const commandArgs = process.platform === 'win32' ? ['build', '--platform', platform, '--profile', profile, '--message', message] : easArgs;
const result = spawnSync(command, commandArgs, {
  cwd: rootDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
