import type React from "react";
import packsManifest from "../../core/icons/icon-packs.json";
import kniIcons from "../../core/icons/kni-icons.json";
import phosphorIcons from "../../core/icons/phosphor-icons.json";

/** Id ikony: `kni-*` z zestawu KNI albo nazwa z paczki Phosphor, np. `shield-check`. */
export type TopicIconName = string;

type IconPack = {
  id: string;
  label: string;
  file: string;
  viewBox: string;
  render: "stroke" | "fill";
  strokeWidth?: number;
};

const PACKS = (packsManifest as {packs: IconPack[]}).packs;

const PACK_ICONS: Record<string, Record<string, string>> = {
  kni: kniIcons as Record<string, string>,
  phosphor: phosphorIcons as Record<string, string>
};

export const DEFAULT_TOPIC_ICON = "kni-chat";

export const TOPIC_ICON_NAMES = PACKS.flatMap((pack) => Object.keys(PACK_ICONS[pack.id] ?? {}));

const resolveIcon = (name: string): {pack: IconPack; markup: string} => {
  for (const pack of PACKS) {
    const markup = PACK_ICONS[pack.id]?.[name];
    if (markup) return {pack, markup};
  }

  const fallback = PACKS[0];
  return {pack: fallback, markup: PACK_ICONS[fallback.id]?.[DEFAULT_TOPIC_ICON] ?? ""};
};

type Props = {
  name: string;
  size?: number;
  color: string;
};

/**
 * Jednokolorowa ikona tematu z paczek opisanych w `icon-packs.json`.
 * Zestaw KNI jest rysowany linią, Phosphor to wypełniane ścieżki.
 */
export const TopicIcon: React.FC<Props> = ({name, size = 156, color}) => {
  const {pack, markup} = resolveIcon(name);
  const isStroke = pack.render === "stroke";

  return (
    <svg
      width={size}
      height={size}
      viewBox={pack.viewBox}
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? color : "none"}
      strokeWidth={isStroke ? pack.strokeWidth : undefined}
      strokeLinecap={isStroke ? "round" : undefined}
      strokeLinejoin={isStroke ? "round" : undefined}
      style={{color}}
      aria-hidden="true"
      dangerouslySetInnerHTML={{__html: markup}}
    />
  );
};

export default TopicIcon;
