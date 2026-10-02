/**
 * 导航徽章的单一事实源
 * --------------------------------------------------------------------------
 * 主导航三大板块标题右上角的发布阶段徽章统一在这里维护：
 * 每个产品只声明「发布阶段」，徽章文案与配色都由阶段推导，不写具体版本号。
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
  /** 发布阶段，决定徽章文案与配色 */
  stage: ReleaseStage;
}

export interface NavBadge {
  /** 徽章文案，如 "稳定版"、"预览版" */
  text: string;
  /** 徽章配色 */
  type: NavBadgeType;
}

/**
 * 各产品的发布阶段。
 *
 * 三者是独立发版的仓库，阶段各走各的，不要合并成一个常量。具体版本号以各自的 NuGet / npm 发布为准。
 */
export const releases = {
  framework: { stage: ReleaseStage.Release },
  ui: { stage: ReleaseStage.Release },
  basicApp: { stage: ReleaseStage.Release },
} satisfies Record<string, ProductRelease>;

/** 阶段 → 徽章文案与配色 */
const stageBadges: Record<ReleaseStage, NavBadge> = {
  [ReleaseStage.Alpha]: { text: "开发版", type: "danger" },
  [ReleaseStage.Beta]: { text: "测试版", type: "danger" },
  [ReleaseStage.Preview]: { text: "预览版", type: "warning" },
  [ReleaseStage.Rc]: { text: "候选版", type: "warning" },
  [ReleaseStage.Release]: { text: "稳定版", type: "tip" },
};

/** 由发布阶段推导徽章 */
export function toNavBadge(release: ProductRelease): NavBadge {
  return stageBadges[release.stage];
}

/** 把徽章拼到导航标题末尾 */
export function withNavBadge(text: string, release: ProductRelease): string {
  const badge = toNavBadge(release);
  return `${text}<span class="xh-nav-badge xh-nav-badge--${badge.type}">${badge.text}</span>`;
}
