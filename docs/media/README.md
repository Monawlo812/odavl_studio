# Media & Recording Guide (Wave 3)

Required shots (replace placeholders):

1. **Scan** panel + diffs
2. **Heal** (apply or dry-run)
3. **Shadow** checks passing
4. **Open PR** with template + metrics

## Record → GIF (quick)

**macOS**

- Press **Shift+Cmd+5** (record region → .mov)
- Or QuickTime → New Screen Recording
- Convert:
  ```bash
  ffmpeg -y -i in.mp4 -vf "fps=10,scale=1280:-1:flags=lanczos,palettegen" palette.png
  ffmpeg -y -i in.mp4 -i palette.png -lavfi "fps=10,scale=1280:-1:flags=lanczos[x];[x][1:v]paletteuse" out.gif
  ```

**Windows**

- Win+Alt+R (Xbox Game Bar) أو ShareX → MP4
- ثم ffmpeg كما أعلاه

**Linux**

- OBS أو Peek → MP4/GIF مباشر

## Tips

- 5–10s لكل لقطة، عرض 1280px، < 5MB
- أخفِ المحتوى الحساس، واجهة نظيفة
- اسم الملف: `docs/media/wave3-<shot>.gif`
- استبدل: scan.png, heal.png, shadow.png, pr.png
