/**
 * 版本与导航徽章的单一事实源
 * --------------------------------------------------------------------------
 * 主导航三大板块标题右上角的徽章（版本号 + 发布阶段）统一在这里维护：
 * 每个产品只声明「版本号」与「发布阶段」，徽章文案与配色都由阶段推导，不再手写。
 *
 * withNavBadge 把徽章拼进 nav 的 item.text，VitePress 以 v-html 渲染该字段，
 * 宽屏导航栏（VPNavBarMenuLink）与窄屏汉堡菜单（VPNavScreenMenuLink）读的是同一份 text，
 * 因此两处自动一致，无需分别写选择器。
 *
 * 外观见 theme/overrides.css 中的 .xh-nav-badge。
 */

/** 发布阶段 */
export enum ReleaseStage {
  /** 开发版：非常早期的开发阶段，可能非常不稳定，如 1.0.0-alpha、1.0.0-alpha.1 */
  Alpha = 1,
  /** 测试版：测试阶段，可能包含一些不稳定的功能，如 1.0.0-beta、1.0.0-beta.1 */
  Beta = 2,
  /** 预览版：测试阶段，可能包含一些不稳定的功能，如 1.0.0-preview、1.0.0-preview.1 */
  Preview = 3,
  /** 候选版：测试阶段，可能包含一些不稳定的功能，如 1.0.0-rc、1.0.0-rc.1 */
  Rc = 4,
  /** 稳定版：已经稳定，不包含任何不稳定的功能，如 1.0.0 */
  Release = 5,
}

/** 徽章配色。新增取值需在 overrides.css 补上对应的 .xh-nav-badge--* */
export type NavBadgeType = "tip" | "warning" | "danger";

export interface ProductRelease {
  /** 版本号，不含阶段后缀，如 "3.5.0" */
  version: string;
  /** 发布阶段，决定徽章后缀与配色 */
  stage: ReleaseStage;
}

export interface NavBadge {
  /** 徽章文案，如 "v3.5.0"、"v0.9.8-alpha" */
  text: string;
  /** 徽章配色 */
  type: NavBadgeType;
}

/**
 * 各产品的发布状态。
 *
 * 三者是独立发版的仓库，framework 与 basicApp 当前恰好同为 3.7.0，
 * 不要合并成一个常量，也不要复用文档站自身 package.json 的版本号。真源分别是：
 *   framework → XiHan.Framework/framework/props/version.props
 *   ui        → XiHan.UI/ui/packages/xihan-ui/package.json
 *   basicApp  → XiHan.BasicApp/backend/props/version.props
 */
export const releases = {
  framework: { version: "3.7.0", stage: ReleaseStage.Release },
  ui: { version: "0.9.8", stage: ReleaseStage.Alpha },
  basicApp: { version: "3.7.0", stage: ReleaseStage.Release },
} satisfies Record<string, ProductRelease>;

/** 阶段 → 版本后缀与徽章配色 */
const stageStyles: Record<ReleaseStage, { suffix: string; badge: NavBadgeType }> = {
  [ReleaseStage.Alpha]: { suffix: "-alpha", badge: "danger" },
  [ReleaseStage.Beta]: { suffix: "-beta", badge: "danger" },
  [ReleaseStage.Preview]: { suffix: "-preview", badge: "warning" },
  [ReleaseStage.Rc]: { suffix: "-rc", badge: "warning" },
  [ReleaseStage.Release]: { suffix: "", badge: "tip" },
};

/** 由发布状态推导徽章 */
export function toNavBadge(release: ProductRelease): NavBadge {
  const { suffix, badge } = stageStyles[release.stage];
  return { text: `v${release.version}${suffix}`, type: badge };
}

/** 把徽章拼到导航标题末尾 */
export function withNavBadge(text: string, release: ProductRelease): string {
  const badge = toNavBadge(release);
  return `${text}<span class="xh-nav-badge xh-nav-badge--${badge.type}">${badge.text}</span>`;
}
