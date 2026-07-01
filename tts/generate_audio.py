"""Batch-generate audio-guide narration for The Crossroad Archive.

Reads src/data/catalog.generated.json, synthesizes each design's audioGuide
text with a VITS model (baj-tts checkpoint), and writes MP3s to
public/audio/<slug>.mp3 plus a manifest at src/data/audio.manifest.json.

Voice is a config choice (tts/voice.json) so the narrator can be swapped
before commercial launch. Caching: skips slugs whose text hash is unchanged.

Run from repo root:
  tts/.venv/Scripts/python tts/generate_audio.py [--only slug1,slug2]
"""

import argparse
import hashlib
import json
import sys
from pathlib import Path

import lameenc
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "src" / "data" / "catalog.generated.json"
VOICE_CONFIG = ROOT / "tts" / "voice.json"
OUT_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "src" / "data" / "audio.manifest.json"
CACHE = ROOT / "tts" / ".audio-cache.json"


def normalize(text: str) -> str:
    """Replace typography the LJSpeech phoneme set can't voice with plain
    equivalents so pauses and quotes survive synthesis."""
    replacements = {
        "—": ", ",  # em dash — reads as a beat
        "–": ", ",  # en dash
        "‘": "'",
        "’": "'",
        "“": '"',
        "”": '"',
        "…": "...",
        "·": ", ",
        " ": " ",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return " ".join(text.split())


def load_json(p: Path, default=None):
    if not p.exists():
        return default
    return json.loads(p.read_text(encoding="utf8"))


def encode_mp3(wav: np.ndarray, sample_rate: int, dest: Path) -> None:
    pcm = np.clip(wav, -1.0, 1.0)
    pcm16 = (pcm * 32767).astype(np.int16)
    enc = lameenc.Encoder()
    enc.set_bit_rate(64)
    enc.set_in_sample_rate(sample_rate)
    enc.set_channels(1)
    enc.set_quality(2)
    data = enc.encode(pcm16.tobytes()) + enc.flush()
    dest.write_bytes(bytes(data))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated slugs to regenerate")
    args = ap.parse_args()

    voice = load_json(VOICE_CONFIG)
    if not voice:
        print("missing tts/voice.json", file=sys.stderr)
        return 1
    catalog = load_json(CATALOG)
    if not catalog:
        print("missing catalog — run: npm run catalog", file=sys.stderr)
        return 1

    only = set(args.only.split(",")) if args.only else None
    cache = load_json(CACHE, {})
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    designs = catalog["designs"]
    todo = []
    for d in designs:
        if only and d["slug"] not in only:
            continue
        text = normalize(d["audioGuide"].strip())
        key = hashlib.sha1(f'{voice["model"]}|{text}'.encode()).hexdigest()
        dest = OUT_DIR / f'{d["slug"]}.mp3'
        if cache.get(d["slug"]) == key and dest.exists():
            continue
        todo.append((d["slug"], text, key, dest))

    print(f"{len(todo)} narrations to synthesize ({len(designs)} designs total)")
    if todo:
        # import late: torch load is slow
        from TTS.utils.synthesizer import Synthesizer

        synth = Synthesizer(
            tts_checkpoint=str(ROOT / "tts" / voice["model"]),
            tts_config_path=str(ROOT / "tts" / voice["config"]),
            use_cuda=voice.get("cuda", False),
        )
        sr = synth.output_sample_rate
        for i, (slug, text, key, dest) in enumerate(todo, 1):
            wav = synth.tts(text)
            encode_mp3(np.asarray(wav, dtype=np.float32), sr, dest)
            cache[slug] = key
            print(f"  [{i}/{len(todo)}] {slug} ({dest.stat().st_size // 1024} KB)")
            CACHE.write_text(json.dumps(cache, indent=2), encoding="utf8")

    manifest = {
        "voice": voice.get("label", "unknown"),
        "files": sorted(p.stem for p in OUT_DIR.glob("*.mp3")),
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf8")
    print(f"manifest: {len(manifest['files'])} audio files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
