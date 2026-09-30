import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from './theme';

export const iconFonts = Ionicons.font;
export function SettingsIcon() { return <Ionicons name="settings-outline" size={26} color={colors.ink} />; }
export function HomeIcon({ active = false }: { active?: boolean }) { return <Ionicons name={active ? 'home' : 'home-outline'} size={22} color={active ? colors.violetDeep : colors.muted} />; }
export function PlanIcon({ active = false }: { active?: boolean }) { return <Ionicons name={active ? 'calendar' : 'calendar-outline'} size={22} color={active ? colors.violetDeep : colors.muted} />; }

export function MicIcon({ active = false }: { active?: boolean }) {
  return <Ionicons name="mic-outline" size={24} color={active ? colors.white : colors.ink} />;
}

export function ArrowIcon({ color = colors.ink }: { color?: string }) {
  return <Ionicons name="arrow-forward" size={24} color={color} />;
}

export function CheckIcon({ color = colors.ink }: { color?: string }) {
  return <Ionicons name="checkmark" size={20} color={color} />;
}

export function TrashIcon() {
  return <Ionicons name="trash-outline" size={22} color={colors.muted} />;
}

export function PencilIcon() {
  return <Ionicons name="pencil-outline" size={22} color={colors.muted} />;
}

export function StopIcon() {
  return <Ionicons name="stop" size={20} color={colors.white} />;
}
