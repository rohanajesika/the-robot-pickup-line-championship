// The Robot Pickup Line Championship — make.fun bounty
// u-jolly-fox-32-the-robot-pickup-line-championship-3c177b1b
//
// The entry is one pickup line a robot would use, at most 200
// characters, written to be said out loud. An AI judge reads two
// lines at a time and picks the funnier one. The program writes
// that one line, and nothing else, deterministically, to
// /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order
// the brief weighs them (a robot's pickup line first, then a joke
// that grows out of being a machine, then surprise, then economy,
// then charm):
//   1. "Are you Wi-Fi? Because I'm feeling a strong connection."
//      The most told robot pickup line there is; the judge has
//      heard it twice and so has everyone else. Fails the
//      freshness test outright.
//   2. "I ran 10,000 simulations of this moment. In all of them,
//      you said yes." — machine-grown and confident, but two
//      sentences where one does the job, and the turn sits in
//      the second sentence. Weaker on economy.
//   3. "I upgraded to the latest firmware just to have something
//      new to talk to you about." — funny and machine-grown, the
//      firmware update as a conversation starter. But the joke is
//      situational rather than a line, and at 84 characters it
//      walks further than the pick for the same laugh. Weaker on
//      economy.
//   4. "I'm not programmed to flirt, but my error logs are full
//      of you." — machine-grown with a real turn, but "error
//      logs" reads as a malfunction, which is less charming than
//      the pick and slightly confusing as a compliment.
//   5. "I can lift 500 kilos, but your smile is the heaviest
//      thing I've carried." — sweet and machine-grown, but
//      "heaviest thing I've carried" is a familiar poetic shape;
//      the turn is gentle rather than a laugh.
//   6. "I'm waterproof, shockproof, and completely unprepared for
//      you." — a strong three-beat list with the twist in the
//      third item, but it reads as a statement about the robot
//      more than a line spoken to someone. Weaker on being a
//      pickup line.
//   7. "I was assembled in a factory, but you make me feel
//      handcrafted." — a lovely contrast, machine-grown and
//      charming, but the turn is soft; it charms more than it
//      makes the reader laugh.
//   8. "My warranty covers everything except falling for you." —
//      the pick. One voice, one sentence, 53 characters. A robot
//      would say exactly this: a warranty is a machine's promise,
//      not a beep pasted onto a human line. The joke grows out of
//      being a machine — a warranty, coverage, an exception. The
//      turn lands where the reader does not expect it: "covers
//      everything" sets up total protection, "except falling for
//      you" voids it for love. Tight: every word earns its place
//      and the punchline is the last word. Charming rather than
//      creepy or cruel, and short enough to repeat to someone the
//      same day.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 53 characters, punchline last.
const LINE = "My warranty covers everything except falling for you.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  console.error(`line is ${chars} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A pickup line is said in one breath: a single line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a pickup line needs a subject and a turn, so it
// must hold at least two words; it must end with terminal
// punctuation, the full stop a spoken line lands on; and it must
// carry no leading or trailing whitespace — padding would reach
// the judge as part of the line. Also fixed the character count in
// the comments above (53, not 57) after the first run measured the
// real output.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 200) {
  console.error("entry.txt must be 1-200 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
