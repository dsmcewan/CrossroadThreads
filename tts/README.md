# Audio Tour Generation

Narration MP3s for the Archive's audio tour, synthesized locally with a VITS
model ([baj-tts](https://github.com/enlyth/baj-tts) checkpoint via
[coqui-tts](https://pypi.org/project/coqui-tts/)).

## One-time setup

```powershell
python -m uv venv --python 3.11 tts/.venv
python -m uv pip install --python tts/.venv "coqui-tts[codec]" "transformers==4.57.1" torch torchaudio lameenc
winget install eSpeak-NG.eSpeak-NG
# model (~1 GB):
curl.exe -L -o tts/models/config.json https://huggingface.co/enlyth/baj-tts/resolve/main/models/config.json
curl.exe -L -o tts/models/david.pth  https://huggingface.co/enlyth/baj-tts/resolve/main/models/david.pth
```

## Generate

```powershell
npm run audio          # all designs (cached by text+model hash)
npm run audio -- --only medusa,boudica
```

Outputs `public/audio/<slug>.mp3` (committed — CI does not run TTS) and
`src/data/audio.manifest.json` (tells the UI which exhibits have narration).

## Voice

`tts/voice.json` picks the checkpoint. The current voice is a clone of a
living broadcaster — acceptable for local/demo use, but **swap in a licensed
or generic narrator voice before commercial launch** (likeness rights; see
BRAND.md's "no likenesses" rule). Changing the model file invalidates the
cache automatically, so a full regeneration is one command.
