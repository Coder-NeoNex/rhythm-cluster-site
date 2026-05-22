# Octahedron + Tri Animation Whitelist (Baseline)
# 八面体 + Tri 动画白名单（基线）

This whitelist is the approved baseline for the homepage 3D mark animation.
本白名单是首页 3D 标识动画的已确认基线。

Any future visible change must explicitly state which whitelist item is being changed.
后续任何可见改动，都必须明确说明改动了白名单中的哪一条。

## 1) Scene and Geometry Locks
## 1）场景与几何锁定项

- [ ] Canvas size stays `450 x 780` (`WIDTH=450`, `HEIGHT=780`)
  中文：画布尺寸固定为 `450 x 780`（宽高常量不改）。
- [ ] Camera stays `OrthographicCamera`, `frustumSize=20`, `zoom=3`, `z=5`
  中文：相机固定为正交相机，视锥大小、缩放和 Z 位置不改。
- [ ] Core geometry stays `OctahedronGeometry(1.2, 0)`
  中文：核心八面体几何参数固定为 `(1.2, 0)`。
- [ ] Core mesh entrance target scale stays `(0.82, 1.3, 0.82)`
  中文：八面体入场后目标缩放固定为 `(0.82, 1.3, 0.82)`。
- [ ] Surrounding shapes stay `tri1` to `tri20` with existing coordinates
  中文：周围 `tri1` 到 `tri20` 的坐标保持当前版本，不重画。

## 2) Rendering and Line Rules
## 2）渲染与线条规则

- [ ] All `LineMaterial` instances keep `resolution.set(WIDTH, HEIGHT)`
  中文：所有 `LineMaterial` 必须持续设置分辨率，否则线宽会异常。
- [ ] Core wireframe keeps `linewidth=3`, `opacity=0.85`
  中文：八面体主线框线宽与透明度固定。
- [ ] Tri wireframes keep `linewidth=1.5`, `opacity=0.85`
  中文：周围 tri 线框线宽与透明度固定。
- [ ] `polygonOffset` settings remain enabled (core `-1/-1`, tri `-2/-2`)
  中文：`polygonOffset` 必须开启，且参数保持当前值，避免深度冲突。
- [ ] Fill meshes remain children of each `triN` object (not reparented)
  中文：fill 面片必须继续挂在各自 `triN` 下，不能改父子关系。

## 3) Theme Behavior Locks
## 3）主题行为锁定项

- [ ] Theme source priority:
`localStorage.theme` (`dark` or `light`) overrides system theme
  中文：主题优先级固定为“用户手动主题（localStorage）优先于系统主题”。
- [ ] Fallback to system theme only when no stored theme exists
  中文：只有用户未手动设置时，才跟随系统深浅色。
- [ ] Dark palette:
faces `[0x151515 x4, 0x060606 x4]`, wireframe `0xffffff`, hover `0x2a2a2a`
  中文：深色模式下，面色/线色/hover 色固定为当前这组值。
- [ ] Light palette:
faces `[0xeaeaea x4, 0xf5f5f5 x4]`, wireframe `0x1a1a1a`, hover `0xfcfcfc`
  中文：浅色模式下，面色/线色/hover 色固定为当前这组值。
- [ ] In `macOS dark + page light`, visual output must match `macOS light + page light`
  中文：在“系统深色 + 网页浅色”时，显示效果必须与“系统浅色 + 网页浅色”一致。

## 4) Motion Locks
## 4）运动锁定项

- [ ] Base rotation remains `X=+8°`, `Y=+17°`, `Z=0°`
  中文：默认姿态固定为 X +8°、Y +17°、Z 0°。
- [ ] Mouse follow range remains `X ±15°`, `Y ±20°`
  中文：鼠标跟随幅度保持 X ±15°、Y ±20°。
- [ ] Main lerp remains `0.05`
  中文：主旋转平滑插值系数保持 `0.05`。
- [ ] Layer delayed lerp factors remain `[0.04, 0.032, 0.026, 0.021, 0.017]`
  中文：分层延迟旋转的插值系数数组保持不变。

## 5) Entrance and Breathing Locks
## 5）入场与呼吸锁定项

- [ ] Entrance animation remains `duration=1400ms`, `ease=outElastic(1, .6)`
  中文：入场动画时长和缓动固定为当前值。
- [ ] Entrance affects mesh, core wireframe, and all `tri1..tri20`
  中文：入场动画必须覆盖八面体、主线框和全部 tri。
- [ ] Breathing starts after `1800ms`
  中文：呼吸动画启动延迟固定为 1800ms。
- [ ] Breathing amplitude remains `y=+0.05 / -0.05`
  中文：呼吸上下浮动幅度固定为 ±0.05。
- [ ] Breathing duration remains `2200ms` each half-cycle, `ease=inOutSine`
  中文：呼吸每半程时长与缓动固定为当前值。

## 6) Wave (rAF) Locks
## 6）Wave（rAF）锁定项

- [ ] Wave driver remains centralized in `updateWaveScales()` via rAF
  中文：波浪动画必须继续由 `updateWaveScales()` 统一驱动。
- [ ] No per-shape independent anime loop is introduced
  中文：禁止改回“每个 shape 单独循环”，防止不同步。
- [ ] Timing remains:
`base delay=2000ms`, `stagger=350ms`, `pop=600ms`, `fall=2400ms`, `pause=600ms`
  中文：Wave 的时序参数保持当前这组值。
- [ ] Scale envelope remains `1 -> 1.012 -> 1`
  中文：Wave 缩放曲线保持 `1 -> 1.012 -> 1`。
- [ ] Rippled shapes are temporarily excluded via `ripplingShapeIndices`
  中文：涟漪期间对应 shape 继续通过 `ripplingShapeIndices` 暂时跳过 wave。

## 7) Ripple and Click Feedback Locks
## 7）涟漪与点击反馈锁定项

- [ ] Click does not navigate; it only triggers visual feedback
  中文：点击不跳转，仅触发视觉反馈。
- [ ] Octahedron face flash timing remains `60ms + 60ms`
  中文：八面体面片闪烁时序固定为 `60ms + 60ms`。
- [ ] Ripple scale remains `1 -> 1.08 -> 1`
  中文：涟漪缩放幅度保持 `1 -> 1.08 -> 1`。
- [ ] Ripple scale timing remains `120ms + 120ms`, `ease=outQuad`
  中文：涟漪缩放时长和缓动保持当前值。
- [ ] Ripple face opacity flash remains `0 -> 1 -> 0` with `80ms + 80ms`
  中文：涟漪 fill 面片透明度闪烁保持当前时序。
- [ ] Ripple stagger remains `80ms`
  中文：涟漪逐个触发间隔保持 80ms。
- [ ] Flash color remains:
dark mode `white`, light mode `black`
  中文：闪光颜色规则保持“深色白闪、浅色黑闪”。

## 8) Direction Mapping Locks
## 8）方向映射锁定项

- [ ] Faces `4,7` -> top-left -> `tri1..tri5`
  中文：面 `4,7` 映射到左上组 `tri1..tri5`。
- [ ] Faces `0,3` -> top-right -> `tri6..tri10`
  中文：面 `0,3` 映射到右上组 `tri6..tri10`。
- [ ] Faces `1,2` -> bottom-right -> `tri11..tri15`
  中文：面 `1,2` 映射到右下组 `tri11..tri15`。
- [ ] Faces `5,6` -> bottom-left -> `tri16..tri20`
  中文：面 `5,6` 映射到左下组 `tri16..tri20`。

## 9) Interaction and Accessibility Locks
## 9）交互与可访问性锁定项

- [ ] Hover feedback remains active with `cursor=pointer` on face hit
  中文：命中面片时保持 hover 高亮与手型光标。
- [ ] Keyboard trigger remains `Enter` and `Space` on focused container
  中文：键盘触发保持 `Enter` 与空格键。
- [ ] Theme updates remain reactive through class observation + media listener
  中文：主题更新继续由 class 监听 + media 监听联动触发。

## 10) Change Protocol
## 10）变更协议

- [ ] Any future change request must name exact whitelist sections/items to change
  中文：后续改动请求必须明确到“第几节第几条”。
- [ ] If an item is changed, update this file and `PROJECT_STATUS.md` in same task
  中文：改动任一白名单条目时，同步更新本文件与 `PROJECT_STATUS.md`。
- [ ] Do not ship visual changes until NAS deploy verification is completed
  中文：可见改动在完成 NAS 部署验证前不算交付完成。
