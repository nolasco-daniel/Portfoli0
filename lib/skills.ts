import {
  siCplusplus,
  siCss,
  siExpress,
  siGodotengine,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPython,
  siReact,
  siTypescript,
  siVite,
  siVuedotjs,
} from "simple-icons";

type SimpleIconSource = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

function skill(icon: SimpleIconSource, title = icon.title): SkillIcon {
  return { title, slug: icon.slug, path: icon.path, hex: icon.hex };
}

const siJava: SkillIcon = {
  title: "Java",
  slug: "java",
  path: "M8.3 18.7c-2.6.7 1.6 2.1 5.2 1 1.3-.4 2.4-1 2.4-1 .5.5 1.5.8 1.5.8-5.3 2.8-12 .2-9.1-.8zm-1.2-2.2c-2.1.5 1.1 1.7 4 1.2 1.9-.3 3.1-1.1 3.1-1.1.5.5 1.2.7 1.2.7-4.1 2-9.9.2-8.3-.8zM16.6 3.2s-3.6.9-3.8 3.3c-.1 1.7 1.6 2.5 1.6 4.1 0 1.5-1.4 2.4-1.4 2.4s2.4-.7 2.7-2.9c.2-1.8-1.7-2.7-1.6-4.2.1-1.4 2.5-2.7 2.5-2.7zm-5.5.4S8.5 4.9 8.6 6.8c.1 1.4 1.4 2 1.4 3.2s-1.1 1.9-1.1 1.9 2-.5 2.3-2.3c.2-1.5-1.4-2.2-1.3-3.4.1-1.1 1.2-2.6 1.2-2.6zm-5.4 9.8c-.9.8.5 1.6 2.6 1.8 1.6.2 3.8-.1 6.2-.9l-.9.9c-3.1.8-6.4.5-8.1-.3-1.3-.7-.9-1.2.2-1.5zm11.5 8.1c-4 1.9-10.4 1.5-13.2.2 0 0 .7.9 4.5 1.2 5 .5 10.1-.6 10.2-2.5 0 0-.3.5-1.5 1.1z",
  hex: "F89820",
};

// 3-row grid consumed by the 3D keyboard and mobile skills grid.
export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = [
  [
    skill(siJavascript),
    skill(siTypescript),
    skill(siReact),
    skill(siNextdotjs),
    skill(siVuedotjs),
  ],
  [
    skill(siVite),
    skill(siCss),
    skill(siGodotengine, "Godot"),
    skill(siNodedotjs),
    skill(siExpress),
  ],
  [
    siJava,
    skill(siPhp),
    skill(siPython),
    skill(siMysql),
    skill(siCplusplus),
  ],
] as const;

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();

