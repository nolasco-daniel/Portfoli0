import {
  siCplusplus,
  siCss,
  siDocker,
  siFigma,
  siGit,
  siGodotengine,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siMysql,
  siNodedotjs,
  siPhp,
  siPython,
} from "simple-icons";

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

const siRestApi: SkillIcon = {
  title: "REST APIs",
  slug: "rest",
  path: "M4 5h16v4H4V5zm0 6h10v3H4v-3zm0 5h16v3H4v-3zm12-5h4v3h-4v-3z",
  hex: "EAF2FB",
};

const siGdscript: SkillIcon = {
  title: "GDScript",
  slug: "gdscript",
  path: "M12 2l7 4v8c0 4-3 7-7 8-4-1-7-4-7-8V6l7-4zm-3 7v6h3.5c1.9 0 3.5-1.3 3.5-3s-1.6-3-3.5-3H9zm2 1.8h1.4c0.9 0 1.6 0.5 1.6 1.2s-0.7 1.2-1.6 1.2H11v-2.4z",
  hex: "478CBF",
};

// 3x5 grid consumed by the 3D keyboard and mobile skills grid.
export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = [
  [siMysql, siPhp, siJavascript, siRestApi, siPython],
  [siHtml5, siCss, siNodedotjs, siDocker, siGooglecloud],
  [siGodotengine, siCplusplus, siGdscript, siFigma, siGit],
] as const;

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();

